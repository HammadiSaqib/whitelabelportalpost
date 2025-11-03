import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useRoute } from 'wouter';

interface Product {
  id: number;
  name: string;
  description: string;
  type: 'video' | 'image' | 'file' | 'website_link';
  imageUrl?: string;
  url?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  products: Product[];
  subcategories: Category[];
}

interface CollectionItemProps {
  category: Category;
  level: number;
  expandedCategories: Set<number>;
  onToggleCategory: (categoryId: number) => void;
}

const CollectionItem: React.FC<CollectionItemProps> = ({
  category,
  level,
  expandedCategories,
  onToggleCategory
}) => {
  const isExpanded = expandedCategories.has(category.id);
  const hasChildren = category.subcategories.length > 0 || category.products.length > 0;
  const paddingLeft = level * 20;

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'website_link':
        return (
          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div>
      {/* Category Header */}
      <div
        className="flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer group"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
        onClick={() => hasChildren && onToggleCategory(category.id)}
      >
        {hasChildren ? (
          <svg
            className={`w-4 h-4 text-gray-500 mr-2 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <div className="w-4 h-4 mr-2" />
        )}
        
        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        
        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
          {category.name}
        </span>
        
        <span className="ml-auto text-xs text-gray-500">
          {category.products.length + category.subcategories.reduce((acc, sub) => acc + sub.products.length, 0)} items
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div>
          {/* Subcategories */}
          {category.subcategories.map((subcategory) => (
            <CollectionItem
              key={subcategory.id}
              category={subcategory}
              level={level + 1}
              expandedCategories={expandedCategories}
              onToggleCategory={onToggleCategory}
            />
          ))}

          {/* Products */}
          {category.products.map((product) => (
            <div
              key={product.id}
              className="flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer group"
              style={{ paddingLeft: `${paddingLeft + 32}px` }}
            >
              <div className="w-4 h-4 mr-2" />
              {getProductIcon(product.type)}
              <span className="text-sm text-gray-700 ml-2 group-hover:text-blue-600">
                {product.name}
              </span>
              <span className="ml-auto text-xs text-gray-400 capitalize">
                {product.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Collections: React.FC = () => {
  const { user } = useAuth();
  const [, params] = useRoute('/:domain/user/collections');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['user-categories', user?.id, params?.domain],
    queryFn: async () => {
      const response = await fetch(`/api/user-categories?domain=${params?.domain}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    enabled: !!user?.id && !!params?.domain
  });

  const handleToggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleExpandAll = () => {
    const allCategoryIds = new Set<number>();
    const collectIds = (cats: Category[]) => {
      cats.forEach(cat => {
        allCategoryIds.add(cat.id);
        collectIds(cat.subcategories);
      });
    };
    collectIds(categories);
    setExpandedCategories(allCategoryIds);
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
  };

  const filteredCategories = categories.filter((category: Category) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    const categoryMatches = category.name.toLowerCase().includes(searchLower);
    const hasMatchingProducts = category.products.some(product => 
      product.name.toLowerCase().includes(searchLower)
    );
    const hasMatchingSubcategories = (cats: Category[]): boolean => {
      return cats.some(cat => 
        cat.name.toLowerCase().includes(searchLower) ||
        cat.products.some(product => product.name.toLowerCase().includes(searchLower)) ||
        hasMatchingSubcategories(cat.subcategories)
      );
    };
    
    return categoryMatches || hasMatchingProducts || hasMatchingSubcategories(category.subcategories);
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Collections</h1>
          <p className="text-gray-600">Browse your categories and products in an organized structure</p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories and products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExpandAll}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Collections Tree */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search criteria'
                  : 'You don\'t have access to any collections yet. Purchase a plan to get started!'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCategories.map((category: Category) => (
                <CollectionItem
                  key={category.id}
                  category={category}
                  level={0}
                  expandedCategories={expandedCategories}
                  onToggleCategory={handleToggleCategory}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {filteredCategories.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            Showing {filteredCategories.length} categories with{' '}
            {filteredCategories.reduce((acc, cat) => 
              acc + cat.products.length + cat.subcategories.reduce((subAcc, sub) => subAcc + sub.products.length, 0), 0
            )} total items
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;