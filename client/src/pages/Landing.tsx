import { useState, useEffect } from "react";
import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/BrandLogo";
import { 
  Layers, 
  Users, 
  HandHeart, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Palette,
  Shield,
  Zap,
  Globe,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  TrendingUp,
  Award,
  Target,
  Menu,
  X
} from "lucide-react";

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statsRef, statsVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [rolesRef, rolesVisible] = useScrollAnimation();
  const offsetY = useParallax();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const slides = [
    {
      title: "Transform Your Business Multi-Tier Affiliate Networks",
      subtitle: "Build, manage, and scale white-label platforms with comprehensive role-based dashboards",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "Start Your Journey"
    },
    {
      title: "Powerful Revenue Sharing & Commission Tracking",
      subtitle: "Automated calculations, transparent distribution, and real-time analytics for every stakeholder",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      cta: "Explore Analytics"
    },
    {
      title: "Complete White-Label Customization",
      subtitle: "Brand every portal with custom themes, templates, and user experiences",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80",
      cta: "Customize Now"
    }
  ];

  const features = [
    {
      icon: Layers,
      title: "Multi-Tier Architecture",
      description: "Support for multiple user roles and hierarchical affiliate structures",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "White-Label Solutions",
      description: "Complete branding customization for your clients' portals",
      color: "bg-purple-500"
    },
    {
      icon: HandHeart,
      title: "Affiliate Management",
      description: "Advanced commission tracking and affiliate relationship management",
      color: "bg-green-500"
    },
    {
      icon: DollarSign,
      title: "Revenue Sharing",
      description: "Automated commission calculations and transparent revenue distribution",
      color: "bg-yellow-500"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive dashboards with real-time performance metrics",
      color: "bg-red-500"
    },
    {
      icon: Settings,
      title: "Role-Based Access",
      description: "Granular permissions and access controls for different user types",
      color: "bg-indigo-500"
    }
  ];

  const roles = [
    {
      name: "Super Admin",
      description: "Platform owner with full control over plans, clients, and affiliates",
      color: "bg-blue-600",
      icon: Shield
    },
    {
      name: "Super Admin Affiliate",
      description: "Promotes white-label clients and earns commissions on subscriptions",
      color: "bg-purple-600",
      icon: TrendingUp
    },
    {
      name: "White-Label Client",
      description: "Businesses that create customized portals for their end users",
      color: "bg-green-600",
      icon: Users
    },
    {
      name: "White-Label Affiliate",
      description: "Promotes specific white-label client offerings to end users",
      color: "bg-yellow-600",
      icon: Target
    },
    {
      name: "End User",
      description: "Customers who interact with white-label client portals",
      color: "bg-gray-600",
      icon: Award
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      content: "WhiteLabel Pro transformed our affiliate program. Revenue increased by 300% in just 6 months.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b890?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Michael Chen",
      role: "Marketing Director",
      content: "The multi-tier structure and analytics dashboard gave us insights we never had before.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      name: "Emma Davis",
      role: "Affiliate Manager",
      content: "Managing hundreds of affiliates is now effortless. The automation saves us 20+ hours weekly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Affiliates" },
    { number: "$2.4B", label: "Revenue Generated" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Role-specific login handler
  const handleRoleLogin = (roleName: string) => {
    // Store the selected role in session storage to redirect to appropriate dashboard
    sessionStorage.setItem('selectedRole', roleName);
    const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <BrandLogo size="md" className="flex items-center space-x-3" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/pricing"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/become-affiliate"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Become Affiliate
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/white-label"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                White Label
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/contact"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Button>
              <Button 
                onClick={() => { const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`; }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <Button 
                  variant="ghost"
                  onClick={() => { window.location.href = "/pricing"; setMobileMenuOpen(false); }}
                  className="w-full text-left justify-start text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { window.location.href = "/become-affiliate"; setMobileMenuOpen(false); }}
                  className="w-full text-left justify-start text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Become Affiliate
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { window.location.href = "/white-label"; setMobileMenuOpen(false); }}
                  className="w-full text-left justify-start text-gray-700 hover:text-blue-600 transition-colors"
                >
                  White Label
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => { window.location.href = "/contact"; setMobileMenuOpen(false); }}
                  className="w-full text-left justify-start text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Button>
                <Button 
                  onClick={() => { const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`; }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
        
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Zap className="mr-2 h-4 w-4" />
              Next-Generation B2B2C Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => {
                  const returnTo = encodeURIComponent(window.location.href);
                  window.location.href = `/api/login?returnTo=${returnTo}`;
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {slides[currentSlide].cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Social Login Options */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm mb-4">Or continue with social accounts</p>
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={() => {
                    const returnTo = encodeURIComponent(window.location.href);
                    window.location.href = `/api/login?returnTo=${returnTo}`;
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 p-3 rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </Button>
                <Button 
                  onClick={() => {
                    const returnTo = encodeURIComponent(window.location.href);
                    window.location.href = `/api/login?returnTo=${returnTo}`;
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 p-3 rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
                <Button 
                  onClick={() => {
                    const returnTo = encodeURIComponent(window.location.href);
                    window.location.href = `/api/login?returnTo=${returnTo}`;
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 p-3 rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Button>
                <Button 
                  onClick={() => {
                    const returnTo = encodeURIComponent(window.location.href);
                    window.location.href = `/api/login?returnTo=${returnTo}`;
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 p-3 rounded-lg transition-all duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div 
          ref={statsRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ transform: `translateY(${offsetY * 0.1}px)` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`transform transition-all duration-1000 ${
                  statsVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                } hover:scale-110`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 animate-pulse">{stat.number}</div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div 
          ref={featuresRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className={`text-center mb-16 transition-all duration-1000 ${
            featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed for complex affiliate ecosystems and white-label solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-1000 transform hover:-translate-y-2 bg-white ${
                    featuresVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div 
          ref={testimonialsRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className={`text-center mb-16 transition-all duration-1000 ${
            testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers say about transforming their affiliate programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-1000 bg-gradient-to-br from-blue-50 to-purple-50 transform ${
                  testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                } hover:-translate-y-2`}
                style={{ transitionDelay: `${index * 250}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current animate-pulse" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover transform transition-transform duration-300 hover:scale-110"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Join thousands of businesses already using our white-label platform to grow their reach and revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/become-affiliate'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Become an Affiliate
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={() => { const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`; }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Platform
              </Button>
            </div>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses already using WhiteLabel Pro to manage complex affiliate networks and drive exponential growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => { const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`; }}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Layers className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">WhiteLabel Pro</h3>
                  <p className="text-gray-400 text-sm">Multi-Tier Platform</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                The ultimate B2B2C white-label platform for building and managing complex affiliate networks with role-based dashboards and revenue sharing.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 WhiteLabel Pro. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Shield className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
