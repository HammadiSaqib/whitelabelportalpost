import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useRoleContext } from "@/components/RoleProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Filter, Eye, UserCheck, UserX, User, Calendar, MoreHorizontal, Menu, Users, Activity, DollarSign, ShoppingCart, TrendingUp, Clock, LogIn, Plus, Mail, Upload, Download, FileText } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function UsersPage() {
  const { user } = useAuth();
  const { canManageUsers } = useRoleContext();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: ''
  });
  
  // Invitation state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTab, setInviteTab] = useState("single");
  const [singleInviteForm, setSingleInviteForm] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isProcessingInvites, setIsProcessingInvites] = useState(false);
  
  const selectedRole = (user as any)?.role;

  // Check if user has access to Users section
  if (!canManageUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833-.73 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            You don't have permission to access user management.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fetch white label data
  const { data: whiteLabelData } = useQuery({
    queryKey: ['/api/admin/white-label'],
  });

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ['/api/admin/user-stats'],
  });

  // Fetch users list
  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ['/api/admin/users'],
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache the data
  });

  // Test endpoint for comparison
  const { data: testUsers } = useQuery({
    queryKey: ['/api/test-admin-users-exact'],
    staleTime: 0,
    cacheTime: 0,
  });

  // Debug logging
  console.log('🔍 UsersPage Debug - Raw users data:', users);
  console.log('🔍 UsersPage Debug - Test users data:', testUsers);
  console.log('🔍 UsersPage Debug - Is users an array?', Array.isArray(users));
  console.log('🔍 UsersPage Debug - Is testUsers an array?', Array.isArray(testUsers));
  console.log('🔍 UsersPage Debug - Users type:', typeof users);
  if (users) {
    console.log('🔍 UsersPage Debug - Users length:', users.length);
    console.log('🔍 UsersPage Debug - First user:', users[0]);
  }
  if (testUsers) {
    console.log('🔍 UsersPage Debug - Test users length:', testUsers.length);
    console.log('🔍 UsersPage Debug - First test user:', testUsers[0]);
  }

  // Fetch user activities
  const { data: userActivities } = useQuery({
    queryKey: [`/api/admin/user-activities/${selectedUser?.id}`],
    enabled: !!selectedUser?.id,
  });

  // Fetch user purchases
  const { data: userPurchases } = useQuery({
    queryKey: [`/api/admin/user-purchases/${selectedUser?.id}`],
    enabled: !!selectedUser?.id,
  });

  // Impersonate user mutation
  const impersonateUserMutation = useMutation({
    mutationFn: (userData: any) => apiRequest('/api/admin/impersonate-user', 'POST', userData),
    onSuccess: (data) => {
      setImpersonatedUser(data);
      setIsImpersonating(true);
      // Redirect to user dashboard
      window.location.href = data.redirectUrl || '/user-dashboard';
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => apiRequest('/api/admin/create-user', 'POST', {
      ...userData,
      role: 'end_user',
      user_of_white_label_id: (user as any)?.white_label_id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      setShowCreateUser(false);
      setUserForm({
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        email: ''
      });
    },
  });

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/api/admin/users/${id}/status`, 'PATCH', { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });

  // Send single invitation mutation
  const sendSingleInvitation = useMutation({
    mutationFn: (inviteData: any) => apiRequest('/api/admin/send-invitation', 'POST', {
      ...inviteData,
      businessName: `${inviteData.firstName} ${inviteData.lastName}'s Business`
    }),
    onSuccess: () => {
      setShowInviteModal(false);
      setSingleInviteForm({
        email: '',
        firstName: '',
        lastName: ''
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Send bulk invitations mutation
  const sendBulkInvitations = useMutation({
    mutationFn: (csvData: any[]) => apiRequest('/api/admin/send-bulk-invitations', 'POST', { invitations: csvData }),
    onSuccess: () => {
      setShowInviteModal(false);
      setCsvFile(null);
      setCsvData([]);
      setUploadStatus('');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Filter users based on search and status
  const usersArray = Array.isArray(users) ? users : [];
  const filteredUsers = usersArray.filter((user: any) => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle form changes
  const handleUserFormChange = (field: string, value: string) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle user creation
  const handleCreateUser = () => {
    if (!userForm.firstName || !userForm.lastName || !userForm.username || !userForm.password || !userForm.email) {
      return;
    }
    createUserMutation.mutate(userForm);
  };

  // Handle impersonate user
  const handleImpersonateUser = (userData: any) => {
    impersonateUserMutation.mutate(userData);
  };

  // Handle view user details
  const handleViewUserDetails = (userData: any) => {
    setSelectedUser(userData);
    setShowUserDetails(true);
  };

  // Handle single invite submit
  const handleSingleInviteSubmit = () => {
    if (!singleInviteForm.email || !singleInviteForm.firstName || !singleInviteForm.lastName) {
      return;
    }
    sendSingleInvitation.mutate(singleInviteForm);
  };

  // Handle CSV file upload
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
        setCsvData(data);
        setUploadStatus(`${data.length} users loaded from CSV`);
      };
      reader.readAsText(file);
    }
  };

  // Handle bulk invite submit
  const handleBulkInviteSubmit = () => {
    if (csvData.length === 0) return;
    setIsProcessingInvites(true);
    
    // Auto-generate businessName for each user
    const invitationsWithBusinessName = csvData.map(user => ({
      ...user,
      businessName: user.businessName || `${user.firstName} ${user.lastName}'s Business`
    }));
    
    sendBulkInvitations.mutate(invitationsWithBusinessName);
  };

  // Download CSV template
  const downloadCsvTemplate = () => {
    const csvContent = "email,firstName,lastName\nexample@email.com,John,Doe";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'white_label_invitation_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="User Management" 
          subtitle="Manage and create user accounts"
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        />
        
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



        {/* Clean Invitation Section */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">User Invitations</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Send invitations to new users</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary CTA Button - Main Brand Color */}
                <Button 
                  onClick={() => setShowInviteModal(true)}
                  className="flex-1 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300" 
                  style={{ backgroundColor: primaryColor || '#3b82f6' }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invitations
                </Button>
                {/* Secondary Button - Using Secondary Color */}
                <Button 
                  variant="outline" 
                  onClick={downloadCsvTemplate}
                  className="flex-1 bg-white font-medium transition-all duration-300 hover:bg-gray-50"
                  style={{ 
                    borderColor: secondaryColor || '#10b981',
                    color: secondaryColor || '#10b981'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${secondaryColor || '#10b981'}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clean Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              </div>
              User Management
            </h2>
            <p className="text-gray-500 mt-1 ml-11">Create and manage user accounts</p>
          </div>
          <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
            <DialogTrigger asChild>
              {/* Primary CTA Button */}
              <Button className="text-white font-medium shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: primaryColor || '#3b82f6' }}>
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </DialogTrigger>


            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up a new end-user account. All fields with * are required.
                </p>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* User Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={userForm.firstName}
                      onChange={(e) => handleUserFormChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={userForm.lastName}
                      onChange={(e) => handleUserFormChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@email.com"
                    value={userForm.email}
                    onChange={(e) => handleUserFormChange('email', e.target.value)}
                  />
                </div>

                {/* Username & Password */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      placeholder="john_smith"
                      value={userForm.username}
                      onChange={(e) => handleUserFormChange('username', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Strong password"
                      value={userForm.password}
                      onChange={(e) => handleUserFormChange('password', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateUser(false)}
                  className="transition-all duration-300"
                  style={{ 
                    borderColor: secondaryColor || '#10b981',
                    color: secondaryColor || '#10b981'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${secondaryColor || '#10b981'}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={createUserMutation.isPending || !userForm.firstName || !userForm.lastName || !userForm.username || !userForm.password || !userForm.email}
                >
                  {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Clean Filters Section */}
        <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-2 focus:ring-2 transition-all duration-300"
                    style={{ 
                      '--tw-ring-color': `${primaryColor || '#3b82f6'}40`
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:border-2 focus:ring-2 transition-all duration-300"
                  style={{ 
                    '--tw-ring-color': `${primaryColor || '#3b82f6'}40`
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clean Users Table */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              User Accounts ({filteredUsers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredUsers?.map((user: any, index: number) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                  style={{
                    background: index % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6" style={{ color: primaryColor || '#3b82f6' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      <p className="text-gray-500 text-sm">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        End User
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" style={{ color: secondaryColor || '#10b981' }} />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Badge className={`${getStatusColor(user.status)} font-medium px-3 py-1`}>
                      {user.status}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      {(selectedRole === 'Super Admin' || selectedRole === 'super_admin' || user?.role === 'super_admin') && (
                        <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleImpersonateUser(user)}
                        title="Impersonate User"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                      >
                        <LogIn className="h-3 w-3" />
                      </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewUserDetails(user)}
                        title="View Details"
                        className="transition-all duration-200"
                        style={{ 
                          borderColor: secondaryColor || '#10b981',
                          color: secondaryColor || '#10b981'
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>

                      {(selectedRole === 'Super Admin' || selectedRole === 'super_admin' || user?.role === 'super_admin') && (
                        <div className="flex space-x-1">
                          {user.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ id: user.id, status: 'active' })}
                              disabled={updateStatusMutation.isPending}
                              className="text-white shadow-sm hover:shadow-md transition-all duration-300"
                              style={{ 
                                backgroundColor: primaryColor || '#3b82f6',
                                borderColor: primaryColor || '#3b82f6'
                              }}
                            >
                              Approve
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: user.id, status: 'suspended' })}
                              disabled={updateStatusMutation.isPending}
                              className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                            >
                              Suspend
                            </Button>
                          )}
                          {user.status === 'suspended' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ id: user.id, status: 'active' })}
                              disabled={updateStatusMutation.isPending}
                              className="text-white shadow-sm hover:shadow-md transition-all duration-300"
                              style={{ 
                                backgroundColor: primaryColor || '#3b82f6',
                                borderColor: primaryColor || '#3b82f6'
                              }}
                            >
                              Reactivate
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="hover:shadow-md transition-all duration-300"
                            style={{ 
                              borderColor: secondaryColor || '#10b981',
                              color: secondaryColor || '#10b981'
                            }}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {(!filteredUsers || filteredUsers.length === 0) && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{
                    background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}20, ${secondaryColor || '#10b981'}20)`
                  }}>
                    <Users className="h-10 w-10" style={{ color: primaryColor || '#3b82f6' }} />
                  </div>
                  <div className="text-gray-600 mb-2 text-lg font-medium">
                    {searchTerm || statusFilter !== 'all' ? 'No users match your filters' : 'No users yet'}
                  </div>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'User accounts will appear here when they sign up'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </main>

      {/* Invitation Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              Send User Invitations
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invite new users to join your platform.
            </p>
          </DialogHeader>

          <Tabs value={inviteTab} onValueChange={setInviteTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger 
                value="single" 
                className="data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={{
                  backgroundColor: inviteTab === 'single' ? primaryColor || '#3b82f6' : 'transparent'
                }}
              >
                Single Invitation
              </TabsTrigger>
              <TabsTrigger 
                value="bulk"
                className="data-[state=active]:text-white data-[state=active]:shadow-sm"
                style={{
                  backgroundColor: inviteTab === 'bulk' ? primaryColor || '#3b82f6' : 'transparent'
                }}
              >
                Bulk Upload (CSV)
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Single Invitation Tab */}
            <TabsContent value="single" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="invite-email" className="text-sm font-medium text-gray-700">
                    Email Address <span style={{ color: secondaryColor || '#10b981' }}>*</span>
                  </Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="user@email.com"
                    value={singleInviteForm.email}
                    onChange={(e) => setSingleInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-2 border-gray-300 focus:border-2 transition-all duration-300"
                    style={{ 
                      '--tw-ring-color': `${primaryColor || '#3b82f6'}50`,
                      borderColor: `${primaryColor || '#3b82f6'}` + '40'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invite-firstname" className="text-sm font-medium text-gray-700">
                      First Name <span style={{ color: secondaryColor || '#10b981' }}>*</span>
                    </Label>
                    <Input
                      id="invite-firstname"
                      placeholder="John"
                      value={singleInviteForm.firstName}
                      onChange={(e) => setSingleInviteForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-2 border-gray-300 focus:border-2 transition-all duration-300"
                      style={{ 
                        '--tw-ring-color': `${primaryColor || '#3b82f6'}50`,
                        borderColor: `${primaryColor || '#3b82f6'}` + '40'
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite-lastname" className="text-sm font-medium text-gray-700">
                      Last Name <span style={{ color: secondaryColor || '#10b981' }}>*</span>
                    </Label>
                    <Input
                      id="invite-lastname"
                      placeholder="Doe"
                      value={singleInviteForm.lastName}
                      onChange={(e) => setSingleInviteForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-2 border-gray-300 focus:border-2 transition-all duration-300"
                      style={{ 
                        '--tw-ring-color': `${primaryColor || '#3b82f6'}50`,
                        borderColor: `${primaryColor || '#3b82f6'}` + '40'
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-lg p-6 border border-gray-200 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Mail className="h-6 w-6 mt-0.5 text-gray-500" />
                    <div>
                      <h4 className="font-medium text-lg text-gray-900">Invitation Preview</h4>
                      <p className="text-sm text-gray-600 mt-2">
                        The user will receive a professional invitation email with setup instructions and login credentials.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInviteModal(false)}
                    className="px-6 transition-all duration-300"
                    style={{ 
                      borderColor: secondaryColor || '#10b981',
                      color: secondaryColor || '#10b981'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${secondaryColor || '#10b981'}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSingleInviteSubmit}
                    disabled={sendSingleInvitation.isPending}
                    className="px-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: primaryColor || '#3b82f6'
                    }}
                  >
                    {sendSingleInvitation.isPending ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Bulk Upload Tab */}
            <TabsContent value="bulk" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">CSV Format Instructions</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Upload a CSV file with columns: email, firstName, lastName
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-upload" className="text-sm font-medium text-gray-700">
                      Upload CSV File
                    </Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="mt-2"
                    />
                    {uploadStatus && (
                      <p className="text-sm text-green-600 mt-2">{uploadStatus}</p>
                    )}
                  </div>

                  {csvData.length > 0 && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Preview ({csvData.length} users)</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {csvData.slice(0, 5).map((row, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {row.email} - {row.firstName} {row.lastName}
                          </div>
                        ))}
                        {csvData.length > 5 && (
                          <div className="text-sm text-gray-500">
                            ... and {csvData.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInviteModal(false)}
                    className="px-6 transition-all duration-300"
                    style={{ 
                      borderColor: secondaryColor || '#10b981',
                      color: secondaryColor || '#10b981'
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBulkInviteSubmit}
                    disabled={sendBulkInvitations.isPending || csvData.length === 0}
                    className="px-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: primaryColor || '#3b82f6'
                    }}
                  >
                    {sendBulkInvitations.isPending ? 'Processing...' : `Send ${csvData.length} Invitations`}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              User Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="purchases">Purchases</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  {/* User Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Full Name</label>
                          <p className="text-lg">{selectedUser.firstName} {selectedUser.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-lg">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Username</label>
                          <p className="text-lg">@{selectedUser.username}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <Badge className={getStatusColor(selectedUser.status)}>
                            {selectedUser.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Joined Date</label>
                          <p className="text-lg">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Role</label>
                          <p className="text-lg">End User</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="purchases" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" style={{ color: secondaryColor || '#10b981' }} />
                        Purchase History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userPurchases?.length > 0 ? (
                          userPurchases.map((purchase: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                                </div>
                                <div>
                                  <p className="font-medium">{purchase.planName || purchase.productName}</p>
                                  <p className="text-sm text-gray-600">{purchase.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-green-600">
                                  ${parseFloat(purchase.amount || purchase.total || '0').toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(purchase.createdAt || purchase.purchaseDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: secondaryColor || '#10b981' }} />
                            <p>No purchases found</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}