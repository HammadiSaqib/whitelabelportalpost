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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, DollarSign, Users, Star, ChevronRight, ChevronDown, ChevronUp, Folder, FolderOpen, FileText, Menu, Eye, Save, CheckSquare, Square, Info, Package, Tag, Layers, Crown, Check, ArrowRight, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import AIDescriptionGenerator from "@/components/AIDescriptionGenerator";


export default function PlansPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previewPlan, setPreviewPlan] = useState<any>(null);
  const [groupedFeatures, setGroupedFeatures] = useState({
    basic: new Set<string>(),
    advanced: new Set<string>(),
    premium: new Set<string>()
  });
  const [submissionAction, setSubmissionAction] = useState<'create' | 'draft' | 'schedule'>('create');
  const [pendingAction, setPendingAction] = useState<'create' | 'draft' | 'schedule'>('create');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Helper functions for smart dropdown
  const handleDropdownSelect = (action: 'create' | 'draft' | 'schedule') => {
    setPendingAction(action);
    // Don't change submissionAction yet, only change button text for preview
  };

  const getAvailableOptions = () => {
    const allOptions = [
      { id: 'create', label: editingPlan ? "Update Plan" : "Add Plan" },
      { id: 'draft', label: "Save as Draft" },
      { id: 'schedule', label: "Schedule for Later" }
    ];
    
    // Show all options except the currently pending one (if different from submission action)
    // This ensures user sees all 3 options and can switch between them
    return allOptions.filter(option => option.id !== pendingAction);
  };

  const getPreviewButtonText = () => {
    const actionToShow = pendingAction !== submissionAction ? pendingAction : submissionAction;
    
    switch (actionToShow) {
      case 'draft':
        return "Draft";
      case 'schedule':
        return "Schedule";
      default:
        return editingPlan ? "Update Plan" : "Add Plan";
    }
  };

  const showDropdown = submissionAction === 'create' && !editingPlan;
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';

  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/plans'],
  });

  const { data: whiteLabel } = useQuery({
    queryKey: ['/api/white-labels/my'],
    enabled: !!user && user?.role === 'white_label_client',
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });





  // Helper functions for tree management
  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Helper function to get all child category IDs recursively
  const getAllChildCategoryIds = (parentId: number): number[] => {
    if (!Array.isArray(categories)) return [];
    
    const childIds: number[] = [];
    const children = categories.filter(cat => cat.parentCategoryId === parentId);
    
    children.forEach(child => {
      childIds.push(child.id);
      childIds.push(...getAllChildCategoryIds(child.id)); // Recursively get deeper children
    });
    
    return childIds;
  };

  // Helper function to get all products in a category and its children
  const getAllProductsInCategory = (categoryId: number): number[] => {
    if (!Array.isArray(products)) return [];
    
    const allCategoryIds = [categoryId, ...getAllChildCategoryIds(categoryId)];
    return products.filter(p => allCategoryIds.includes(p.categoryId)).map(p => p.id);
  };

  const toggleItemSelection = (type: 'category' | 'product', id: number, name: string) => {
    const value = `${type === 'category' ? 'cat' : 'prod'}-${id}`;
    
    if (type === 'category') {
      const newSelectedCategories = new Set(selectedCategories);
      const newSelectedProducts = new Set(selectedProducts);
      
      if (newSelectedCategories.has(value)) {
        // Removing category - remove it and all its children
        newSelectedCategories.delete(value);
        
        // Remove all child categories
        const childCategoryIds = getAllChildCategoryIds(id);
        childCategoryIds.forEach(childId => {
          newSelectedCategories.delete(`cat-${childId}`);
        });
        
        // Remove all products in this category and its children
        const allProductIds = getAllProductsInCategory(id);
        allProductIds.forEach(productId => {
          newSelectedProducts.delete(`prod-${productId}`);
        });
      } else {
        // Adding category - add it and all its children and products
        newSelectedCategories.add(value);
        
        // Add all child categories
        const childCategoryIds = getAllChildCategoryIds(id);
        childCategoryIds.forEach(childId => {
          newSelectedCategories.add(`cat-${childId}`);
        });
        
        // Add all products in this category and its children
        const allProductIds = getAllProductsInCategory(id);
        allProductIds.forEach(productId => {
          newSelectedProducts.add(`prod-${productId}`);
        });
      }
      
      setSelectedCategories(newSelectedCategories);
      setSelectedProducts(newSelectedProducts);
    } else {
      const newSelectedProducts = new Set(selectedProducts);
      if (newSelectedProducts.has(value)) {
        newSelectedProducts.delete(value);
      } else {
        newSelectedProducts.add(value);
        // Auto-populate form with the first selected product
        const product = Array.isArray(products) ? products.find(p => p.id === id) : null;
        if (product) {
          setTimeout(() => handleProductSelect(product), 100);
        }
      }
      setSelectedProducts(newSelectedProducts);
    }
  };

  // Build tree structure for dropdown
  const buildTreeStructure = (parentId: number | null = null): any[] => {
    if (!Array.isArray(categories)) return [];
    
    return categories
      .filter(cat => cat.parentCategoryId === parentId)
      .map(category => ({
        ...category,
        children: buildTreeStructure(category.id),
        products: Array.isArray(products) ? products.filter(p => p.categoryId === category.id) : []
      }));
  };

  // Render tree item recursively
  const renderTreeItem = (item: any, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const hasProducts = item.products && item.products.length > 0;
    const isExpanded = expandedCategories.has(item.id);
    const paddingLeft = level * 16;
    const categoryValue = `cat-${item.id}`;
    const isSelected = selectedCategories.has(categoryValue);

    return (
      <div key={item.id}>
        {/* Category Item */}
        <div 
          className={`flex items-center py-2 px-3 hover:bg-gray-100 ${
            isSelected ? 'bg-primary/10 text-primary' : ''
          }`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          {(hasChildren || hasProducts) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(item.id);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" style={{ color: secondaryColor }} /> : <ChevronRight className="h-3 w-3" style={{ color: secondaryColor }} />}
            </button>
          )}
          {!hasChildren && !hasProducts && <div className="w-4 mr-1" />}
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleItemSelection('category', item.id, item.name)}
            className="mr-2 h-5 w-5"
          />
          {isExpanded ? <FolderOpen className="h-4 w-4 mr-2" style={{ color: secondaryColor }} /> : <Folder className="h-4 w-4 mr-2" style={{ color: secondaryColor || '#6366f1' }} />}
          <span className="text-sm cursor-pointer" onClick={() => toggleItemSelection('category', item.id, item.name)}>{item.name}</span>
        </div>

        {/* Children and Products */}
        {isExpanded && (
          <div>
            {/* Render child categories */}
            {item.children?.map((child: any) => renderTreeItem(child, level + 1))}
            
            {/* Render products */}
            {item.products?.map((product: any) => {
              const productValue = `prod-${product.id}`;
              const isProductSelected = selectedProducts.has(productValue);
              
              return (
                <div
                  key={`prod-${product.id}`}
                  className={`flex items-center py-2 px-3 hover:bg-gray-100 ${
                    isProductSelected ? 'bg-primary/10 text-primary' : ''
                  }`}
                  style={{ paddingLeft: `${paddingLeft + 32}px` }}
                >
                  <Checkbox
                    checked={isProductSelected}
                    onCheckedChange={() => toggleItemSelection('product', product.id, product.name)}
                    className="mr-2 h-5 w-5"
                  />
                  <FileText className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                  <span className="text-sm cursor-pointer" onClick={() => toggleItemSelection('product', product.id, product.name)}>{product.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Helper function to get all category IDs in a hierarchy (including the root category)
  const getAllCategoryIds = (categoryId: number): number[] => {
    const result = [categoryId];
    
    const getChildIds = (parentId: number) => {
      const children = Array.isArray(categories) ? 
        categories.filter(cat => cat.parentCategoryId === parentId) : [];
      
      children.forEach(child => {
        result.push(child.id);
        getChildIds(child.id); // Recursively get deeper children
      });
    };
    
    getChildIds(categoryId);
    return result;
  };

  // Helper function to auto-populate form when product is selected
  const handleProductSelect = (product: any) => {
    // Auto-populate form fields
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement;
    
    if (nameInput) nameInput.value = product.name;
    if (priceInput) priceInput.value = product.price;
    if (descriptionInput) descriptionInput.value = product.description || '';
    
    // Trigger change events to update form state
    if (nameInput) nameInput.dispatchEvent(new Event('change', { bubbles: true }));
    if (priceInput) priceInput.dispatchEvent(new Event('change', { bubbles: true }));
    if (descriptionInput) descriptionInput.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Helper function to recursively render category tree with clickable products
  const renderCategoryWithProducts = (category: any, level: number = 0, allowedCategoryIds: number[] = []) => {
    // Find direct subcategories of this category
    const subcategories = Array.isArray(categories) ? 
      categories.filter(cat => cat.parentCategoryId === category.id) : [];
    
    // Find products directly in this category (only from allowed categories)
    const directProducts = Array.isArray(products) ? 
      products.filter(p => p.categoryId === category.id && allowedCategoryIds.includes(p.categoryId)) : [];

    return (
      <div key={category.id} className="space-y-3">
        {/* Render subcategories with their products */}
        {subcategories.map(subcat => {
          const subcatProducts = Array.isArray(products) ? 
            products.filter(p => p.categoryId === subcat.id && allowedCategoryIds.includes(p.categoryId)) : [];
          
          // Find deeper subcategories for this subcategory
          const deeperSubcats = Array.isArray(categories) ? 
            categories.filter(cat => cat.parentCategoryId === subcat.id) : [];

          return (
            <div key={subcat.id} className="space-y-2">
              <h4 className="font-medium text-gray-900 text-base">
                {subcat.name}
              </h4>
              
              {/* Products directly in this subcategory */}
              {subcatProducts.length > 0 && (
                <div className="pl-4">
                  <div className="text-primary text-lg mb-1">•</div>
                  <div className="space-y-1 pl-4">
                    {subcatProducts.map(product => (
                      <div 
                        key={product.id} 
                        className="text-gray-700 cursor-pointer hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors text-sm"
                        onClick={() => handleProductSelect(product)}
                        title="Click to auto-populate plan form"
                      >
                        {product.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render deeper subcategories recursively */}
              {deeperSubcats.length > 0 && (
                <div className="pl-4 space-y-2">
                  {deeperSubcats.map(deepSubcat => {
                    const deepProducts = Array.isArray(products) ? 
                      products.filter(p => p.categoryId === deepSubcat.id && allowedCategoryIds.includes(p.categoryId)) : [];
                    
                    return (
                      <div key={deepSubcat.id} className="space-y-1">
                        <strong className="text-gray-800 text-sm">{deepSubcat.name}</strong>
                        {deepProducts.length > 0 && (
                          <div className="pl-4">
                            <div className="text-primary text-lg mb-1">•</div>
                            <div className="space-y-1 pl-4">
                              {deepProducts.map(product => (
                                <div 
                                  key={product.id} 
                                  className="text-gray-700 cursor-pointer hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors text-sm"
                                  onClick={() => handleProductSelect(product)}
                                  title="Click to auto-populate plan form"
                                >
                                  {product.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Products directly in the main selected category (without subcategory) */}
        {directProducts.length > 0 && (
          <div>
            <div className="text-primary text-lg mb-1">•</div>
            <div className="space-y-1 pl-4">
              {directProducts.map(product => (
                <div 
                  key={product.id} 
                  className="text-gray-700 cursor-pointer hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors text-sm"
                  onClick={() => handleProductSelect(product)}
                  title="Click to auto-populate plan form"
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSelectedCategoryFeatures = () => {
    if (selectedCategories.size === 0 && selectedProducts.size === 0) {
      return (
        <div className="text-gray-500 text-sm p-4 text-center">
          Select categories or products to view features
        </div>
      );
    }

    const selectedProductsList = Array.from(selectedProducts).map(prodValue => {
      const productId = parseInt(prodValue.replace('prod-', ''));
      return Array.isArray(products) ? products.find(p => p.id === productId) : null;
    }).filter(Boolean);

    const selectedCategoriesList = Array.from(selectedCategories).map(catValue => {
      const categoryId = parseInt(catValue.replace('cat-', ''));
      return Array.isArray(categories) ? categories.find(cat => cat.id === categoryId) : null;
    }).filter(Boolean);

    // Build hierarchical tree structure for selected items
    const buildSelectedTree = () => {
      // Get categories that should be shown at root level (either actual root categories or orphaned child categories)
      const displayedCategoryIds = new Set();
      const rootCategories = selectedCategoriesList.filter(cat => {
        // Show as root if it's actually a root category OR if its parent is not selected
        const isActualRoot = cat.parentCategoryId === null;
        const parentSelected = cat.parentCategoryId ? selectedCategoriesList.some(c => c.id === cat.parentCategoryId) : false;
        return isActualRoot || !parentSelected;
      });
      
      const renderCategoryTree = (category: any, level: number = 0) => {
        displayedCategoryIds.add(category.id);
        const indent = level * 20;
        const categoryProducts = selectedProductsList.filter(product => product.categoryId === category.id);
        const childCategories = selectedCategoriesList.filter(cat => cat.parentCategoryId === category.id);
        
        return (
          <div key={category.id} style={{ marginLeft: `${indent}px` }}>
            {/* Category header */}
            <div className="flex items-center text-sm font-medium text-primary mb-1">
              <Folder className="h-4 w-4 mr-2" />
              ✅ {category.name}
            </div>
            
            {/* Products in this category */}
            {categoryProducts.map(product => (
              <div key={product.id} style={{ marginLeft: `${indent + 20}px` }} className="flex items-center text-sm text-gray-700 mb-1">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                • {product.name}
              </div>
            ))}
            
            {/* Child categories */}
            {childCategories.map(childCat => renderCategoryTree(childCat, level + 1))}
          </div>
        );
      };
      
      return (
        <div className="space-y-2">
          {/* Standalone products (no category) */}
          {selectedProductsList.filter(product => product.categoryId === null).map(product => (
            <div key={product.id} className="flex items-center text-sm text-blue-700 mb-1">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              ✅ {product.name}
            </div>
          ))}
          
          {/* Root categories and their trees (including orphaned child categories) */}
          {rootCategories.map(category => renderCategoryTree(category, 0))}
          
          {/* Individual products from non-selected categories */}
          {selectedProductsList.filter(product => 
            product.categoryId !== null && !selectedCategoriesList.some(cat => cat.id === product.categoryId)
          ).map(product => {
            const productCategory = Array.isArray(categories) ? categories.find(cat => cat.id === product.categoryId) : null;
            return (
              <div key={product.id} className="flex items-center text-sm text-primary mb-1">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                ✅ {product.name} <span className="text-gray-500 text-xs ml-1">(from {productCategory?.name})</span>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📋 Selected Plan Features Tree:
          </h3>
          {buildSelectedTree()}
        </div>
      </div>
    );
  };



  const createMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await apiRequest('/api/plans', 'POST', planData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans/public'] });
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Plan created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...planData }: any) => {
      const response = await apiRequest(`/api/plans/${id}`, 'PUT', planData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans/public'] });
      setEditingPlan(null);
      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/plans/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, actionToUse?: 'create' | 'draft' | 'schedule') => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Use the provided action or fall back to current submissionAction
    const currentAction = actionToUse || submissionAction;
    
    // Validate required fields
    const planName = formData.get('name') as string;
    const priceValue = formData.get('price') as string;
    const featuresValue = formData.get('features') as string;
    
    const validationErrors: string[] = [];
    
    if (!planName?.trim()) {
      validationErrors.push('Plan Name is required');
    }
    
    if (!priceValue?.trim()) {
      validationErrors.push('Price ($) is required');
    }
    
    if (!featuresValue?.trim()) {
      validationErrors.push('Features are required');
    }
    
    // Show validation errors if any
    if (validationErrors.length > 0) {
      // Set validation errors for form display
      const errors: {[key: string]: string} = {};
      if (!planName?.trim()) errors.name = 'Plan Name is required';
      if (!priceValue?.trim()) errors.price = 'Price ($) is required';
      if (!featuresValue?.trim()) errors.features = 'Features are required';
      
      setValidationErrors(errors);
      return;
    }
    
    // Clear validation errors if all fields are valid
    setValidationErrors({});
    
    const commissionValue = formData.get('commissionRate') as string;
    
    // Get selected accesses for Super Admin
    const accessesArray = formData.getAll('accesses') as string[];
    
    // Get schedule date if provided
    const scheduleDateValue = formData.get('scheduledAt') as string;
    
    const planData = {
      name: formData.get('name'),
      description: formData.get('description'),
      monthlyPrice: priceValue ? parseFloat(priceValue).toString() : null,
      features: (formData.get('features') as string)?.split('\n').filter(f => f.trim()),
      allowAffiliatePromotion: formData.get('allowAffiliatePromotion') === 'on',
      affiliateCommissionPercentage: commissionValue ? parseFloat(commissionValue).toString() : null,
      selectedCategories: Array.from(selectedCategories).map(id => {
        const cleanId = id.replace('cat-', '');
        return parseInt(cleanId);
      }).filter(id => !isNaN(id)),
      selectedProducts: Array.from(selectedProducts).map(id => {
        const cleanId = id.replace('prod-', '');
        return parseInt(cleanId);
      }).filter(id => !isNaN(id)),
      accesses: user?.role === 'super_admin' ? accessesArray : undefined,
      isActive: currentAction === 'create', // Only true for immediate publish, false for draft/schedule
      isMainSitePlan: currentAction === 'create', // Only true for immediate publish, false for draft/schedule
      status: currentAction === 'create' ? 'published' : (currentAction === 'schedule' ? 'scheduled' : currentAction),
      scheduledAt: currentAction === 'schedule' && scheduleDateValue ? new Date(scheduleDateValue).toISOString() : null,
      publishedAt: currentAction === 'create' ? new Date().toISOString() : null,
    };

    console.log('Submitting plan data:', {
      action: currentAction,
      status: planData.status,
      isMainSitePlan: planData.isMainSitePlan,
      scheduledAt: planData.scheduledAt,
      scheduleDateValue: scheduleDateValue
    });

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, ...planData });
    } else {
      createMutation.mutate(planData);
    }
  };

  const handleConfirmAction = () => {
    // This will be used when the button is actually clicked
    const actionToUse = pendingAction !== submissionAction ? pendingAction : submissionAction;
    console.log('handleConfirmAction:', {
      pendingAction,
      submissionAction,
      actionToUse
    });
    setSubmissionAction(actionToUse);
    
    // Find the form and submit with the exact action
    const forms = document.querySelectorAll('form');
    const form = forms[forms.length - 1] as HTMLFormElement;
    if (form) {
      // Create a synthetic event and call handleSubmit directly with the action
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: form
      } as React.FormEvent<HTMLFormElement>;
      
      handleSubmit(syntheticEvent, actionToUse);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Header with Hamburger Menu */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Subscription Plans</h1>
            <div className="w-10"></div>
          </div>

          <Header title="Subscription Plans" subtitle="Manage subscription plans and pricing" />
          <div className="p-6">
            <div className="text-center py-12">Loading plans...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Subscription Plans</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="Subscription Plans"
          subtitle="Manage subscription plans and pricing"
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Plan Management */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-500">
                Current Role: {selectedRole}
              </div>
              <Button onClick={() => {
                setEditingPlan(null);
                setShowCreateForm(true);
                setSelectedCategories(new Set());
                setSelectedProducts(new Set());
                setPreviewPlan(null);
                setSubmissionAction('create');
                setPendingAction('create');
                setValidationErrors({}); // Clear validation errors
              }} className="text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Plan
              </Button>
            </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingPlan) && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Plan Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        key={editingPlan ? `name-${editingPlan.id}` : 'name-new'}
                        defaultValue={editingPlan?.name || ''}
                        required
                        className={validationErrors.name ? 'border-destructive' : ''}
                      />
                      {validationErrors.name && (
                        <p className="text-destructive text-sm mt-1">{validationErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        key={editingPlan ? `price-${editingPlan.id}` : 'price-new'}
                        defaultValue={editingPlan?.monthlyPrice || ''}
                        required
                        className={validationErrors.price ? 'border-destructive' : ''}
                      />
                      {validationErrors.price && (
                        <p className="text-destructive text-sm mt-1">{validationErrors.price}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description">Description</Label>
                      <AIDescriptionGenerator
                        titleFieldId="name"
                        descriptionFieldId="description"
                        contentType="plan"
                        onContentGenerated={(content) => {
                          const descriptionField = document.getElementById('description') as HTMLTextAreaElement;
                          if (descriptionField) {
                            descriptionField.value = content;
                          }
                        }}
                      />
                    </div>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingPlan?.description || ''}
                      required
                    />
                  </div>

                  {/* VS Code Style Tree Selector */}
                  <div>
                    <Label htmlFor="category">Select Category Or Product</Label>
                    <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isDropdownOpen}
                          className="w-full justify-between"
                        >
                          {selectedCategories.size + selectedProducts.size > 0 
                            ? `Selected: ${selectedCategories.size} categories, ${selectedProducts.size} products`
                            : "Choose categories or products..."}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0" style={{ color: secondaryColor || '#6366f1' }} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 max-h-80 overflow-y-auto">
                        <div className="py-1">
                          {/* Clear All Selections Option */}
                          <div
                            className="flex items-center py-2 px-3 hover:bg-gray-100 cursor-pointer border-b mb-2"
                            onClick={() => {
                              setSelectedCategories(new Set());
                              setSelectedProducts(new Set());
                              setIsDropdownOpen(false);
                            }}
                          >
                            <Folder className="h-4 w-4 mr-2" style={{ color: secondaryColor || '#6366f1' }} />
                            <span className="text-sm">Clear All Selections</span>
                          </div>
                          
                          {/* Tree Structure */}
                          {buildTreeStructure().map((item: any) => renderTreeItem(item, 0))}
                          
                          {/* Unassigned Products */}
                          {Array.isArray(products) && products.filter(p => p.categoryId === null).length > 0 && (
                            <div>
                              <div className="flex items-center py-2 px-3 text-gray-500 text-sm font-medium border-t mt-2 pt-2">
                                <FileText className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                                Unassigned Products
                              </div>
                              {products.filter(p => p.categoryId === null).map((product: any) => {
                                const productValue = `prod-${product.id}`;
                                const isProductSelected = selectedProducts.has(productValue);
                                
                                return (
                                  <div
                                    key={`unassigned-${product.id}`}
                                    className={`flex items-center py-2 px-3 hover:bg-gray-100 ml-4 ${
                                      isProductSelected ? 'bg-primary/10 text-primary' : ''
                                    }`}
                                  >
                                    <Checkbox
                                      checked={isProductSelected}
                                      onCheckedChange={() => toggleItemSelection('product', product.id, product.name)}
                                      className="mr-2 h-5 w-5"
                                    />
                                    <FileText className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                                    <span className="text-sm cursor-pointer" onClick={() => toggleItemSelection('product', product.id, product.name)}>{product.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Professional Features Display */}
                  <div className="space-y-4">
                    <div className="border rounded-lg p-6 max-h-80 overflow-y-auto bg-white shadow-sm">
                      {renderSelectedCategoryFeatures()}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="features">Plan Features *</Label>
                    <Textarea
                      id="features"
                      name="features"
                      defaultValue={Array.isArray(editingPlan?.features) ? editingPlan.features.join('\n') : (editingPlan?.features || '')}
                      placeholder="Premium Support&#10;Advanced Analytics&#10;Custom Branding&#10;Priority Processing&#10;Dedicated Account Manager"
                      required
                      className={validationErrors.features ? 'border-destructive' : ''}
                      rows={5}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter each feature on a new line</p>
                    {validationErrors.features && (
                      <p className="text-destructive text-sm mt-1">{validationErrors.features}</p>
                    )}
                  </div>

                  {/* Affiliate Promotion Checkbox */}
                  <div className="flex items-start space-x-3 rounded-md border p-4">
                    <input
                      type="checkbox"
                      id="allowAffiliatePromotion"
                      name="allowAffiliatePromotion"
                      defaultChecked={editingPlan?.allowAffiliatePromotion || false}
                      className="mt-1"
                      onChange={(e) => {
                        const container = document.getElementById('commissionRateContainer') as HTMLElement;
                        if (container) {
                          container.style.display = e.target.checked ? 'block' : 'none';
                        }
                      }}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="allowAffiliatePromotion" className="text-sm font-medium leading-none">
                        Allow Affiliates To Promote Plan
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, affiliates can promote this plan and earn commissions.
                      </p>
                    </div>
                  </div>

                  {/* Commission Rate - Shows/Hides based on checkbox */}
                  <div id="commissionRateContainer" style={{ display: editingPlan?.allowAffiliatePromotion ? 'block' : 'none' }}>
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <Input
                      id="commissionRate"
                      name="commissionRate"
                      type="number"
                      step="0.1"
                      max="100"
                      key={editingPlan ? `commissionRate-${editingPlan.id}` : 'commissionRate-new'}
                      defaultValue={editingPlan?.affiliateCommissionPercentage ? parseFloat(editingPlan.affiliateCommissionPercentage).toString() : ''}
                      placeholder="Enter commission rate (0-100)"
                    />
                  </div>

                  {/* Access Selection - Only for Super Admin */}
                  {user?.role === 'super_admin' && (
                    <div>
                      <Label>Plan Access Features</Label>
                      <div className="mt-2 space-y-2 border rounded-lg p-4 bg-gray-50">
                        <p className="text-sm text-gray-600 mb-3">Select which features this plan will unlock for customers:</p>
                        {[
                          { id: 'categories', label: 'Categories Management', description: 'Create and organize product categories' },
                          { id: 'affiliates', label: 'Affiliates Management', description: 'Manage affiliate partners and commissions' },
                          { id: 'landing_page_builder', label: 'Landing Page Builder', description: 'Advanced drag-and-drop page builder' }
                        ].map((access) => (
                          <div key={access.id} className="flex items-start space-x-3 p-3 bg-white rounded border hover:bg-gray-50">
                            <input
                              type="checkbox"
                              id={`access-${access.id}`}
                              name="accesses"
                              value={access.id}
                              defaultChecked={editingPlan?.accesses?.includes(access.id) || false}
                              className="mt-1"
                            />
                            <div>
                              <Label htmlFor={`access-${access.id}`} className="font-medium">{access.label}</Label>
                              <p className="text-sm text-gray-500">{access.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedule Date/Time Picker - Only show when schedule is selected */}
                  {pendingAction === 'schedule' && (
                    <div>
                      <Label htmlFor="scheduledAt">Schedule Date & Time *</Label>
                      <Input
                        id="scheduledAt"
                        name="scheduledAt"
                        type="datetime-local"
                        key={editingPlan ? `scheduledAt-${editingPlan.id}` : 'scheduledAt-new'}
                        defaultValue={
                          editingPlan?.scheduledAt 
                            ? new Date(editingPlan.scheduledAt).toISOString().slice(0, 16)
                            : ''
                        }
                        required={pendingAction === 'schedule'}
                        min={new Date().toISOString().slice(0, 16)}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingPlan(null);
                        setSelectedCategories(new Set());
                        setSelectedProducts(new Set());
                        setSubmissionAction('create'); // Reset to default action
                        setPendingAction('create'); // Reset pending action
                        setValidationErrors({}); // Clear validation errors
                      }}
                    >
                      Cancel
                    </Button>
                    {/* Professional Single Button with Upward Arrow Dropdown */}
                    <div className="flex">
                      <Button 
                        type="button"
                        onClick={() => handleConfirmAction()}
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="text-white font-semibold rounded-r-none border-r-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || '#6366f1'})` }}
                      >
                        {getPreviewButtonText()}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            type="button"
                            onClick={() => handleConfirmAction()}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="text-white font-semibold px-2 rounded-l-none border-l border-l-gray-300 dark:border-l-gray-600 shadow-lg hover:shadow-xl transition-all duration-300"
                            variant="default"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor || '#6366f1'})` }}
                          >
                            <ChevronUp className="h-4 w-4 text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {getAvailableOptions().map((option) => (
                            <DropdownMenuItem 
                              key={option.id}
                              onClick={() => handleDropdownSelect(option.id as 'create' | 'draft' | 'schedule')}
                              disabled={createMutation.isPending || updateMutation.isPending}
                            >
                              {option.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(plans) && plans.map((plan: any) => (
              <Card 
                key={plan.id} 
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  previewPlan?.id === plan.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => setPreviewPlan(plan)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="flex items-center space-x-2">
                          <span>{plan.name}</span>

                        </CardTitle>
                        
                        {/* Status Badge Based on Plan Status */}
                        <div className="flex space-x-2">
                          {plan.status === 'published' ? (
                            <Badge 
                              variant="success" 
                              className="border-0"
                              style={{
                                backgroundColor: primaryColor || '#3b82f6',
                                color: 'white',
                                borderColor: primaryColor || '#3b82f6'
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Public
                            </Badge>
                          ) : plan.status === 'scheduled' ? (
                            <Badge 
                              variant="warning" 
                              className="border-0"
                              style={{
                                backgroundColor: `${secondaryColor || '#64748b'}20`,
                                color: secondaryColor || '#64748b',
                                borderColor: `${secondaryColor || '#64748b'}40`
                              }}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Scheduled
                            </Badge>
                          ) : (
                            <Badge 
                              variant="info" 
                              className="border-0"
                              style={{
                                backgroundColor: secondaryColor || '#64748b',
                                color: 'white',
                                borderColor: secondaryColor || '#64748b'
                              }}
                            >
                              <Package className="h-3 w-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-2">
                        <DollarSign className="h-6 w-6 text-primary" />
                        <span className="text-3xl font-bold">
                          {plan.monthlyPrice ? `$${parseFloat(plan.monthlyPrice).toFixed(2)}` : 'Contact for Pricing'}
                        </span>
                        {plan.monthlyPrice && <span className="text-gray-500">/month</span>}
                      </div>
                    </div>
                    {(user?.role === 'super_admin' || user?.role === 'white_label_client') && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            // DEBUG: Log the plan data being received
                            console.log('🔍 EDIT PLAN DEBUG - Full plan object:', plan);
                            console.log('🔍 EDIT PLAN DEBUG - selectedCategories:', plan.selectedCategories);
                            console.log('🔍 EDIT PLAN DEBUG - selectedCategories type:', typeof plan.selectedCategories);
                            console.log('🔍 EDIT PLAN DEBUG - selectedCategories isArray:', Array.isArray(plan.selectedCategories));
                            console.log('🔍 EDIT PLAN DEBUG - selectedProducts:', plan.selectedProducts);
                            console.log('🔍 EDIT PLAN DEBUG - selectedProducts type:', typeof plan.selectedProducts);
                            console.log('🔍 EDIT PLAN DEBUG - selectedProducts isArray:', Array.isArray(plan.selectedProducts));
                            
                            setEditingPlan(plan);
                            setShowCreateForm(true);
                            setPreviewPlan(plan);
                            // Initialize form action based on plan status - Smart Status Preservation
                            if (plan.status === 'draft') {
                              setSubmissionAction('draft');
                              setPendingAction('draft');
                            } else if (plan.status === 'scheduled') {
                              setSubmissionAction('schedule');
                              setPendingAction('schedule');
                            } else if (plan.status === 'published') {
                              setSubmissionAction('create');
                              setPendingAction('create');
                            } else {
                              // Fallback for published plans or unknown status
                              setSubmissionAction('create');
                              setPendingAction('create');
                            }
                            // Populate selected categories and products when editing
                            if (plan.selectedCategories && Array.isArray(plan.selectedCategories)) {
                              const categorySet = new Set(plan.selectedCategories.map((id: any) => `cat-${id}`));
                              console.log('🔍 EDIT PLAN DEBUG - Setting selectedCategories to:', categorySet);
                              setSelectedCategories(categorySet);
                            } else {
                              console.log('🔍 EDIT PLAN DEBUG - selectedCategories is not valid array, setting empty set');
                              setSelectedCategories(new Set());
                            }
                            if (plan.selectedProducts && Array.isArray(plan.selectedProducts)) {
                              const productSet = new Set(plan.selectedProducts.map((id: any) => `prod-${id}`));
                              console.log('🔍 EDIT PLAN DEBUG - Setting selectedProducts to:', productSet);
                              setSelectedProducts(productSet);
                            } else {
                              console.log('🔍 EDIT PLAN DEBUG - selectedProducts is not valid array, setting empty set');
                              setSelectedProducts(new Set());
                            }
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={deleteMutation.isPending}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the plan "{plan.name}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(plan.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Plan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {(() => {
                      if (!plan.features) return [];
                      if (Array.isArray(plan.features)) return plan.features;
                      if (typeof plan.features === 'string') {
                        return plan.features.split(',').map((f: string) => f.trim());
                      }
                      return [];
                    })().map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" style={{ color: secondaryColor }} />
                      <span>{plan.allowAffiliatePromotion ? 'Affiliate Promotion Enabled' : 'Affiliate Promotion Disabled'}</span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <DollarSign className="h-4 w-4" style={{ color: secondaryColor }} />
                      <span>
                        {plan.affiliateCommissionPercentage 
                          ? `${parseFloat(plan.affiliateCommissionPercentage).toFixed(1)}% Commission`
                          : 'Commission Not Set'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || []}
          </div>

          {(!Array.isArray(plans) || plans.length === 0) && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No plans created yet</div>
              {selectedRole === 'Super Admin' && (
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Plan
                </Button>
              )}
            </div>
          )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Eye className="mr-2 h-5 w-5" style={{ color: secondaryColor || '#6366f1' }} />
                Live Preview
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {previewPlan ? `Previewing: ${previewPlan.name}` : "Select a plan to preview"}
              </p>
            </div>
            
            {previewPlan ? (
              <div className="space-y-6">
                {/* Plan Card Preview - EXACT /pricing page style */}
                <Card className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{previewPlan.name}</h3>
                    <p className="text-gray-600 mb-6">{previewPlan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        {previewPlan.monthlyPrice && parseFloat(previewPlan.monthlyPrice) > 0 ? (
                          <>
                            <span className="text-4xl font-bold text-gray-900">${parseFloat(previewPlan.monthlyPrice).toFixed(0)}</span>
                            <span className="text-gray-500 ml-1">/month</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-primary">Contact for Pricing</span>
                        )}
                      </div>
                    </div>

                    <Button 
                      className="w-full mb-6 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      {previewPlan.monthlyPrice && parseFloat(previewPlan.monthlyPrice) > 0 
                        ? `Purchase Now - ${parseFloat(previewPlan.monthlyPrice).toFixed(0)}`
                        : 'Purchase Now'
                      }
                      <ArrowRight className="ml-2 h-4 w-4" style={{ color: 'white' }} />
                    </Button>

                    <div className="space-y-3 text-left">
                      {(() => {
                        // Parse features if it's a string, otherwise use as array
                        let features = previewPlan.features;
                        if (typeof features === 'string') {
                          try {
                            features = JSON.parse(features);
                          } catch (e) {
                            features = [];
                          }
                        }
                        
                        // Ensure features is an array
                        if (!Array.isArray(features)) {
                          features = [];
                        }
                        
                        return features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <Check className="h-5 w-5 mr-3" style={{ color: secondaryColor }} />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Visibility Status Badge */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Visibility Status:</span>
                        <div className="flex space-x-2">
                          {previewPlan.isMainSitePlan ? (
                            <Badge 
                              variant="success" 
                              className="text-white border-0"
                              style={{ 
                                backgroundColor: primaryColor || '#3b82f6',
                                color: 'white'
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              {selectedRole === 'Super Admin' ? 'Public on /pricing' : `Public on /${whiteLabel?.domainPath || user?.username || 'domain'}`}
                            </Badge>
                          ) : (
                            <Badge variant="purple" className="bg-gray-100 text-gray-800">
                              {selectedRole === 'Super Admin' ? 'Hidden from /pricing' : `Hidden from /${whiteLabel?.domainPath || user?.username || 'domain'}`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 mb-4" style={{ color: secondaryColor || '#6366f1' }} />
                <p className="text-gray-500 mb-4">No plan selected for preview</p>
                <p className="text-sm text-gray-400">
                  Click on any plan card to see a live preview here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>


    </div>
  );
}