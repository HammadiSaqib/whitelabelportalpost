import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  Play,
  FileText,
  Image,
  Video,
  File,
  ExternalLink,
  Eye,
  Star,
  Clock,
  Calendar,
  DollarSign,
  Package,
  User,
} from "lucide-react";

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
  categoryId?: number;
  categoryName?: string;
}

interface Purchase {
  id: number;
  planId: number;
  planName: string;
  amount: number;
  status: string;
  createdAt: string;
  whiteLabelId: number;
}

export default function ProductDetailPage() {
  const { user, isAuthenticated, isLoading, domain } = useAuth();
  const [match, params] = useRoute("/:domain/user/product/:productId");
  const [location, setLocation] = useLocation();
  const routeDomain = params?.domain;
  const productId = params?.productId;

  console.log("ProductDetailPage rendering:", { 
    user, 
    isAuthenticated, 
    isLoading, 
    domain: domain || routeDomain,
    productId 
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
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const currentDomain = domain || routeDomain;

  // Get product details
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId, currentDomain],
    queryFn: async () => {
      const res = await fetch(`/api/products/${productId}?domain=${currentDomain}`);
      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }
      return res.json();
    },
    enabled: isAuthenticated && !!productId && !!currentDomain,
  });

  // Check if user has access to this product
  const { data: hasAccess = false } = useQuery({
    queryKey: ["/api/user/product-access", productId, currentDomain],
    queryFn: async () => {
      const res = await fetch(`/api/user/product-access/${productId}?domain=${currentDomain}`);
      if (!res.ok) {
        return false;
      }
      const data = await res.json();
      return data.hasAccess;
    },
    enabled: isAuthenticated && !!productId && !!currentDomain,
  });

  const goBack = () => {
    setLocation(`/${currentDomain}/user`);
  };

  const handleDownload = () => {
    if (product?.contentUrl) {
      window.open(product.contentUrl, '_blank');
    }
  };

  const handleView = () => {
    if (product?.contentUrl) {
      window.open(product.contentUrl, '_blank');
    }
  };

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'file':
        return <File className="h-6 w-6" />;
      case 'link':
        return <ExternalLink className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'file':
        return 'bg-blue-100 text-blue-800';
      case 'link':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={goBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <Eye className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have access to this product. Please check your subscription or contact support.
            </p>
            <Button onClick={goBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={goBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div className="text-sm text-gray-500">
            {currentDomain}
          </div>
        </div>

        {/* Product Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                  {getProductIcon(product.type)}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getProductTypeColor(product.type)}>
                      {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                    </Badge>
                    {product.categoryName && (
                      <Badge variant="outline">
                        {product.categoryName}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {product.price && (
                <div className="text-right">
                  <div className="flex items-center text-2xl font-bold text-green-600">
                    <DollarSign className="h-6 w-6" />
                    {product.price}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          {product.description && (
            <CardContent>
              <CardDescription className="text-base text-gray-700">
                {product.description}
              </CardDescription>
            </CardContent>
          )}
        </Card>

        {/* Product Image */}
        {product.imageUrl && (
          <Card className="mb-8">
            <CardContent className="p-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {product.contentUrl && (
                <>
                  <Button
                    onClick={handleView}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Content</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Product Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Product ID</Label>
                  <p className="text-gray-900">{product.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Type</Label>
                  <p className="text-gray-900 capitalize">{product.type}</p>
                </div>
                {product.accessDuration && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Access Duration</Label>
                    <p className="text-gray-900">{product.accessDuration}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}