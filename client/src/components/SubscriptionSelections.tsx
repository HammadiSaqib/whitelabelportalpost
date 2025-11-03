import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Save, Package, Folder, ChevronDown, ChevronRight } from "lucide-react";

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
  categoryId: number;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  id: number;
  name: string;
  selectedCategories: number[];
  selectedProducts: number[];
}

interface Subscription {
  id: number;
  planId: number;
  planName: string;
  selectedCategories: number[];
  selectedProducts: number[];
  status: string;
  amount: number;
}

interface SubscriptionSelectionsProps {
  subscription: Subscription;
}

const SubscriptionSelections: React.FC<SubscriptionSelectionsProps> = ({ subscription }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(subscription.selectedCategories || [])
  );
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(subscription.selectedProducts || [])
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch plan details to get available categories and products
  const { data: planData } = useQuery({
    queryKey: ['plan', subscription.planId],
    queryFn: async () => {
      const response = await fetch(`/api/plans/${subscription.planId}`);
      if (!response.ok) throw new Error('Failed to fetch plan details');
      return response.json();
    }
  });

  // Fetch all categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Fetch all products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  // Update subscription selections mutation
  const updateSelectionsMutation = useMutation({
    mutationFn: async ({ selectedCategories, selectedProducts }: { 
      selectedCategories: number[], 
      selectedProducts: number[] 
    }) => {
      const response = await fetch(`/api/subscriptions/${subscription.id}/selections`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedCategories,
          selectedProducts,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update selections');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: "Success",
        description: "Subscription selections updated successfully",
      });
    },
    onError: (error: Error) => {
      console.error('Error updating selections:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription selections",
        variant: "destructive",
      });
    },
  });

  const handleSaveSelections = () => {
    updateSelectionsMutation.mutate({
      selectedCategories: Array.from(selectedCategories),
      selectedProducts: Array.from(selectedProducts),
    });
  };

  const toggleCategory = (categoryId: number) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const toggleProduct = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter available categories and products based on plan
  const availableCategories = categories.filter((cat: Category) => 
    planData?.selectedCategories?.includes(cat.id)
  );
  
  const availableProducts = products.filter((prod: Product) => 
    planData?.selectedProducts?.includes(prod.id)
  );

  // Group products by category
  const productsByCategory = availableProducts.reduce((acc: Record<number, Product[]>, product: Product) => {
    if (!acc[product.categoryId]) {
      acc[product.categoryId] = [];
    }
    acc[product.categoryId].push(product);
    return acc;
  }, {});

  if (!planData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Loading plan details...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Subscription Content Selection
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose which categories and products you want to access with your {subscription.planName} subscription.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories Section */}
        {availableCategories.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Categories
            </h3>
            <div className="space-y-2">
              {availableCategories.map((category: Category) => {
                const isExpanded = expandedCategories.has(category.id);
                const categoryProducts = productsByCategory[category.id] || [];
                
                return (
                  <div key={category.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.has(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {category.name}
                        </Label>
                        {category.description && (
                          <span className="text-sm text-gray-500">
                            - {category.description}
                          </span>
                        )}
                      </div>
                      {categoryProducts.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryExpansion(category.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {/* Products in this category */}
                    {isExpanded && categoryProducts.length > 0 && (
                      <div className="mt-3 ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
                        {categoryProducts.map((product: Product) => (
                          <div key={product.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.has(product.id)}
                              onCheckedChange={() => toggleProduct(product.id)}
                            />
                            <Label 
                              htmlFor={`product-${product.id}`}
                              className="cursor-pointer"
                            >
                              {product.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {product.type}
                            </Badge>
                            {product.description && (
                              <span className="text-sm text-gray-500">
                                - {product.description}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Standalone Products Section */}
        {availableProducts.filter((prod: Product) => !availableCategories.some((cat: Category) => cat.id === prod.categoryId)).length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Individual Products
            </h3>
            <div className="space-y-2">
              {availableProducts
                .filter((prod: Product) => !availableCategories.some((cat: Category) => cat.id === prod.categoryId))
                .map((product: Product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`standalone-product-${product.id}`}
                      checked={selectedProducts.has(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                    <Label 
                      htmlFor={`standalone-product-${product.id}`}
                      className="cursor-pointer font-medium"
                    >
                      {product.name}
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {product.type}
                    </Badge>
                    {product.description && (
                      <span className="text-sm text-gray-500">
                        - {product.description}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSaveSelections}
            disabled={updateSelectionsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {updateSelectionsMutation.isPending ? 'Saving...' : 'Save Selections'}
          </Button>
        </div>

        {/* Selection Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium mb-2">Current Selection Summary:</h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>Categories selected: {selectedCategories.size}</p>
            <p>Products selected: {selectedProducts.size}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSelections;