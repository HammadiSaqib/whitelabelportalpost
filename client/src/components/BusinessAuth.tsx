import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, Palette, CreditCard, Settings, CheckCircle, Upload, ChevronRight } from 'lucide-react';

interface BusinessInfo {
  businessName: string;
  description: string;
  industry: string;
  ownerFirstName: string;
  ownerLastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  website: string;
}

interface BrandingInfo {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  domainPath: string;
}

interface PlanSelection {
  planId: number;
  billingCycle: 'monthly' | 'yearly';
}

interface BusinessAuthProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: 'Business Information', icon: Building2, description: 'Tell us about your business' },
  { id: 2, title: 'Email Verification', icon: CheckCircle, description: 'Verify your email address' },
  { id: 3, title: 'Brand Setup', icon: Palette, description: 'Customize your brand appearance' },
  { id: 4, title: 'Auto-Provision', icon: Settings, description: 'Setting up your platform' },
];

export default function BusinessAuth({ onBack }: BusinessAuthProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    description: '',
    industry: '',
    ownerFirstName: user?.firstName || '',
    ownerLastName: user?.lastName || '',
    username: '',
    password: '',
    email: '',
    phone: '',
    website: '',
  });

  const [brandingInfo, setBrandingInfo] = useState<BrandingInfo>({
    logoUrl: '',
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    domainPath: '',
  });

  const [planSelection, setPlanSelection] = useState<PlanSelection>({
    planId: 0,
    billingCycle: 'monthly',
  });

  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Username availability checking
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    try {
      const res = await apiRequest('/api/auth/check-username', 'POST', { username });
      const data: { available: boolean } = await res.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  // Email availability checking
  const checkEmailAvailability = async (email: string) => {
    if (!email.includes('@')) return;
    try {
      const res = await apiRequest('/api/auth/check-email', 'POST', { email });
      const data: { available: boolean } = await res.json();
      setEmailAvailable(data.available);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // Domain path availability checking
  const checkDomainAvailability = async (domainPath: string) => {
    if (domainPath.length < 2) return;
    try {
      const response = await fetch(`/api/check-domain?domainPath=${encodeURIComponent(domainPath)}`);
      const data = await response.json();
      setDomainAvailable(data.available);
    } catch (error) {
      console.error('Error checking domain:', error);
    }
  };

  // Send email verification code
  const sendVerificationCode = async () => {
    try {
      const res = await apiRequest('/api/auth/send-verification', 'POST', { 
        email: businessInfo.email 
      });
      const data = await res.json();
      
      setVerificationSent(true);
      toast({
        title: 'Verification Code Sent',
        description: 'Please check your email for the verification code.',
      });
      return true;
    } catch (error: any) {
      console.error('Error sending verification:', error);
      
      // Extract user-friendly error message from server response
      let errorMessage = 'Unable to send verification code. Please try again.';
      
      try {
        // The error message format is "status: json_response"
        const errorText = error.message || '';
        if (errorText.includes(': {')) {
          // Extract JSON part after the status code
          const jsonPart = errorText.substring(errorText.indexOf(': ') + 2);
          const errorData = JSON.parse(jsonPart);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } else if (errorText.includes('wait')) {
          // Handle rate limiting messages
          errorMessage = errorText.includes(':') ? errorText.split(':')[1].trim() : errorText;
        }
      } catch (parseError) {
        // If JSON parsing fails, use a generic friendly message
        console.error('Could not parse error response:', parseError);
        errorMessage = 'Unable to send verification code. Please try again.';
      }
      
      toast({
        title: 'Failed to Send Code',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Verify email code
  const verifyEmailCode = async () => {
    try {
      const res = await apiRequest('/api/auth/verify-code', 'POST', { 
        email: businessInfo.email,
        code: verificationCode 
      });
      const data: { verified: boolean; message: string } = await res.json();
      
      if (data.verified) {
        setEmailVerified(true);
        toast({
          title: 'Email Verified',
          description: 'Your email has been successfully verified.',
        });
        setCurrentStep(3); // Move to Brand Setup
      }
      return data.verified;
    } catch (error: any) {
      console.error('Error verifying code:', error);
      
      // Extract user-friendly error message from server response
      let errorMessage = 'Please check your verification code and try again.';
      
      try {
        // The error message format is "status: json_response"
        const errorText = error.message || '';
        if (errorText.includes(': {')) {
          // Extract JSON part after the status code
          const jsonPart = errorText.substring(errorText.indexOf(': ') + 2);
          const errorData = JSON.parse(jsonPart);
          errorMessage = errorData.message || errorMessage;
        } else if (errorText.includes('message')) {
          // Fallback for different error formats
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (parseError) {
        // If JSON parsing fails, use a generic friendly message
        console.error('Could not parse error response:', parseError);
        errorMessage = 'Please check your verification code and try again.';
      }
      
      toast({
        title: 'Verification Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Auto-provision mutation
  const autoProvisionMutation = useMutation({
    mutationFn: async () => {
      console.log('Provision mutation called with:', { businessInfo, brandingInfo, planSelection });
      const result = await apiRequest('/api/business-auth/provision', 'POST', {
        businessInfo,
        brandingInfo,
        planSelection,
      });
      console.log('Provision result:', result);
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Business Setup Complete!',
        description: 'Your white-label platform has been successfully created.',
      });
      // Redirect will happen in the timeout handler
    },
    onError: (error) => {
      console.error('Auto-provision error:', error);
      setIsProcessing(false);
      toast({
        title: 'Setup Failed',
        description: 'There was an error setting up your business. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep);
    console.log('Current data state:', { businessInfo, brandingInfo, planSelection });
    
    // Step 1: Business Information -> Validate email and send verification
    if (currentStep === 1) {
      // Validate email is available and send verification code
      if (!businessInfo.email || !businessInfo.email.includes('@')) {
        toast({
          title: 'Email Required',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        });
        return;
      }
      
      if (emailAvailable !== true) {
        toast({
          title: 'Email Issue',
          description: 'Please use an available email address.',
          variant: 'destructive',
        });
        return;
      }
      
      // Send verification code and move to step 2
      const codeSent = await sendVerificationCode();
      if (codeSent) {
        setCurrentStep(2);
      }
      return;
    }
    
    // Step 2: Email Verification -> Already handled in verifyEmailCode function
    if (currentStep === 2) {
      if (verificationCode.length !== 6) {
        toast({
          title: 'Verification Code Required',
          description: 'Please enter the 6-digit verification code.',
          variant: 'destructive',
        });
        return;
      }
      await verifyEmailCode();
      return; // verifyEmailCode will handle moving to step 3 if successful
    }
    
    if (currentStep === 4) {
      console.log('Starting setup process...');
      console.log('Data validation check:');
      console.log('- businessInfo:', businessInfo);
      console.log('- brandingInfo:', brandingInfo);
      console.log('- planSelection:', planSelection);
      
      setIsProcessing(true);
      // Simple 5-second setup animation then redirect to dashboard
      setTimeout(async () => {
        console.log('5 seconds elapsed, calling provision API...');
        console.log('About to call autoProvisionMutation.mutateAsync()');
        try {
          const result = await autoProvisionMutation.mutateAsync();
          console.log('Provision successful:', result);
          // Redirect to white label client dashboard
          setTimeout(() => {
            console.log('Redirecting to dashboard...');
            setLocation('/');
          }, 500);
        } catch (error) {
          console.error('Setup error:', error);
          console.error('Full error object:', error);
          setIsProcessing(false);
          toast({
            title: 'Setup Failed',
            description: `Error: ${(error as Error).message || 'Unknown error occurred'}`,
            variant: 'destructive',
          });
        }
      }, 5000);
      return;
    }

    if (currentStep < 4) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessInfo(prev => ({ ...prev, businessName: value }));
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.logoUrl) {
        setBrandingInfo(prev => ({ ...prev, logoUrl: result.logoUrl }));
        toast({
          title: 'Logo Uploaded',
          description: 'Your logo has been successfully uploaded.',
        });
      } else {
        throw new Error('No logo URL returned');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return businessInfo.businessName && businessInfo.ownerFirstName && businessInfo.ownerLastName && 
               businessInfo.username && businessInfo.password && businessInfo.email && 
               usernameAvailable === true && emailAvailable === true;
      case 2:
        // Allow verification attempt when code is 6 digits, not when already verified
        return verificationCode.length === 6;
      case 3:
        return brandingInfo.domainPath && brandingInfo.primaryColor && domainAvailable === true;
      case 4:
        return true; // Step 4 is always ready - it's just the setup process
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Business Platform</h1>
          <p className="text-gray-600">Set up your white-label business in 4 simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isStepComplete(step.id) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.businessName}
                      onChange={(e) => handleBusinessNameChange(e.target.value)}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={businessInfo.industry} onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      value={businessInfo.description}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your business"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ownerFirstName">Owner First Name *</Label>
                    <Input
                      id="ownerFirstName"
                      value={businessInfo.ownerFirstName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, ownerFirstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerLastName">Owner Last Name *</Label>
                    <Input
                      id="ownerLastName"
                      value={businessInfo.ownerLastName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, ownerLastName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        value={businessInfo.username}
                        onChange={(e) => {
                          setBusinessInfo(prev => ({ ...prev, username: e.target.value }));
                          checkUsernameAvailability(e.target.value);
                        }}
                        required
                        className="border border-input pr-20"
                        placeholder="username"
                      />
                      {usernameAvailable !== null && (
                        <div className={`absolute right-2 top-2 text-sm ${usernameAvailable ? 'text-primary' : 'text-destructive'}`}>
                          {usernameAvailable ? '✓ Available' : '✗ Username already in use'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={businessInfo.password}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => {
                          setBusinessInfo(prev => ({ ...prev, email: e.target.value }));
                          checkEmailAvailability(e.target.value);
                        }}
                        className="border border-input pr-20"
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                      {emailAvailable !== null && (
                        <div className={`absolute right-2 top-2 text-sm ${emailAvailable ? 'text-primary' : 'text-destructive'}`}>
                          {emailAvailable ? '✓ Available' : '✗ Email already in use'}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Email Verification */}
            {currentStep === 2 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verify Your Email Address</h3>
                  <p className="text-gray-600">
                    We've sent a 6-digit verification code to:
                    <br />
                    <span className="font-medium">{businessInfo.email}</span>
                  </p>
                </div>
                
                <div className="max-w-xs mx-auto space-y-4">
                  <div>
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="123456"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                      data-testid="input-verification-code"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="outline"
                    onClick={sendVerificationCode}
                    disabled={!verificationSent}
                    data-testid="button-resend-code"
                  >
                    Resend Code
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Brand Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="logoUpload">Business Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('logoUpload')?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                        {brandingInfo.logoUrl && (
                          <img
                            src={brandingInfo.logoUrl}
                            alt="Business Logo"
                            className="w-12 h-12 object-contain rounded"
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="domainPath">Domain Path *</Label>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">whitelabelportal.com/</span>
                        <div className="relative flex-1">
                          <Input
                            id="domainPath"
                            value={brandingInfo.domainPath}
                            onChange={(e) => {
                              const cleanPath = e.target.value.replace(/[^a-z0-9]/g, '');
                              setBrandingInfo(prev => ({ ...prev, domainPath: cleanPath }));
                              checkDomainAvailability(cleanPath);
                            }}
                            placeholder="businessname"
                            className="pr-20"
                          />
                          {domainAvailable !== null && (
                            <div className={`absolute right-2 top-2 text-sm ${domainAvailable ? 'text-primary' : 'text-destructive'}`}>
                              {domainAvailable ? '✓ Available' : '✗ Taken'}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">This will be your custom URL path</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Brand Color *</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={brandingInfo.primaryColor}
                          onChange={(e) => setBrandingInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                          className="w-12 h-12 p-1 border-2"
                        />
                        <Input
                          value={brandingInfo.primaryColor}
                          onChange={(e) => setBrandingInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                          placeholder="#667eea"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={brandingInfo.secondaryColor}
                          onChange={(e) => setBrandingInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          className="w-12 h-12 p-1 border-2"
                        />
                        <Input
                          value={brandingInfo.secondaryColor}
                          onChange={(e) => setBrandingInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                          placeholder="#764ba2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Brand Preview</h3>
                  <div
                    className="h-24 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${brandingInfo.primaryColor} 0%, ${brandingInfo.secondaryColor} 100%)`
                    }}
                  >
                    {businessInfo.businessName || 'Your Business Name'}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Auto-Provision */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-primary-foreground animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Setting up your platform...</h3>
                  <p className="text-gray-600">
                    We're creating your white-label platform with custom templates, 
                    product collections, and initial announcements.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <h4 className="font-medium mb-3">What we're setting up:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Custom domain configuration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Brand-customized templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Product collections and categories</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Welcome announcements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Affiliate program setup</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isProcessing}
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete(currentStep) || isProcessing}
            className="flex items-center gap-2"
            data-testid="button-next"
          >
            {currentStep === 4 ? (
              isProcessing ? "Setting up..." : "Complete Setup"
            ) : currentStep === 2 ? (
              "Verify Code"
            ) : (
              "Next"
            )}
            {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}