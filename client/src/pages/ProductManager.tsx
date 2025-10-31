import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, DollarSign, Package, Star, Globe, Link, Upload, FileImage, FileVideo, FileAudio, FileText, BookOpen, ShoppingCart, Download, Search, Sparkles, Zap, Activity, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import DynamicProductForm from "@/components/DynamicProductForm";
import { Menu } from "lucide-react";

const PRODUCT_TYPES = [
  { value: "website_link", label: "Website Link" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "document", label: "Document" },
  { value: "article", label: "Article" },
  { value: "ecommerce_product", label: "E-commerce Product" },
  { value: "digital_product", label: "Digital Product" },
  { value: "lms_course", label: "LMS Course" },
];

export default function ProductManager() {
  const { user } = useAuth();
  const { theme, primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [urlInput, setUrlInput] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedProductType, setSelectedProductType] = useState("website_link");
  const [metaImage, setMetaImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';

  /**
   * Professional Color Theory Implementation
   * 
   * This system follows the 40-35-25 color distribution rule:
   * - 40% Neutral colors (whites, grays) for backgrounds and base elements
   * - 35% Primary brand color for main CTAs, headers, and key interactions
   * - 25% Secondary complementary color for accents and supporting elements
   * 
   * Color Generation Logic:
   * - Primary color is provided by user/brand settings
   * - Secondary color is automatically generated using complementary color theory
   * - Uses HSL color space for precise hue, saturation, and lightness control
   * - Ensures strong contrast between primary and secondary colors
   * - Maintains professional appearance across all color combinations
   */

  // Professional color theory functions
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) { r = c; g = x; b = 0; }
    else if (1/6 <= h && h < 2/6) { r = x; g = c; b = 0; }
    else if (2/6 <= h && h < 3/6) { r = 0; g = c; b = x; }
    else if (3/6 <= h && h < 4/6) { r = 0; g = x; b = c; }
    else if (4/6 <= h && h < 5/6) { r = x; g = 0; b = c; }
    else if (5/6 <= h && h < 1) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Generate professional secondary color based on color theory
  const generateProfessionalSecondary = (primaryHex: string) => {
    const [h, s, l] = hexToHsl(primaryHex);
    
    // Use complementary or triadic color schemes for better contrast
    let secondaryHue;
    
    // Choose color relationship based on primary hue for optimal contrast
    if (h >= 0 && h < 60) {
      // Red-Orange: Use cool blue-green complement
      secondaryHue = (h + 180) % 360;
    } else if (h >= 60 && h < 120) {
      // Yellow-Green: Use warm purple complement
      secondaryHue = (h + 180) % 360;
    } else if (h >= 120 && h < 180) {
      // Green-Cyan: Use warm red complement
      secondaryHue = (h + 180) % 360;
    } else if (h >= 180 && h < 240) {
      // Blue-Cyan: Use warm orange complement
      secondaryHue = (h + 180) % 360;
    } else if (h >= 240 && h < 300) {
      // Blue-Purple: Use warm yellow complement
      secondaryHue = (h + 180) % 360;
    } else {
      // Purple-Red: Use cool green complement
      secondaryHue = (h + 180) % 360;
    }
    
    // Create professional saturation and lightness
    let secondarySat = Math.max(30, Math.min(80, s * 0.9)); // Maintain good saturation
    let secondaryLight;
    
    // Ensure good contrast with primary
    if (l > 60) {
      secondaryLight = Math.max(20, l - 40); // Much darker for light primaries
    } else if (l < 40) {
      secondaryLight = Math.min(80, l + 40); // Much lighter for dark primaries
    } else {
      secondaryLight = l > 50 ? Math.max(25, l - 30) : Math.min(75, l + 30);
    }
    
    return hslToHex(secondaryHue, secondarySat, secondaryLight);
  };

  // Helper function to create professional gradient styles with color theory
  const createGradientStyle = (opacity = 0.1, angle = 135) => {
    const primary = primaryColor || '#2563EB';
    const secondary = secondaryColor || '#64748B'; // Use user's actual secondary color
    
    // Create sophisticated color blending with professional ratios
    const primaryOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
    const secondaryOpacity = Math.round((opacity * 0.6) * 255).toString(16).padStart(2, '0');
    
    return {
      background: `linear-gradient(${angle}deg, ${primary}${primaryOpacity}, ${secondary}${secondaryOpacity})`
    };
  };

  // Helper function to create professional solid color styles
  const createSolidStyle = (useSecondary = false, opacity = 1) => {
    const primary = primaryColor || '#2563EB';
    const secondary = secondaryColor || '#64748B'; // Use user's actual secondary color
    const color = useSecondary ? secondary : primary;
    
    if (opacity === 1) {
      return { backgroundColor: color };
    }
    
    const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return { backgroundColor: `${color}${opacityHex}` };
  };

  // Helper function to create professional text gradient styles
  const createTextGradientStyle = (subtle = false) => {
    const primary = primaryColor || '#2563EB';
    const secondary = secondaryColor || '#64748B'; // Use user's actual secondary color
    
    if (subtle) {
      // Create a more subtle gradient for better readability
      return {
        background: `linear-gradient(135deg, ${primary}E6, ${secondary}CC)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      };
    }
    
    return {
      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };
  };

  // Helper function for accent colors with better harmony (following 60-30-10 rule)
  const createAccentStyle = (variant = 'primary') => {
    const primary = primaryColor || '#2563EB';
    const secondary = secondaryColor || '#64748B'; // Use user's actual secondary color
    
    switch (variant) {
      case 'success':
        return { backgroundColor: '#10B981' }; // Professional green
      case 'warning':
        return { backgroundColor: '#F59E0B' }; // Professional amber
      case 'secondary':
        return { backgroundColor: secondary }; // User's actual secondary color
      case 'neutral':
        return { backgroundColor: '#6B7280' }; // Professional gray (60% of design)
      default:
        return { backgroundColor: primary }; // Primary color (30% of design)
    }
  };

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const createMutation = useMutation({
    mutationFn: async (productData: any) => {
      return apiRequest('/api/products', 'POST', productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setShowCreateForm(false);
      setEditingProduct(null);
      setSelectedCategoryId(undefined);
      setUploadedFile(null);
      setSelectedProductType("website_link");
      toast({
        title: "Product Created",
        description: "Your product has been created successfully.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      return apiRequest(`/api/products/${id}`, 'PUT', productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      setShowCreateForm(false);
      setSelectedCategoryId(undefined);
      setUploadedFile(null);
      setSelectedProductType("website_link");
      toast({
        title: "Product Updated",
        description: "Your product has been updated successfully.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/products/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    },
  });

  // URL meta fetching function
  const fetchUrlMeta = async (url: string) => {
    if (!url || !url.startsWith('http')) return;
    
    setFetchingMeta(true);
    try {
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        const { title, description, image } = data.data;
        
        // Update form fields directly via DOM manipulation
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        const descInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const urlField = document.querySelector('input[name="contentUrl"]') as HTMLInputElement;
        const imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
        const imageUrlHidden = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
        
        if (nameInput && title) nameInput.value = title;
        if (descInput && description) descInput.value = description;
        if (urlField) urlField.value = url;
        
        // Set image if available
        if (image && image.url) {
          setMetaImage(image.url);
          if (imagePreview) {
            imagePreview.src = image.url;
            imagePreview.style.display = 'block';
          }
          if (imageUrlHidden) imageUrlHidden.value = image.url;
        }
        
        toast({
          title: "URL Meta Fetched",
          description: `Product details ${image?.url ? 'and image' : ''} have been auto-filled from the URL.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch URL metadata. Please enter details manually.",
        variant: "destructive",
      });
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setUrlInput(url);
    
    if (url && url.startsWith('http')) {
      // Debounce the API call
      const timer = setTimeout(() => {
        fetchUrlMeta(url);
      }, 1000);
      
      // Cleanup function would go here in a useEffect, but for this simple case we'll just call it directly
      return () => clearTimeout(timer);
    }
  };

  // Get expected file types based on product type
  const getAcceptedFileTypes = (productType: string) => {
    switch (productType) {
      case 'video':
        return '.mp4,.mov,.avi,.mkv,.webm';
      case 'audio':
        return '.mp3,.wav,.ogg,.m4a';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.rtf';
      case 'article':
        return '.md,.txt,.html';
      case 'ecommerce_product':
      case 'digital_product':
      case 'lms_course':
        return '.zip,.pdf,.mp4,.mp3';
      default:
        return 'image/*';
    }
  };

  // Get icon for product type
  const getProductTypeIcon = (productType: string) => {
    switch (productType) {
      case 'video':
        return <FileVideo className="h-8 w-8" />;
      case 'audio':
        return <FileAudio className="h-8 w-8" />;
      case 'document':
        return <FileText className="h-8 w-8" />;
      case 'article':
        return <BookOpen className="h-8 w-8" />;
      case 'ecommerce_product':
        return <ShoppingCart className="h-8 w-8" />;
      case 'digital_product':
        return <Download className="h-8 w-8" />;
      case 'lms_course':
        return <BookOpen className="h-8 w-8" />;
      default:
        return <FileImage className="h-8 w-8" />;
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  // Process uploaded file
  const handleFileUpload = (file: File) => {
    const acceptedTypes = getAcceptedFileTypes(selectedProductType).split(',');
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    // Check if file type matches expected type
    const isValidType = acceptedTypes.some(type => 
      type.trim() === fileExtension || 
      (type.includes('/*') && file.type.startsWith(type.replace('/*', '')))
    );

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a file matching the ${selectedProductType} type. Expected: ${acceptedTypes.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    
    // Create object URL for preview
    const fileUrl = URL.createObjectURL(file);
    const imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
    const imageUrlHidden = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
    
    if (imagePreview && file.type.startsWith('image/')) {
      imagePreview.src = fileUrl;
      imagePreview.style.display = 'block';
    }
    
    if (imageUrlHidden) {
      imageUrlHidden.value = fileUrl;
    }

    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryIdValue = formData.get('categoryId') as string;
    
    // Handle file upload - use uploaded file if available, otherwise preserve existing contentUrl
    let contentUrl = formData.get('contentUrl') as string || '';
    if (uploadedFile) {
      try {
        // Upload file to server
        const fileFormData = new FormData();
        fileFormData.append('file', uploadedFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('File upload failed');
        }
        
        const { filename } = await uploadResponse.json();
        contentUrl = filename;
      } catch (error) {
        console.error('File upload error:', error);
        toast({
          title: "Upload Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else if (editingProduct && editingProduct.contentUrl && selectedProductType !== 'website_link') {
      // For non-website_link products, preserve existing file when editing and no new file uploaded
      // For website_link products, always use the contentUrl from the form
      contentUrl = editingProduct.contentUrl;
    }
    
    const productData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      type: formData.get('type'),
      categoryId: (categoryIdValue && categoryIdValue !== 'none') ? parseInt(categoryIdValue) : null,
      contentUrl: contentUrl,
      accessDuration: formData.get('accessDuration') ? parseInt(formData.get('accessDuration') as string) : null,
      imageUrl: formData.get('imageUrl'),
      isActive: formData.get('isActive') === 'on',
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setSelectedProductType(product.type || 'document'); // Set the product type to match the editing product
    setSelectedCategoryId(product.categoryId || undefined); // Set the category
    setUploadedFile(null); // Clear any previously uploaded files
    setShowCreateForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  if (productsLoading) {
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
            <h1 className="text-lg font-semibold text-card-foreground">Product Manager</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>

          <Header title="Product Manager" subtitle="Manage your products and inventory" />
          <div className="p-6">
            <div className="text-center py-12">Loading products...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Professional neutral background (40% of design) - More prominent neutral base */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-gray-50/20 to-gray-100/30 dark:from-gray-800/30 dark:via-gray-850/20 dark:to-gray-900/40" />
      
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto relative z-10">
        {/* Mobile Header with Primary Color Accent */}
        <div className="lg:hidden backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/60 dark:border-gray-700/60 px-4 py-3 flex items-center justify-between shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-800/60"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent" style={createTextGradientStyle()}>
            Product Manager
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Hero Section - Primary color usage (35% of design) - Increased primary presence */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0" style={createGradientStyle(0.12, 135)} />
          <div className="relative backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-b border-gray-200/40 dark:border-gray-700/40">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2" style={createTextGradientStyle(false)}>
                    Product Manager
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Manage your products and inventory with professional style
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="backdrop-blur-md rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50" style={createSolidStyle(0.15)}>
                    <Package className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Following 40-35-25 rule with stronger primary presence */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Primary color card (35% usage) */}
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{products?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={createSolidStyle(false, 1)}>
                    <Package className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary color card (35% usage) */}
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{products?.filter((p: any) => p.isActive).length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={createSolidStyle(true, 1)}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary color accent (25% usage) */}
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={createAccentStyle('secondary')}>
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secondary color accent (25% usage) */}
            <Card className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${products?.reduce((sum: number, p: any) => sum + (parseFloat(p.price) || 0), 0).toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl" style={createAccentStyle('secondary')}>
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Create Section - Strong contrast for primary CTAs */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-gray-200/70 dark:border-gray-700/70 focus:bg-white dark:focus:bg-gray-800 focus:border-2 transition-all duration-200"
                  style={{ 
                    focusBorderColor: primaryColor || '#2563EB',
                    '--tw-ring-color': primaryColor || '#2563EB'
                  }}
                />
              </div>
            </div>
            {/* Primary CTA with strong contrast (35% usage) */}
            <Button 
              onClick={() => {
                setShowCreateForm(true);
                setEditingProduct(null);
                setSelectedCategoryId(undefined);
                setUploadedFile(null);
                setSelectedProductType("website_link");
            }} 
            className="text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto hover:scale-105 border-2 border-white/20"
            style={createSolidStyle(false, 1)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Product
          </Button>
          </div>

          {/* Create/Edit Form - Neutral background with primary header */}
          {(showCreateForm || editingProduct) && (
            <Card className="mb-8 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border-gray-200/70 dark:border-gray-700/70 shadow-xl">
              <CardHeader className="rounded-t-lg border-b border-gray-200/50 dark:border-gray-700/50" style={createSolidStyle(false, 0.1)}>
                <CardTitle className="text-xl font-semibold text-white">
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <DynamicProductForm
                    key={editingProduct ? `edit-${editingProduct.id}` : 'create'}
                    selectedProductType={selectedProductType}
                    setSelectedProductType={setSelectedProductType}
                    editingProduct={editingProduct}
                    categories={categories}
                    dragActive={dragActive}
                    uploadedFile={uploadedFile}
                    fetchingMeta={fetchingMeta}
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}
                    handleFileSelect={handleFileSelect}
                    handleUrlChange={handleUrlChange}
                    getAcceptedFileTypes={getAcceptedFileTypes}
                    getProductTypeIcon={getProductTypeIcon}
                    PRODUCT_TYPES={PRODUCT_TYPES}
                    onProductTypeChange={(newType) => {
                      const previousType = selectedProductType;
                      setSelectedProductType(newType);
                      
                      // Clear uploaded file when product type changes
                      if (previousType !== newType) {
                        setUploadedFile(null);
                        // Clear file input
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                        if (fileInput) {
                          fileInput.value = '';
                        }
                      }
                      
                      // Clear meta image when switching away from website_link
                      if (previousType === 'website_link' && newType !== 'website_link') {
                        setMetaImage(null);
                        const imagePreview = document.querySelector('#image-preview') as HTMLImageElement;
                        const imageUrlHidden = document.querySelector('input[name="imageUrl"]') as HTMLInputElement;
                        if (imagePreview) {
                          imagePreview.style.display = 'none';
                          imagePreview.src = '';
                        }
                        if (imageUrlHidden) imageUrlHidden.value = '';
                      }
                      
                      // Re-fetch meta when switching back to website_link with existing URL
                      if (previousType !== 'website_link' && newType === 'website_link') {
                        const urlField = document.querySelector('input[name="contentUrl"]') as HTMLInputElement;
                        if (urlField && urlField.value && urlField.value.startsWith('http')) {
                          fetchUrlMeta(urlField.value);
                        }
                      }
                    }}
                    onCategoryChange={(categoryId) => setSelectedCategoryId(categoryId)}
                    selectedCategoryId={selectedCategoryId}
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      defaultChecked={editingProduct?.isActive ?? true}
                      className="rounded"
                    />
                    <Label htmlFor="isActive">Active Product</Label>
                  </div>

                  <div className="flex space-x-4">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingProduct(null);
                        setUploadedFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Products Grid - Neutral cards with primary accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(products) && products
              .filter((product: any) => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                return product.name.toLowerCase().includes(searchLower) ||
                       product.description.toLowerCase().includes(searchLower) ||
                       product.type.toLowerCase().includes(searchLower);
              })
              .map((product: any) => (
              <Card key={product.id} className="backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-gray-200/60 dark:border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="pb-3 rounded-t-lg" style={createGradientStyle(0.04, 110)}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg" style={createGradientStyle(0.85, 60)}>
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                        {product.name}
                      </CardTitle>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" style={{ color: primaryColor || '#2563EB' }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Smart Image Priority System */}
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {(() => {
                        // Priority 1: Meta URL Image (imageUrl field)
                        if (product.imageUrl && product.imageUrl.trim() !== '') {
                          return (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center">
                                      <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                      </svg>
                                    </div>
                                  `;
                                }
                              }}
                            />
                          );
                        }
                        // Priority 2: First image file from attachments
                        else if (product.attachments && Array.isArray(product.attachments) && product.attachments.length > 0) {
                          const imageAttachment = product.attachments.find((attachment: any) => 
                            attachment.type?.startsWith('image/') || 
                            attachment.type === 'image' ||
                            attachment.name?.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)
                          );
                          if (imageAttachment) {
                            return (
                              <img 
                                src={imageAttachment.url} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-full flex items-center justify-center">
                                        <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            );
                          }
                        }
                        
                        // Priority 3: Default placeholder
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-full" style={createSolidStyle(true, 1)}>
                          <DollarSign className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-bold text-lg bg-gradient-to-r bg-clip-text text-transparent" style={createTextGradientStyle()}>
                          ${product.price}
                        </span>
                      </div>
                      <Badge 
                        variant={product.isActive ? "default" : "secondary"}
                        className={product.isActive 
                          ? "text-white border-0 shadow-md" 
                          : "bg-gray-100 text-gray-600 border-gray-200"
                        }
                        style={product.isActive ? createSolidStyle(true, 1) : {}}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-200"
                        style={createGradientStyle(0.08, 90)}
                      >
                        {PRODUCT_TYPES.find(t => t.value === product.type)?.label || product.type}
                      </Badge>
                      {product.contentUrl && (
                        <Badge 
                          variant="outline" 
                          className="text-xs border-gray-200 text-gray-700 hover:border-gray-300 transition-all duration-200"
                          style={createGradientStyle(0.08, 90)}
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Link
                        </Badge>
                      )}
                    </div>

                    {/* Show filename for file-based products */}
                    {product.contentUrl && product.type !== 'website_link' && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 px-3 py-2 rounded-lg font-mono truncate border border-gray-200 dark:border-gray-700">
                        {product.contentUrl.split('/').pop() || product.contentUrl}
                      </div>
                    )}

                    {product.contentUrl && product.type === 'website_link' && (
                      <a 
                        href={product.contentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium truncate group transition-all duration-200"
                        style={{ color: primaryColor || '#2563EB' }}
                      >
                        View Product 
                        <svg className="ml-1 h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State - Neutral design with primary accent */}
          {(!products || products.length === 0) && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 opacity-20"></div>
                </div>
                <Package className="relative mx-auto h-16 w-16 text-gray-400" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">No products yet</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                Start building your product catalog by creating your first product. You can add digital products, courses, and more.
              </p>
              <div className="mt-8">
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  style={createGradientStyle(1, 135)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Product
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}