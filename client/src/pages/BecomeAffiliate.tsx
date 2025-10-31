import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Shield,
  Check,
  ArrowRight,
  Star,
  Zap,
  Award,
  Globe
} from "lucide-react";

export default function BecomeAffiliate() {

  const benefits = [
    {
      icon: DollarSign,
      title: "High Commissions",
      description: "Earn up to 40% recurring commission on every successful referral",
      color: "bg-green-500"
    },
    {
      icon: TrendingUp,
      title: "Lifetime Earnings",
      description: "Get paid for as long as your referrals remain active customers",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Multi-Tier Structure",
      description: "Build your network and earn from sub-affiliates' performance",
      color: "bg-purple-500"
    },
    {
      icon: Target,
      title: "Marketing Support",
      description: "Professional marketing materials and dedicated support team",
      color: "bg-red-500"
    },
    {
      icon: Shield,
      title: "Real-Time Tracking",
      description: "Advanced dashboard with real-time analytics and reporting",
      color: "bg-indigo-500"
    },
    {
      icon: Award,
      title: "Exclusive Rewards",
      description: "Performance bonuses, contests, and exclusive partner benefits",
      color: "bg-yellow-500"
    }
  ];

  const stats = [
    { number: "40%", label: "Max Commission Rate" },
    { number: "$50K+", label: "Top Affiliate Earnings" },
    { number: "2,500+", label: "Active Affiliates" },
    { number: "24/7", label: "Support Available" }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white text-sm sm:text-lg" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">WhiteLabel Pro</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Multi-Tier Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/"}
                className="text-gray-700 hover:text-blue-600 text-xs sm:text-sm px-2 sm:px-4"
              >
                Home
              </Button>
              <Button 
                size="sm"
                onClick={() => window.location.href = "/login?context=affiliate"}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
              >
                Join as Affiliate
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            <TrendingUp className="mr-2 h-4 w-4" />
            Affiliate Partnership Program
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Become a Super Admin Affiliate
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join our elite network of partners and earn substantial recurring commissions by promoting the world's most advanced white-label platform.
          </p>
          <div className="flex items-center justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = "/login?context=affiliate"}
              className="bg-white text-blue-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
            >
              Join as Affiliate
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-lg text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join the most lucrative affiliate program in the B2B2C space with industry-leading commission rates and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join our exclusive affiliate program today and start earning up to 40% recurring commissions on every successful referral.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Approval</h3>
              <p className="text-gray-600">Get started immediately with instant account approval</p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Commissions</h3>
              <p className="text-gray-600">Earn up to 40% on every sale you generate</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">Access worldwide markets and opportunities</p>
            </div>
          </div>

          <Button 
            size="lg"
            onClick={() => window.location.href = "/login?context=affiliate"}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Earning Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful affiliates who are already earning substantial commissions with WhiteLabel Pro.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = "/login?context=affiliate"}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}