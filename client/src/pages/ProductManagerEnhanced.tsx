import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TreeCategorySelector from "@/components/TreeCategorySelector";
import type { Category } from "@shared/schema";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Globe,
  Video,
  AudioLines,
  FileText,
  BookOpen,
  ShoppingCart,
  Download,
  GraduationCap,
  Sparkles,
  Loader2,
  Save,
  X
} from 'lucide-react';

// Product type configurations
const PRODUCT_TYPES = {
  website_link: {
    label: "Website Link",
    icon: Globe,
    description: "External website or web application",
    fields: ["url", "accessType", "loginRequired"]
  },
  video: {
    label: "Video Content",
    icon: Video,
    description: "Video files, streaming content, or video courses",
    fields: ["duration", "format", "quality", "downloadable"]
  },
  audio: {
    label: "Audio Content",
    icon: AudioLines,
    description: "Podcasts, music, audiobooks, or audio courses",
    fields: ["duration", "format", "downloadable"]
  },
  document: {
    label: "Document",
    icon: FileText,
    description: "PDFs, ebooks, guides, or written materials",
    fields: ["format", "pages", "downloadable"]
  },
  article: {
    label: "Article/Blog Post",
    icon: BookOpen,
    description: "Written content, blog posts, or tutorials",
    fields: ["content", "readingTime", "seoOptimized"]
  },
  ecommerce_product: {
    label: "E-commerce Product",
    icon: ShoppingCart,
    description: "Physical products for online sales",
    fields: ["sku", "inventory", "shipping", "variants"]
  },
  digital_product: {
    label: "Digital Product",
    icon: Download,
    description: "Software, apps, digital downloads, or tools",
    fields: ["downloadUrl", "fileSize", "fileFormat", "license"]
  },
  lms_course: {
    label: "LMS Course",
    icon: GraduationCap,
    description: "Structured learning courses with lessons and chapters",
    fields: ["lessons", "duration", "difficulty", "prerequisites"]
  }
};

// Form schemas
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  type: z.enum(["website_link", "video", "audio", "document", "article", "ecommerce_product", "digital_product", "lms_course"]),
  categoryId: z.number().optional(),
  contentUrl: z.string().optional(),
  accessDuration: z.number().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type ProductForm = z.infer<typeof productSchema>;
type CategoryForm = z.infer<typeof categorySchema>;

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  type: string;
  categoryId?: number;
  contentUrl?: string;
  accessDuration?: number;
  imageUrl?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}



