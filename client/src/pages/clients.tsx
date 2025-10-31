import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Filter, Eye, UserCheck, UserX, Building, Calendar, MoreHorizontal, Menu, Users, Activity, DollarSign, ShoppingCart, TrendingUp, Clock, LogIn, Plus, Mail, Upload, Download, FileText } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function ClientsPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedClient, setImpersonatedClient] = useState<any>(null);
  const [showCreateOrganization, setShowCreateOrganization] = useState(false);
  const [organizationForm, setOrganizationForm] = useState({
    businessName: '',
    domainPath: '',
    organizationFirstName: '',
    organizationLastName: '',
    industry: '',
    username: '',
    password: '',
    website: ''
  });
  
  // Invitation state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTab, setInviteTab] = useState("single");
  const [singleInviteForm, setSingleInviteForm] = useState({
    email: '',
    businessName: '',
    firstName: '',
    lastName: ''
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isProcessingInvites, setIsProcessingInvites] = useState(false);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';
  
  // Debug logging
  console.log('ClientsPage Debug:', {
    selectedRole,
    userRole: user?.role,
    sessionRole: sessionStorage.getItem('selectedRole')
  });

  const { data: whiteLabels, isLoading } = useQuery({
    queryKey: ['/api/white-labels'],
  });

  const { data: stats, error: statsError } = useQuery({
    queryKey: ['/api/white-labels/stats'],
    retry: 2,
    staleTime: 0, // Force fresh data
  });
  
  // Debug stats
  console.log('Stats data:', stats, 'Stats error:', statsError);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/white-labels/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels'] });
    },
  });

  // Analytics queries for selected client
  const { data: clientStats } = useQuery({
    queryKey: [`/api/white-labels/${selectedClient?.id}/analytics/stats`],
    enabled: !!selectedClient?.id,
  });

  const { data: clientActivities } = useQuery({
    queryKey: [`/api/white-labels/${selectedClient?.id}/analytics/activities`],
    enabled: !!selectedClient?.id,
  });

  const { data: clientPurchases } = useQuery({
    queryKey: [`/api/white-labels/${selectedClient?.id}/analytics/purchases`],
    enabled: !!selectedClient?.id,
  });

  const handleViewClientDetails = (client: any) => {
    setSelectedClient(client);
    setShowClientDetails(true);
  };

  // Impersonation mutation
  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Starting impersonation for userId:', userId);
      const response = await fetch(`/api/admin/impersonate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Impersonation failed: ${error}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Impersonation successful:', data);
      // Store the original admin session info
      sessionStorage.setItem('originalAdminRole', user?.role || 'super_admin');
      sessionStorage.setItem('originalAdminId', user?.id || '');
      sessionStorage.setItem('impersonatedClientId', data.impersonatedUser.id);
      
      // Reload the page to get the new impersonated session
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('Impersonation failed:', error);
      alert(`Impersonation failed: ${error.message}`);
    },
  });

  const handleImpersonateClient = (client: any) => {
    if (confirm(`Are you sure you want to impersonate ${client.businessName}? You will be logged in as this client and can make changes to their account.`)) {
      impersonateMutation.mutate(client.userId); // Use userId for the API call
    }
  };

  // Handle organization form changes
  const handleOrganizationFormChange = (field: string, value: string) => {
    setOrganizationForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate domain path from business name
    if (field === 'businessName') {
      const domainPath = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
      
      setOrganizationForm(prev => ({
        ...prev,
        domainPath
      }));
    }
  };

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (organizationData: any) => {
      const response = await fetch('/api/admin/create-organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(organizationData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Organization created successfully:', data);
      alert(`Organization "${data.organization.whiteLabel.businessName}" created successfully!`);
      setShowCreateOrganization(false);
      
      // Reset form
      setOrganizationForm({
        businessName: '',
        domainPath: '',
        organizationFirstName: '',
        organizationLastName: '',
        industry: '',
        username: '',
        password: '',
        website: ''
      });
      
      // Refresh the white-labels list to show the new organization
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels'] });
      queryClient.invalidateQueries({ queryKey: ['/api/white-labels/stats'] });
    },
    onError: (error: any) => {
      console.error('Error creating organization:', error);
      alert(`Failed to create organization: ${error.message}`);
    },
  });

  // Handle create organization
  const handleCreateOrganization = () => {
    // Validate required fields
    const { businessName, organizationFirstName, organizationLastName, username, password, domainPath } = organizationForm;
    
    if (!businessName || !organizationFirstName || !organizationLastName || !username || !password || !domainPath) {
      alert('Please fill in all required fields (marked with *)');
      return;
    }
    
    console.log('Creating organization with data:', organizationForm);
    createOrganizationMutation.mutate(organizationForm);
  };

  // CSV Template Download
  const downloadCsvTemplate = () => {
    const csvContent = "email,businessName,firstName,lastName\nexample@company.com,Example Company,John,Doe\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'white-label-invitation-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // CSV File Upload Handler
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setUploadStatus('Please upload a CSV file');
      return;
    }

    setCsvFile(file);
    
    // Parse CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      if (!headers.includes('email') || !headers.includes('businessName') || !headers.includes('firstName') || !headers.includes('lastName')) {
        setUploadStatus('CSV must contain columns: email, businessName, firstName, lastName');
        setCsvData([]);
        return;
      }

      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      }).filter(row => row.email); // Filter out empty rows

      setCsvData(data);
      setUploadStatus(`${data.length} invitations ready to send`);
    };
    
    reader.readAsText(file);
  };

  // Send Single Invitation
  const sendSingleInvitation = useMutation({
    mutationFn: async (inviteData: any) => {
      const response = await fetch('/api/admin/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(inviteData)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: () => {
      alert('Invitation sent successfully!');
      setSingleInviteForm({ email: '', businessName: '', firstName: '', lastName: '' });
      setShowInviteModal(false);
    },
    onError: (error: any) => {
      alert(`Failed to send invitation: ${error.message}`);
    }
  });

  // Send Bulk Invitations
  const sendBulkInvitations = useMutation({
    mutationFn: async (invitations: any[]) => {
      const response = await fetch('/api/admin/send-bulk-invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ invitations })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      alert(`Successfully sent ${data.successCount} invitations! ${data.errorCount > 0 ? `${data.errorCount} failed.` : ''}`);
      setCsvFile(null);
      setCsvData([]);
      setUploadStatus('');
      setShowInviteModal(false);
    },
    onError: (error: any) => {
      alert(`Failed to send bulk invitations: ${error.message}`);
    }
  });

  // Handle Single Invite Form
  const handleSingleInviteSubmit = () => {
    const { email, businessName, firstName, lastName } = singleInviteForm;
    
    if (!email || !businessName || !firstName || !lastName) {
      alert('Please fill in all fields');
      return;
    }

    sendSingleInvitation.mutate({
      email,
      businessName,
      firstName,
      lastName,
      inviterName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Super Admin'
    });
  };

  // Handle Bulk Invite Submit
  const handleBulkInviteSubmit = () => {
    if (csvData.length === 0) {
      alert('Please upload a CSV file with invitation data');
      return;
    }

    const invitations = csvData.map(row => ({
      ...row,
      inviterName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'Super Admin'
    }));

    sendBulkInvitations.mutate(invitations);
  };

  const filteredClients = whiteLabels?.filter((client: any) => {
    const matchesSearch = client.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
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
            <h1 className="text-lg font-semibold text-gray-900">White-Label Clients</h1>
            <div className="w-10"></div>
          </div>

          <Header title="White-Label Clients" subtitle="Manage your white-label client accounts" />
          <div className="p-6">
            <div className="text-center py-12">Loading clients...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Clean Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">White-Label Clients</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="White-Label Clients"
          subtitle="Manage your white-label client accounts"
        />
        
        <div className="p-6">

        {/* Clean Stats Cards with Neutral Base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Clients</CardTitle>
              <Building className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.total || 0}</div>
              <p className="text-xs text-gray-500 mt-1">All white-label clients</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Active</CardTitle>
              <UserCheck className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.active || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Have purchased plans</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
              <Calendar className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.pending || 0}</div>
              <p className="text-xs text-gray-500 mt-1">No plans purchased</p>
            </CardContent>
          </Card>
        </div>

        {/* Clean Invitation Section */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="h-4 w-4" style={{ color: primaryColor || '#3b82f6' }} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Client Invitations</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Send invitations to new clients</p>
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
              Client Management
            </h2>
            <p className="text-gray-500 mt-1 ml-11">Create and manage client organizations</p>
          </div>
          <Dialog open={showCreateOrganization} onOpenChange={setShowCreateOrganization}>
            <DialogTrigger asChild>
              {/* Primary CTA Button */}
              <Button className="text-white font-medium shadow-sm hover:shadow-md transition-all duration-300" style={{ backgroundColor: primaryColor || '#3b82f6' }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up a new white-label organization in under 2 minutes. All fields with * are required.
                </p>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Business Name */}
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Enter business or organization name"
                    value={organizationForm.businessName}
                    onChange={(e) => handleOrganizationFormChange('businessName', e.target.value)}
                  />
                </div>

                {/* Organization Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="organizationFirstName" className="text-sm font-medium">
                      Organization First Name *
                    </Label>
                    <Input
                      id="organizationFirstName"
                      placeholder="John"
                      value={organizationForm.organizationFirstName}
                      onChange={(e) => handleOrganizationFormChange('organizationFirstName', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="organizationLastName" className="text-sm font-medium">
                      Organization Last Name *
                    </Label>
                    <Input
                      id="organizationLastName"
                      placeholder="Smith"
                      value={organizationForm.organizationLastName}
                      onChange={(e) => handleOrganizationFormChange('organizationLastName', e.target.value)}
                    />
                  </div>
                </div>

                {/* Industry */}
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </Label>
                  <Select 
                    value={organizationForm.industry} 
                    onValueChange={(value) => handleOrganizationFormChange('industry', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="nonprofit">Non-Profit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Username & Password */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username *
                    </Label>
                    <Input
                      id="username"
                      placeholder="admin_user"
                      value={organizationForm.username}
                      onChange={(e) => handleOrganizationFormChange('username', e.target.value)}
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
                      value={organizationForm.password}
                      onChange={(e) => handleOrganizationFormChange('password', e.target.value)}
                    />
                  </div>
                </div>

                {/* Domain Path */}
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="domainPath" className="text-sm font-medium">
                    Domain Path *
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{window.location.hostname}/</span>
                    <Input
                      id="domainPath"
                      placeholder="business-name"
                      value={organizationForm.domainPath}
                      onChange={(e) => handleOrganizationFormChange('domainPath', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Auto-generated from business name, but you can customize it</p>
                </div>

                {/* Website */}
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="website" className="text-sm font-medium">
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://www.business.com"
                    value={organizationForm.website}
                    onChange={(e) => handleOrganizationFormChange('website', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateOrganization(false)}
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
                  onClick={handleCreateOrganization}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={createOrganizationMutation.isPending || !organizationForm.businessName || !organizationForm.organizationFirstName || !organizationForm.organizationLastName || !organizationForm.username || !organizationForm.password || !organizationForm.domainPath}
                >
                  {createOrganizationMutation.isPending ? 'Creating...' : 'Create Organization'}
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
                    placeholder="Search clients by name or email..."
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
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clean Clients Table */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Building className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              Client Accounts ({filteredClients?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredClients?.map((client: any, index: number) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-6 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                  style={{
                    background: index % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Building className="h-6 w-6" style={{ color: primaryColor || '#3b82f6' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {client.businessName}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.contactEmail}
                      </p>
                      {client.customDomain && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 bg-gray-100 text-gray-700">
                          {client.customDomain}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {client.planName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" style={{ color: secondaryColor || '#10b981' }} />
                        Joined {new Date(client.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <Badge className={`${getStatusColor(client.status)} font-medium px-3 py-1`}>
                      {client.status}
                    </Badge>

                    <div className="flex items-center space-x-2">
                      {(selectedRole === 'Super Admin' || selectedRole === 'super_admin' || user?.role === 'super_admin') && (
                        <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleImpersonateClient(client)}
                        title="Impersonate Client"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                      >
                        <LogIn className="h-3 w-3" />
                      </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewClientDetails(client)}
                        title="View Analytics"
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
                          {client.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ id: client.id, status: 'active' })}
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
                          {client.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: client.id, status: 'suspended' })}
                              disabled={updateStatusMutation.isPending}
                              className="border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                            >
                              Suspend
                            </Button>
                          )}
                          {client.status === 'suspended' && (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ id: client.id, status: 'active' })}
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

              {(!filteredClients || filteredClients.length === 0) && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{
                    background: `linear-gradient(135deg, ${primaryColor || '#3b82f6'}20, ${secondaryColor || '#10b981'}20)`
                  }}>
                    <Building className="h-10 w-10" style={{ color: primaryColor || '#3b82f6' }} />
                  </div>
                  <div className="text-gray-600 mb-2 text-lg font-medium">
                    {searchTerm || statusFilter !== 'all' ? 'No clients match your filters' : 'No clients yet'}
                  </div>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Client accounts will appear here when they sign up'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </main>

      {/* Invitation Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
              Send White-Label Invitations
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Invite potential clients to join your platform. Invitations will be sent from {user?.firstName || user?.username || 'Super Admin'}.
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
                    placeholder="client@company.com"
                    value={singleInviteForm.email}
                    onChange={(e) => setSingleInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-2 border-gray-300 focus:border-2 transition-all duration-300"
                    style={{ 
                      '--tw-ring-color': `${primaryColor || '#3b82f6'}50`,
                      borderColor: `${primaryColor || '#3b82f6'}` + '40'
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="invite-business" className="text-sm font-medium text-gray-700">
                    Business Name <span style={{ color: secondaryColor || '#10b981' }}>*</span>
                  </Label>
                  <Input
                    id="invite-business"
                    placeholder="Company Name"
                    value={singleInviteForm.businessName}
                    onChange={(e) => setSingleInviteForm(prev => ({ ...prev, businessName: e.target.value }))}
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
                        The client will receive a professional invitation email with setup instructions and login credentials.
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
                        Your CSV file must contain these columns: <code className="bg-amber-100 px-1 rounded">email</code>, <code className="bg-amber-100 px-1 rounded">businessName</code>, <code className="bg-amber-100 px-1 rounded">firstName</code>, <code className="bg-amber-100 px-1 rounded">lastName</code>
                      </p>
                      <Button 
                        variant="link" 
                        className="text-amber-700 hover:text-amber-800 p-0 h-auto mt-2"
                        onClick={downloadCsvTemplate}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="csv-upload" className="text-sm font-medium">
                    Upload CSV File
                  </Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">CSV files only</p>
                        </div>
                        <input 
                          id="csv-upload" 
                          type="file" 
                          accept=".csv"
                          className="hidden" 
                          onChange={handleCsvUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {uploadStatus && (
                  <div className={`p-3 rounded-lg ${csvData.length > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${csvData.length > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {uploadStatus}
                    </p>
                  </div>
                )}

                {csvData.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Preview ({csvData.length} invitations)</h4>
                    <div className="max-h-48 overflow-y-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Email</th>
                            <th className="px-3 py-2 text-left">Business</th>
                            <th className="px-3 py-2 text-left">Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvData.slice(0, 5).map((row, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-3 py-2">{row.email}</td>
                              <td className="px-3 py-2">{row.businessName}</td>
                              <td className="px-3 py-2">{row.firstName} {row.lastName}</td>
                            </tr>
                          ))}
                          {csvData.length > 5 && (
                            <tr className="border-t">
                              <td colSpan={3} className="px-3 py-2 text-center text-gray-500">
                                ... and {csvData.length - 5} more
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
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
                  onClick={handleBulkInviteSubmit}
                  disabled={sendBulkInvitations.isPending || csvData.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {sendBulkInvitations.isPending ? 'Sending...' : `Send ${csvData.length} Invitations`}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Client Analytics Detail Modal */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <Building className="h-5 w-5" style={{ color: secondaryColor || '#10b981' }} />
              </div>
              <div>
                <div className="text-lg font-semibold">{selectedClient?.businessName}</div>
                <div className="text-sm text-gray-600">{selectedClient?.contactEmail}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="mt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activities">User Activities</TabsTrigger>
                  <TabsTrigger value="purchases">Purchase History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                        <Users className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{clientStats?.totalSignups || '0'}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{clientStats?.activeUsers || '0'}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                        <Activity className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{clientStats?.totalLogins || '0'}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                        <ShoppingCart className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{clientStats?.totalPurchases || '0'}</div>
                        <p className="text-xs text-muted-foreground">Orders completed</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                          ${parseFloat(clientStats?.totalRevenue || '0').toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">All time earnings</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Client Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Business Name</label>
                          <p className="text-lg">{selectedClient.businessName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Contact Email</label>
                          <p className="text-lg">{selectedClient.contactEmail}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Domain Path</label>
                          <p className="text-lg">/{selectedClient.domainPath}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <Badge className={getStatusColor(selectedClient.status)}>
                            {selectedClient.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Joined Date</label>
                          <p className="text-lg">{new Date(selectedClient.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Plan</label>
                          <p className="text-lg">{selectedClient.planName || 'No Plan'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activities" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" style={{ color: secondaryColor || '#10b981' }} />
                        Recent End User Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {clientActivities?.length > 0 ? (
                          clientActivities.map((activity: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Users className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                                </div>
                                <div>
                                  <p className="font-medium">{activity.description || activity.action}</p>
                                  <p className="text-sm text-gray-600">{activity.userEmail || activity.userId}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                                {new Date(activity.createdAt || activity.timestamp).toLocaleString()}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" style={{ color: secondaryColor || '#10b981' }} />
                            <p>No recent activities found</p>
                          </div>
                        )}
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
                        {clientPurchases?.length > 0 ? (
                          clientPurchases.map((purchase: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                  <DollarSign className="h-4 w-4" style={{ color: secondaryColor || '#10b981' }} />
                                </div>
                                <div>
                                  <p className="font-medium">{purchase.planName || purchase.productName}</p>
                                  <p className="text-sm text-gray-600">{purchase.customerEmail || purchase.userEmail}</p>
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