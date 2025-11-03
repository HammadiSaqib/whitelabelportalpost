import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { RoleProvider } from "@/components/RoleProvider";
import DomainPageWrapper from "@/components/DomainPageWrapper";
import SuperAdminRoute from "@/components/SuperAdminRoute";
import Landing from "@/pages/Landing";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import AffiliateDashboard from "@/pages/AffiliateDashboard";
import SuperAdminAffiliateDashboard from "@/pages/SuperAdminAffiliateDashboard";
import WhiteLabelClientDashboard from "@/pages/WhiteLabelClientDashboard";
import WhiteLabelAffiliateDashboard from "@/pages/WhiteLabelAffiliateDashboard";

import Plans from "@/pages/plans";
import Affiliates from "@/pages/affiliates";
import Clients from "@/pages/clients";
import Analytics from "@/pages/analytics";
import ProductManager from "@/pages/ProductManager";
import CategoryManager from "@/pages/CategoryManager";
import CategoriesPage from "@/pages/CategoriesPage";
import UsersPage from "@/pages/UsersPage";
import LandingPageBuilderPage from "@/pages/LandingPageBuilderPage";

import Settings from "./pages/settings";
import Integrations from "./pages/integrations";
import Billing from "./pages/billing";
import AIContent from "./pages/ai-content";
import LandingBuilder from "./pages/landing-builder";
import LandingPageView from "./pages/landing-page-view";
import Products from "./pages/products";
import Announcements from "./pages/announcements-simple";
import NotFound from "@/pages/not-found";
import Commissions from "./pages/commissions";
import Referrals from "./pages/referrals";
import Links from "./pages/links";
import Pricing from "./pages/Pricing";
import BecomeAffiliate from "./pages/BecomeAffiliate";
import WhiteLabel from "./pages/WhiteLabel";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import EndUserDashboard from "./pages/EndUserDashboard";
import ModernEndUserDashboard from "./pages/ModernEndUserDashboard";
import ProductDetailPage from "./pages/ProductDetailPage";
import AffiliateCommissions from "./pages/AffiliateCommissions";
import BusinessAuth from "./pages/BusinessAuth";
import ShootDefaultLanding from "./pages/ShootDefaultLanding";
import BusinessDetail from "./pages/BusinessDetail";

function RoleDashboard() {
  const { user } = useAuth();
  
  // Handle affiliate role assignment if pending
  React.useEffect(() => {
    const pendingRole = localStorage.getItem('pendingUserRole');
    if (pendingRole === 'white_label_affiliate' && user) {
      // Assign affiliate role and clear pending status
      fetch('/api/auth/assign-affiliate-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).then(() => {
        localStorage.removeItem('pendingUserRole');
        sessionStorage.setItem('selectedRole', 'white_label_affiliate');
        window.location.reload(); // Refresh to show affiliate dashboard
      }).catch(console.error);
    }
  }, [user]);
  
  // Get role from session storage (set during login) or user data
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role;
  
  // Determine which dashboard to show based on role
  switch (selectedRole) {
    case 'super_admin':
    case 'Super Admin':
      return <SuperAdminDashboard />;
    case 'super_admin_affiliate':
    case 'Super Admin Affiliate':
      return <SuperAdminAffiliateDashboard />;
    case 'affiliate':
    case 'Affiliate':
      return <AffiliateDashboard />;
    case 'white_label_client':
    case 'White-Label Client':
    case 'White Label':
      return <WhiteLabelClientDashboard />;
    case 'white_label_affiliate':
    case 'White-Label Affiliate':
      return <WhiteLabelAffiliateDashboard />;
    case 'end_user':
    case 'End User':
      // End-users should not access main URL - server-side middleware handles redirect
      return <div>Redirecting to your dashboard...</div>;
    default:
      // If no specific role is set, default to White Label Client for new users
      return <WhiteLabelClientDashboard />;
  }
}