export default function ProductManagerEnhanced() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedProductType, setSelectedProductType] = useState<string>("");

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    select: (data: Category[]) => data || [],
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products/my'],
    select: (data: Product[]) => data || [],
  });

  // Category form
  const categoryForm = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  // Product form
  const productForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      type: "digital_product",
      contentUrl: "",
      accessDuration: undefined,
      categoryId: undefined,
      imageUrl: "",
      isActive: true,
      metadata: {},
    },
  });

  // Watch product type changes
  const watchedType = productForm.watch("type");

  // AI Content Generation
  const generateWithAI = useMutation({
    mutationFn: async (data: { type: string; prompt: string; productType: string }) => {
      return await apiRequest('/api/ai/generate-product-content', 'POST', data);
    },
    onSuccess: (data: any) => {
      if (data?.content) {
        // Apply AI-generated content to form
        if (data.content.name) productForm.setValue("name", data.content.name);
        if (data.content.description) productForm.setValue("description", data.content.description);
        if (data.content.metadata) productForm.setValue("metadata", data.content.metadata);
        
        toast({
          title: "AI Content Generated!",
          description: "Product content has been generated and applied to your form.",
        });
        setShowAIAssistant(false);
        setAiPrompt("");
      }
    },
    onError: (error) => {
      console.error('AI generation error:', error);
      toast({
        title: "AI Generation Failed",
        description: "Please try again with a different prompt.",
        variant: "destructive",
      });
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryForm) => {
      return await apiRequest('/api/categories', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories/my'] });
      setShowCategoryModal(false);
      categoryForm.reset();
      toast({
        title: "Success!",
        description: "Category created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create category.",
        variant: "destructive",
      });
    }
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<CategoryForm> }) => {
      return await apiRequest(`/api/categories/${data.id}`, 'PATCH', data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories/my'] });
      setShowCategoryModal(false);
      categoryForm.reset();
      setEditingCategory(null);
      toast({
        title: "Success!",
        description: "Category updated successfully.",
      });
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      return await apiRequest('/api/products', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/my'] });
      setShowProductModal(false);
      productForm.reset();
      toast({
        title: "Success!",
        description: "Product created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<ProductForm> }) => {
      return await apiRequest(`/api/products/${data.id}`, 'PATCH', data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/my'] });
      setShowProductModal(false);
      productForm.reset();
      setEditingProduct(null);
      toast({
        title: "Success!",
        description: "Product updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/products/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products/my'] });
      toast({
        title: "Success!",
        description: "Product deleted successfully.",
      });
    },
  });

  // Handlers
  const handleCategorySubmit = (data: CategoryForm) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, updates: data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const handleProductSubmit = (data: ProductForm) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, updates: data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type as any,
      categoryId: product.categoryId,
      contentUrl: product.contentUrl,
      accessDuration: product.accessDuration,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      metadata: product.metadata || {},
    });
    setShowProductModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      description: category.description ?? undefined,
      isActive: category.isActive ?? false,
    });
    setShowCategoryModal(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    productForm.reset();
    setShowProductModal(false);
  };

  const resetCategoryForm = () => {
    setEditingCategory(null);
    categoryForm.reset();
    setShowCategoryModal(false);
  };

  // Get product type config
  const getProductTypeConfig = (type: string) => {
    return PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES] || PRODUCT_TYPES.digital_product;
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Product Manager" />
        
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Digital Products</h2>
                <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetProductForm(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Create New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...productForm}>
                      <form onSubmit={productForm.handleSubmit(handleProductSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Digital Marketing Course" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Type</FormLabel>
                                <Select onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedProductType(value);
                                }} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select product type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(PRODUCT_TYPES).map(([key, config]) => {
                                      const IconComponent = config.icon;
                                      return (
                                        <SelectItem key={key} value={key}>
                                          <div className="flex items-center gap-2">
                                            <IconComponent className="h-4 w-4" />
                                            <span>{config.label}</span>
                                          </div>
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* AI Assistant Button */}
                        {watchedType && (
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowAIAssistant(true)}
                              className="flex items-center gap-2"
                            >
                              <Sparkles className="h-4 w-4" />
                              AI Assistant for {getProductTypeConfig(watchedType).label}
                            </Button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input placeholder="49.99" type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="categoryId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category (Optional)</FormLabel>
                                <FormControl>
                                  {categoriesLoading ? (
                                    <div className="text-sm text-gray-500">Loading categories...</div>
                                  ) : categories.length === 0 ? (
                                    <div className="text-sm text-gray-500">No categories available</div>
                                  ) : (
                                    <TreeCategorySelector
                                      categories={categories}
                                      selectedId={field.value}
                                      onSelect={(id) => field.onChange(id)}
                                      placeholder="Select category"
                                    />
                                  )}
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={productForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detailed description of your product..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={productForm.control}
                            name="contentUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/content" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={productForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={productForm.control}
                          name="accessDuration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Access Duration (Days)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="30 (leave empty for lifetime access)"
                                  {...field}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowProductModal(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                          >
                            {createProductMutation.isPending || updateProductMutation.isPending
                              ? "Saving..."
                              : editingProduct
                              ? "Update Product"
                              : "Create Product"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Products Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const typeConfig = getProductTypeConfig(product.type);
                        const IconComponent = typeConfig.icon;
                        const category = categories.find(c => c.id === product.categoryId);
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="info">{typeConfig.label}</Badge>
                            </TableCell>
                            <TableCell>
                              {category ? (
                                <Badge variant="purple">{category.name}</Badge>
                              ) : (
                                <span className="text-gray-400">Uncategorized</span>
                              )}
                            </TableCell>
                            <TableCell>${product.price ? Number(product.price).toFixed(2) : '0.00'}</TableCell>
                            <TableCell>
                              <Badge variant={product.isActive ? "success" : "warning"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteProductMutation.mutate(product.id)}
                                  disabled={deleteProductMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Product Categories</h2>
                <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetCategoryForm(); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Edit Category" : "Create New Category"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...categoryForm}>
                      <form onSubmit={categoryForm.handleSubmit(handleCategorySubmit)} className="space-y-4">
                        <FormField
                          control={categoryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Online Courses" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={categoryForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Category description..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowCategoryModal(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                          >
                            {createCategoryMutation.isPending || updateCategoryMutation.isPending
                              ? "Saving..."
                              : editingCategory
                              ? "Update Category"
                              : "Create Category"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          )}
                        </div>
                        <Badge variant={category.isActive ? "success" : "warning"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant Dialog */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Product Assistant
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product Type</Label>
              <p className="text-sm text-gray-600">
                {selectedProductType ? getProductTypeConfig(selectedProductType).description : "Select a product type first"}
              </p>
            </div>
            <div>
              <Label htmlFor="ai-prompt">What kind of {selectedProductType ? getProductTypeConfig(selectedProductType).label.toLowerCase() : 'product'} do you want to create?</Label>
              <Textarea
                id="ai-prompt"
                placeholder={`e.g., "A comprehensive digital marketing course for beginners covering social media, SEO, and email marketing"`}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAIAssistant(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (aiPrompt && selectedProductType) {
                    generateWithAI.mutate({
                      type: 'product_content',
                      prompt: aiPrompt,
                      productType: selectedProductType
                    });
                  }
                }}
                disabled={!aiPrompt || !selectedProductType || generateWithAI.isPending}
              >
                {generateWithAI.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}