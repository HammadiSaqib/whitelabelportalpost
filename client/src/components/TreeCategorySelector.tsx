import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import type { Category } from "@shared/schema";

interface TreeCategorySelectorProps {
  categories: Category[];
  selectedId?: number;
  onSelect: (id: number | undefined) => void;
  excludeId?: number;
  placeholder?: string;
}

export default function TreeCategorySelector({ 
  categories, 
  selectedId, 
  onSelect, 
  excludeId,
  placeholder = "Select category"
}: TreeCategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const buildTree = (parentId: number | null = null): (Category & { children: any[]; depth: number })[] => {
    return categories
      .filter(cat => cat.parentCategoryId === parentId && cat.id !== excludeId)
      .map(category => ({
        ...category,
        children: buildTree(category.id),
        depth: parentId === null ? 0 : 1
      }));
  };

  const tree = buildTree();

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderTreeItem = (item: Category & { children: any[]; depth: number }, depth: number = 0) => {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandedIds.has(item.id);
    const indentLevel = depth * 16;

    return (
      <div key={item.id}>
        <div 
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${selectedId === item.id ? 'bg-blue-50 text-blue-700' : ''}`}
          style={{ paddingLeft: `${indentLevel + 8}px` }}
          onClick={() => {
            onSelect(item.id);
            setIsOpen(false);
          }}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 mr-1"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpanded(item.id);
            }}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            ) : (
              <div className="h-3 w-3" />
            )}
          </Button>
          <Folder className="h-3 w-3 mr-2 text-blue-600" />
          <span className="text-sm">{item.name}</span>
        </div>
        {isExpanded && hasChildren && item.children.map(child => renderTreeItem(child, depth + 1))}
      </div>
    );
  };

  const selectedCategory = categories.find(c => c.id === selectedId);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>{selectedCategory ? selectedCategory.name : placeholder}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-64 overflow-auto">
          <div 
            className="py-1 px-2 hover:bg-gray-100 cursor-pointer border-b"
            onClick={() => {
              onSelect(undefined);
              setIsOpen(false);
            }}
          >
            <span className="text-sm">No Category</span>
          </div>
          {tree.map(item => renderTreeItem(item))}
        </div>
      )}
    </div>
  );
}