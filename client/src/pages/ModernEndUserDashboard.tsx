import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useRoute, useLocation } from "wouter";

// Import page components
import Overview from "./user/Overview";
import Products from "./user/Products";
import Collections from "./user/Collections";
import NewsFeed from "./user/NewsFeed";
import Profile from "./user/Profile";
import {
  User,
  Package,
  LogOut,
  ArrowLeft,
  Download,
  Play,
  FileText,
  Image,
  Video,
  File,
  ExternalLink,
  Eye,
  Folder,
  FolderOpen,
  Grid,
  Calendar,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  Home,
  BookOpen,
  Music,
  Camera,
  Code,
  Database,
  ShoppingBag,
  Bookmark,
} from "lucide-react";

interface Purchase {
  id: number;
  planId: number;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
  whiteLabelId: number;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  type: 'video' | 'image' | 'file' | 'link';
  contentUrl: string | null;
  accessDuration: string | null;
  imageUrl: string | null;
  metadata: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserPlan {
  id: number;
  name: string;
  description: string | null;
  monthlyPrice: string | null;
  purchaseDate: string;
  categories: Category[];
  products: Product[];
}

interface ModernEndUserDashboardProps {
  initialTab?: string;
}

export default function ModernEndUserDashboard({ initialTab = 'overview' }: ModernEndUserDashboardProps) {
  const { user, isAuthenticated, isLoading, domain } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/:domain/user/:tab?");
  const routeDomain = params?.domain;

  console.log("ModernEndUserDashboard rendering:", { 
    user, 
    isAuthenticated, 
    isLoading, 
    domain: domain || routeDomain 
  });

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    const currentDomain = domain || routeDomain;
    window.location.href = `/api/login?domain=${currentDomain}&returnTo=${window.location.href}`;
    return <div>Redirecting to login...</div>;
  }

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your modern dashboard...</p>
        </div>
      </div>
    );
  }

  // Get user's purchases with domain context
  const currentDomain = domain || routeDomain;
  const { data: purchases = [] } = useQuery<Purchase[]>({
    queryKey: ["/api/purchases", currentDomain],
    queryFn: async () => {
      const res = await fetch(`/api/purchases?domain=${currentDomain}`);
      if (!res.ok) {
        console.error('Failed to fetch purchases:', res.status, res.statusText);
        return [];
      }
      const data = await res.json();
      console.log('ModernEndUserDashboard - Fetched purchases:', data);
      return data;
    },
    enabled: isAuthenticated && !!currentDomain,
  });

  // Get user's purchased plans with categories and products (filtered by domain)
  const { data: userPlans = [] } = useQuery({
    queryKey: ["/api/user/plans", currentDomain],
    queryFn: async () => {
      const res = await fetch(`/api/user/plans?domain=${currentDomain}`, {
        cache: 'no-store', // Prevent browser caching
      });
      if (!res.ok) {
        console.error('Failed to fetch user plans:', res.status, res.statusText);
        return [];
      }
      const data = await res.json();
      console.log('ModernEndUserDashboard - Fetched user plans:', data);
      return data;
    },
    enabled: isAuthenticated && !!currentDomain,
    staleTime: 0, // Always refetch on mount
    gcTime: 0, // Don't cache in memory
  });

  const handleLogout = () => {
    const currentDomain = domain || routeDomain;
    // Use GET /api/logout with returnTo parameter for complete logout
    const returnToUrl = encodeURIComponent(`${window.location.origin}/${currentDomain}`);
    window.location.href = `/api/logout?returnTo=${returnToUrl}`;
  };

  const goBack = () => {
    const currentDomain = domain || routeDomain;
    if (currentDomain) {
      window.location.href = `/${currentDomain}`;
    } else {
      window.history.back();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-6">
              Please login to access your modern dashboard
            </p>
            <div className="space-y-3">
              <Button
                onClick={() =>
                  (window.location.href = `/api/login${currentDomain ? `?domain=${currentDomain}&returnTo=${encodeURIComponent(window.location.href)}` : ""}`)
                }
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Login to Continue
              </Button>
              {currentDomain && (
                <Button variant="outline" onClick={goBack} className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {currentDomain}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation items with proper URL navigation
  const sidebarItems = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Home,
      path: `/${currentDomain}/user/overview`
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: Package,
      path: `/${currentDomain}/user/products`
    },
    { 
      id: 'collections', 
      label: 'Collections', 
      icon: Folder,
      path: `/${currentDomain}/user/collections`
    },
    { 
      id: 'newsfeed', 
      label: 'News Feed', 
      icon: Bell,
      path: `/${currentDomain}/user/newsfeed`
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User,
      path: `/${currentDomain}/user/profile`
    }
  ];

  // Handle navigation
  const handleNavigation = (tabId: string, path: string) => {
    setActiveTab(tabId);
    setLocation(path);
    setSidebarOpen(false); // Close mobile sidebar
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview userPlans={userPlans} purchases={purchases} />;
      case "products":
        return <Products userPlans={userPlans} />;
      case "collections":
        return <Collections userPlans={userPlans} />;
      case "newsfeed":
        return <NewsFeed />;
      case "profile":
        return <Profile />;
      default:
        return <Overview userPlans={userPlans} purchases={purchases} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col lg:w-64 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentDomain}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              className="w-full justify-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 z-20 relative">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {activeTab}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('overview', `/${currentDomain}/user/overview`)}
                className={activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Home className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('products', `/${currentDomain}/user/products`)}
                className={activeTab === 'products' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('collections', `/${currentDomain}/user/collections`)}
                className={activeTab === 'collections' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Bookmark className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('newsfeed', `/${currentDomain}/user/newsfeed`)}
                className={activeTab === 'newsfeed' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('profile', `/${currentDomain}/user/profile`)}
                className={activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : ''}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}