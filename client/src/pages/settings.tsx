import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Globe, Palette, Save, Eye, EyeOff, CheckCircle, AlertCircle, Menu, Upload, Sun, Moon, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SimpleFileUploader } from "@/components/SimpleFileUploader";
import { BrandLogoUploader } from "@/components/BrandLogoUploader";
import { ModernImageUploader } from "@/components/ModernImageUploader";
import SubscriptionSelections from "@/components/SubscriptionSelections";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import type { UploadResult } from "@uppy/core";

export default function SettingsPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Password update state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    nmi: false,
    nmiKey: false
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [expandedSubscriptions, setExpandedSubscriptions] = useState<Record<number, boolean>>({});
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [brandLogoPreview, setBrandLogoPreview] = useState<string>("");
  
  // State for tracking profile form changes
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: ''
  });
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  
  // NMI Settings form state
  const [nmiFormData, setNmiFormData] = useState({
    username: '',
    password: '',
    securityKey: '',
    processorId: '',
    gatewayUrl: 'https://secure.nmi.com/api/transact.php',
    isTestMode: false
  });
  const [hasNmiChanges, setHasNmiChanges] = useState(false);
  const [isEditingProfileImage, setIsEditingProfileImage] = useState(false);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';

  // Data queries
  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
  });

  const { data: preferences } = useQuery({
    queryKey: ['/api/preferences'],
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['/api/subscriptions/my'],
  });

  const { data: billingInfo } = useQuery({
    queryKey: ['/api/billing/info'],
  });

  // Query for existing NMI credentials
  const { data: nmiCredentials } = useQuery({
    queryKey: ['/api/nmi-credentials'],
  });

  // Initialize profile form data when profile is loaded
  useEffect(() => {
    if (profile) {
      const initialData = {
        firstName: (profile as any)?.firstName || '',
        lastName: (profile as any)?.lastName || '',
        phone: (profile as any)?.phone || '',
        company: (profile as any)?.company || ''
      };
      setProfileFormData(initialData);
      setHasProfileChanges(false);
    }
  }, [profile]);

  // Initialize NMI form data when credentials are loaded
  useEffect(() => {
    if (nmiCredentials?.hasCredentials) {
      const creds = nmiCredentials.credentials;
      setNmiFormData({
        username: creds.username || '',
        password: '', // Don't populate password for security
        securityKey: '', // Don't populate security key for security
        processorId: '',
        gatewayUrl: creds.gatewayUrl || 'https://secure.nmi.com/api/transact.php',
        isTestMode: creds.isTestMode || false
      });
      setHasNmiChanges(false);
    }
  }, [nmiCredentials]);

  // Use global theme management instead of local state
  const currentTheme = preferences?.theme || 'light';

  const toggleSubscriptionExpansion = (subscriptionId: number) => {
    setExpandedSubscriptions(prev => ({
      ...prev,
      [subscriptionId]: !prev[subscriptionId]
    }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      // Update local state to reflect the saved changes
      if (data) {
        const updatedData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          company: data.company || ''
        };
        setProfileFormData(updatedData);
      }
      setHasProfileChanges(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update preferences');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been successfully updated.",
      });
    },
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/upload/brand-logo', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload brand logo');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      setBrandLogoPreview(data.logoUrl || '');
      toast({
        title: "Brand Logo Updated",
        description: "Your brand logo has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/objects/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload profile image');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setLogoPreview(data.uploadURL || '');
      toast({
        title: "Profile Image Updated",
        description: "Your profile image has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Custom brand logo upload handler
  const handleBrandLogoUpload = (file: File) => {
    uploadLogoMutation.mutate(file);
  };

  // Profile image upload handler
  const handleProfileImageUpload = (file: File) => {
    uploadProfileImageMutation.mutate(file);
    setIsEditingProfileImage(false); // Reset edit mode after upload
  };

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update password');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({});
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to update password";
      toast({
        title: "Password Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // NMI Credentials save mutation
  const saveNmiCredentialsMutation = useMutation({
    mutationFn: async (data: typeof nmiFormData) => {
      const response = await fetch('/api/nmi-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          securityKey: data.securityKey,
          gatewayUrl: data.gatewayUrl,
          isTestMode: data.isTestMode
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save NMI credentials');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nmi-credentials'] });
      toast({
        title: "NMI Settings Saved",
        description: "Your NMI payment gateway settings have been saved successfully.",
      });
      setHasNmiChanges(false);
      // Clear sensitive fields after successful save
      setNmiFormData(prev => ({
        ...prev,
        password: '',
        securityKey: ''
      }));
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to save NMI settings";
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const profileData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      bio: formData.get('bio'),
      profileImageUrl: logoPreview || profile?.profileImageUrl,
    };
    updateProfileMutation.mutate(profileData);
  };

  // Handle profile form input changes
  const handleProfileInputChange = (field: string, value: string) => {
    const newFormData = { ...profileFormData, [field]: value };
    setProfileFormData(newFormData);
    
    // Check if any field has changed from original values
    const originalData = {
      firstName: (profile as any)?.firstName || '',
      lastName: (profile as any)?.lastName || '',
      phone: (profile as any)?.phone || '',
      company: (profile as any)?.company || ''
    };
    
    const hasChanges = Object.keys(newFormData).some(
      key => newFormData[key as keyof typeof newFormData] !== originalData[key as keyof typeof originalData]
    );
    
    setHasProfileChanges(hasChanges);
  };

  // Handle save profile changes
  const handleSaveProfile = () => {
    const profileData = {
      firstName: profileFormData.firstName,
      lastName: profileFormData.lastName,
      company: profileFormData.company,
      phone: profileFormData.phone,
      email: (profile as any)?.email || '',
      bio: (profile as any)?.bio || '',
      profileImageUrl: logoPreview || profile?.profileImageUrl,
    };
    updateProfileMutation.mutate(profileData);
    setHasProfileChanges(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferencesMutation.mutate({
      ...(preferences || {}),
      [key]: value,
    });
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "New password must be at least 6 characters";
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handlePasswordInputChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleThemeChange = (theme: string) => {
    // Only update preferences, let ThemeProvider handle the actual theme application
    updatePreferencesMutation.mutate({ theme });
  };

  // NMI form handlers
  const handleNmiFormChange = (field: keyof typeof nmiFormData, value: string | boolean) => {
    setNmiFormData(prev => ({ ...prev, [field]: value }));
    setHasNmiChanges(true);
  };

  const handleNmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!nmiFormData.username || !nmiFormData.password || !nmiFormData.securityKey) {
      toast({
        title: "Validation Error",
        description: "Username, password, and security key are required.",
        variant: "destructive",
      });
      return;
    }

    saveNmiCredentialsMutation.mutate(nmiFormData);
  };

  const handleColorChange = (colorType: 'primaryColor' | 'secondaryColor', color: string) => {
    updatePreferencesMutation.mutate({ [colorType]: color });
  };

  const handleResetColors = () => {
    // Determine the actual theme to use for default colors
    let actualTheme = currentTheme;
    if (currentTheme === 'system') {
      // Detect actual system theme when preference is 'system'
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    }
    
    const defaultSecondaryColor = actualTheme === 'light' ? '#ffffff' : '#64748B';
    updatePreferencesMutation.mutate({ 
      primaryColor: '#2563EB',
      secondaryColor: defaultSecondaryColor
    });
  };

  const handleGetUploadParameters = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file.data);
    
    const response = await fetch('/api/objects/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    // Since we're doing direct upload now, we don't need to return upload parameters
    // Instead, we'll handle the upload completion here
    return {
      method: 'GET' as const,
      url: data.uploadURL,
    };
  };

  const handleLogoUploadComplete = (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (result.successful && result.successful.length > 0) {
      const uploadURL = result.successful[0].uploadURL;
      if (uploadURL) {
        setLogoPreview(uploadURL);
        uploadLogoMutation.mutate(uploadURL);
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-muted-foreground"
          >
            <Menu className="h-6 w-6 text-muted-foreground" />
          </Button>
          <h1 className="text-lg font-semibold text-card-foreground">Settings</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="Settings"
          subtitle="Manage your account preferences and platform settings"
        />
        
        <div className="p-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileFormData.firstName}
                        onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileFormData.lastName}
                        onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileFormData.phone}
                        onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={profileFormData.company}
                        onChange={(e) => handleProfileInputChange('company', e.target.value)}
                      />
                    </div>
                    
                    {/* Save Button - appears only when there are changes */}
                    {hasProfileChanges && (
                      <div className="absolute -bottom-12 right-0">
                        <Button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={updateProfileMutation.isPending}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Profile Image Upload */}
                  <div className="space-y-3">
                    <Label>Profile Image</Label>
                    <div className="text-sm text-gray-500 mb-4">
                      Upload your profile picture. Recommended size: 200x200px (PNG, JPG, or SVG)
                    </div>
                    
                    {/* Show centered profile image with edit option when image exists and not in edit mode */}
                    {profile?.profileImageUrl && !isEditingProfileImage ? (
                      <div className="flex flex-col items-center space-y-4 p-6 border border-gray-200 rounded-lg">
                        <div className="relative">
                          <img
                            src={profile.profileImageUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                          />
                          {uploadProfileImageMutation.isPending && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfileImage(true)}
                          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors"
                        >
                          Click to Edit
                        </button>
                      </div>
                    ) : (
                      /* Show ModernImageUploader when no image exists or in edit mode */
                      <div className="space-y-2">
                        <ModernImageUploader
                          currentImageUrl={profile?.profileImageUrl}
                          onUpload={handleProfileImageUpload}
                          isUploading={uploadProfileImageMutation.isPending}
                          maxSizeInMB={10}
                          acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
                          title="Profile Image"
                          description="Upload your profile picture"
                        />
                        {isEditingProfileImage && (
                          <button
                            type="button"
                            onClick={() => setIsEditingProfileImage(false)}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.authProvider === 'google' ? (
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        You signed in with Google. Password management is handled by your Google account.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                            placeholder="Enter current password"
                            className={passwordErrors.currentPassword ? "border-destructive" : ""}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                            placeholder="Enter new password (min 6 characters)"
                            className={passwordErrors.newPassword ? "border-destructive" : ""}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                            placeholder="Confirm new password"
                            className={passwordErrors.confirmPassword ? "border-destructive" : ""}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        disabled={updatePasswordMutation.isPending}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {updatePasswordMutation.isPending ? (
                          <>
                            <Save className="mr-2 h-4 w-4 animate-spin" style={{ color: 'white' }} />
                            Updating Password...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" style={{ color: 'white' }} />
                            Update Password
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>


            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              {/* Current Subscription - Only for White Label Clients */}
              {(selectedRole === 'white_label_client' || selectedRole === 'White-Label Client' || selectedRole === 'White Label') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Subscription</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(subscriptions as any)?.filter((sub: any) => sub.status === 'active').map((sub: any) => {
                      const startDate = new Date(sub.createdAt);
                      const nextBillingDate = new Date(startDate);
                      nextBillingDate.setDate(startDate.getDate() + 30);
                      const isExpanded = expandedSubscriptions[sub.id];
                      
                      return (
                        <div key={sub.id} className="space-y-4 mb-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {sub.planName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                ${sub.amount}/month • Next billing: {nextBillingDate.toLocaleDateString()}
                              </p>
                              {isExpanded && (
                                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <p>Started: {startDate.toLocaleDateString()}</p>
                                  <p>Features: {sub.features || 'All premium features included'}</p>
                                </div>
                              )}
                            </div>
                            <Badge variant="default">
                              {sub.status}
                            </Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleSubscriptionExpansion(sub.id)}
                            className="w-full"
                          >
                            {isExpanded ? 'Show Less' : 'Show More'}
                          </Button>
                          
                          {/* Subscription Selections Component */}
                          {isExpanded && (
                            <div className="mt-4">
                              <SubscriptionSelections subscription={sub} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {(!(subscriptions as any) || (subscriptions as any)?.filter((sub: any) => sub.status === 'active').length === 0) && (
                      <p className="text-gray-500 text-center py-8">No active subscriptions</p>
                    )}
                  </CardContent>
                </Card>
              )}



              {/* NMI Payment Gateway Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    NMI Payment Gateway Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configure your NMI payment gateway credentials to receive payments directly to your account
                  </p>
                  
                  <form onSubmit={handleNmiSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nmi-username">NMI Username</Label>
                        <Input
                          id="nmi-username"
                          type="text"
                          placeholder="Enter your NMI username"
                          className="w-full"
                          value={nmiFormData.username}
                          onChange={(e) => handleNmiFormChange('username', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nmi-password">NMI Password</Label>
                        <div className="relative">
                          <Input
                            id="nmi-password"
                            type={showPasswords.nmi ? "text" : "password"}
                            placeholder="Enter your NMI password"
                            className="w-full pr-10"
                            value={nmiFormData.password}
                            onChange={(e) => handleNmiFormChange('password', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, nmi: !prev.nmi }))}
                          >
                            {showPasswords.nmi ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nmi-security-key">Security Key</Label>
                        <div className="relative">
                          <Input
                            id="nmi-security-key"
                            type={showPasswords.nmiKey ? "text" : "password"}
                            placeholder="Enter your NMI security key"
                            className="w-full pr-10"
                            value={nmiFormData.securityKey}
                            onChange={(e) => handleNmiFormChange('securityKey', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPasswords(prev => ({ ...prev, nmiKey: !prev.nmiKey }))}
                          >
                            {showPasswords.nmiKey ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nmi-processor-id">Processor ID (Optional)</Label>
                        <Input
                          id="nmi-processor-id"
                          type="text"
                          placeholder="Enter processor ID if required"
                          className="w-full"
                          value={nmiFormData.processorId}
                          onChange={(e) => handleNmiFormChange('processorId', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nmi-gateway-url">Gateway URL</Label>
                      <Input
                        id="nmi-gateway-url"
                        type="url"
                        placeholder="https://secure.nmi.com/api/transact.php"
                        className="w-full"
                        value={nmiFormData.gatewayUrl}
                        onChange={(e) => handleNmiFormChange('gatewayUrl', e.target.value)}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="nmi-test-mode" 
                        checked={nmiFormData.isTestMode}
                        onCheckedChange={(checked) => handleNmiFormChange('isTestMode', checked)}
                      />
                      <Label htmlFor="nmi-test-mode" className="text-sm">
                        Test Mode (Use sandbox environment)
                      </Label>
                    </div>

                    <Alert>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <AlertDescription>
                        Your NMI credentials are encrypted and stored securely. When customers purchase your plans, payments will be processed directly through your NMI account.
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        type="submit"
                        disabled={saveNmiCredentialsMutation.isPending || !hasNmiChanges}
                        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {saveNmiCredentialsMutation.isPending ? (
                          <>
                            <Save className="h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save NMI Settings
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        className="text-muted-foreground border-muted-foreground hover:bg-muted/10"
                      >
                        Test Connection
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Billing Information message for non-white-label users */}
              {selectedRole !== 'white_label_client' && selectedRole !== 'White-Label Client' && selectedRole !== 'White Label' && (
                <Alert>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <AlertDescription>
                    Subscription billing is only available for White Label Clients. You can still manage your payment method above.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="space-y-6">
              {/* Theme Customization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-muted-foreground" />
                    Theme & Display
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Theme Preference</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={currentTheme === 'light' ? 'default' : 'outline'}
                        className="flex flex-col items-center gap-2 h-20"
                        onClick={() => handleThemeChange('light')}
                      >
                        <Sun className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Light</span>
                      </Button>
                      <Button
                        variant={currentTheme === 'dark' ? 'default' : 'outline'}
                        className="flex flex-col items-center gap-2 h-20"
                        onClick={() => handleThemeChange('dark')}
                      >
                        <Moon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Dark</span>
                      </Button>
                      <Button
                        variant={currentTheme === 'system' ? 'default' : 'outline'}
                        className="flex flex-col items-center gap-2 h-20"
                        onClick={() => handleThemeChange('system')}
                      >
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">System</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color Customization */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Brand Colors</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleResetColors}
                    disabled={updatePreferencesMutation.isPending}
                    className="text-muted-foreground border-muted-foreground hover:bg-muted/10"
                  >
                    Reset to Default
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={preferences?.primaryColor || '#2563EB'}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="w-16 h-10 p-0 border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={preferences?.primaryColor || '#2563EB'}
                          onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                          className="flex-1"
                          placeholder="#2563EB"
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        Used for buttons, links, and primary UI elements
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={preferences?.secondaryColor || '#64748B'}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="w-16 h-10 p-0 border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={preferences?.secondaryColor || '#64748B'}
                          onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                          className="flex-1"
                          placeholder="#64748B"
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        Used for secondary elements and accents
                      </div>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-3">Color Preview</h4>
                    <div className="flex gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: preferences?.primaryColor || '#2563EB' }}
                      />
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: preferences?.secondaryColor || '#64748B' }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Brand Logo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Logo Upload</Label>
                    <div className="text-sm text-gray-500 mb-4">
                      Upload your logo to appear in the top-left corner of your dashboard and landing pages. 
                      Recommended size: 200x60px (PNG, JPG, or SVG)
                    </div>
                    <ModernImageUploader
                      currentImageUrl={profile?.logoImageUrl}
                      onUpload={handleBrandLogoUpload}
                      isUploading={uploadLogoMutation.isPending}
                      maxSizeInMB={5}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']}
                      title="Brand Logo"
                      description="Upload your brand logo"
                    />
                  </div>
                </CardContent>
              </Card>


            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
}