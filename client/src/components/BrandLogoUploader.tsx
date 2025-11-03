import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Edit } from "lucide-react";

interface BrandLogoUploaderProps {
  maxFileSize?: number;
  accept?: string;
  onUploadComplete?: (file: File) => void;
  buttonClassName?: string;
  currentImageUrl?: string;
  uploading?: boolean;
}

export function BrandLogoUploader({
  maxFileSize = 10485760, // 10MB default
  accept = "image/*",
  onUploadComplete,
  buttonClassName,
  currentImageUrl,
  uploading = false,
}: BrandLogoUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showChangeInterface, setShowChangeInterface] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show current image if available and no preview is set
  const displayImage = preview || currentImageUrl;
  const hasCurrentImage = currentImageUrl && !preview;

  const handleFile = async (file: File) => {
    // Check file size
    if (file.size > maxFileSize) {
      alert(`File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call the upload handler with the file
    onUploadComplete?.(file);
    setShowChangeInterface(false);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleFile(files[0]);
    }
  }, []);

  const clearPreview = () => {
    setPreview(null);
    setShowChangeInterface(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleChangeImage = () => {
    setShowChangeInterface(true);
  };

  // If user has current image and not in change mode, show current image with change option
  if (hasCurrentImage && !showChangeInterface) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="relative inline-block">
            <img 
              src={currentImageUrl} 
              alt="Current Brand Logo" 
              className="w-32 h-32 object-cover rounded-lg border shadow-sm"
            />
            <button
              onClick={handleChangeImage}
              className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-sm"
              title="Change Brand Logo"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Current Brand Logo
          </p>
          <Button 
            onClick={handleChangeImage}
            variant="outline"
            className="mt-2"
          >
            <Edit className="w-4 h-4 mr-2" />
            Change Logo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Drag and Drop Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Image className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">Uploading brand logo...</div>
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Drop logo here or <span className="text-blue-600 dark:text-blue-400">browse files</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Upload your logo to appear in the top-left corner of your dashboard and landing pages. Recommended size: 200x60px (PNG, JPG, or SVG)
              </div>
              {hasCurrentImage && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  This will replace your current brand logo
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative inline-block">
          <img 
            src={preview} 
            alt="Brand Logo Preview" 
            className="w-32 h-32 object-cover rounded-lg border shadow-sm"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearPreview();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cancel change option */}
      {showChangeInterface && hasCurrentImage && (
        <Button 
          onClick={() => setShowChangeInterface(false)}
          variant="outline"
          className="w-full"
        >
          Cancel
        </Button>
      )}
    </div>
  );
}