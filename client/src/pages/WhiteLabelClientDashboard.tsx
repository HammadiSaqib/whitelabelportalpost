import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/useUserAccess";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { createIconStyle } from "@/utils/iconColors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Users, DollarSign, TrendingUp, Activity, Plus, Settings, Package, Target, Eye, Award, BarChart3, Menu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RevenueChart from "@/components/charts/RevenueChart";
import CustomBarChart from "@/components/charts/BarChart";
import CustomPieChart from "@/components/charts/PieChart";
import AIInsights from "@/components/ai/AIInsights";
import BusinessDashboard from "@/components/BusinessDashboard";
import PlanAnalytics from "@/components/PlanAnalytics";
import UpgradeYourPlan from "@/components/UpgradeYourPlan";
import { apiRequest } from "@/lib/queryClient";

export default function WhiteLabelClientDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: userAccess, isLoading: isAccessLoading } = useUserAccess();
  const { toast } = useToast();
  const { primaryColor, secondaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [setupAttempted, setSetupAttempted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'White Label Client';

  // Check if user has white-label account setup
  const { data: whiteLabelAccount, isLoading: isWhiteLabelLoading } = useQuery({
    queryKey: ['/api/white-labels/my'],
    enabled: isAuthenticated && !isLoading,
  });

  // Auto-setup white label account if needed
  const setupWhiteLabelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/setup/white-label', 'POST', {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome to WhiteLabel Pro!",
        description: `Your account has been set up successfully. Your default landing page is ready at /${data.defaultLandingPage?.domainPath}`,
      });
      // Refresh the white-label account data
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to set up your white-label account. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `/api/login?returnTo=${returnTo}`;
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Auto-trigger white-label setup if user doesn't have account
  useEffect(() => {
    if (isAuthenticated && !isLoading && !isWhiteLabelLoading && !setupAttempted) {
      // If no white-label account exists, automatically create one for any user on this dashboard
      if (!whiteLabelAccount && !setupWhiteLabelMutation.isPending) {
        console.log('Auto-triggering white-label setup for user:', user?.email, 'Role:', selectedRole);
        setSetupAttempted(true);
        setupWhiteLabelMutation.mutate();
      }
    }
  }, [isAuthenticated, isLoading, isWhiteLabelLoading, whiteLabelAccount, user?.email, setupAttempted]);

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: revenueData } = useQuery({
    queryKey: ['/api/analytics/revenue-trend'],
  });

  const { data: clientDistribution } = useQuery({
    queryKey: ['/api/analytics/client-distribution'],
  });

  const { data: planPerformance } = useQuery({
    queryKey: ['/api/analytics/plan-performance'],
  });

  // Use domain-specific activities for white label clients
  const { data: activities } = useQuery({
    queryKey: ['/api/end-users/activities'],
    enabled: !!whiteLabelAccount, // Only fetch when white label account is set up
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['/api/subscriptions'],
  });

  // Process chart data from real API responses
  const chartRevenueData = revenueData || [
    { month: 'Jan', revenue: 8500, growth: 5 },
    { month: 'Feb', revenue: 12000, growth: 8 },
    { month: 'Mar', revenue: 15500, growth: 12 },
    { month: 'Apr', revenue: 18000, growth: 15 },
    { month: 'May', revenue: 22500, growth: 18 },
    { month: 'Jun', revenue: 26000, growth: 22 },
  ];

  const chartClientData = clientDistribution || [
    { name: 'Basic', value: 35, color: '#3b82f6' },
    { name: 'Premium', value: 40, color: '#10b981' },
    { name: 'Enterprise', value: 25, color: '#f59e0b' },
  ];

  const chartPlanData = planPerformance || [
    { name: 'Basic Plan', value: 75 },
    { name: 'Premium Plan', value: 110 },
    { name: 'Enterprise Plan', value: 85 },
  ];

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Show setup progress if auto-setup is running
  if (setupWhiteLabelMutation.isPending) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Setting Up Your Account</CardTitle>
              <p className="text-gray-600 mt-2">
                We're creating your white-label platform and default landing page...
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-gray-500 mt-4">This will only take a moment</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-muted-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-card-foreground">Business Dashboard</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <Header 
          title="Business Dashboard"
          subtitle="Manage your white-label platform and track performance"
        />
        
        <div className="p-6">
          {/* Simplified Single Page Dashboard */}
          <BusinessDashboard />
        </div>
      </main>
    </div>
  );
}