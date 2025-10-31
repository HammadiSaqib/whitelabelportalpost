import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileImage, FileVideo, FileAudio, FileText, BookOpen, ShoppingCart, Download, Globe, Wand2 } from "lucide-react";
import TreeCategorySelector from "@/components/TreeCategorySelector";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DynamicProductFormProps {
  selectedProductType: string;
  setSelectedProductType: (type: string) => void;
  editingProduct?: any;
  categories?: any[];
  dragActive: boolean;
  uploadedFile: File | null;
  fetchingMeta: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getAcceptedFileTypes: (type: string) => string;
  getProductTypeIcon: (type: string) => JSX.Element;
  PRODUCT_TYPES: { value: string; label: string }[];
  onProductTypeChange?: (newType: string) => void;
  onCategoryChange?: (categoryId: number | undefined) => void;
  selectedCategoryId?: number;
}

export default function DynamicProductForm({
  selectedProductType,
  setSelectedProductType,
  editingProduct,
  categories,
  dragActive,
  uploadedFile,
  fetchingMeta,
  handleDrag,
  handleDrop,
  handleFileSelect,
  handleUrlChange,
  getAcceptedFileTypes,
  getProductTypeIcon,
  PRODUCT_TYPES,
  onProductTypeChange,
  onCategoryChange,
  selectedCategoryId
}: DynamicProductFormProps) {
  const { toast } = useToast();
  
  // Local state to manage URL field for controlled component
  const [urlValue, setUrlValue] = useState(editingProduct?.contentUrl || '');
  
  // Update hidden categoryId field when selection changes
  useEffect(() => {
    const categoryInput = document.querySelector('input[name="categoryId"]') as HTMLInputElement;
    if (categoryInput) {
      categoryInput.value = selectedCategoryId?.toString() || '';
    }
  }, [selectedCategoryId]);
  
  // Update URL value when editingProduct changes
  useEffect(() => {
    if (editingProduct?.contentUrl) {
      setUrlValue(editingProduct.contentUrl);
    } else {
      setUrlValue('');
    }
  }, [editingProduct]);
  
  // AI Description Generation
  const generateDescriptionMutation = useMutation({
    mutationFn: async (data: { title: string; existingDescription?: string; productType: string }) => {
      const response = await apiRequest('/api/ai/generate-content', 'POST', {
        type: 'product_description',
        prompt: data.existingDescription 
          ? `Enhance this ${data.productType} product description: "${data.existingDescription}" for product "${data.title}"`
          : `Create a compelling ${data.productType} product description for: "${data.title}"`,
        tone: 'professional',
        length: 'medium'
      });
      return await response.json();
    },
    onSuccess: (data, variables) => {
      const descriptionField = document.getElementById('description') as HTMLTextAreaElement;
      if (descriptionField) {
        descriptionField.value = data.content;
        descriptionField.focus();
      }
      toast({
        title: "Description Generated!",
        description: "AI has created an enhanced product description for you.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate description. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAIDescriptionGenerate = () => {
    const titleField = document.getElementById('name') as HTMLInputElement;
    const descriptionField = document.getElementById('description') as HTMLTextAreaElement;
    
    const title = titleField?.value?.trim();
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a product title first to generate a description.",
        variant: "destructive"
      });
      return;
    }

    const existingDescription = descriptionField?.value?.trim();
    generateDescriptionMutation.mutate({
      title,
      existingDescription,
      productType: selectedProductType
    });
  };

  const renderFileUpload = (label: string, required = false, accept?: string, multiple = false) => {
    // Check if we're editing and have existing content
    const hasExistingFile = editingProduct && editingProduct.contentUrl;
    const isEditing = !!editingProduct;
    
    return (
      <div>
        <Label>{label} {isEditing && hasExistingFile && "(Optional - leave empty to keep existing file)"}</Label>
        
        {/* Show existing file information when editing */}
        {hasExistingFile && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <FileText className="h-4 w-4" />
              <div>
                <p className="font-medium">✓ Current File Saved:</p>
                <p className="text-sm font-mono bg-green-100 px-2 py-1 rounded text-xs">
                  {editingProduct.contentUrl || editingProduct.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  File is preserved - upload a new one only if you want to replace it
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept || getAcceptedFileTypes(selectedProductType)}
            onChange={handleFileSelect}
            required={required && !hasExistingFile} // Not required if editing with existing file
            multiple={multiple}
          />
          
          <div className="space-y-2">
            {getProductTypeIcon(selectedProductType)}
            
            {uploadedFile ? (
              <div className="text-green-600">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm">New file uploaded - will replace existing</p>
              </div>
            ) : (
              <div className="text-gray-600">
                <p className="font-medium">
                  {hasExistingFile ? `Upload new ${label.toLowerCase()} (optional)` : `Drop ${label.toLowerCase()} here`}
                </p>
                <p className="text-sm">or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">
                  Accepts: {accept || getAcceptedFileTypes(selectedProductType)}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden input to preserve existing contentUrl when not uploading new file */}
        {hasExistingFile && !uploadedFile && (
          <input
            type="hidden"
            name="contentUrl"
            value={editingProduct.contentUrl}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Product Type Selection */}
      <div>
        <Label htmlFor="type">Product Type</Label>
        <Select 
          name="type" 
          defaultValue={editingProduct?.type || 'website_link'}
          onValueChange={(value) => {
            setSelectedProductType(value);
            onProductTypeChange?.(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_TYPES.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Website Link Fields */}
      {selectedProductType === 'website_link' && (
        <>
          <div>
            <Label htmlFor="contentUrl">Website URL (Auto-fill from URL)</Label>
            <div className="flex gap-2">
              <Input
                id="contentUrl"
                name="contentUrl"
                type="url"
                placeholder="https://example.com"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  handleUrlChange(e);
                }}
                required
              />
              <Button type="button" variant="outline" disabled={fetchingMeta}>
                {fetchingMeta ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Website Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Access Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Website Description</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              defaultValue={editingProduct?.description || ''}
              required
            />
          </div>
        </>
      )}

      {/* Video/Audio Fields */}
      {(selectedProductType === 'video' || selectedProductType === 'audio') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{selectedProductType === 'video' ? 'Video Title' : 'Audio Title'}</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder={`Describe your ${selectedProductType} content...`}
              defaultValue={editingProduct?.description || ''}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="e.g., 30"
              />
            </div>
            <div>
              <Label htmlFor="quality">{selectedProductType === 'video' ? 'Resolution' : 'Quality'}</Label>
              <Select name="quality">
                <SelectTrigger>
                  <SelectValue placeholder={selectedProductType === 'video' ? 'Select resolution' : 'Select quality'} />
                </SelectTrigger>
                <SelectContent>
                  {selectedProductType === 'video' ? (
                    <>
                      <SelectItem value="720p">720p HD</SelectItem>
                      <SelectItem value="1080p">1080p Full HD</SelectItem>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="128kbps">128 kbps</SelectItem>
                      <SelectItem value="256kbps">256 kbps</SelectItem>
                      <SelectItem value="320kbps">320 kbps</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderFileUpload(`${selectedProductType === 'video' ? 'Video' : 'Audio'} File`, true)}
        </>
      )}

      {/* Article Fields */}
      {selectedProductType === 'article' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Article Title</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Article Content</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Write your article content here..."
              defaultValue={editingProduct?.description || ''}
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="readingTime">Reading Time (minutes)</Label>
              <Input
                id="readingTime"
                name="readingTime"
                type="number"
                placeholder="e.g., 5"
              />
            </div>
            <div>
              <Label htmlFor="articleCategory">Article Category</Label>
              <Select name="articleCategory">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="opinion">Opinion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderFileUpload("Optional Image or Document", false, "image/*,.pdf,.doc,.docx")}
        </>
      )}

      {/* Document Fields */}
      {selectedProductType === 'document' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Document Title</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Document Description</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what this document contains..."
              defaultValue={editingProduct?.description || ''}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pages">Number of Pages</Label>
              <Input
                id="pages"
                name="pages"
                type="number"
                placeholder="e.g., 10"
              />
            </div>
            <div>
              <Label htmlFor="documentType">Document Type</Label>
              <Select name="documentType">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">E-book</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderFileUpload("Document File", true)}
        </>
      )}

      {/* E-commerce Product Fields */}
      {selectedProductType === 'ecommerce_product' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Product Description</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product features, benefits, and specifications..."
              defaultValue={editingProduct?.description || ''}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                placeholder="e.g., PROD-001"
              />
            </div>
            <div>
              <Label htmlFor="inventory">Inventory Count</Label>
              <Input
                id="inventory"
                name="inventory"
                type="number"
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>

          {renderFileUpload("Product Images", false, "image/*", true)}
        </>
      )}

      {/* Digital Product Fields */}
      {selectedProductType === 'digital_product' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Digital Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="description">Product Description</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAIDescriptionGenerate}
                disabled={generateDescriptionMutation.isPending}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your digital product, what it includes, and how customers will benefit..."
              defaultValue={editingProduct?.description || ''}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="downloadLimit">Download Limit</Label>
              <Input
                id="downloadLimit"
                name="downloadLimit"
                type="number"
                placeholder="e.g., 5 (0 for unlimited)"
              />
            </div>
            <div>
              <Label htmlFor="fileFormat">File Format</Label>
              <Select name="fileFormat">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="zip">ZIP Archive</SelectItem>
                  <SelectItem value="mp4">MP4 Video</SelectItem>
                  <SelectItem value="mp3">MP3 Audio</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderFileUpload("Digital Product Files", true)}
        </>
      )}

      {/* LMS Course Fields */}
      {selectedProductType === 'lms_course' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Course Title</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name || ''}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Course Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price || ''}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what students will learn, course objectives, and requirements..."
              defaultValue={editingProduct?.description || ''}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="e.g., 20"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select name="difficulty">
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="students">Max Students</Label>
              <Input
                id="students"
                name="students"
                type="number"
                placeholder="e.g., 100"
              />
            </div>
          </div>

          {renderFileUpload("Course Materials", false, undefined, true)}
        </>
      )}

      {/* Common Fields for All Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <TreeCategorySelector
            categories={categories || []}
            selectedId={selectedCategoryId || editingProduct?.categoryId}
            onSelect={(id) => onCategoryChange?.(id)}
            placeholder="Select category"
          />
        </div>
        <div>
          <Label htmlFor="accessDuration">Access Duration (days)</Label>
          <Input
            id="accessDuration"
            name="accessDuration"
            type="number"
            placeholder="0 for lifetime access"
            defaultValue={editingProduct?.accessDuration || ''}
          />
        </div>
      </div>

      {/* Hidden field for image URL */}
      <input
        type="hidden"
        name="imageUrl"
        defaultValue={editingProduct?.imageUrl || ''}
      />
      
      {/* Hidden field for category ID */}
      <input
        type="hidden"
        name="categoryId"
        defaultValue={selectedCategoryId || editingProduct?.categoryId || ''}
      />

      {/* Image Preview */}
      <img
        id="image-preview"
        className="mt-3 max-w-full h-32 object-cover rounded-lg hidden"
        alt="Preview"
      />
    </>
  );
}