import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Folder, FolderPlus, Edit, Trash2, Plus, ChevronDown, ChevronRight, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIDescriptionGenerator from "@/components/AIDescriptionGenerator";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import TreeCategorySelector from "@/components/TreeCategorySelector";
import type { Category, InsertCategory } from "@shared/schema";

interface CategoryFormData {
  name: string;
  description: string;
  parentCategoryId?: number;
}

// Recursive tree row component for VS Code-style nesting
interface CategoryTreeRowProps {
  category: Category & { children: any[]; depth: number };
  depth: number;
  expandedCategories: Set<number>;
  toggleCategory: (id: number) => void;
  handleEdit: (category: Category) => void;
  handleDelete: (id: number) => void;
  primaryColor?: string;
  secondaryColor?: string;
}

// Recursive tree row component for VS Code-style nesting
function CategoryTreeRow({ 
  category, 
  depth, 
  expandedCategories, 
  toggleCategory, 
  handleEdit, 
  handleDelete,
  allCategories,
  primaryColor,
  secondaryColor
}: CategoryTreeRowProps & { allCategories: Category[] }) {
  const isExpanded = expandedCategories.has(category.id);
  const hasChildren = category.children && category.children.length > 0;
  const indentLevel = depth * 20; // 20px per level like VS Code

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center space-x-2" style={{ marginLeft: `${indentLevel}px` }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => hasChildren && toggleCategory(category.id)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
              disabled={!hasChildren}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="h-4 w-4" />
              )}
            </Button>
            <Folder className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
            <span className="font-medium">{category.name}</span>
            {hasChildren && (
              <Badge variant="outline" className="ml-2 text-xs">
                {category.children.length}
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell>
          {category.parentCategoryId ? (
            <Badge variant="outline">
              {allCategories.find(c => c.id === category.parentCategoryId)?.name || "Unknown"}
            </Badge>
          ) : (
            <span className="text-gray-500">Root Category</span>
          )}
        </TableCell>
        <TableCell>
          <span className="text-sm text-gray-600">
            {category.description || "No description"}
          </span>
        </TableCell>
        <TableCell>
          <Badge 
            variant={category.isActive ? "default" : "secondary"}
            className={category.isActive ? "text-white" : "text-white"}
            style={{
              backgroundColor: category.isActive 
                ? (primaryColor || '#3b82f6')
                : (secondaryColor || '#64748b')
            }}
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
              className="h-8 w-8 p-0 hover:bg-opacity-20"
              style={{ 
                color: secondaryColor || '#64748b',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${secondaryColor || '#64748b'}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(category.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      {/* Recursively render children when expanded */}
      {isExpanded && hasChildren && category.children.map((child: any) => (
        <CategoryTreeRow
          key={child.id}
          category={child}
          depth={depth + 1}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          allCategories={allCategories}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </>
  );
}

function CategoryManager() {
  const { primaryColor, secondaryColor } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    parentCategoryId: undefined,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: InsertCategory) =>
      apiRequest("/api/categories", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertCategory> }) =>
      apiRequest(`/api/categories/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingCategory(null);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/categories/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      parentCategoryId: undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const categoryData: InsertCategory = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      parentCategoryId: formData.parentCategoryId || null,
      whiteLabelId: 2, // Default to current white label
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: categoryData });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentCategoryId: category.parentCategoryId || undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewCategory = () => {
    resetForm();
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  // Build unlimited depth hierarchical tree (VS Code style)
  const buildCategoryTree = (
    parentId: number | null = null,
    depth: number = 0,
    path: Set<number> = new Set()
  ): (Category & { children: any[]; depth: number })[] => {
    return categories
      .filter(cat => cat.parentCategoryId === parentId)
      .map(category => {
        // Guard against cycles: if we encounter a category already in the path, stop recursing
        if (path.has(category.id)) {
          return {
            ...category,
            children: [],
            depth
          };
        }
        const nextPath = new Set(path);
        nextPath.add(category.id);
        return {
          ...category,
          children: buildCategoryTree(category.id, depth + 1, nextPath),
          depth
        };
      });
  };

  const categoryTree = buildCategoryTree();

  // Get parent category options (exclude the current category being edited to prevent circular references)
  const getParentOptions = () => {
    return categories.filter(cat => !editingCategory || cat.id !== editingCategory.id);
  };

  const getParentCategoryName = (parentId: number | null) => {
    if (!parentId) return "";
    const parent = categories.find(cat => cat.id === parentId);
    return parent?.name || "";
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
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
          <h1 className="text-lg font-semibold text-gray-900">Category Management</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <Header title="Category Management" />
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-gray-600 mt-2">
            Organize your products with hierarchical categories
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={handleNewCategory} 
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: primaryColor || '#3b82f6' }}
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? "Update the category information below." 
                  : "Fill in the details to create a new category for organizing your products."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" style={{ color: secondaryColor || '#64748b' }}>Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description" style={{ color: secondaryColor || '#64748b' }}>Description</Label>
                  <AIDescriptionGenerator
                    titleFieldId="name"
                    descriptionFieldId="description"
                    contentType="category"
                    onContentGenerated={(content) => 
                      setFormData({ ...formData, description: content })
                    }
                  />
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description (optional)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="parentCategory" style={{ color: secondaryColor || '#64748b' }}>Parent Category (Optional)</Label>
                <TreeCategorySelector 
                  categories={categories}
                  selectedId={formData.parentCategoryId}
                  onSelect={(id) => setFormData({ ...formData, parentCategoryId: id })}
                  excludeId={editingCategory?.id}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-2 text-white"
                  style={{ 
                    borderColor: secondaryColor || '#64748b',
                    backgroundColor: secondaryColor || '#64748b'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="text-white"
                  style={{ backgroundColor: primaryColor || '#3b82f6' }}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingCategory
                    ? "Update"
                    : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parent Categories</CardTitle>
            <FolderPlus className="h-4 w-4" style={{ color: secondaryColor || '#64748b' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => !cat.parentCategoryId).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub Categories</CardTitle>
            <Folder className="h-4 w-4" style={{ color: secondaryColor || '#64748b' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.filter(cat => cat.parentCategoryId).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottomColor: secondaryColor || '#64748b' }}>
                <TableHead style={{ color: secondaryColor || '#64748b' }}>Category Name</TableHead>
                <TableHead style={{ color: secondaryColor || '#64748b' }}>Parent Category</TableHead>
                <TableHead style={{ color: secondaryColor || '#64748b' }}>Description</TableHead>
                <TableHead style={{ color: secondaryColor || '#64748b' }}>Status</TableHead>
                <TableHead style={{ color: secondaryColor || '#64748b' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryTree.map((category) => (
                <CategoryTreeRow 
                  key={category.id} 
                  category={category} 
                  depth={0}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  allCategories={categories}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              ))}
              
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Folder className="h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">No categories created yet</p>
                      <Button onClick={handleNewCategory} variant="outline">
                        Create Your First Category
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
            </div>
          </main>
        </div>
      </div>
    );
}

export default CategoryManager;