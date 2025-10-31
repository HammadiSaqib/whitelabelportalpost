import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign, TrendingUp, Home, UserPlus, Star, Package, ShoppingCart, Eye, EyeOff, Bell, MessageSquare, Heart, Share2, ThumbsUp, Link, Settings, FileText, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import ModernFigmaBuilder from '@/components/landing-builder/ModernFigmaBuilder';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AffiliateDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Extract domain from URL (e.g., /hammad/affiliate -> hammad)
  const domain = location.split('/')[1];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access affiliate dashboard",
        variant: "destructive",
      });
      setLocation(`/api/login?domain=${domain}&returnTo=${encodeURIComponent(location)}`);
      return;
    }

    if (isAuthenticated && user) {
      // Load affiliate dashboard data
      loadAffiliateData();
    }
  }, [isAuthenticated, isLoading, user, domain, location, toast, setLocation]);

  const loadAffiliateData = async () => {
    try {
      setLoading(true);
      
      // Load affiliate-specific data
      const response = await fetch(`/api/affiliate/dashboard?domain=${domain}`);
      
      if (response.ok) {
        const data = await response.json();
        setAffiliateData(data);
      } else {
        // If no specific affiliate data, create default structure
        setAffiliateData({
          stats: {
            totalReferrals: 0,
            activeReferrals: 0,
            totalCommissions: 0,
            pendingCommissions: 0
          },
          recentActivity: [],
          commissionHistory: []
        });
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      setAffiliateData({
        stats: {
          totalReferrals: 0,
          activeReferrals: 0,
          totalCommissions: 0,
          pendingCommissions: 0
        },
        recentActivity: [],
        commissionHistory: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Query for referral data
  const { data: referrals = [], isLoading: referralsLoading } = useQuery({
    queryKey: ['/api/affiliate/referrals'],
    enabled: !!user && isAuthenticated,
  });

  // Query for commission data
  const { data: commissionData = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/affiliate/commissions'],
    enabled: !!user && isAuthenticated,
  });

  // Query for affiliate plans
  const { data: affiliatePlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/affiliate/plans'],
    enabled: !!user && isAuthenticated,
  });

  // Query for notifications
  const { data: notifications = [], isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/affiliate/notifications'],
    enabled: !!user && isAuthenticated,
  });

  // Query for announcements
  const { data: allAnnouncements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/affiliate/announcements'],
    enabled: !!user && isAuthenticated,
  });

  // Calculate totals from real data
  const totalReferrals = referrals?.length || 0;
  const totalCommission = commissionData?.reduce((total: number, item: any) => {
    return total + (item.metrics?.affiliateCommission || 0);
  }, 0) || 0;
  const totalPlans = affiliatePlans?.length || 0;
  const totalPurchases = commissionData?.reduce((total: number, item: any) => {
    return total + (item.metrics?.totalPurchases || 0);
  }, 0) || 0;

  const copyAffiliateLink = () => {
    const affiliateLink = `${window.location.origin}/${domain}?ref=${user?.id}`;
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Link Copied!",
      description: "Your affiliate link has been copied to clipboard",
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading affiliate dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Affiliate Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Welcome back, {user?.firstName || user?.name || user?.email}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <Button
                onClick={() => window.open(`${window.location.origin}/${domain}`, '_blank')}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Website
              </Button>
              <Button
                onClick={() => window.open(`${window.location.origin}/${domain}`, '_blank')}
                variant="outline"
                size="sm"
                className="sm:hidden"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => window.location.href = `/api/logout?returnTo=${encodeURIComponent(window.location.origin + '/' + domain)}`}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                onClick={() => window.location.href = `/api/logout?returnTo=${encodeURIComponent(window.location.origin + '/' + domain)}`}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 sm:hidden"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 min-w-max">
              <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap">Overview</TabsTrigger>
              <TabsTrigger value="plans" className="text-xs sm:text-sm whitespace-nowrap">Plans</TabsTrigger>
              <TabsTrigger value="referrals" className="text-xs sm:text-sm whitespace-nowrap">Referrals</TabsTrigger>
              <TabsTrigger value="commissions" className="text-xs sm:text-sm whitespace-nowrap">Commissions</TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm whitespace-nowrap">Announcements</TabsTrigger>
              <TabsTrigger value="landing-builder" className="text-xs sm:text-sm whitespace-nowrap">Page Builder</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalReferrals}</div>
                  <p className="text-xs text-muted-foreground">Users referred by you</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalCommission.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Your total earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPlans}</div>
                  <p className="text-xs text-muted-foreground">Plans you can promote</p>
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Latest updates from your white-label client</CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {notification.type === 'announcement' && (
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                          )}
                          {notification.type === 'signup' && (
                            <UserPlus className="w-5 h-5 text-green-500" />
                          )}
                          {notification.type === 'purchase' && (
                            <ShoppingCart className="w-5 h-5 text-purple-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                        {notification.amount && (
                          <Badge variant="outline">+${notification.amount}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No notifications</p>
                    <p className="text-sm text-gray-400">You'll see updates here when your white-label client posts announcements, new users sign up, or purchases are made</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <PlansSection domain={domain} />
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Referral Tracking</CardTitle>
                <CardDescription>Users who joined through your landing page</CardDescription>
              </CardHeader>
              <CardContent>
                {referralsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : referrals && referrals.length > 0 ? (
                  <div className="space-y-4">
                    {referrals.map((referral: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">
                                {referral.endUserEmail || 'Unknown User'}
                              </h4>
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Customer
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Email:</span> {referral.endUserEmail}
                              </div>
                              <div>
                                <span className="font-medium">Name:</span> {
                                  referral.endUserFirstName && referral.endUserLastName
                                    ? `${referral.endUserFirstName} ${referral.endUserLastName}`
                                    : 'Name not provided'
                                }
                              </div>
                              <div>
                                <span className="font-medium">Total Purchases:</span> {referral.totalPurchases || 0}
                              </div>
                              <div>
                                <span className="font-medium">Total Spent:</span> ${Number(referral.totalSpent || 0).toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Joined:</span> {new Date(referral.referralDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> 
                                <Badge variant={referral.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                                  {referral.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${Number(referral.totalCommissionEarned || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Commission Earned</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No referrals yet</p>
                    <p className="text-sm text-gray-400">Share your affiliate link to start earning</p>
                    <Button onClick={copyAffiliateLink} className="mt-4">
                      Get Your Affiliate Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Earnings</CardTitle>
                <CardDescription>Track your commission earnings from total plans</CardDescription>
              </CardHeader>
              <CardContent>
                {commissionsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : commissionData && commissionData.length > 0 ? (
                  <div className="space-y-4">
                    {commissionData.map((commission: any, index: number) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{commission.plan.name}</h3>
                            <p className="text-sm text-gray-500">Plan Price: ${commission.plan.monthlyPrice || 'Contact for Pricing'}</p>
                          </div>
                          <Badge variant="secondary">
                            {commission.plan.affiliateCommissionPercentage || 0}% Commission
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {commission.metrics?.totalPurchases || 0}
                            </div>
                            <div className="text-sm text-gray-600">Total Purchases</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              ${(commission.metrics?.affiliateCommission || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Your Commission</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No commission data available</p>
                    <p className="text-sm text-gray-400">Make plans public to start earning commissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <AnnouncementsSection domain={domain} />
          </TabsContent>

          <TabsContent value="landing-builder" className="space-y-6">
            <ModernFigmaBuilder
              isAffiliate={true}
              parentWhiteLabelDomain={domain}
              onClose={() => setLocation(`/${domain}/affiliate`)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// PlansSection component for affiliate dashboard
function PlansSection({ domain }: { domain: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: plans, isLoading, error } = useQuery({
    queryKey: [`/api/affiliate/plans`, domain],
    queryFn: async () => {
      const response = await fetch(`/api/affiliate/plans?domain=${domain}`, {
        headers: {
          'Referer': `${window.location.origin}/${domain}/affiliate`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      return response.json();
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ planId, currentVisibility }: { planId: number; currentVisibility: boolean }) => {
      const response = await fetch(`/api/affiliate/plans/${planId}/toggle-visibility`, {
        method: 'POST',
        body: JSON.stringify({ isVisible: !currentVisibility }),
        headers: {
          'Content-Type': 'application/json',
          'Referer': `${window.location.origin}/${domain}/affiliate`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to update plan visibility');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/affiliate/plans`, domain] });
      queryClient.invalidateQueries({ queryKey: [`/api/affiliate/commissions`, domain] });
      toast({
        title: "Plan Visibility Updated",
        description: "Your plan visibility has been changed successfully",
      });
    },
    onError: (error) => {
      console.error('Toggle visibility error:', error);
      toast({
        title: "Error",
        description: "Failed to update plan visibility",
        variant: "destructive",
      });
    },
  });



  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>White Label Client Plans</CardTitle>
          <CardDescription>Plans you can promote as an affiliate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>White Label Client Plans</CardTitle>
          <CardDescription>Plans you can promote as an affiliate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500">Error loading plans</p>
            <p className="text-sm text-gray-400">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>White Label Client Plans</CardTitle>
        <CardDescription>Plans you can promote as an affiliate</CardDescription>
      </CardHeader>
      <CardContent>
        {plans && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan: any) => (
              <Card key={plan.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {plan.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {plan.monthlyPrice ? `$${plan.monthlyPrice}` : 'Contact for Pricing'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plan.monthlyPrice ? 'per month' : ''}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      <Package className="w-3 h-3 mr-1" />
                      {plan._count?.categories || 0} Categories
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      {plan._count?.products || 0} Products
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => toggleVisibilityMutation.mutate({ planId: plan.id, currentVisibility: plan.isVisible })}
                      className={`w-full ${plan.isVisible ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                      disabled={toggleVisibilityMutation.isPending}
                    >
                      {plan.isVisible ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                      {plan.isVisible ? 'Click To Private' : 'Click To Public'}
                    </Button>
                    <Button 
                      onClick={() => window.open(`/${domain}?plan=${plan.id}`, '_blank')}
                      className="w-full"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Preview Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No plans available</p>
            <p className="text-sm text-gray-400">Your white label client hasn't created any plans yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// AffiliateLandingPageBuilder component 
function AffiliateLandingPageBuilder({ domain }: { domain: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get white-label client info for this domain
  const { data: whiteLabelInfo } = useQuery({
    queryKey: [`/api/white-labels/by-domain/${domain}`],
    queryFn: async () => {
      const response = await fetch(`/api/white-labels/by-domain/${domain}`);
      if (!response.ok) {
        throw new Error('Failed to fetch white-label info');
      }
      return response.json();
    },
  });

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Landing Page Builder</CardTitle>
          <CardDescription>Please log in to access the landing page builder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Authentication required</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Landing Page Builder</CardTitle>
        <CardDescription>
          Create and customize landing pages for {domain} domain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[800px] w-full">
          <ModernFigmaBuilder 
            isAffiliate={true}
            parentWhiteLabelDomain={domain}
          />
        </div>
      </CardContent>
    </Card>
  );
}
// AnnouncementsSection component for affiliate dashboard
function AnnouncementsSection({ domain }: { domain: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [commentContent, setCommentContent] = useState("");

  // Query for announcements from white-label client
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: [`/api/affiliate/announcements`, domain],
    queryFn: async () => {
      const response = await fetch(`/api/affiliate/announcements?domain=${domain}`);
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      console.log('Announcements data from API:', data);
      return data;
    },
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache the data
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  // Query for comments of selected announcement
  const { data: comments = [] } = useQuery<any[]>({
    queryKey: [`/api/announcements/${selectedAnnouncement?.id}/comments`],
    enabled: !!selectedAnnouncement,
  });

  // Like announcement mutation
  const likeMutation = useMutation({
    mutationFn: async (announcementId: number) => {
      return await apiRequest(`/api/announcements/${announcementId}/like`, "POST");
    },
    onMutate: async (announcementId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [`/api/affiliate/announcements`, domain] });
      
      // Snapshot previous value
      const previousAnnouncements = queryClient.getQueryData([`/api/affiliate/announcements`, domain]);
      
      // Optimistically update
      queryClient.setQueryData([`/api/affiliate/announcements`, domain], (old: any[]) => {
        return old?.map((announcement: any) => {
          if (announcement.id === announcementId) {
            return {
              ...announcement,
              userLiked: !announcement.userLiked,
              likesCount: announcement.userLiked ? announcement.likesCount - 1 : announcement.likesCount + 1
            };
          }
          return announcement;
        });
      });
      
      return { previousAnnouncements };
    },
    onError: (error: any, announcementId, context: any) => {
      // Rollback on error
      queryClient.setQueryData([`/api/affiliate/announcements`, domain], context.previousAnnouncements);
      toast({
        title: "Error",
        description: "Failed to like announcement",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/affiliate/announcements`, domain] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async ({ announcementId, content }: { announcementId: number; content: string }) => {
      return await apiRequest(`/api/announcements/${announcementId}/comments`, "POST", { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/announcements/${selectedAnnouncement?.id}/comments`] });
      setCommentContent("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Share announcement
  const shareAnnouncement = (announcement: any) => {
    const shareText = `Check out this announcement: ${announcement.title}`;
    const shareUrl = `${window.location.origin}/${domain}/affiliate`;
    
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: shareText,
        url: shareUrl,
      }).catch((error) => {
        console.error("Error sharing:", error);
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        toast({
          title: "Link Copied",
          description: "Announcement link copied to clipboard",
        });
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Announcements from {domain}
          </CardTitle>
          <CardDescription>
            Stay updated with the latest news and updates from your white-label client
          </CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No announcements available</p>
              <p className="text-sm text-gray-400">Your white-label client hasnt created any announcements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <p className="text-sm text-gray-500">
                          by {announcement.authorName} • {formatDate(announcement.createdAt)}
                        </p>
                      </div>
                    </div>
                    {announcement.isPinned && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {announcement.content}
                  </p>

                  {/* Attachments */}
                  {announcement.attachments && Array.isArray(announcement.attachments) && announcement.attachments.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {announcement.attachments.map((attachment: any, index: number) => {
                        // Check if it's an image (handle both full MIME types and simple 'image' type)
                        const isImage = attachment.type.startsWith('image/') || 
                                      attachment.type === 'image' || 
                                      attachment.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        
                        return (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            {isImage ? (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name}
                                className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-800"
                                onError={(e) => {
                                  // Fallback to file icon if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="p-4 flex items-center space-x-2">
                                        <span class="text-sm truncate">${attachment.name}</span>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className="p-4 flex items-center space-x-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm truncate">{attachment.name}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => likeMutation.mutate(announcement.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          announcement.userLiked 
                            ? 'text-red-500' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                        disabled={likeMutation.isPending}
                      >
                        <Heart className={`w-4 h-4 ${announcement.userLiked ? 'fill-current' : ''}`} />
                        <span>{announcement.likesCount}</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{announcement.commentsCount}</span>
                      </button>
                      
                      <button
                        onClick={() => shareAnnouncement(announcement)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{announcement.sharesCount}</span>
                      </button>
                    </div>
                    

                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcement Details Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.title}</DialogTitle>
            <DialogDescription>
              by {selectedAnnouncement?.authorName} • {formatDate(selectedAnnouncement?.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p>{selectedAnnouncement?.content}</p>
            </div>
            
            <div className="flex items-center space-x-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => likeMutation.mutate(selectedAnnouncement?.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  selectedAnnouncement?.userLiked 
                    ? 'text-red-500' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
                disabled={likeMutation.isPending}
              >
                <Heart className={`w-5 h-5 ${selectedAnnouncement?.userLiked ? 'fill-current' : ''}`} />
                <span>{selectedAnnouncement?.likesCount} Likes</span>
              </button>
              
              <button
                onClick={() => shareAnnouncement(selectedAnnouncement)}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            
            {/* Comments Section */}
            <div className="space-y-4">
              <h4 className="font-semibold">Comments ({comments.length})</h4>
              
              {/* Add Comment */}
              <div className="flex space-x-3">
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => commentMutation.mutate({ 
                        announcementId: selectedAnnouncement?.id, 
                        content: commentContent 
                      })}
                      disabled={!commentContent.trim() || commentMutation.isPending}
                      size="sm"
                    >
                      Add Comment
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {comment.authorName?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{comment.authorName}</p>
                          <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
