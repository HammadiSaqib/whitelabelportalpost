import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Users,
  Crown,
  Target,
  TrendingUp,
  Award
} from "lucide-react";
import EndUserSignup from "@/components/EndUserSignup";
import WhiteLabelAffiliateSignup from "@/components/WhiteLabelAffiliateSignup";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showEndUserSignup, setShowEndUserSignup] = useState(false);
  const [showWhiteLabelAffiliateSignup, setShowWhiteLabelAffiliateSignup] = useState(false);
  const [whitelabelId, setWhitelabelId] = useState<string | null>(null);
  const [signupRole, setSignupRole] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  // Check for whitelabel_id and role parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const whitelabel = params.get('whitelabel_id');
    const role = params.get('role');
    console.log('🔍 LOGIN DEBUG - whitelabel_id from URL:', whitelabel);
    console.log('🔍 LOGIN DEBUG - role from URL:', role);
    if (whitelabel) {
      setWhitelabelId(whitelabel);
      console.log('✅ Set whitelabelId state to:', whitelabel);
    }
    if (role) {
      setSignupRole(role);
      console.log('✅ Set signupRole state to:', role);
      
      // Auto-enable white label affiliate signup if both role and whitelabel_id are present
      if (role === 'affiliate' && whitelabel) {
        setShowWhiteLabelAffiliateSignup(true);
        console.log('✅ Auto-enabled white label affiliate signup');
      }
    }
  }, []);

  const demoUsers = [
    {
      role: "Super Admin",
      email: "admin@whitelabelpro.com",
      password: "SuperAdmin123!",
      description: "Full platform control and management",
      icon: Shield,
      color: "bg-blue-600"
    },
    {
      role: "Super Admin Affiliate",
      email: "affiliate@whitelabelpro.com", 
      password: "Affiliate123!",
      description: "Promote clients and earn commissions",
      icon: TrendingUp,
      color: "bg-purple-600"
    },
    {
      role: "White-Label Client",
      email: "client@whitelabelpro.com",
      password: "Client123!",
      description: "Manage your branded platform",
      icon: Users,
      color: "bg-green-600"
    },
    {
      role: "White-Label Affiliate", 
      email: "wlaffiliate@whitelabelpro.com",
      password: "WLAffiliate123!",
      description: "Promote client offerings to end users",
      icon: Target,
      color: "bg-yellow-600"
    },
    {
      role: "End User",
      email: "user@whitelabelpro.com",
      password: "EndUser123!",
      description: "Access client portal features",
      icon: Award,
      color: "bg-gray-600"
    }
  ];

  const handleRoleSelect = (user: any) => {
    setSelectedRole(user.role);
    setCredentials({
      email: user.email,
      password: user.password
    });
    // Store selected role for dashboard routing
    sessionStorage.setItem('selectedRole', user.role);
  };

  const handleLogin = async () => {
    // Check if this is a demo user
    const demoUser = demoUsers.find(user => user.email === credentials.email);
    
    if (demoUser && credentials.password === demoUser.password) {
      // For demo users, use the demo-login endpoint
      try {
        const response = await fetch('/api/auth/demo-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            role: selectedRole
          })
        });
        
        if (response.ok) {
          window.location.href = "/";
        } else {
          // Fallback to regular login
          await handleRegularLogin();
        }
      } catch (error) {
        // Fallback to regular login
        await handleRegularLogin();
      }
    } else {
      // Regular users go through normal login
      await handleRegularLogin();
    }
  };

  const handleRegularLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = "/";
      } else {
        // Show error message
        console.error('Login failed:', data.error);
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Show white label affiliate signup if role=affiliate and whitelabel_id is present
  if (showWhiteLabelAffiliateSignup && whitelabelId && signupRole === 'affiliate') {
    console.log('✅ Rendering WhiteLabelAffiliateSignup component');
    return <WhiteLabelAffiliateSignup onBack={() => setShowWhiteLabelAffiliateSignup(false)} whiteLabelId={parseInt(whitelabelId)} />;
  }

  // Show end-user signup if whitelabel_id is present and user clicked signup
  console.log('🔍 LOGIN RENDER CHECK:', { showEndUserSignup, whitelabelId, signupRole });
  
  if (showEndUserSignup && whitelabelId) {
    console.log('✅ Rendering EndUserSignup component');
    return <EndUserSignup onBack={() => setShowEndUserSignup(false)} domainPath={whitelabelId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">WhiteLabel Pro</h1>
                <p className="text-xs text-gray-500">Multi-Tier Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/pricing"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Pricing
              </Button>
              <Button 
                variant="ghost"
                onClick={() => window.location.href = "/contact"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Left Side - Demo Users */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-8">
          <div className="w-full max-w-md mx-auto flex flex-col justify-center">
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Demo Access</h2>
              <p className="text-blue-100 leading-relaxed">
                Choose any role below to automatically fill in the login credentials and experience the platform from different perspectives.
              </p>
            </div>

            <div className="space-y-4">
              {demoUsers.map((user, index) => {
                const IconComponent = user.icon;
                return (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 shadow-lg ${
                      selectedRole === user.role ? 'ring-2 ring-white' : ''
                    }`}
                    onClick={() => handleRoleSelect(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${user.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{user.role}</h3>
                          <p className="text-gray-600 text-xs">{user.description}</p>
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">Email: {user.email}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-white text-sm text-center">
                💡 Click any role above to auto-fill the login form with demo credentials
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your WhiteLabel Pro account</p>
              {selectedRole && (
                <Badge className="mt-3 bg-blue-100 text-blue-700">
                  Logging in as: {selectedRole}
                </Badge>
              )}
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        value={credentials.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div>

                  <Button 
                    type="button"
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-3">
                    <Button 
                      onClick={handleLogin}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 p-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                    <Button 
                      onClick={handleLogin}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 p-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Button>
                    <Button 
                      onClick={handleLogin}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 p-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </Button>
                    <Button 
                      onClick={handleLogin}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300 p-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    {whitelabelId && signupRole === 'affiliate' ? (
                      <button
                        onClick={() => {
                          console.log('📝 Sign up button clicked for white label affiliate, whitelabelId:', whitelabelId);
                          setShowWhiteLabelAffiliateSignup(true);
                        }}
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                        data-testid="button-signup-whitelabelaffiliate"
                      >
                        Sign up
                      </button>
                    ) : whitelabelId ? (
                      <button
                        onClick={() => {
                          console.log('📝 Sign up button clicked, whitelabelId:', whitelabelId, 'signupRole:', signupRole);
                          // Check if this is an affiliate signup (role=affiliate&whitelabel_id present)
                          if (signupRole === 'affiliate' && whitelabelId) {
                            console.log('✅ Detected affiliate signup - showing WhiteLabelAffiliateSignup');
                            setShowWhiteLabelAffiliateSignup(true);
                          } else {
                            console.log('✅ Detected end-user signup - showing EndUserSignup');
                            setShowEndUserSignup(true);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-500 font-medium underline"
                        data-testid="button-signup-enduser"
                      >
                        Sign up
                      </button>
                    ) : (
                      <a href="/become-affiliate" className="text-blue-600 hover:text-blue-500 font-medium">
                        Sign up here
                      </a>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Demo Users */}
            <div className="lg:hidden mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Accounts</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {demoUsers.map((user, index) => {
                      const IconComponent = user.icon;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => handleRoleSelect(user)}
                          className={`justify-start p-3 h-auto ${
                            selectedRole === user.role ? 'bg-blue-50 border border-blue-200' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 ${user.color} rounded-lg flex items-center justify-center mr-3`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{user.role}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}