function Router() {
  const { isAuthenticated, isLoading, user, domain } = useAuth();
  
  console.log("Router rendering - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "user:", user, "domain:", domain);

  if (isLoading) {
    console.log("Router - showing loading state");
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Auth} />
          <Route path="/auth" component={() => {
            // Redirect /auth to /login for backward compatibility
            const queryString = window.location.search;
            window.location.replace(`/login${queryString}`);
            return <div>Redirecting to login...</div>;
          }} />
          <Route path="/super-admin-login" component={SuperAdminLogin} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/signup" component={Auth} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/become-affiliate" component={BecomeAffiliate} />
          <Route path="/white-label" component={WhiteLabel} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout/:planId" component={Checkout} />
          <Route path="/purchase-success" component={PurchaseSuccess} />
          <Route path="/shoot" component={ShootDefaultLanding} />
          
          {/* Redirect unauthenticated users from domain-specific routes to main login */}
          <Route path="/:domain/user" component={() => {
            console.log("Unauthenticated user accessing /:domain/user - redirecting to /login");
            window.location.href = `/login`;
            return <div>Redirecting to login...</div>;
          }} />
          
          <Route path="/:domain/affiliate" component={() => {
            console.log("Unauthenticated user accessing /:domain/affiliate - redirecting to /login");
            window.location.href = `/login`;
            return <div>Redirecting to login...</div>;
          }} />
        </>
      ) : (
        <RoleProvider>
          {/* Domain-specific end-user dashboard routes - PROTECTED */}
          <Route path="/:domain/user" component={() => {
            console.log("Authenticated user accessing /:domain/user - rendering ModernEndUserDashboard");
            return <ModernEndUserDashboard />;
          }} />
          
          {/* Individual user page routes with proper URLs */}
          <Route path="/:domain/user/overview" component={() => {
            console.log("Authenticated user accessing /:domain/user/overview");
            return <ModernEndUserDashboard initialTab="overview" />;
          }} />
          
          <Route path="/:domain/user/products" component={() => {
            console.log("Authenticated user accessing /:domain/user/products");
            return <ModernEndUserDashboard initialTab="products" />;
          }} />
          
          <Route path="/:domain/user/collections" component={() => {
            console.log("Authenticated user accessing /:domain/user/collections");
            return <ModernEndUserDashboard initialTab="collections" />;
          }} />
          
          <Route path="/:domain/user/newsfeed" component={() => {
            console.log("Authenticated user accessing /:domain/user/newsfeed");
            return <ModernEndUserDashboard initialTab="newsfeed" />;
          }} />
          
          <Route path="/:domain/user/profile" component={() => {
            console.log("Authenticated user accessing /:domain/user/profile");
            return <ModernEndUserDashboard initialTab="profile" />;
          }} />
          
          {/* Product detail page route */}
          <Route path="/:domain/user/product/:productId" component={() => {
            console.log("Route /:domain/user/product/:productId matched - about to render ProductDetailPage");
            return <ProductDetailPage />;
          }} />
          
          {/* Domain-specific affiliate dashboard routes - PROTECTED */}
          <Route path="/:domain/affiliate" component={() => {
            const userRole = (user as any)?.role;
            console.log(`Authenticated user accessing /:domain/affiliate - user role: ${userRole}`);
            
            // Render appropriate dashboard based on user role
            if (userRole === 'super_admin_affiliate') {
              console.log("Rendering SuperAdminAffiliateDashboard");
              return <SuperAdminAffiliateDashboard />;
            } else if (userRole === 'white_label_affiliate') {
              console.log("Rendering WhiteLabelAffiliateDashboard");
              return <WhiteLabelAffiliateDashboard />;
            } else {
              console.log("Rendering default AffiliateDashboard");
              return <AffiliateDashboard />;
            }
          }} />
          
          <Route path="/" component={RoleDashboard} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscriptions" component={Plans} />
          <Route path="/clients" component={() => <SuperAdminRoute><Clients /></SuperAdminRoute>} />
          <Route path="/affiliates" component={Affiliates} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/products" component={ProductManager} />
          <Route path="/categories" component={CategoriesPage} />
          <Route path="/users" component={UsersPage} />

          <Route path="/settings" component={Settings} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/billing" component={Billing} />
          <Route path="/ai-content" component={AIContent} />
          <Route path="/landing-builder" component={LandingPageBuilderPage} />
          <Route path="/landing-page/:id" component={LandingPageView} />

          <Route path="/referrals" component={Referrals} />
          <Route path="/affiliate-commissions" component={AffiliateCommissions} />
          <Route path="/links" component={Links} />
          <Route path="/news" component={Announcements} />
          <Route path="/news/:id" component={Announcements} />
          {/* Legacy announcements routes for backwards compatibility */}
          <Route path="/announcements" component={() => { window.location.href = "/news"; return null; }} />
          <Route path="/announcements-simple" component={() => { window.location.href = "/news"; return null; }} />
          <Route path="/announcements/:id" component={() => { window.location.href = "/news"; return null; }} />
          <Route path="/affiliate-dashboard" component={AffiliateDashboard} />
          
          {/* Business Management Routes */}
          <Route path="/business-auth" component={BusinessAuth} />
          <Route path="/business-signup" component={BusinessAuth} />
          <Route path="/business/:businessId" component={BusinessDetail} />
          
          {/* Super Admin Routes */}
          <Route path="/commission-rules" component={Plans} />
          <Route path="/billing" component={Plans} />
          <Route path="/system-settings" component={Settings} />
          <Route path="/impersonate" component={Analytics} />
          
          {/* Affiliate Routes */}
          <Route path="/tracking" component={Analytics} />
          <Route path="/reports" component={Analytics} />
          
          {/* White-Label Client Routes */}
          <Route path="/end-users" component={Clients} />
          <Route path="/my-affiliates" component={Affiliates} />
          <Route path="/portal-settings" component={Settings} />
          <Route path="/preview" component={Analytics} />
          
          {/* White-Label Affiliate Routes */}
          <Route path="/performance" component={Analytics} />
          
          {/* End User Routes */}
          <Route path="/browse" component={ProductManager} />
          <Route path="/downloads" component={ProductManager} />
          <Route path="/courses" component={ProductManager} />
          <Route path="/favorites" component={ProductManager} />
          <Route path="/library" component={ProductManager} />
          <Route path="/profile" component={Settings} />
          <Route path="/notifications" component={Settings} />
          <Route path="/support" component={Settings} />
          
          {/* Checkout and Purchase Routes - available for authenticated users */}
          <Route path="/checkout/:planId" component={() => {
            console.log("Checkout route matched for authenticated user");
            return <Checkout />;
          }} />
          <Route path="/purchase-success" component={PurchaseSuccess} />
        </RoleProvider>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <DomainPageWrapper>
            <Router />
          </DomainPageWrapper>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;