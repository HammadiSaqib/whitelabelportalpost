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
import { Input } from "@/components/ui/input";
import {
  Package,
  Search,
  Filter,
  Download,
  Play,
  FileText,
  Image,
  Video,
  File,
  ExternalLink,
  Eye,
  Grid,
  List,
} from "lucide-react";

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

interface ProductsProps {
  userPlans: UserPlan[];
}

export default function Products({ userPlans }: ProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get all products from user plans
  const allProducts = userPlans.flatMap(plan => 
    plan.products.map(product => ({
      ...product,
      planName: plan.name,
      planId: plan.id
    }))
  );

  // Get all categories
  const allCategories = userPlans.flatMap(plan => plan.categories);
  const uniqueCategories = allCategories.filter((category, index, self) => 
    index === self.findIndex(c => c.id === category.id)
  );

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedCategory === "all") return matchesSearch;
    
    // Check if product belongs to selected category (this would need proper category-product relationship)
    return matchesSearch;
  });

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'file':
        return <File className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
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

  const handleViewProduct = (product: any) => {
    if (product.contentUrl) {
      let url = product.contentUrl;
      
      // If it's a document type and the URL doesn't start with http, prepend the API endpoint
      if (product.type === 'document' && !url.startsWith('http')) {
        url = `/api/files/${url}`;
      }
      
      // For PDF files, open in a new tab with proper PDF viewer
      if (url.toLowerCase().endsWith('.pdf')) {
        window.open(url, '_blank');
      } else {
        // For other file types, open in new tab
        window.open(url, '_blank');
      }
    }
  };

  const handleDownloadProduct = (product: any) => {
    if (product.contentUrl) {
      let url = product.contentUrl;
      
      // If it's a document type and the URL doesn't start with http, prepend the API endpoint
      if (product.type === 'document' && !url.startsWith('http')) {
        url = `/api/files/${url}`;
      }
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = product.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600">Access and manage your purchased products</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all" 
                ? "No products match your current filters."
                : "You don't have access to any products yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white">
                      {getProductIcon(product.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">{product.planName}</p>
                    </div>
                  </div>
                  <Badge className={getProductTypeColor(product.type)}>
                    {product.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {product.description && (
                  <CardDescription className="mb-4 line-clamp-2">
                    {product.description}
                  </CardDescription>
                )}
                {product.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {product.accessDuration && (
                      <span>{product.accessDuration}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProduct(product)}
                      disabled={!product.contentUrl}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {product.contentUrl && product.type !== 'website_link' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadProduct(product)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredProducts.length} of {allProducts.length} products
            </span>
            <span>
              {userPlans.length} active plan{userPlans.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}