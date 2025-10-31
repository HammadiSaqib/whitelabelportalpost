import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  Users,
  CreditCard,
  Palette,
  FileText,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserCheck,
} from 'lucide-react';

export default function BusinessDetail() {
  const [match] = useRoute('/business/:businessId');
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [impersonating, setImpersonating] = useState(false);

  const businessId = match?.businessId;

  // Query for business details
  const { data: business, isLoading } = useQuery({
    queryKey: ['/api/business-detail', businessId],
    enabled: !!businessId,
  });

  // Impersonate mutation
  const impersonateMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/business/${businessId}/impersonate`, 'POST');
    },
    onSuccess: () => {
      setImpersonating(true);
      toast({
        title: 'Impersonation Active',
        description: 'You are now viewing as this business owner.',
      });
      // Redirect to their dashboard
      setLocation(`/${business.domainPath}/dashboard`);
    },
    onError: () => {
      toast({
        title: 'Impersonation Failed',
        description: 'Unable to impersonate this business.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Business Not Found</h2>
          <p className="text-gray-600">The business you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/businesses')} className="mt-4">
            Back to Businesses
          </Button>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Users',
      value: business.userCount || 0,
      icon: Users,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Monthly Revenue',
      value: `$${business.monthlyRevenue || 0}`,
      icon: CreditCard,
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Active Plans',
      value: business.activePlans || 0,
      icon: FileText,
      change: '+3',
      trend: 'up',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/businesses')}
            className="text-gray-600"
          >
            ← Back to Businesses
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{business.businessName}</h1>
            <p className="text-gray-600">{business.domainPath}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={business.isActive ? 'default' : 'secondary'}>
            {business.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Button
            onClick={() => impersonateMutation.mutate()}
            disabled={impersonateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            {impersonateMutation.isPending ? 'Connecting...' : 'Impersonate'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Business Name</Label>
                  <p className="text-gray-900">{business.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="text-gray-900">{business.industry || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-gray-900">{business.description || 'No description provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <p className="text-gray-900">{business.website || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-gray-900">
                    {new Date(business.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Owner Name</Label>
                  <p className="text-gray-900">
                    {business.ownerFirstName} {business.ownerLastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-gray-900">{business.ownerEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-gray-900">{business.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Login</Label>
                  <p className="text-gray-900">
                    {business.lastLogin 
                      ? new Date(business.lastLogin).toLocaleString()
                      : 'Never'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">End Users</h3>
                  <Badge variant="outline">{business.endUsers?.length || 0} users</Badge>
                </div>
                <div className="grid gap-4">
                  {business.endUsers?.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isActive ? 'default' : 'secondary'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Current Plan</Label>
                  <p className="text-gray-900 font-semibold">{business.currentPlan?.name || 'No Plan'}</p>
                  <p className="text-sm text-gray-600">
                    ${business.currentPlan?.price || 0}/month
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Billing Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={business.billingStatus === 'active' ? 'default' : 'destructive'}>
                      {business.billingStatus || 'Unknown'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Billing Date</Label>
                  <p className="text-gray-900">
                    {business.nextBillingDate 
                      ? new Date(business.nextBillingDate).toLocaleDateString()
                      : 'Not scheduled'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Revenue</Label>
                  <p className="text-gray-900 font-semibold">
                    ${business.totalRevenue || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brand Tab */}
        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Logo</Label>
                  {business.logoUrl ? (
                    <img
                      src={business.logoUrl}
                      alt="Business Logo"
                      className="w-24 h-24 object-contain border rounded-lg mt-2"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 border rounded-lg mt-2 flex items-center justify-center text-gray-400">
                      No Logo
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Primary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: business.primaryColor }}
                      />
                      <p className="text-gray-900">{business.primaryColor}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Secondary Color</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: business.secondaryColor }}
                      />
                      <p className="text-gray-900">{business.secondaryColor}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Domain Path</Label>
                <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  yourdomain.com/{business.domainPath}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Plans:</span>
                    <span className="font-medium">{business.activePlans || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Published Plans:</span>
                    <span className="font-medium">{business.publishedPlans || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Draft Plans:</span>
                    <span className="font-medium">{business.draftPlans || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Announcements:</span>
                    <span className="font-medium">{business.totalAnnouncements || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Published:</span>
                    <span className="font-medium">{business.publishedAnnouncements || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Scheduled:</span>
                    <span className="font-medium">{business.scheduledAnnouncements || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Business Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{business.totalViews || 0}</p>
                  <p className="text-sm text-gray-600">Total Page Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{business.conversions || 0}</p>
                  <p className="text-sm text-gray-600">Conversions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {((business.conversions || 0) / Math.max(business.totalViews || 1, 1) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Business Status</h3>
                  <p className="text-sm text-gray-600">Enable or disable this business account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={business.isActive ? 'default' : 'secondary'}>
                    {business.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
                <div>
                  <h3 className="font-medium text-red-900">Danger Zone</h3>
                  <p className="text-sm text-red-600">Permanently delete this business and all associated data</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Business
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}