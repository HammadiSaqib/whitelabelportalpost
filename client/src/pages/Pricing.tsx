import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import CheckoutModal from "@/components/CheckoutModal";
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Rocket,
  Shield,
  ArrowRight,
  LogIn,
  UserPlus
} from "lucide-react";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Extract domain, referral code, and context from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const domainPath = urlParams.get('domain');
  
  // Support multiple referral code parameter formats:
  // /pricing?affiliate (direct referral code as parameter name)
  // /pricing?ref=affiliate (traditional format)
  // /pricing?referralcode=affiliate (explicit format)
  let referralCode = urlParams.get('ref') || urlParams.get('referralcode');
  
  // Check if referral code is passed as direct parameter (e.g., ?affiliate)
  if (!referralCode) {
    // Get all URL parameters and find one that doesn't match standard parameters
    const standardParams = ['domain', 'ref', 'referralcode', 'context', 'plan', 'name', 'price'];
    for (const [key, value] of urlParams.entries()) {
      if (!standardParams.includes(key) && (value === '' || value === null)) {
        referralCode = key; // The parameter name itself is the referral code
        break;
      }
    }
  }
  
  const context = urlParams.get('context');
  
  // Store referral code in sessionStorage for persistence across page navigation
  if (referralCode) {
    sessionStorage.setItem('activeReferralCode', referralCode);
    console.log('Referral code detected and stored:', referralCode);
  }
  
  // Retrieve stored referral code if not in URL (for page refreshes/navigation)
  const storedReferralCode = sessionStorage.getItem('activeReferralCode');
  const activeReferralCode = referralCode || storedReferralCode;

  const { data: plans = [] } = useQuery<any[]>({
    queryKey: ["/api/plans/public", activeReferralCode],
    queryFn: async () => {
      const url = activeReferralCode 
        ? `/api/plans/public?referralCode=${encodeURIComponent(activeReferralCode)}`
        : '/api/plans/public';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      return response.json();
    },
  });

  // Get user's purchase history to check for existing purchases
  const { data: userPurchases = [] } = useQuery<any[]>({
    queryKey: ["/api/purchases"],
    enabled: isAuthenticated,
  });

  const formatPrice = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice);
    const finalPrice = isYearly ? price * 10 : price; // 2 months free on yearly
    return finalPrice.toFixed(0);
  };

  const planIcons = {
    "Starter": Rocket,
    "Professional": Star,
    "Enterprise": Crown,
    "Ultimate": Shield
  };

  const planColors = {
    "Starter": "from-blue-500 to-blue-600",
    "Professional": "from-purple-500 to-purple-600", 
    "Enterprise": "from-green-500 to-green-600",
    "Ultimate": "from-yellow-500 to-yellow-600"
  };

  // Check if user already purchased a plan
  const hasPurchasedPlan = (planId: number) => {
    return userPurchases.some(purchase => purchase.planId === planId && purchase.status === 'completed');
  };

  // Handle purchase button click
  const handlePurchaseClick = (plan: any) => {
    console.log('Purchase button clicked for plan:', plan);
    
    // Check if user already purchased this plan
    if (isAuthenticated && hasPurchasedPlan(plan.id)) {
      alert('You Have Already Purchase This Plan');
      return;
    }
    
    // If not authenticated, redirect to auth with context and preserve referral code
    if (!isAuthenticated) {
      const contextParam = context ? `context=${context}` : '';
      const referralParam = activeReferralCode ? `ref=${activeReferralCode}` : '';
      const planParam = `plan=${plan.id}&name=${encodeURIComponent(plan.name)}&price=${plan.price}`;
      
      // Build query parameters properly
      const queryParams = [contextParam, referralParam, planParam].filter(Boolean).join('&');
      const authUrl = `/login?${queryParams}`;
      
      window.location.href = authUrl;
      return;
    }
    
    // If authenticated and haven't purchased, show checkout modal with referral code
    const planWithReferral = {
      ...plan,
      referralCode: activeReferralCode
    };
    setSelectedPlan(planWithReferral);
    setShowCheckoutModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WhiteLabel Pro</h1>
                <p className="text-xs text-gray-500">Multi-Tier Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/"}
                className="text-gray-700 hover:text-blue-600"
              >
                Home
              </Button>
              <Button 
                onClick={() => { 
                  const returnTo = encodeURIComponent(window.location.href); 
                  const loginUrl = domainPath ? 
                    `/api/login?domain=${domainPath}&returnTo=${returnTo}` : 
                    `/api/login?returnTo=${returnTo}`;
                  window.location.href = loginUrl;
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-700">
            <Zap className="mr-2 h-4 w-4" />
            Flexible Pricing Plans
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include core features with premium upgrades for advanced functionality.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge className="ml-2 bg-green-100 text-green-700">Save 20%</Badge>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans?.map((plan: any, index: number) => {
              const IconComponent = planIcons[plan.name as keyof typeof planIcons] || Rocket;
              const gradientClass = planColors[plan.name as keyof typeof planColors] || "from-blue-500 to-blue-600";
              const isPopular = plan.name === "Professional";
              
              return (
                <Card key={plan.id} className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${isPopular ? 'scale-105 ring-2 ring-blue-500' : ''}`}>
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${gradientClass} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        {plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 ? (
                          <>
                            <span className="text-4xl font-bold text-gray-900">${formatPrice(plan.monthlyPrice)}</span>
                            <span className="text-gray-500 ml-1">/{isYearly ? 'year' : 'month'}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">Contact for Pricing</span>
                        )}
                      </div>
                      {isYearly && plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 && (
                        <p className="text-sm text-green-600 mt-1">Save ${(parseFloat(plan.monthlyPrice) * 2).toFixed(0)} per year</p>
                      )}
                    </div>

                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePurchaseClick(plan);
                      }}
                      className={`w-full mb-6 bg-gradient-to-r ${gradientClass} hover:opacity-90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isAuthenticated && hasPurchasedPlan(plan.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isAuthenticated && hasPurchasedPlan(plan.id)}
                    >
                      {isAuthenticated && hasPurchasedPlan(plan.id) 
                        ? 'Already Purchased'
                        : plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 
                          ? `Purchase Now - ${formatPrice(plan.monthlyPrice)}`
                          : 'Purchase Now'
                      }
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="space-y-3 text-left">
                      {(() => {
                        // Parse features if it's a string, otherwise use as array
                        let features = plan.features;
                        if (typeof features === 'string') {
                          try {
                            features = JSON.parse(features);
                          } catch (e) {
                            features = [];
                          }
                        }
                        
                        // Ensure features is an array
                        if (!Array.isArray(features)) {
                          features = [];
                        }
                        
                        return features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-5 w-5 text-green-500 mr-3" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change my plan later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all plans come with a 14-day free trial. No credit card required to start.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please login or signup to purchase the {selectedPlan?.name} plan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => {
                  const returnTo = encodeURIComponent(window.location.href);
                  const loginUrl = domainPath ? 
                    `/api/login?domain=${domainPath}&returnTo=${returnTo}` : 
                    `/api/login?returnTo=${returnTo}`;
                  window.location.href = loginUrl;
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const returnTo = encodeURIComponent(window.location.href);
                  const loginUrl = domainPath ? 
                    `/api/login?domain=${domainPath}&returnTo=${returnTo}` : 
                    `/api/login?returnTo=${returnTo}`;
                  window.location.href = loginUrl;
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal && selectedPlan !== null}
        onClose={() => {
          console.log('Closing checkout modal');
          setShowCheckoutModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        referralCode={selectedPlan?.referralCode || activeReferralCode}
      />
      
      {/* Referral Code Debug Info (only show if referral code is detected) */}
      {activeReferralCode && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          🎯 Referral: {activeReferralCode}
        </div>
      )}
    </div>
  );
}