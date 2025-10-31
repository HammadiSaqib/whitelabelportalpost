import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import CustomDomainManager from '@/components/domain/CustomDomainManager';
import { 
  Settings, Globe, Zap, Eye, Trash2, Save, Palette
} from 'lucide-react';

interface ModernFigmaBuilderProps {
  initialLandingPageId?: number;
  onClose?: () => void;
  isAffiliate?: boolean;
  parentWhiteLabelDomain?: string;
}

export default function ModernFigmaBuilder({ 
  initialLandingPageId, 
  onClose, 
  isAffiliate = false, 
  parentWhiteLabelDomain 
}: ModernFigmaBuilderProps) {
  const { user } = useAuth();
  // State for interactive editing
  const [editMode, setEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<{
    type: 'text' | 'color' | 'background';
    field: string;
    value: string;
    position: { x: number; y: number };
  } | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Handle iframe messages for interactive editing
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('Message received from iframe:', event.data);
      
      if (event.origin !== window.location.origin) {
        console.log('Message from different origin, ignoring');
        return;
      }
      
      if (event.data.type === 'ELEMENT_CLICKED') {
        console.log('Element clicked in iframe:', event.data);
        const { elementType, fieldName, currentValue, position } = event.data;
        setSelectedElement({
          type: elementType,
          field: fieldName,
          value: currentValue,
          position
        });
        setTempValue(currentValue);
      } else if (event.data.type === 'ELEMENT_UPDATED') {
        const { fieldName, newValue, elementType } = event.data;
        
        // Update whiteLabelCustomizations with the new value
        if (elementType === 'text' || elementType === 'button') {
          setWhiteLabelCustomizations(prev => ({
            ...prev,
            text: {
              ...prev.text,
              [fieldName]: newValue
            }
          }));
        }
        
        // Clear selected element since editing is complete
        setSelectedElement(null);
        setTempValue('');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Apply edit changes
  const handleApplyEdit = () => {
    if (!selectedElement) return;

    console.log('🔧 Applying edit:', {
      type: selectedElement.type,
      field: selectedElement.field,
      oldValue: selectedElement.value,
      newValue: tempValue
    });

    if (selectedElement.type === 'text') {
      setWhiteLabelCustomizations(prev => {
        const updated = {
          ...prev,
          text: {
            ...prev.text,
            [selectedElement.field]: tempValue
          }
        };
        console.log('🔧 Updated customizations:', updated);
        return updated;
      });
    } else if (selectedElement.type === 'color' || selectedElement.type === 'background') {
      setWhiteLabelCustomizations(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [selectedElement.field]: tempValue
        }
      }));
    }

    setSelectedElement(null);
    setTempValue('');
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setSelectedElement(null);
    setTempValue('');
  };

   const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [showDomainPanel, setShowDomainPanel] = useState(false);
  const [currentLandingPageId, setCurrentLandingPageId] = useState<number | undefined>(initialLandingPageId);
  const [lastSavedPageId, setLastSavedPageId] = useState<number | null>(null);
  
  // Fetch parent white-label client domain for affiliates
  const { data: affiliateData } = useQuery({
    queryKey: ['/api/affiliate/parent-domain'],
    enabled: isAffiliate && !!user?.id,
  });

  // Fetch white-label data for current user to get domain path
  const { data: whiteLabelData } = useQuery({
    queryKey: ['/api/white-labels/my'],
    enabled: !!user && user.role === 'white_label_client',
  });
  
  // Get the actual client domain name (either from prop or API)
  const clientDomainName = isAffiliate && affiliateData?.parentDomain 
    ? affiliateData.parentDomain 
    : parentWhiteLabelDomain;
  
  // Fetch existing landing pages
  const { data: existingLandingPages = [] } = useQuery({
    queryKey: ['/api/landing-pages'],
    enabled: !!user
  });

  // Auto-set the current landing page ID for white-label clients
  useEffect(() => {
    if (!currentLandingPageId && existingLandingPages.length > 0 && user) {
      // If user is white-label client and has landing pages, auto-select the first one
      const firstLandingPage = existingLandingPages[0];
      if (firstLandingPage && firstLandingPage.id) {
        setCurrentLandingPageId(firstLandingPage.id);
        setLastSavedPageId(firstLandingPage.id);
      }
    }
  }, [existingLandingPages, currentLandingPageId, user]);
  
  // White label customizations state
  const [whiteLabelCustomizations, setWhiteLabelCustomizations] = useState({
    text: {
      heroTitle: 'Welcome to Our Platform',
      heroSubtitle: 'Transform your business with our powerful tools',
      ctaButtonText: 'Get Started',
      companyName: 'Your Company'
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      buttonColor: '#3b82f6'
    }
  });

  // Save landing page mutation
  const saveLandingPageMutation = useMutation({
    mutationFn: async () => {
      const landingPageData = {
        name: 'New Landing Page',
        elements: [],
        settings: {
          canvasHeight: 800,
          viewMode: 'desktop',
          zoom: 1
        }
      };

      const url = currentLandingPageId 
        ? `/api/landing-pages/${currentLandingPageId}`
        : '/api/landing-pages';
      
      const method = currentLandingPageId ? 'PUT' : 'POST';
      
      const response = await apiRequest(url, method, landingPageData);
      const result = await response.json();
      
      if (!currentLandingPageId && result.id) {
        setCurrentLandingPageId(result.id);
        setLastSavedPageId(result.id);
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Landing Page Saved",
        description: "Your landing page has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: "Failed to save landing page. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Set as default landing page mutation
  const setAsDefaultMutation = useMutation({
    mutationFn: async (landingPageId: number) => {
      const response = await apiRequest(`/api/landing-pages/${landingPageId}/set-default`, 'POST');
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Set as Default Successfully!",
        description: `Your landing page is now live at: ${data.domainUrl || window.location.origin}/${data.domainPath}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
    }
  });

  // Set as domain page mutation (for affiliates)
  const setAsDomainPageMutation = useMutation({
    mutationFn: async (landingPageId: number) => {
      const response = await apiRequest(`/api/landing-pages/${landingPageId}/set-domain-page`, 'POST');
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Domain Page Set Successfully!",
        description: `Your landing page is now live for ${clientDomainName}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
    }
  });

  // Set page mutation
  const setPageMutation = useMutation({
    mutationFn: async (landingPageId: number) => {
      const response = await apiRequest(`/api/landing-pages/${landingPageId}/set-page`, 'POST');
      return response.json();
    },
    onSuccess: async (data) => {
      toast({
        title: "Page Deployed Successfully!",
        description: `Your landing page is now live at: ${data.domainUrl || window.location.origin}/${data.domainPath}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
    }
  });

  // Save white label customization mutation
  const saveWhiteLabelCustomizationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/white-label-customizations', 'POST', whiteLabelCustomizations);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Customizations Saved",
        description: "Your white label customizations have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: "Failed to save customizations. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveCustomizations = () => {
    saveWhiteLabelCustomizationMutation.mutate();
  };

  const handleSetAsDefaultLandingPage = async () => {
    try {
      if (lastSavedPageId) {
        // Use the last saved page ID
        setAsDefaultMutation.mutate(lastSavedPageId);
      } else {
        // Save first, then set as default
        const result = await saveLandingPageMutation.mutateAsync();
        if (result && result.id) {
          setAsDefaultMutation.mutate(result.id);
        } else {
          toast({
            title: "Error",
            description: "Could not get landing page ID to set as active landing page",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save landing page before setting as active",
        variant: "destructive"
      });
    }
  };

  const handleSetAsDomainPage = async () => {
    try {
      if (lastSavedPageId) {
        // Use the last saved page ID
        setAsDomainPageMutation.mutate(lastSavedPageId);
      } else {
        // Save first, then set as domain page
        const result = await saveLandingPageMutation.mutateAsync();
        if (result && result.id) {
          setAsDomainPageMutation.mutate(result.id);
        } else {
          toast({
            title: "Error",
            description: "Could not get landing page ID to set as domain page",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save landing page before setting as domain page",
        variant: "destructive"
      });
    }
  };

  const handleDeployPage = async () => {
    try {
      if (lastSavedPageId) {
        // Use the last saved page ID - save whatever user built
        setPageMutation.mutate(lastSavedPageId);
      } else {
        // Save first, then set as page
        const result = await saveLandingPageMutation.mutateAsync();
        if (result && result.id) {
          setPageMutation.mutate(result.id);
        } else {
          toast({
            title: "Error",
            description: "Could not get landing page ID to set as page",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save landing page before setting as page",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-semibold">White Label Landing Page Builder</h1>
        <div className="flex items-center space-x-3">
          {/* Show different buttons based on user type */}
          {!isAffiliate ? (
            <>
              <Button 
                size="sm" 
                onClick={handleSetAsDefaultLandingPage}
                disabled={saveLandingPageMutation.isPending || setAsDefaultMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                title="Set this page as the default landing page for your domain"
              >
                <Settings className="h-4 w-4 mr-2" />
                {setAsDefaultMutation.isPending ? 'Setting Default...' : 'Set as Default'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleDeployPage}
                disabled={saveLandingPageMutation.isPending || setPageMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                title="Deploy this page to your live domain"
              >
                <Zap className="h-4 w-4 mr-2" />
                {setPageMutation.isPending ? 'Setting...' : 'Set Page'}
              </Button>
            </>
          ) : (
            <>
              <Button 
                size="sm" 
                onClick={handleSetAsDefaultLandingPage}
                disabled={saveLandingPageMutation.isPending || setAsDefaultMutation.isPending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                title="Set this page as the default landing page for your domain"
              >
                <Settings className="h-4 w-4 mr-2" />
                {setAsDefaultMutation.isPending ? 'Setting Default...' : 'Set as Default'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleSetAsDomainPage}
                disabled={saveLandingPageMutation.isPending || setAsDomainPageMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                title={`Set this page as the default landing page for ${parentWhiteLabelDomain ? parentWhiteLabelDomain.split('.')[0] : 'your white-label client'}`}
              >
                <Globe className="h-4 w-4 mr-2" />
                {setAsDomainPageMutation.isPending ? 'Setting...' : `Set ${clientDomainName ? clientDomainName.charAt(0).toUpperCase() + clientDomainName.slice(1) : 'Client'} Page`}
              </Button>
              <Button 
                size="sm" 
                onClick={handleDeployPage}
                disabled={saveLandingPageMutation.isPending || setPageMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                title="Deploy this page to your live domain"
              >
                <Zap className="h-4 w-4 mr-2" />
                {setPageMutation.isPending ? 'Setting...' : 'Set Page'}
              </Button>
            </>
          )}

          <Button 
            size="sm" 
            variant={showDomainPanel ? 'default' : 'outline'}
            onClick={() => setShowDomainPanel(!showDomainPanel)}
            className={showDomainPanel ? 
              "bg-blue-600 hover:bg-blue-700 text-white" : 
              "border-blue-200 text-blue-700 hover:bg-blue-50"
            }
          >
            <Globe className="h-4 w-4 mr-2" />
            Custom Domains
          </Button>
          
          {lastSavedPageId && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`/landing/${lastSavedPageId}`, '_blank')}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Live Page
            </Button>
          )}

          <Button
            onClick={handleSaveCustomizations}
            disabled={saveWhiteLabelCustomizationMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saveWhiteLabelCustomizationMutation.isPending ? 'Saving...' : 'Save Customizations'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Customization Panel */}
        <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* WYSIWYG Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2 text-blue-800">
                <Settings className="h-5 w-5" />
                WYSIWYG Editor
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>🖱️ <strong>Hover</strong> over any text to see edit options</p>
                <p>📝 <strong>Click</strong> on text to edit inline</p>
                <p>💾 <strong>Save Customizations</strong> to persist changes</p>
              </div>
            </div>

            {/* Current Customizations Display */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-gray-800">Current Text Values</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Hero Title:</span>
                  <p className="text-gray-800 truncate">{whiteLabelCustomizations.text.heroTitle || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Hero Subtitle:</span>
                  <p className="text-gray-800 truncate">{whiteLabelCustomizations.text.heroSubtitle || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">CTA Button:</span>
                  <p className="text-gray-800 truncate">{whiteLabelCustomizations.text.ctaButtonText || 'Not set'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Company Name:</span>
                  <p className="text-gray-800 truncate">{whiteLabelCustomizations.text.companyName || 'Not set'}</p>
                </div>
              </div>
            </div>

            {/* Quick Color Customizations */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-3 text-gray-800 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Quick Colors
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="primaryColor" className="text-xs">Primary</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={whiteLabelCustomizations.colors.primary}
                    onChange={(e) => setWhiteLabelCustomizations(prev => ({
                      ...prev,
                      colors: { ...prev.colors, primary: e.target.value }
                    }))}
                    className="h-8 w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonColor" className="text-xs">Button</Label>
                  <Input
                    id="buttonColor"
                    type="color"
                    value={whiteLabelCustomizations.colors.buttonColor}
                    onChange={(e) => setWhiteLabelCustomizations(prev => ({
                      ...prev,
                      colors: { ...prev.colors, buttonColor: e.target.value }
                    }))}
                    className="h-8 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 p-4 relative">
          <div className="h-full border rounded-lg overflow-hidden relative">
            <iframe
              src={`${whiteLabelData?.domainPath || '/shoot'}?customizations=${encodeURIComponent(JSON.stringify(whiteLabelCustomizations))}&editMode=true${whiteLabelData?.domainPath ? `&domain=${encodeURIComponent(whiteLabelData.domainPath)}` : ''}`}
              key={`${JSON.stringify(whiteLabelCustomizations)}-true-${whiteLabelData?.domainPath || ''}`}
              className="w-full h-full border-0"
              title="Landing Page Preview"
              onLoad={() => {
                console.log('🔄 Iframe loaded with customizations:', whiteLabelCustomizations);
                console.log('🔄 Iframe src:', `${whiteLabelData?.domainPath || '/shoot'}?customizations=${encodeURIComponent(JSON.stringify(whiteLabelCustomizations))}&editMode=true${whiteLabelData?.domainPath ? `&domain=${encodeURIComponent(whiteLabelData.domainPath)}` : ''}`);
              }}
            />
          </div>

          {/* Inline Editor Overlay */}
          {selectedElement && selectedElement.position && (
            <div 
              className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-20 min-w-64"
              style={{
                left: Math.min(selectedElement.position.x, window.innerWidth - 300),
                top: Math.min(selectedElement.position.y, window.innerHeight - 200)
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">
                  Edit {selectedElement.type === 'text' ? 'Text' : 'Color'}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-6 w-6 p-0"
                >
                  ×
                </Button>
              </div>

              {selectedElement.type === 'text' ? (
                <div className="space-y-3">
                  <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="Enter text"
                    className="w-full"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    type="color"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full h-10"
                  />
                  <Input
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder="Enter hex color"
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={handleApplyEdit}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Domain Panel */}
      {showDomainPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Custom Domain Management</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDomainPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
              <div className="p-6">
                <div className="space-y-6">
                  <CustomDomainManager 
                    selectedLandingPageId={currentLandingPageId}
                    onDomainAdded={(domain) => {
                      toast({
                        title: "Domain Added",
                        description: `Your custom domain has been added: ${domain.domain}`,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}