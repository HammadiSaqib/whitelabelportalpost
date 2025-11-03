import { useState } from "react";
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
import { useRoute } from "wouter";
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
  Grid,
  Calendar,
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

export default function EndUserDashboard() {
  const { user, isAuthenticated, isLoading, domain } = useAuth();
  const [activeTab, setActiveTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [match, params] = useRoute("/:domain/user");
  const routeDomain = params?.domain;

  console.log("EndUserDashboard rendering:", { 
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
      console.log('EndUserDashboard - Fetched purchases:', data);
      return data;
    },
    enabled: isAuthenticated && !!currentDomain,
  });



  // Get user's purchased plans with categories and products (filtered by domain)
  const { data: userPlans = [] } = useQuery({
    queryKey: ["/api/user/plans", currentDomain],
    queryFn: async () => {
      const res = await fetch(`/api/user/plans?domain=${currentDomain}`);
      if (!res.ok) {
        console.error('Failed to fetch user plans:', res.status, res.statusText);
        return [];
      }
      const data = await res.json();
      console.log('EndUserDashboard - Fetched user plans:', data);
      return data;
    },
    enabled: isAuthenticated && !!currentDomain,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login to access your dashboard
          </p>
          <div className="space-y-3">
            <Button
              onClick={() =>
                (window.location.href = `/api/login${currentDomain ? `?domain=${currentDomain}&returnTo=${encodeURIComponent(window.location.href)}` : ""}`)
              }
              className="w-full"
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {currentDomain && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {currentDomain ? `${currentDomain} - My Dashboard` : "My Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === "plans" ? "default" : "outline"}
            onClick={() => setActiveTab("plans")}
            className="px-4 py-2"
          >
            <Package className="h-4 w-4 mr-2" />
            My Plans
          </Button>
          <Button
            variant={activeTab === "purchases" ? "default" : "outline"}
            onClick={() => setActiveTab("purchases")}
            className="px-4 py-2"
          >
            My Purchases
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "plans" && (
          <div className="space-y-6">
            {userPlans.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    My Plans
                  </CardTitle>
                  <CardDescription>
                    Access all your purchased plan content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No plans purchased yet
                    </h3>
                    <p className="text-gray-500">
                      Purchase a plan to access exclusive content
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Plan Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      My Plans ({userPlans.length})
                    </CardTitle>
                    <CardDescription>
                      Select a plan to view its content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userPlans.map((plan: UserPlan) => (
                        <Card
                          key={plan.id}
                          className={`cursor-pointer transition-colors ${
                            selectedPlan === plan.id
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription className="text-sm">
                              Purchased: {new Date(plan.purchaseDate).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-3">
                              {plan.description || "No description"}
                            </p>
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary">
                                {plan.categories.length} categories
                              </Badge>
                              <Badge variant="outline">
                                {plan.products.length} items
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Content */}
                {selectedPlan && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5" />
                        Plan Content
                      </CardTitle>
                      <CardDescription>
                        Browse and access your plan content by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const currentPlan = userPlans.find((p: UserPlan) => p.id === selectedPlan);
                        if (!currentPlan) return null;

                        const allCategories = currentPlan.categories;
                        const allProducts = currentPlan.products;

                        return (
                          <div className="flex gap-6">
                            {/* Left Side - Tree Structure */}
                            <div className="w-1/3 border-r pr-6">
                              <div className="space-y-2">
                                {/* Hierarchical Categories Tree */}
                                {(() => {
                                  // Function to build hierarchical tree structure
                                  const buildCategoryTree = (categories: Category[], parentId: number | null = null, level: number = 0) => {
                                    const filteredCategories = categories.filter(cat => cat.parentCategoryId === parentId);
                                    
                                    return filteredCategories.map((category) => {
                                      const categoryProducts = allProducts.filter(
                                        (product) => product.categoryId === category.id
                                      );
                                      const subcategories = categories.filter(cat => cat.parentCategoryId === category.id);
                                      
                                      return (
                                        <div key={category.id} className="space-y-1">
                                          <div 
                                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                            style={{ marginLeft: `${level * 20}px` }}
                                            onClick={() => setSelectedCategory(category.id.toString())}
                                          >
                                            <Folder className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">{category.name}</span>
                                          </div>
                                          
                                          {/* Subcategories */}
                                          {subcategories.length > 0 && (
                                            <div className="space-y-1">
                                              {buildCategoryTree(categories, category.id, level + 1)}
                                            </div>
                                          )}
                                          
                                          {/* Products in this category */}
                                          {categoryProducts.map((product) => (
                                            <div 
                                              key={product.id}
                                              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                              style={{ marginLeft: `${(level + 1) * 20}px` }}
                                              onClick={() => setSelectedCategory(product.id.toString())}
                                            >
                                              {product.type === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                                              {product.type === 'image' && <Image className="h-4 w-4 text-green-600" />}
                                              {product.type === 'file' && <FileText className="h-4 w-4 text-purple-600" />}
                                              {product.type === 'document' && <FileText className="h-4 w-4 text-purple-600" />}
                                              {product.type === 'link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                              {product.type === 'website_link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                              {!['video', 'image', 'file', 'document', 'link', 'website_link'].includes(product.type) && <FileText className="h-4 w-4 text-gray-600" />}
                                              <span className="text-sm">{product.name}</span>
                                              <Badge variant="outline" className="text-xs ml-auto">
                                                {product.type}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    });
                                  };
                                  
                                  // Build the tree starting from root categories (parentCategoryId = null)
                                  return buildCategoryTree(allCategories, null);
                                })()}

                                {/* Unassigned Products */}
                                {allProducts.filter(product => !product.categoryId).length > 0 && (
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                      <Folder className="h-4 w-4 text-gray-600" />
                                      <span className="font-medium">Unassigned Products</span>
                                    </div>
                                    {allProducts
                                      .filter(product => !product.categoryId)
                                      .map((product) => (
                                        <div 
                                          key={product.id}
                                          className="flex items-center gap-2 p-2 ml-6 rounded hover:bg-gray-50 cursor-pointer"
                                          onClick={() => setSelectedCategory(product.id.toString())}
                                        >
                                          {product.type === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                                          {product.type === 'image' && <Image className="h-4 w-4 text-green-600" />}
                                          {product.type === 'file' && <FileText className="h-4 w-4 text-purple-600" />}
                                          {product.type === 'document' && <FileText className="h-4 w-4 text-purple-600" />}
                                          {product.type === 'link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                          {product.type === 'website_link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                          {!['video', 'image', 'file', 'document', 'link', 'website_link'].includes(product.type) && <FileText className="h-4 w-4 text-gray-600" />}
                                          <span className="text-sm">{product.name}</span>
                                          <Badge variant="outline" className="text-xs ml-auto">
                                            {product.type}
                                          </Badge>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right Side - Product Details */}
                            <div className="w-2/3">
                              {selectedCategory && (
                                <div className="space-y-4">
                                  {(() => {
                                    // Check if it's a category or product
                                    const category = allCategories.find(c => c.id.toString() === selectedCategory);
                                    const product = allProducts.find(p => p.id.toString() === selectedCategory);
                                    
                                    if (product) {
                                      // Show single product details
                                      return (
                                        <Card className="hover:shadow-md transition-shadow">
                                          <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                              <div className="flex items-center gap-2">
                                                {product.type === 'video' && <Video className="h-5 w-5 text-blue-600" />}
                                                {product.type === 'image' && <Image className="h-5 w-5 text-green-600" />}
                                                {product.type === 'file' && <FileText className="h-5 w-5 text-purple-600" />}
                                                {product.type === 'link' && <ExternalLink className="h-5 w-5 text-orange-600" />}
                                                {product.type === 'website_link' && <ExternalLink className="h-5 w-5 text-orange-600" />}
                                                <CardTitle className="text-xl">{product.name}</CardTitle>
                                              </div>
                                              <Badge variant="outline" className="text-sm">
                                                {product.type}
                                              </Badge>
                                            </div>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-gray-600 mb-4">
                                              {product.description || "No description"}
                                            </p>
                                            
                                            {/* Website Link - Show clickable meta image */}
                                            {product.type === 'website_link' && product.contentUrl && (
                                              <div className="mb-4">
                                                <div 
                                                  className="relative w-full h-48 bg-gradient-to-br from-red-50 to-red-100 rounded-md border-2 border-red-200 cursor-pointer hover:border-red-300 transition-colors group overflow-hidden"
                                                  onClick={() => window.open(product.contentUrl, '_blank')}
                                                >
                                                  {product.imageUrl ? (
                                                    <img 
                                                      src={product.imageUrl} 
                                                      alt={product.name}
                                                      className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
                                                    />
                                                  ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-red-600 bg-white/90">
                                                      {/* YouTube-like preview */}
                                                      <div className="flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-4">
                                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                          <path d="M23.498 6.186a2.998 2.998 0 0 0-2.115-2.115C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.383.525A2.998 2.998 0 0 0 .502 6.186C0 8.064 0 12 0 12s0 3.936.502 5.814a2.998 2.998 0 0 0 2.115 2.115c1.878.525 9.383.525 9.383.525s7.505 0 9.383-.525a2.998 2.998 0 0 0 2.115-2.115C24 15.936 24 12 24 12s0-3.936-.502-5.814zM9.75 15.568V8.432L15.818 12l-6.068 3.568z"/>
                                                        </svg>
                                                      </div>
                                                      <span className="text-lg font-bold text-red-700">{product.name}</span>
                                                      <span className="text-sm text-red-600 mt-1">Click to watch on YouTube</span>
                                                    </div>
                                                  )}
                                                  
                                                  {/* Overlay with external link icon */}
                                                  <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 group-hover:bg-red-700 transition-colors">
                                                    <ExternalLink className="h-4 w-4" />
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {/* Preview Image for non-website_link products */}
                                            {product.type !== 'website_link' && product.imageUrl && (
                                              <div className="mb-4">
                                                <img 
                                                  src={product.imageUrl} 
                                                  alt={product.name}
                                                  className="w-full h-48 object-cover rounded-md"
                                                />
                                              </div>
                                            )}

                                            {/* Action Buttons - Only show for non-website_link products */}
                                            {product.type !== 'website_link' && (
                                              <div className="flex gap-2">
                                                {product.type === 'video' && product.contentUrl && (
                                                  <Button size="sm" className="flex-1">
                                                    <Play className="h-4 w-4 mr-2" />
                                                    Play
                                                  </Button>
                                                )}
                                                {product.type === 'image' && product.contentUrl && (
                                                  <Button size="sm" className="flex-1">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                  </Button>
                                                )}
                                                {(product.type === 'file' || product.type === 'document') && product.contentUrl && (
                                                  <Button 
                                                    size="sm" 
                                                    className="flex-1"
                                                    onClick={() => {
                                                      if (product.contentUrl) {
                                                        console.log('Downloading file:', product.name, 'URL:', product.contentUrl);
                                                        // Create a temporary anchor element to trigger download
                                                        const link = document.createElement('a');
                                                        link.href = `/api/files/${product.contentUrl}`;
                                                        link.download = product.name || 'document';
                                                        link.target = '_blank';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                      } else {
                                                        console.log('No contentUrl for product:', product.name);
                                                      }
                                                    }}
                                                  >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                  </Button>
                                                )}
                                                {product.type === 'link' && product.contentUrl && (
                                                  <Button 
                                                    size="sm" 
                                                    className="flex-1"
                                                    onClick={() => window.open(product.contentUrl, '_blank')}
                                                  >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Visit
                                                  </Button>
                                                )}
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      );
                                    } else if (category) {
                                      // Show category products
                                      const categoryProducts = allProducts.filter(
                                        (product) => product.categoryId === category.id
                                      );
                                      return (
                                        <div>
                                          <div className="mb-4">
                                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                              <Folder className="h-5 w-5 text-blue-600" />
                                              {category.name}
                                            </h3>
                                            <p className="text-gray-600">
                                              {category.description || "No description"}
                                            </p>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {categoryProducts.map((product) => (
                                              <Card 
                                                key={product.id} 
                                                className="hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => setSelectedCategory(product.id.toString())}
                                              >
                                                <CardHeader className="pb-2">
                                                  <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                      {product.type === 'video' && <Video className="h-4 w-4 text-blue-600" />}
                                                      {product.type === 'image' && <Image className="h-4 w-4 text-green-600" />}
                                                      {product.type === 'file' && <FileText className="h-4 w-4 text-purple-600" />}
                                                      {product.type === 'link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                                      {product.type === 'website_link' && <ExternalLink className="h-4 w-4 text-orange-600" />}
                                                      <CardTitle className="text-base">{product.name}</CardTitle>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                      {product.type}
                                                    </Badge>
                                                  </div>
                                                </CardHeader>
                                                <CardContent>
                                                  <p className="text-sm text-gray-600 mb-3">
                                                    {product.description || "No description"}
                                                  </p>
                                                </CardContent>
                                              </Card>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              )}
                              
                              {!selectedCategory && (
                                <div className="text-center py-8">
                                  <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Select content to view
                                  </h3>
                                  <p className="text-gray-500">
                                    Click on any category or product from the tree to view its details
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "purchases" && (
          <Card>
            <CardHeader>
              <CardTitle>My Purchases</CardTitle>
              <CardDescription>
                Your purchase history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {purchases.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No purchases yet
                  </h3>
                  <p className="text-gray-500">
                    When you make purchases, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{purchase.planName}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${parseFloat(purchase.amount?.toString() || '0').toFixed(2)}</p>
                        <Badge>{purchase.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}


      </main>
    </div>
  );
}