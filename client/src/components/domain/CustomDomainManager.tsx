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
  Plus, 
  Check, 
  X, 
  Settings, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Shield,
  Zap,
  Trash2,
  RefreshCw,
  Server,
  Lock
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WhiteLabelData {
  id: string;
  userId: string;
  domainPath: string | null;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomDomainManagerProps {
  selectedLandingPageId?: number;
  onDomainAdded?: (domain: any) => void;
}

export default function CustomDomainManager({ selectedLandingPageId, onDomainAdded }: CustomDomainManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [domainPath, setDomainPath] = useState('');
  const [domainPathValidation, setDomainPathValidation] = useState<{ available: boolean; message: string } | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalDomainPath, setOriginalDomainPath] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Force clear any cached data on mount for affiliate users
  useEffect(() => {
    if (user?.role === 'end_user') {
      console.log('🚀 AFFILIATE USER DETECTED - Force refreshing data...');
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
      setDomainPath(''); // Clear any existing value
    }
  }, [user?.role, queryClient]);
  
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

  // Fetch custom domains
  const { data: domains = [], isLoading: domainsLoading, refetch: refetchDomains } = useQuery({
    queryKey: ['/api/custom-domains'],
    enabled: !!user,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0 // Don't cache
  });

  // Add debug logging for domains data
  useEffect(() => {
    console.log('🔥 DOMAINS DATA CHANGED:', domains);
    console.log('🔥 DOMAINS LENGTH:', domains?.length);
    console.log('🔥 USER ROLE:', user?.role);
  }, [domains, user?.role]);

  // Fetch white-label data for domain management
  const { data: whiteLabelData, isLoading: whiteLabelLoading } = useQuery({
    queryKey: ['/api/white-labels/my'],
    enabled: !!user,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0 // Don't cache
  });

  const isLoading = domainsLoading || whiteLabelLoading;

  // Add domain mutation
  const addDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest('/api/custom-domains', 'POST', {
        domain: domain.toLowerCase(),
        landingPageId: selectedLandingPageId
      });
      return response.json();
    },
    onSuccess: (newDomain) => {
      toast({
        title: "Domain Added",
        description: `${newDomain.domain} has been added successfully. Please verify your domain.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
      setNewDomain('');
      setShowAddDialog(false);
      onDomainAdded?.(newDomain);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Domain",
        description: error.message || "Please check the domain format and try again.",
        variant: "destructive"
      });
    }
  });

  // Update domain mutation
  const updateDomainMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CustomDomain> }) => {
      const response = await apiRequest(`/api/custom-domains/${id}`, 'PUT', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Domain Updated",
        description: "Domain settings have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
    }
  });

  // Delete domain mutation
  const deleteDomainMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest(`/api/custom-domains/${id}`, 'DELETE');
    },
    onSuccess: () => {
      toast({
        title: "Domain Deleted",
        description: "Custom domain has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
    }
  });

  // Verify domain mutation
  const verifyDomainMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/custom-domains/${id}/verify`, 'POST');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Domain Verified",
        description: "Your domain has been successfully verified and is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Please check your DNS settings and try again.",
        variant: "destructive"
      });
    }
  });

  // Create default landing page mutation
  const createDefaultPageMutation = useMutation({
    mutationFn: async ({ domainPath, companyName }: { domainPath: string; companyName?: string }) => {
      const response = await apiRequest('/api/create-default-landing-page', 'POST', {
        domainPath,
        companyName
      });
      return response.json();
    },
    onSuccess: (newPage) => {
      toast({
        title: "Default Page Created",
        description: `Professional landing page created and published at /${newPage.domainPath}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      setShowDefaultPageDialog(false);
      setDomainPath('');
      setCompanyName('');
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Page",
        description: error.message || "Could not create default landing page.",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const validateDomain = (domain: string) => {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    return domainRegex.test(domain);
  };

  // Domain path validation for white-label clients
  const validateDomainPath = async (path: string) => {
    if (!path) {
      setDomainPathValidation(null);
      return;
    }

    setCheckingAvailability(true);
    try {
      const response = await apiRequest('/api/domain-paths/validate', 'POST', {
        domainPath: path
      });
      const result = await response.json();
      
      if (result.available) {
        if (result.message.includes('current domain')) {
          setDomainPathValidation({
            available: true,
            message: "This is your current domain"
          });
        } else {
          setDomainPathValidation({
            available: true,
            message: "Domain path is available"
          });
        }
      } else {
        setDomainPathValidation({
          available: false,
          message: "Domain path already taken by other white-label client"
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

  // Update domain path mutation - uses actual white-label IDs from data
  const updateDomainPathMutation = useMutation({
    mutationFn: async (path: string) => {
      console.log('🚀 UPDATE MUTATION - path:', path, 'user role:', user?.role);
      console.log('🚀 UPDATE MUTATION - domains data:', domains);
      console.log('🚀 UPDATE MUTATION - whiteLabelData:', whiteLabelData);
      
      // FIXED: Use actual white-label ID from the domain data
      let targetDomainId;
      
      if (user?.role === 'white_label_client') {
        // For white-label clients, use their main domain ID (should be -2 but let's be dynamic)
        const mainDomain = domains?.find(d => d.isMainDomain);
        if (mainDomain) {
          targetDomainId = mainDomain.id;
          console.log('✅ White-label client - using main domain ID:', targetDomainId);
        } else {
          // Fallback to -2 for white-label clients
          targetDomainId = -2;
          console.log('⚠️ White-label client - using fallback ID -2');
        }
      } else {
        // For affiliates, use the actual domain ID from the data
        const affiliateDomain = domains?.find(d => d.isAffiliateDomain);
        if (affiliateDomain) {
          targetDomainId = affiliateDomain.id;
          console.log('✅ Affiliate - using domain ID:', targetDomainId, 'whiteLabelId:', affiliateDomain.whiteLabelId);
        } else if (domains && domains.length > 0) {
          // Use the first available domain
          targetDomainId = domains[0].id;
          console.log('⚠️ Affiliate - using first domain ID:', targetDomainId);
        } else {
          // Last resort fallback
          targetDomainId = -1;
          console.log('⚠️ Affiliate - using fallback ID -1');
        }
      }
      
      console.log('🎯 Final targetDomainId:', targetDomainId);
      
      const response = await apiRequest(`/api/custom-domains/${targetDomainId}`, 'PUT', {
        domain: path,
        whiteLabelId: domains?.find(d => d.id === targetDomainId)?.whiteLabelId // Include actual white-label ID
      });
      return response.json();
    },
    onSuccess: (updatedDomain) => {
      toast({
        title: "Domain Updated Successfully",
        description: `Your domain has been updated to "${updatedDomain.domain}".`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/custom-domains'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/landing-pages'] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Domain",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Populate domain path from custom domains data for affiliates
  useEffect(() => {
    if (!isEditing) {
      console.log('🔍 Populating domain path - domains:', domains, 'whiteLabelData:', whiteLabelData);
      console.log('👤 User role:', user?.role);
      
      // For end-users (affiliates), use ANY custom domains API data
      if (user?.role === 'end_user' && domains && domains.length > 0) {
        console.log('🎯 AFFILIATE USER - checking domains from API:', domains);
        console.log('🔥 RAW DOMAINS DATA:', JSON.stringify(domains, null, 2));
        
        // Use the first domain returned (API should return affiliate's domains)
        const firstDomain = domains[0];
        console.log('🎯 FIRST DOMAIN from API:', firstDomain);
        
        if (firstDomain && firstDomain.domain) {
          console.log('✅ SETTING domain path to:', firstDomain.domain);
          setDomainPath(firstDomain.domain);
          setOriginalDomainPath(firstDomain.domain);
          return; // Exit early - don't use any fallback
        }
        
        // If no valid domain found, log error
        console.error('❌ NO VALID DOMAINS FOUND for user', user.id);
        console.error('Available domains:', domains);
        return;
      }
      
      // For white-label clients only
      if (user?.role === 'white_label_client' && whiteLabelData && whiteLabelData.domainPath) {
        console.log('🏢 WHITE LABEL CLIENT - Setting domain path to:', whiteLabelData.domainPath);
        setDomainPath(whiteLabelData.domainPath);
        setOriginalDomainPath(whiteLabelData.domainPath);
      }
    }
  }, [domains, whiteLabelData, isEditing, user?.role]);

  // Handle domain path input change with debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (domainPath) {
        validateDomainPath(domainPath);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [domainPath]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Domain Management</h2>
            <p className="text-sm text-gray-600">Manage custom domains and branded URLs for your landing pages</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="domain-paths" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="domain-paths" className="flex items-center space-x-2">
            <Server className="h-4 w-4" />
            <span>Domain</span>
          </TabsTrigger>
          <TabsTrigger value="custom-domains" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Custom Domain</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="custom-domains" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Connect your own domain to create a professional branded experience</p>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>
                Enter your domain name to connect it to your landing page
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter without www or https://
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (!validateDomain(newDomain)) {
                      toast({
                        title: "Invalid Domain",
                        description: "Please enter a valid domain name",
                        variant: "destructive"
                      });
                      return;
                    }
                    addDomainMutation.mutate(newDomain);
                  }}
                  disabled={!newDomain || addDomainMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {addDomainMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Domain
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Domains List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : domains.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Domains</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Add your own domain to create a professional branded experience for your landing pages
            </p>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((domain: CustomDomain) => (
            <Card key={domain.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{domain.domain}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>Added {new Date(domain.createdAt).toLocaleDateString()}</span>
                        {domain.landingPageId && (
                          <>
                            <span>•</span>
                            <span>Connected to landing page</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {domain.isVerified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-200 text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {domain.sslEnabled && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Shield className="h-3 w-3 mr-1" />
                        SSL
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!domain.isVerified && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      <strong>Domain verification required.</strong> Add the DNS records below to verify ownership.
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs defaultValue="setup" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="setup">DNS Setup</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="setup" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">1. Add DNS Records</h4>
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">A Record</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => copyToClipboard('185.199.108.153')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><strong>Type:</strong> A</div>
                              <div><strong>Name:</strong> @ (or leave blank)</div>
                              <div><strong>Value:</strong> 185.199.108.153</div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">CNAME Record (www)</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => copyToClipboard(domain.domain)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div><strong>Type:</strong> CNAME</div>
                              <div><strong>Name:</strong> www</div>
                              <div><strong>Value:</strong> {domain.domain}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">2. Verify Ownership</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">TXT Record</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(`whitelabel-verify=${domain.verificationToken}`)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div><strong>Type:</strong> TXT</div>
                            <div><strong>Name:</strong> @ (or leave blank)</div>
                            <div><strong>Value:</strong> whitelabel-verify={domain.verificationToken}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="status" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Server className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">DNS Status</span>
                        </div>
                        <Badge variant={domain.isVerified ? "default" : "outline"}>
                          {domain.isVerified ? "Configured" : "Pending"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">SSL Certificate</span>
                        </div>
                        <Badge variant={domain.sslEnabled ? "default" : "outline"}>
                          {domain.sslEnabled ? "Active" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <div className="font-medium">Domain Status</div>
                        <div className="text-sm text-gray-600">Enable or disable this domain</div>
                      </div>
                      <Button
                        size="sm"
                        variant={domain.isActive ? "outline" : "default"}
                        onClick={() => updateDomainMutation.mutate({
                          id: domain.id,
                          data: { isActive: !domain.isActive }
                        })}
                      >
                        {domain.isActive ? "Disable" : "Enable"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t">
                      <div>
                        <div className="font-medium text-red-600">Delete Domain</div>
                        <div className="text-sm text-gray-600">Permanently remove this domain</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${domain.domain}?`)) {
                            deleteDomainMutation.mutate(domain.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {domain.isVerified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Visit Site
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!domain.isVerified && (
                      <Button
                        size="sm"
                        onClick={() => verifyDomainMutation.mutate(domain.id)}
                        disabled={verifyDomainMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {verifyDomainMutation.isPending ? (
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        Verify Domain
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>

        <TabsContent value="domain-paths" className="space-y-6">
          <div className="space-y-4">
            
            {whiteLabelData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-blue-600" />
                        <span>{isEditing ? 'Edit Domain' : 'Set Domain'}</span>
                      </CardTitle>
                      <CardDescription>
                        {isEditing ? 'Update your client domain path' : 'Manage your client domain path'}
                      </CardDescription>
                    </div>
                    {whiteLabelData?.domainPath && !isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true);
                          setOriginalDomainPath(whiteLabelData.domainPath || '');
                          setDomainPath(whiteLabelData.domainPath || '');
                        }}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="domain-path">Set Domain</Label>
                    <div className="mt-1 flex items-center border rounded-md bg-white">
                      {/* Locked base URL */}
                      <div className="flex items-center px-3 py-2 bg-gray-50 border-r text-sm font-mono text-gray-600">
                        <Lock className="h-4 w-4 mr-2 text-gray-400" />
                        {baseUrl}/
                      </div>
                      
                      {/* Editable domain path */}
                      <input
                        id="domain-path"
                        type="text"
                        placeholder="your-domain-path"
                        value={isEditing ? domainPath : (whiteLabelData?.domainPath || '')}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                          setDomainPath(value);
                        }}
                        className="flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        disabled={!isEditing}
                      />
                      
                      {/* Copy button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const currentPath = isEditing ? domainPath : (whiteLabelData?.domainPath || '');
                          const fullUrl = `${baseUrl}/${currentPath}`;
                          navigator.clipboard.writeText(fullUrl);
                          toast({
                            title: "Copied!",
                            description: "Domain URL copied to clipboard",
                          });
                        }}
                        className="px-3 border-l"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Base URL is locked. You can only edit your client's domain path portion.
                    </p>
                    
                    {/* Validation feedback */}
                    {domainPathValidation && (
                      <div className={`mt-2 text-sm flex items-center space-x-1 ${
                        domainPathValidation.available ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {domainPathValidation.available ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        <span>{domainPathValidation.message}</span>
                      </div>
                    )}
                    
                    {checkingAvailability && (
                      <div className="mt-2 text-sm text-blue-600 flex items-center space-x-1">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Checking availability...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setDomainPath(originalDomainPath || '');
                            setDomainPathValidation(null);
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            updateDomainPathMutation.mutate(domainPath);
                          }}
                          disabled={!domainPath || !domainPathValidation?.available || updateDomainPathMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          {updateDomainPathMutation.isPending ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Update Domain
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => updateDomainPathMutation.mutate(domainPath)}
                        disabled={!domainPath || !domainPathValidation?.available || updateDomainPathMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 flex-1"
                      >
                        {updateDomainPathMutation.isPending ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        Set Domain
                      </Button>
                    )}
                    
                    {whiteLabelData?.domainPath && (
                      <Button
                        onClick={() => {
                          const testUrl = `${baseUrl}/${whiteLabelData.domainPath}`;
                          window.open(testUrl, '_blank');
                        }}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Test Domain
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Domain management not available. Please ensure you have proper access permissions.
                </AlertDescription>
              </Alert>
            )}

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span>Quick Setup</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Domain paths are instantly available - no DNS configuration required
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>SSL Included</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    All domain paths are automatically secured with SSL certificates
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>


    </div>
  );
}