import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff, Upload, X, Loader2, CheckCircle } from 'lucide-react';

interface WhiteLabelAffiliateFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  referralUrl?: string;
  profileImage?: File;
  whiteLabelId: number;
}

interface WhiteLabelAffiliateSignupProps {
  onBack: () => void;
  whiteLabelId: number;
}

export default function WhiteLabelAffiliateSignup({ onBack, whiteLabelId }: WhiteLabelAffiliateSignupProps) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Information, 2: Email Verification
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [whiteLabelDomainPath, setWhiteLabelDomainPath] = useState<string>('');
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<WhiteLabelAffiliateFormData>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    referralUrl: '',
    profileImage: undefined,
    whiteLabelId
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Fetch white label details to get domainPath
  useEffect(() => {
    const fetchWhiteLabelDetails = async () => {
      try {
        const response = await apiRequest(`/api/white-labels/by-id/${whiteLabelId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setWhiteLabelDomainPath(data.domainPath || '');
        }
      } catch (error) {
        console.error('Error fetching white label details:', error);
      }
    };
    
    fetchWhiteLabelDetails();
  }, [whiteLabelId]);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    try {
      const response = await apiRequest('/api/auth/check-username', 'POST', { username });
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  // Check email availability
  const checkEmailAvailability = async (email: string) => {
    if (!email.includes('@')) {
      setEmailAvailable(null);
      return;
    }
    
    try {
      const response = await apiRequest('/api/auth/check-email', 'POST', { email });
      const data = await response.json();
      setEmailAvailable(data.available);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof WhiteLabelAffiliateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Check availability for username and email
    if (field === 'username') {
      checkUsernameAvailability(value);
    } else if (field === 'email') {
      checkEmailAvailability(value);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    setFormData(prev => ({ ...prev, profileImage: file }));
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (usernameAvailable === false) {
      newErrors.username = 'Username is not available';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    } else if (emailAvailable === false) {
      newErrors.email = 'Email is already in use';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send verification code
  const sendVerificationCode = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/auth/send-verification', 'POST', { 
        email: formData.email 
      });
      
      if (response.ok) {
        setVerificationSent(true);
        setCurrentStep(2);
        toast({
          title: 'Verification Code Sent',
          description: 'Please check your email for the verification code.',
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send verification code');
      }
    } catch (error: any) {
      toast({
        title: 'Failed to Send Code',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for step 1
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await sendVerificationCode();
  };

  // Handle signup completion
  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      toast({
        title: 'Verification Code Required',
        description: 'Please enter the 6-digit verification code.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('username', formData.username);
      submitData.append('password', formData.password);
      submitData.append('email', formData.email);
      submitData.append('verificationCode', verificationCode);
      submitData.append('role', 'white_label_affiliate');
      submitData.append('whiteLabelId', whiteLabelId.toString());
      
      if (formData.referralUrl) {
        submitData.append('referralUrl', formData.referralUrl);
      }
      
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }

      const response = await fetch('/api/auth/signup-white-label-affiliate', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: 'Account Created Successfully!',
          description: 'Welcome to the affiliate program. You are now logged in.',
        });

        // Redirect to white label affiliate dashboard
        setTimeout(() => {
          window.location.href = `/${whiteLabelDomainPath}/affiliate`;
        }, 1500);
      } else {
        const data = await response.json();
        
        // Check if it's a verification error and show specific message
        if (data.message && data.message.includes('Incorrect verification code')) {
          throw new Error('Incorrect Verification Code');
        } else if (data.message && data.message.includes('verification code')) {
          throw new Error(data.message);
        } else {
          throw new Error(data.error || data.message || 'Failed to create account');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code
  const resendVerificationCode = async () => {
    await sendVerificationCode();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign up As {whiteLabelDomainPath ? `"${whiteLabelDomainPath}"` : 'White Label'} Affiliate
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {currentStep === 1 
                  ? "Join our affiliate program and start earning commissions"
                  : "Verify your email to complete registration"
                }
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Information */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                      placeholder="John"
                      data-testid="input-firstName"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                      placeholder="Doe"
                      data-testid="input-lastName"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                      className={`pr-20 ${
                        errors.username 
                          ? "border-red-500" 
                          : usernameAvailable === true 
                          ? "border-green-500" 
                          : ""
                      }`}
                      placeholder="username"
                      style={{ textTransform: 'lowercase' }}
                      data-testid="input-username"
                    />
                    {usernameAvailable !== null && (
                      <div className={`absolute right-2 top-2 text-sm ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameAvailable ? '✓ Available' : '✗ Taken'}
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                      placeholder="Enter your password"
                      data-testid="input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pr-20 ${
                        errors.email 
                          ? "border-red-500" 
                          : emailAvailable === true 
                          ? "border-green-500" 
                          : ""
                      }`}
                      placeholder="your@email.com"
                      data-testid="input-email"
                    />
                    {emailAvailable !== null && (
                      <div className={`absolute right-2 top-2 text-sm ${emailAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {emailAvailable ? '✓ Available' : '✗ In use'}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Referral URL (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="referralUrl">Your Referral URL (Optional)</Label>
                  <Input
                    id="referralUrl"
                    type="url"
                    value={formData.referralUrl}
                    onChange={(e) => handleInputChange('referralUrl', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    data-testid="input-referralUrl"
                  />
                </div>

                {/* Profile Image Upload (Optional) */}
                <div className="space-y-2">
                  <Label>Profile Image (Optional)</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.profileImage ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={URL.createObjectURL(formData.profileImage)}
                            alt="Profile preview"
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-600">{formData.profileImage.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, profileImage: undefined }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Drag and drop your image here, or{' '}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    data-testid="button-back"
                  >
                    Back to Login
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading || usernameAvailable === false || emailAvailable === false}
                    data-testid="button-continue"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      'Continue'
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: Email Verification */}
            {currentStep === 2 && (
              <form onSubmit={handleSignupComplete} className="space-y-6">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Verify Your Email Address</h3>
                    <p className="text-gray-600">
                      We've sent a 6-digit verification code to:
                      <br />
                      <span className="font-medium">{formData.email}</span>
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
                        data-testid="input-verificationCode"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Didn't receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resendVerificationCode}
                      disabled={loading}
                      data-testid="button-resend"
                    >
                      Resend Code
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    disabled={loading}
                    data-testid="button-back-step2"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading || verificationCode.length !== 6}
                    data-testid="button-signup"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Signup'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
