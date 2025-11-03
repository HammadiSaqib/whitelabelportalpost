import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  ChevronDown, 
  ChevronRight,
  Video,
  Image,
  FileText,
  Music,
  Code,
  Monitor,
  BookOpen,
  Heart,
  Briefcase,
  TrendingUp,
  Coffee,
  Gamepad2,
  Palette,
  ExternalLink,
  Play,
  Download,
  Eye,
  Folder,
  FolderOpen
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string | null;
  type: 'video' | 'image' | 'file' | 'link' | 'website_link' | 'document';
  contentUrl: string | null;
  accessDuration: string | null;
  imageUrl: string | null;
  metadata: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  products: Product[];
}

interface Plan {
  id: number;
  name: string;
  description: string | null;
  monthlyPrice: string | null;
  purchaseDate: string;
  subscriptionId: number;
  subscriptionStatus: string;
  categories: Category[];
}

interface UserPlansResponse {
  plans: Plan[];
}

// Category icon mapping
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('video') || name.includes('movie') || name.includes('film')) return Video;
  if (name.includes('image') || name.includes('photo') || name.includes('picture')) return Image;
  if (name.includes('document') || name.includes('doc') || name.includes('text')) return FileText;
  if (name.includes('music') || name.includes('audio') || name.includes('sound')) return Music;
  if (name.includes('code') || name.includes('programming') || name.includes('development')) return Code;
  if (name.includes('design') || name.includes('graphic') || name.includes('art')) return Palette;
  if (name.includes('business') || name.includes('finance') || name.includes('money')) return Briefcase;
  if (name.includes('education') || name.includes('learning') || name.includes('course')) return BookOpen;
  if (name.includes('health') || name.includes('medical') || name.includes('fitness')) return Heart;
  if (name.includes('technology') || name.includes('tech') || name.includes('software')) return Monitor;
  if (name.includes('marketing') || name.includes('sales') || name.includes('promotion')) return TrendingUp;
  if (name.includes('game') || name.includes('gaming') || name.includes('entertainment')) return Gamepad2;
  if (name.includes('food') || name.includes('recipe') || name.includes('cooking')) return Coffee;
  return Folder;
};

// Product type icon mapping
const getProductTypeIcon = (type: string) => {
  switch (type) {
    case 'video': return Video;
    case 'image': return Image;
    case 'document': return FileText;
    case 'file': return FileText;
    case 'link':
    case 'website_link': return ExternalLink;
    default: return FileText;
  }
};

const Overview: React.FC = () => {
  const { user } = useAuth();
  const [, params] = useRoute('/:domain/user/:page?');
  const [expandedPlans, setExpandedPlans] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const currentDomain = params?.domain;

  // Fetch user plans with products and categories (filtered by domain)
  const { data: userPlansData, isLoading, error } = useQuery<UserPlansResponse>({
    queryKey: ['user-plans-with-products', user?.id, currentDomain],
    queryFn: async () => {
      const response = await fetch(`/api/user-products?domain=${currentDomain}`, {
        credentials: 'include',
        cache: 'no-store', // Prevent browser caching
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user plans');
      }
      return response.json();
    },
    enabled: !!user && !!currentDomain,
    staleTime: 0, // Always refetch on mount
    gcTime: 0, // Don't cache in memory
  });

  const togglePlanExpansion = (planId: number) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const toggleCategoryExpansion = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const handleProductAction = (product: Product) => {
    if (product.contentUrl) {
      if (product.type === 'link' || product.type === 'website_link') {
        window.open(product.contentUrl, '_blank');
      } else {
        // For files, videos, etc., open in new tab or download
        window.open(product.contentUrl, '_blank');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: string | null) => {
    if (!price) return 'Free';
    const numPrice = parseFloat(price);
    return numPrice > 0 ? `$${numPrice.toFixed(2)}` : 'Free';
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Plans</h3>
            <p className="text-red-700">Failed to load your subscription plans. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const plans = userPlansData?.plans || [];

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
          <p className="text-gray-600">Your subscription plans and accessible content</p>
        </div>

        {plans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 mb-4">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Active Plans</h3>
                <p>You don't have any active subscription plans yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => {
              const isExpanded = expandedPlans.has(plan.id);
              const totalProducts = plan.categories.reduce((sum, cat) => sum + cat.products.length, 0);
              
              return (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              Purchased {formatDate(plan.purchaseDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {formatPrice(plan.monthlyPrice)}/month
                            </div>
                            <Badge 
                              variant={plan.subscriptionStatus === 'active' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {plan.subscriptionStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {plan.categories.length} categories • {totalProducts} products
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlanExpansion(plan.id)}
                          className="p-2"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                    )}
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="p-6">
                      {plan.categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No categories available in this plan</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {plan.categories.map((category) => {
                            const categoryKey = `${plan.id}-${category.id}`;
                            const isCategoryExpanded = expandedCategories.has(categoryKey);
                            const CategoryIcon = getCategoryIcon(category.name);

                            return (
                              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div 
                                  className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                  onClick={() => toggleCategoryExpansion(categoryKey)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <CategoryIcon className="h-5 w-5 text-gray-600" />
                                      <div>
                                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                                        {category.description && (
                                          <p className="text-sm text-gray-600">{category.description}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline" className="text-xs">
                                        {category.products.length} products
                                      </Badge>
                                      {isCategoryExpanded ? (
                                        <FolderOpen className="h-4 w-4 text-gray-500" />
                                      ) : (
                                        <Folder className="h-4 w-4 text-gray-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {isCategoryExpanded && (
                                  <div className="p-4 bg-white">
                                    {category.products.length === 0 ? (
                                      <div className="text-center py-6 text-gray-500">
                                        <Package className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No products in this category</p>
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.products.map((product) => {
                                          const ProductIcon = getProductTypeIcon(product.type);
                                          
                                          return (
                                            <div 
                                              key={product.id} 
                                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                              onClick={() => handleProductAction(product)}
                                            >
                                              <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                  {product.imageUrl ? (
                                                    <img 
                                                      src={product.imageUrl} 
                                                      alt={product.name}
                                                      className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                  ) : (
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                      <ProductIcon className="h-6 w-6 text-gray-500" />
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
                                                  {product.description && (
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                                                  )}
                                                  <div className="flex items-center justify-between mt-2">
                                                    <Badge variant="secondary" className="text-xs capitalize">
                                                      {product.type.replace('_', ' ')}
                                                    </Badge>
                                                    {product.contentUrl && (
                                                      <div className="flex items-center space-x-1">
                                                        {product.type === 'video' && <Play className="h-3 w-3 text-blue-500" />}
                                                        {(product.type === 'link' || product.type === 'website_link') && <ExternalLink className="h-3 w-3 text-green-500" />}
                                                        {(product.type === 'file' || product.type === 'document') && <Download className="h-3 w-3 text-purple-500" />}
                                                        {product.type === 'image' && <Eye className="h-3 w-3 text-orange-500" />}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;