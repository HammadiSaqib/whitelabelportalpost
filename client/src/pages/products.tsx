import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { createIconStyle } from "@/utils/iconColors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign,
  Users,
  Star,
  BarChart3,
  TrendingUp,
  Search,
  Filter,
  Download,
  Upload,
  ShoppingCart,
  Tag,
  Image,
  FileText,
  Menu,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';

// Import the proper Product type from schema
import { products } from "@/../../shared/schema";

type Product = typeof products.$inferSelect;

export default function ProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { primaryColor, secondaryColor } = useTheme();
  
  // State management
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'draft' as const,
    imageUrl: '',
    features: [''],
    tags: ['']
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  // Fetch product categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/product-categories'],
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest('/api/products', 'POST', {
        ...productData,
        price: productData.price.toString(),
        type: 'digital',
        features: productData.features.filter((f: string) => f.trim()),
        tags: productData.tags.filter((t: string) => t.trim())
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      return await apiRequest(`/api/products/${id}`, 'PUT', {
        ...data,
        price: parseFloat(data.price),
        features: data.features.filter((f: string) => f.trim()),
        tags: data.tags.filter((t: string) => t.trim())
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowEditDialog(false);
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/products/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      status: 'draft',
      imageUrl: '',
      features: [''],
      tags: ['']
    });
    setSelectedProduct(null);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      status: product.status,
      imageUrl: product.imageUrl || '',
      features: product.features.length > 0 ? product.features : [''],
      tags: product.tags.length > 0 ? product.tags : ['']
    });
    setShowEditDialog(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const addFeature = () => {
    setProductForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setProductForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const addTag = () => {
    setProductForm(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    setProductForm(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const updateTag = (index: number, value: string) => {
    setProductForm(prev => ({
      ...prev,
      tags: prev.tags.map((t, i) => i === index ? value : t)
    }));
  };

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate stats with safe fallbacks
  const stats = {
    totalProducts: products.length || 0,
    activeProducts: products.filter((p: Product) => p.status === 'active').length || 0,
    totalRevenue: products.reduce((sum: number, p: Product) => sum + (p.revenue || 0), 0) || 0,
    totalSales: products.reduce((sum: number, p: Product) => sum + (p.sales || 0), 0) || 0
  };

  const ProductForm = ({ isEdit = false }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={productForm.name}
            onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={productForm.category}
            onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="template">Template</SelectItem>
              <SelectItem value="digital">Digital Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={productForm.price}
            onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.00"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={productForm.status}
            onValueChange={(value: 'active' | 'inactive' | 'draft') => 
              setProductForm(prev => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={productForm.description}
          onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your product..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={productForm.imageUrl}
          onChange={(e) => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label>Features</Label>
        {productForm.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={feature}
              onChange={(e) => updateFeature(index, e.target.value)}
              placeholder="Enter feature"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFeature(index)}
              disabled={productForm.features.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFeature}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <div>
        <Label>Tags</Label>
        {productForm.tags.map((tag, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <Input
              value={tag}
              onChange={(e) => updateTag(index, e.target.value)}
              placeholder="Enter tag"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeTag(index)}
              disabled={productForm.tags.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTag}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setShowEditDialog(false);
            } else {
              setShowCreateDialog(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={() => {
            if (isEdit && selectedProduct) {
              updateProductMutation.mutate({ id: selectedProduct.id, data: productForm });
            } else {
              createProductMutation.mutate(productForm);
            }
          }}
          disabled={createProductMutation.isPending || updateProductMutation.isPending}
        >
          {(createProductMutation.isPending || updateProductMutation.isPending) ? 
            "Saving..." : 
            (isEdit ? "Update Product" : "Create Product")
          }
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header with Hamburger Menu */}
          <div className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3 flex items-center justify-between shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Products
            </h1>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${primaryColor || '#3B82F6'}, ${secondaryColor || '#8B5CF6'}, ${primaryColor || '#3B82F6'})`
                }}
              ></div>
              <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3 flex items-center justify-between shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Products
          </h1>
          <div className="w-10"></div>
        </div>

        <Header title="Products" />
        
        <div className="flex-1 overflow-auto p-6 space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r opacity-10" style={{
              background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
            }}></div>
            <div className="relative px-8 py-12">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-3 rounded-2xl shadow-lg"
                      style={{ backgroundColor: primaryColor || '#3B82F6' }}
                    >
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Product Catalog
                      </h1>
                      <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Manage your digital products with style and efficiency
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    className="px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: primaryColor || '#3B82F6',
                      background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
                    }}
                  >
                    <Plus className="h-6 w-6 mr-3" />
                    Create Product
                    <Sparkles className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{
                background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, transparent 100%)`
              }}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Products</CardTitle>
                <div 
                  className="p-2 rounded-xl shadow-lg"
                  style={{ backgroundColor: primaryColor || '#3B82F6' }}
                >
                  <Package className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-2">
                  <Activity className="h-4 w-4 mr-1" />
                  {stats.activeProducts} active
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Sales</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSales.toLocaleString()}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Across all products
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{
                background: `linear-gradient(135deg, ${secondaryColor || '#8B5CF6'} 0%, transparent 100%)`
              }}></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Revenue</CardTitle>
                <div 
                  className="p-2 rounded-xl shadow-lg"
                  style={{ backgroundColor: secondaryColor || '#8B5CF6' }}
                >
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-2">
                  <Zap className="h-4 w-4 mr-1" />
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Products</CardTitle>
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeProducts}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-2">
                  <BarChart3 className="h-4 w-4 mr-1" style={{ color: secondaryColor || '#8B5CF6' }} />
                  {stats.totalProducts > 0 ? ((stats.activeProducts / stats.totalProducts) * 100).toFixed(1) : '0'}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Products Management */}
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{
              background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
            }}></div>
            <CardHeader className="relative border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div 
                      className="p-2 rounded-xl shadow-lg"
                      style={{ backgroundColor: primaryColor || '#3B82F6' }}
                    >
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Product Management
                    </span>
                  </CardTitle>
                  <p className="text-slate-600 dark:text-slate-400">
                    Manage your product inventory and catalog with advanced tools
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                    style={{ 
                      borderColor: secondaryColor || '#8B5CF6',
                      color: secondaryColor || '#8B5CF6'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${secondaryColor || '#8B5CF6'}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" style={{ color: secondaryColor || '#8B5CF6' }} />
                    Export
                  </Button>
                  <Button 
                    onClick={() => setShowCreateDialog(true)} 
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: primaryColor || '#3B82F6',
                      background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Product
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative p-6">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" style={{ color: secondaryColor || '#8B5CF6' }} />
                    <Input
                      placeholder="Search products by name, category, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <Tag className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="digital">Digital Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl">
                {/* Mobile Card View */}
                <div className="block lg:hidden">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 px-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div 
                          className="p-4 rounded-2xl shadow-lg"
                          style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}
                        >
                          <Package className="h-12 w-12" style={createIconStyle('Package', { primaryColor, secondaryColor })} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                              ? 'No products found' 
                              : 'No products yet'
                            }
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 max-w-md">
                            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                              ? 'Try adjusting your search or filter criteria'
                              : 'Get started by creating your first product'
                            }
                          </p>
                        </div>
                        {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
                          <Button 
                            onClick={() => setShowCreateDialog(true)}
                            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            style={{ 
                              backgroundColor: primaryColor || '#3B82F6',
                              background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Product
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 p-4">
                      {filteredProducts.map((product: Product) => (
                        <Card key={product.id} className="relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="absolute inset-0 bg-gradient-to-br opacity-3" style={{
                            background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
                          }}></div>
                          <CardContent className="relative p-4">
                            <div className="flex items-start space-x-4">
                              <div className="relative flex-shrink-0">
                                {(() => {
                                  let displayImage = null;
                                  if (product.imageUrl) {
                                    displayImage = product.imageUrl;
                                  } else if (product.attachments && Array.isArray(product.attachments) && product.attachments.length > 0) {
                                    const imageAttachment = product.attachments.find((attachment: any) => 
                                      attachment.type?.startsWith('image/') || 
                                      attachment.type === 'image' ||
                                      attachment.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
                                    );
                                    if (imageAttachment) {
                                      displayImage = imageAttachment.url;
                                    }
                                  }
                                  
                                  return displayImage ? (
                                    <img 
                                      src={displayImage} 
                                      alt={product.name}
                                      className="w-16 h-16 rounded-xl object-cover shadow-md"
                                    />
                                  ) : (
                                    <div 
                                      className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
                                      style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}
                                    >
                                      <Package className="h-8 w-8" style={createIconStyle('Package', { primaryColor, secondaryColor })} />
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-lg">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                      {product.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(product)}
                                      className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDelete(product.id)}
                                      disabled={deleteProductMutation.isPending}
                                      className="h-9 w-9 p-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-4">
                                  <span 
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm"
                                    style={{ 
                                      backgroundColor: `${secondaryColor || '#8B5CF6'}20`,
                                      color: secondaryColor || '#8B5CF6'
                                    }}
                                  >
                                    {product.category}
                                  </span>
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${
                                    product.status === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                      : product.status === 'inactive'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {product.status}
                                  </span>
                                  <span className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                                    ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <TrendingUp className="h-4 w-4 text-green-500" />
                                      <span className="font-medium text-slate-900 dark:text-slate-100">
                                        {product.sales?.toLocaleString() || '0'} sales
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="h-4 w-4 text-green-500" />
                                      <span className="font-medium text-slate-900 dark:text-slate-100">
                                        ${(product.revenue || 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div>
                    <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200/50 dark:border-slate-700/50">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-4">Product</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Category</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Price</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Sales</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Revenue</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div 
                              className="p-4 rounded-2xl shadow-lg"
                              style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}
                            >
                              <Package className="h-12 w-12" style={createIconStyle('Package', { primaryColor, secondaryColor })} />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                                  ? 'No products found' 
                                  : 'No products yet'
                                }
                              </h3>
                              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                                  ? 'Try adjusting your search or filter criteria'
                                  : 'Get started by creating your first product'
                                }
                              </p>
                            </div>
                            {(!searchTerm && statusFilter === 'all' && categoryFilter === 'all') && (
                              <Button 
                                onClick={() => setShowCreateDialog(true)}
                                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{ 
                                  backgroundColor: primaryColor || '#3B82F6',
                                  background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Product
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product: Product) => (
                        <TableRow 
                          key={product.id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all duration-200 border-b border-slate-200/30 dark:border-slate-700/30"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                {(() => {
                                  // Smart Image Priority System:
                                  // 1. Meta URL Image (imageUrl field)
                                  // 2. First image file from attachments
                                  // 3. Default placeholder
                                  
                                  let displayImage = null;
                                  
                                  // Priority 1: Meta URL Image - Drizzle maps image_url to imageUrl
                                  if (product.imageUrl) {
                                    displayImage = product.imageUrl;
                                  }
                                  // Priority 2: First image file from attachments
                                  else if (product.attachments && Array.isArray(product.attachments) && product.attachments.length > 0) {
                                    const imageAttachment = product.attachments.find((attachment: any) => 
                                      attachment.type?.startsWith('image/') || 
                                      attachment.type === 'image' ||
                                      attachment.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
                                    );
                                    if (imageAttachment) {
                                      displayImage = imageAttachment.url;
                                    }
                                  }
                                  
                                  return displayImage ? (
                                    <img 
                                      src={displayImage} 
                                      alt={product.name}
                                      className="w-12 h-12 rounded-xl object-cover shadow-md"
                                      onError={(e) => {
                                        // Fallback to placeholder if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.innerHTML = `
                                            <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style="background-color: ${primaryColor || '#3B82F6'}20">
                                              <svg class="h-6 w-6" style="color: ${primaryColor || '#3B82F6'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                              </svg>
                                            </div>
                                          `;
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div 
                                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                                      style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}
                                    >
                                      <Package className="h-6 w-6" style={createIconStyle('Package', { primaryColor, secondaryColor })} />
                                    </div>
                                  );
                                })()} 
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                  {product.name}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                              style={{ 
                                backgroundColor: `${secondaryColor || '#8B5CF6'}20`,
                                color: secondaryColor || '#8B5CF6'
                              }}
                            >
                              {product.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              ${product.price ? Number(product.price).toFixed(2) : '0.00'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : product.status === 'inactive'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {product.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {product.sales?.toLocaleString() || '0'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-500" />
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                ${(product.revenue || 0).toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                                className="h-9 w-9 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                disabled={deleteProductMutation.isPending}
                                className="h-9 w-9 p-0 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{
              background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
            }}></div>
            <DialogHeader className="relative border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div 
                  className="p-2 rounded-xl shadow-lg"
                  style={{ backgroundColor: primaryColor || '#3B82F6' }}
                >
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Create New Product
                </span>
              </DialogTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Add a new product to your catalog with detailed information and media
              </p>
            </DialogHeader>
            <div className="relative">
              <ProductForm />
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5" style={{
              background: `linear-gradient(135deg, ${primaryColor || '#3B82F6'} 0%, ${secondaryColor || '#8B5CF6'} 100%)`
            }}></div>
            <DialogHeader className="relative border-b border-slate-200/50 dark:border-slate-700/50 pb-6">
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div 
                  className="p-2 rounded-xl shadow-lg"
                  style={{ backgroundColor: secondaryColor || '#8B5CF6' }}
                >
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Edit Product
                </span>
              </DialogTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Update product information and manage your catalog
              </p>
            </DialogHeader>
            <div className="relative">
              <ProductForm isEdit />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}