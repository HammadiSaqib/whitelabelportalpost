import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Globe, 
  Check, 
  X, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Shield,
  Lock,
  Edit3,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';

interface WhiteLabelData {
  id: number;
  domainPath: string;
  businessName: string;
  userId: string;
}

interface EnhancedDomainManagerProps {
  selectedLandingPageId?: number;
  onDomainUpdated?: (newDomainPath: string) => void;
}

export default function EnhancedDomainManager({ selectedLandingPageId, onDomainUpdated }: EnhancedDomainManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newDomainPath, setNewDomainPath] = useState('');
  const [domainPathValidation, setDomainPathValidation] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get the base URL (dev or production)
  const getBaseUrl = () => {
    const currentUrl = window.location.origin;
    // Check if it's the development URL
    if (currentUrl.includes('replit.dev') || currentUrl.includes('localhost')) {
      return currentUrl;
    }
    // Production URL
    return 'http://whitelabelportal.com';
  };

  const baseUrl = getBaseUrl();

  // Fetch white-label data
  const { data: whiteLabelData, isLoading } = useQuery<WhiteLabelData>({
    queryKey: ['/api/white-labels/my'],
    enabled: !!user && user.role === 'white_label_client'
  });

  // Initialize domain path when data loads
  useEffect(() => {
    if (whiteLabelData && !isEditing) {
      setNewDomainPath(whiteLabelData.domainPath || '');
    }
  }, [whiteLabelData, isEditing]);

  // Domain path validation with debounce
  useEffect(() => {
    if (!newDomainPath || newDomainPath === whiteLabelData?.domainPath) {
      setDomainPathValidation(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      validateDomainPath(newDomainPath);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [newDomainPath, whiteLabelData?.domainPath]);

  // Domain path validation
  const validateDomainPath = async (path: string) => {
    if (!path) {
      setDomainPathValidation(null);
      return;
    }

    // Check if it's the same as the current domain path
    if (whiteLabelData?.domainPath === path) {
      setDomainPathValidation({
        available: true,
        message: "This is your current domain"
      });
      return;
    }

    setCheckingAvailability(true);
    try {
      const response = await apiRequest('/api/domain-paths/validate', 'POST', {
        domainPath: path
      });
      const result = await response.json();
      
      if (!result.available) {
        setDomainPathValidation({
          available: false,
          message: "Domain path already taken by other white-label client"
        });
      } else {
        setDomainPathValidation({
          available: true,
          message: "Domain path is available"
        });
      }
    } catch (error) {
      setDomainPathValidation({
        available: false,
        message: "Error checking availability"
      });
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Update domain path mutation
  const updateDomainPathMutation = useMutation({
    mutationFn: async (newPath: string) => {
      const response = await apiRequest('/api/white-labels/update-domain', 'PUT', {
        domainPath: newPath
      });
      return response.json();
    },
    onSuccess: (updatedData) => {
      toast({
        title: "Domain Updated Successfully",
        description: `Your domain has been updated to: ${baseUrl}/${updatedData.domainPath}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
      setIsEditing(false);
      onDomainUpdated?.(updatedData.domainPath);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Domain",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  const copyFullUrl = () => {
    const fullUrl = `${baseUrl}/${whiteLabelData?.domainPath || newDomainPath}`;
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "Copied!",
      description: "Domain URL copied to clipboard",
    });
  };

  const handleSave = () => {
    if (!newDomainPath || newDomainPath === whiteLabelData?.domainPath) {
      setIsEditing(false);
      return;
    }

    if (domainPathValidation?.available) {
      updateDomainPathMutation.mutate(newDomainPath);
    }
  };

  const handleCancel = () => {
    setNewDomainPath(whiteLabelData?.domainPath || '');
    setIsEditing(false);
    setDomainPathValidation(null);
  };

  const currentDomainPath = whiteLabelData?.domainPath || '';
  const fullCurrentUrl = `${baseUrl}/${currentDomainPath}`;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Management
          </CardTitle>
          <CardDescription>
            Configure your custom white-label domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Custom Domain Management
        </CardTitle>
        <CardDescription>
          Manage your white-label domain path. Changes will update across the entire system.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Domain Display */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Your Domain URL</Label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 font-mono">{baseUrl}/</span>
            <div className="flex-1 flex items-center gap-2">
              {!isEditing ? (
                <>
                  <span className="font-mono text-blue-600 font-medium">
                    {currentDomainPath || 'not-set'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="ml-auto"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={newDomainPath}
                    onChange={(e) => setNewDomainPath(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="your-domain-path"
                    className="font-mono text-blue-600"
                    disabled={updateDomainPathMutation.isPending}
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      disabled={!domainPathValidation?.available || updateDomainPathMutation.isPending}
                    >
                      {updateDomainPathMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={updateDomainPathMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyFullUrl}
              className="ml-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Validation Status */}
          {isEditing && newDomainPath && newDomainPath !== currentDomainPath && (
            <div className="space-y-2">
              {checkingAvailability ? (
                <Alert>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <AlertDescription>Checking availability...</AlertDescription>
                </Alert>
              ) : domainPathValidation && (
                <Alert className={domainPathValidation.available ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {domainPathValidation.available ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={domainPathValidation.available ? "text-green-800" : "text-red-800"}>
                    {domainPathValidation.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {/* Domain Information */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Business Name</Label>
              <div className="p-2 bg-gray-50 rounded border text-sm">
                {whiteLabelData?.businessName || 'Not Set'}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(fullCurrentUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Domain
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyFullUrl}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy URL
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Important:</strong> Changing your domain path will update all references across the system including landing pages, affiliate links, and user dashboards. The change takes effect immediately.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}