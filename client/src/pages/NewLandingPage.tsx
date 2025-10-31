import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CustomDomainManager from "@/components/domain/CustomDomainManager";
import { 
  Settings, Globe, Zap, Eye, Trash2
} from "lucide-react";

interface NewLandingPageProps {
  initialLandingPageId?: number;
  onClose?: () => void;
  isAffiliate?: boolean;
  parentWhiteLabelDomain?: string;
}

export default function NewLandingPage({ 
  initialLandingPageId, 
  onClose, 
  isAffiliate = false, 
  parentWhiteLabelDomain 
}: NewLandingPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch parent white-label client domain for affiliates
  const { data: affiliateData } = useQuery({
    queryKey: ['/api/affiliate/parent-domain'],
    enabled: isAffiliate && !!user?.id,
  });
  
  // Get the actual client domain name (either from prop or API)
  const clientDomainName = isAffiliate && affiliateData?.parentDomain 
    ? affiliateData.parentDomain 
    : parentWhiteLabelDomain;
  
  // State management
  const [showDomainPanel, setShowDomainPanel] = useState(false);
  const [currentLandingPageId, setCurrentLandingPageId] = useState<number | undefined>(initialLandingPageId);
  const [lastSavedPageId, setLastSavedPageId] = useState<number | null>(null);

  // Fetch existing landing pages
  const { data: existingLandingPages = [] } = useQuery({
    queryKey: ['/api/landing-pages'],
    enabled: !!user
  });

  // Auto-set the current landing page ID for white-label clients
  React.useEffect(() => {
    if (!currentLandingPageId && existingLandingPages.length > 0 && user) {
      // If user is white-label client and has landing pages, auto-select the first one
      const firstLandingPage = existingLandingPages[0];
      if (firstLandingPage && firstLandingPage.id) {
        setCurrentLandingPageId(firstLandingPage.id);
        setLastSavedPageId(firstLandingPage.id);
      }
    }
  }, [existingLandingPages, currentLandingPageId, user]);

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
    }
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
    onSuccess: (data) => {
      // Extract client name from domain path
      const clientName = data.domainPath || 'client';
      toast({
        title: `${clientName} Page Set!`,
        description: `Your landing page now becomes just like ${clientName}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
    }
  });

  // Set page mutation
  const setPageMutation = useMutation({
    mutationFn: async (landingPageId: number) => {
      const response = await apiRequest(`/api/landing-pages/${landingPageId}/set-page`, 'POST');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Custom Page Set Successfully!",
        description: data.message || "Your custom page is now live",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
    }
  });

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
    <div className="h-full flex items-center justify-center">
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