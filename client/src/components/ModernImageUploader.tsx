import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernImageUploaderProps {
  currentImageUrl?: string;
  onUpload: (file: File) => void;
  isUploading?: boolean;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  title: string;
  description: string;
  className?: string;
}

export function ModernImageUploader({
  currentImageUrl,
  onUpload,
  isUploading = false,
  maxSizeInMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  title,
  description,
  className
}: ModernImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [showChangeInterface, setShowChangeInterface] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show current image if available and no preview is set
  const displayImage = preview || currentImageUrl;
  const hasCurrentImage = currentImageUrl && !preview;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeInMB}MB`);
      return false;
    }

    // Check file type
    if (!acceptedTypes.some(type => file.type === type)) {
      alert(`Please select a valid image file (${acceptedTypes.join(', ')})`);
      return false;
    }

    return true;
  };

  const handleFileSelection = async (file: File) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call the upload handler with the file
    onUpload(file);
    setShowChangeInterface(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview("");
    setShowChangeInterface(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show current image with edit option
  if (displayImage && !showChangeInterface) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <div className="p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
          
          <div className="relative group">
            <img
              src={displayImage}
              alt={title}
              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                onClick={() => setShowChangeInterface(true)}
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Show upload interface
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-6">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
        
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer min-h-[200px]",
            "hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
            isDragOver 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
              : "border-gray-300 dark:border-gray-600"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Drop your image here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Max size: {maxSizeInMB}MB • {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                </p>
              </>
            )}
          </div>
        </div>

        {showChangeInterface && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearPreview}
              className="text-gray-600 dark:text-gray-400"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}