import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Eye, 
  EyeOff,
  Check,
  X,
  Loader2
} from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import BusinessAuthComponent from "../components/BusinessAuth";
import AffiliateSignup from "../components/AffiliateSignup";
import EndUserSignup from "../components/EndUserSignup";
import WhiteLabelAffiliateSignup from "../components/WhiteLabelAffiliateSignup";

interface AuthFormData {
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
}

interface UsernameCheckResponse {
  available: boolean;
  existingRole?: string;
  message: string;
  checking?: boolean;
}

type AuthView = 'login' | 'signup' | 'businessSignup' | 'endUserSignup' | 'whiteLabelAffiliateSignup';

export default function Auth() {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameCheckResponse | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    firstName: "",
    lastName: "",
    username: "",
    password: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [location] = useLocation();

  // Get context from URL parameters
  const getContext = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('context');
  })();

  // Check if this is affiliate signup based on URL parameters or context
  const isAffiliateSignup = (() => {
    return getContext === 'affiliate' || location.includes('/become-affiliate');
  })();

  // Check if this is white-label client signup based on context
  const isWhiteLabelSignup = (() => {
    return getContext && getContext.startsWith('client_');
  })();

  // Get automatic role based on context
  const getAutoRole = () => {
    if (isAffiliateSignup) {
      return "super_admin_affiliate";
    }
    if (isWhiteLabelSignup) {
      return "end_user";
    }
    // For domain-based users, role will be determined on backend
    return "auto_detect";
  };

  // Auto-enable white label affiliate signup when URL has role=affiliate&whitelabel_id
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    const whiteLabelId = urlParams.get('whitelabel_id');
    
    if (role === 'affiliate' && whiteLabelId) {
      console.log('✅ Auto-enabling white label affiliate signup view');
      setView('whiteLabelAffiliateSignup');
    }
  }, []);

  // Get white-label client info for display
  const getWhiteLabelInfo = () => {
    if (isWhiteLabelSignup && getContext) {
      const clientId = getContext.replace('client_', '');
      return { clientId };
    }
    return null;
  };

  // State for auto-logout loading
  const [autoLogoutLoading, setAutoLogoutLoading] = useState(true);

  // Auto-logout if user is already authenticated
  useEffect(() => {
    const autoLogout = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          // User is logged in, logout them first
          console.log('🔄 User already logged in, logging out before showing auth page...');
          await fetch('/api/logout', { method: 'POST' });
          console.log('✅ Auto-logout complete');
          // Small delay to ensure logout completes
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.log('No active session or error checking auth status');
      } finally {
        setAutoLogoutLoading(false);
      }
    };
    
    autoLogout();
  }, []); // Run once on component mount

  // Process whitelabel_id from URL parameters and store domainPath
  // Watch for URL changes to ensure stale values are cleared
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const whiteLabelId = urlParams.get('whitelabel_id');
    
    // Strict validation: whitelabel_id must be a pure positive integer (only digits)
    const isValidId = whiteLabelId && /^\d+$/.test(whiteLabelId);
    const parsedId = isValidId ? Number(whiteLabelId) : NaN;
    
    if (isValidId && parsedId > 0) {
      // Store the whitelabel_id for passing to backend during login
      sessionStorage.setItem('authWhiteLabelId', whiteLabelId);
      
      // Fetch white label info and store domainPath for post-login redirect
      const fetchWhiteLabelInfo = async () => {
        try {
          const response = await fetch(`/api/white-labels/by-id/${whiteLabelId}`);
          if (response.ok) {
            const whiteLabelData = await response.json();
            if (whiteLabelData.domainPath) {
              // Store the domainPath for post-login redirect
              sessionStorage.setItem('authDomain', whiteLabelData.domainPath);
              // Set default intent to 'user' if not already set
              if (!sessionStorage.getItem('authIntent')) {
                sessionStorage.setItem('authIntent', 'user');
              }
            }
          }
        } catch (error) {
          console.error('Error fetching white label info:', error);
        }
      };
      
      fetchWhiteLabelInfo();
    } else {
      // Clear stale whitelabel_id if user accesses /auth without query parameter or with invalid ID
      sessionStorage.removeItem('authWhiteLabelId');
      sessionStorage.removeItem('authDomain');
      sessionStorage.removeItem('authIntent');
      if (whiteLabelId) {
        console.log('🧹 Cleared authWhiteLabelId - invalid whitelabel_id in URL:', whiteLabelId);
      } else {
        console.log('🧹 Cleared stale authWhiteLabelId - no whitelabel_id in URL');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]); // Re-run when URL query string changes

  // Username availability check
  useEffect(() => {
    if (view === 'signup' && formData.username && formData.username.length >= 3) {
      const timeoutId = setTimeout(async () => {
        setUsernameLoading(true);
        try {
          const response = await fetch("/api/auth/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: formData.username,
              context: getContext || 'domain'
            })
          });
          const data = await response.json();
          setUsernameStatus(data);
        } catch (error: any) {
          setUsernameStatus({
            available: false,
            message: "Error checking username availability"
          });
        } finally {
          setUsernameLoading(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setUsernameStatus(null);
    }
  }, [formData.username, view, isAffiliateSignup]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const checkUsername = async (username: string) => {
    if (!username.trim()) {
      setUsernameStatus({ available: false, message: "", checking: false });
      return;
    }

    setUsernameStatus({ available: false, message: "", checking: true });

    try {
      const response = await fetch("/api/auth/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.toLowerCase() }),
      });

      const data = await response.json();
      
      if (data.available) {
        setUsernameStatus({
          available: true,
          message: "Username is available!",
          checking: false,
        });
      } else {
        setUsernameStatus({
          available: false,
          message: data.message || "Username is not available",
          checking: false,
        });
      }
    } catch (error) {
      setUsernameStatus({
        available: false,
        message: "Error checking username availability",
        checking: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (view === 'signup') {
      if (!formData.firstName || formData.firstName.length < 2) {
        newErrors.firstName = "First name must be at least 2 characters";
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
      }
    }

    // Validate username/email field based on view
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = view === 'login' 
        ? "Please enter your email or username (minimum 3 characters)"
        : "Username must be at least 3 characters";
    } else if (view === 'signup') {
      // Only apply strict username validation during signup
      if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores";
      }
    }
    // For login view, allow both emails and usernames (no regex restriction)

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Check username availability for signup only
    if (view === 'signup' && usernameStatus && !usernameStatus.available) {
      newErrors.username = usernameStatus.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (view === 'login') {
        // Login - Include whitelabel_id if present
        const authWhiteLabelId = sessionStorage.getItem('authWhiteLabelId');
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            whitelabel_id: authWhiteLabelId || undefined
          })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          toast({
            title: "Login Successful",
            description: "Welcome back!",
          });
          
          // Check for stored auth intent and redirect accordingly
          const authIntent = sessionStorage.getItem('authIntent');
          const authDomain = sessionStorage.getItem('authDomain');
          
          // Clear auth-related sessionStorage to prevent stale values
          sessionStorage.removeItem('authWhiteLabelId');
          sessionStorage.removeItem('authIntent');
          sessionStorage.removeItem('authDomain');
          
          if (authIntent && authDomain) {
            // Redirect to domain-specific dashboard
            if (authIntent === 'affiliate') {
              window.location.href = `/${authDomain}/affiliate`;
            } else {
              window.location.href = `/${authDomain}/user`;
            }
          } else {
            // Default redirect to main page
            window.location.href = "/";
          }
        } else {
          throw new Error(data.error || "Login failed");
        }
      } else {
        // Signup - Include whitelabel_id if present
        const authWhiteLabelId = sessionStorage.getItem('authWhiteLabelId');
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            password: formData.password,
            role: getAutoRole(),
            context: getContext || 'domain',
            whitelabel_id: authWhiteLabelId || undefined
          })
        });
        const data = await response.json();

        if (response.ok && data.success) {
          toast({
            title: "Account Created",
            description: "Welcome to WhiteLabel Pro!",
          });
          
          // Check for stored auth intent and redirect accordingly
          const authIntent = sessionStorage.getItem('authIntent');
          const authDomain = sessionStorage.getItem('authDomain');
          
          // Clear auth-related sessionStorage to prevent stale values
          sessionStorage.removeItem('authWhiteLabelId');
          sessionStorage.removeItem('authIntent');
          sessionStorage.removeItem('authDomain');
          
          if (authIntent && authDomain) {
            // Redirect to domain-specific dashboard
            if (authIntent === 'affiliate') {
              window.location.href = `/${authDomain}/affiliate`;
            } else {
              window.location.href = `/${authDomain}/user`;
            }
          } else {
            // Default redirect to main page
            window.location.href = "/";
          }
        } else {
          throw new Error(data.error || "Failed to create account");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const contextParam = getContext || 'domain';
    const urlParams = new URLSearchParams(window.location.search);
    const whiteLabelId = urlParams.get('whitelabel_id');
    
    let authUrl = `/api/auth/google`;
    const params = new URLSearchParams();
    
    if (view !== 'login') {
      params.set('role', getAutoRole());
      params.set('context', contextParam);
    }
    
    // Pass whitelabel_id to Google OAuth only if it's a valid positive integer
    if (whiteLabelId) {
      const isValidId = /^\d+$/.test(whiteLabelId);
      const parsedId = isValidId ? Number(whiteLabelId) : NaN;
      
      if (isValidId && parsedId > 0) {
        params.set('whitelabel_id', whiteLabelId);
      } else {
        console.warn('Invalid whitelabel_id in Google OAuth:', whiteLabelId);
      }
    }
    
    if (params.toString()) {
      authUrl += `?${params.toString()}`;
    }
    
    window.location.href = authUrl;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });

      // Always show success message regardless of backend response
      // This prevents email enumeration attacks
      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, we've sent password reset instructions.",
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      
      // Log actual errors to console for debugging (not visible to user)
      if (!response.ok) {
        const data = await response.json();
        console.error('Password reset error:', data.error || 'Failed to send reset email');
      }
    } catch (error: any) {
      // Still show success message even on network errors
      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, we've sent password reset instructions.",
      });
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
      
      // Log actual errors to console for debugging
      console.error('Password reset network error:', error.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const getUsernameStatusIcon = () => {
    // Only show username availability icons during signup
    if (view !== 'signup') {
      return null;
    }
    
    if (usernameLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    }
    if (usernameStatus?.available) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (usernameStatus && !usernameStatus.available) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  // Get role display info for signup context
  const getRoleDisplayInfo = () => {
    if (isAffiliateSignup) {
      return {
        title: "Join as Super Admin Affiliate",
        description: "Promote our white-label platform and earn substantial commissions"
      };
    }
    if (isWhiteLabelSignup) {
      const whiteLabelInfo = getWhiteLabelInfo();
      return {
        title: "Create Your Account",
        description: `Join as an End-User and get access to exclusive content and services`
      };
    }
    return {
      title: view === 'login' ? "Welcome Back" : "Create Account", 
      description: view === 'login' ? "Sign in to your account" : "Join our platform today"
    };
  };

  const roleDisplayInfo = getRoleDisplayInfo();

  // Render business signup component
  if (view === 'businessSignup') {
    return <BusinessAuthComponent onBack={() => setView('login')} />;
  }

  // Render affiliate signup component
  if (view === 'signup' && isAffiliateSignup) {
    return <AffiliateSignup onBack={() => setView('login')} />;
  }

  // Render end-user signup component (for white-label domains)
  if (view === 'endUserSignup') {
    const domainPath = sessionStorage.getItem('authDomain') || '';
    return <EndUserSignup onBack={() => setView('login')} domainPath={domainPath} />;
  }

  // Render white label affiliate signup component (for role=affiliate&whitelabel_id=X)
  if (view === 'whiteLabelAffiliateSignup') {
    const urlParams = new URLSearchParams(window.location.search);
    const whiteLabelId = urlParams.get('whitelabel_id');
    
    // Strict validation: whitelabel_id must be a pure positive integer (only digits)
    const isValidId = whiteLabelId && /^\d+$/.test(whiteLabelId);
    const parsedId = isValidId ? Number(whiteLabelId) : NaN;
    
    if (isValidId && parsedId > 0) {
      return <WhiteLabelAffiliateSignup onBack={() => setView('login')} whiteLabelId={parsedId} />;
    } else {
      // Show error if whitelabel_id is missing or invalid
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="shadow-xl border-0 w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Alert className="mb-4">
                <AlertDescription>
                  Invalid affiliate signup link. The white label ID is {whiteLabelId ? 'invalid' : 'missing'}.
                </AlertDescription>
              </Alert>
              <Button onClick={() => setView('login')}>Back to Login</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Show loading while checking/logging out existing session
  if (autoLogoutLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="shadow-xl border-0 w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 text-center">Please wait, logging you out first...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4 pb-6">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {roleDisplayInfo.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {roleDisplayInfo.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields (Signup only) */}
              {view === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Email or Username */}
              <div className="space-y-2">
                <Label htmlFor="username">{view === 'login' ? 'Email, Username' : 'Username (lowercase only)'}</Label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      // For login, allow both email and username without forcing lowercase
                      // For signup, still force lowercase for username
                      const value = view === 'login' ? e.target.value : e.target.value.toLowerCase();
                      handleInputChange("username", value);
                    }}
                    className={`pr-10 ${
                      errors.username 
                        ? "border-red-500" 
                        : (view === 'signup' && usernameStatus?.available) 
                        ? "border-green-500" 
                        : ""
                    }`}
                    placeholder={view === 'login' ? "Enter your email or username" : "Enter your username (lowercase)"}
                    style={view === 'login' ? {} : { textTransform: 'lowercase' }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {getUsernameStatusIcon()}
                  </div>
                </div>
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
                {!errors.username && view === 'signup' && usernameStatus?.available && (
                  <p className="text-sm text-green-600">Username is available!</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="Enter your password"
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

              {/* Forgot Password Link (Login only) */}
              {view === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forget Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading || (usernameLoading && view === 'signup')}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {view === 'login' ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  view === 'login' ? "Sign In" : "Create Account"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Auth */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleAuth}
            >
              <SiGoogle className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            {/* Toggle Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  if (view === 'login') {
                    // Check for whitelabel_id and role in URL to determine signup type
                    const urlParams = new URLSearchParams(window.location.search);
                    const whiteLabelId = urlParams.get('whitelabel_id');
                    const role = urlParams.get('role');
                    
                    // Check if this is a white label affiliate signup (role=affiliate&whitelabel_id=X)
                    if (role === 'affiliate' && whiteLabelId) {
                      console.log('✅ Detected white label affiliate signup');
                      setView('whiteLabelAffiliateSignup');
                    } else if (whiteLabelId || sessionStorage.getItem('authWhiteLabelId')) {
                      // End-user signup for white-label domains
                      setView('endUserSignup');
                    } else if (isAffiliateSignup) {
                      // Affiliate signup
                      setView('signup');
                    } else {
                      // Business signup (default)
                      setView('businessSignup');
                    }
                  } else {
                    const newView = view === 'signup' ? 'login' : 'login';
                    setView(newView);
                    setErrors({});
                    setUsernameStatus(null);
                    setFormData({
                      firstName: "",
                      lastName: "",
                      username: "",
                      password: ""
                    });
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {view === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                data-testid="input-forgot-password-email"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                }}
                className="flex-1"
                data-testid="button-cancel-forgot-password"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={forgotPasswordLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                data-testid="button-send-reset-link"
              >
                {forgotPasswordLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}