import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from "@/hooks/useTheme";
import { createIconStyle } from "@/utils/iconColors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  UserCheck, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Search,
  Filter,
  ChevronRight,
  DollarSign,
  Activity,
  Calendar,
  Clock,
  BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import PlanAnalytics from '@/components/PlanAnalytics';

interface EndUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  lastLoginAt?: Date;
  isOnline: boolean;
  totalPurchases: number;
  totalSpent: string;
}

interface EndUserActivity {
  id: number;
  userId: string;
  activityType: string;
  description: string | null;
  metadata: any;
  createdAt: Date | null;
  user: {
    id: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}

interface Purchase {
  id: number;
  userId: string;
  planId: number;
  amount: string;
  status: string;
  paymentMethod: string | null;
  createdAt: Date | null;
}

interface ActivityStats {
  totalSignups: number;
  totalLogins: number;
  totalPurchases: number;
  recentSignups: number;
  activeUsers: number;
}

export default function BusinessDashboard() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { primaryColor, secondaryColor } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('endusers');

  // Fetch end-user statistics
  const { data: stats } = useQuery<ActivityStats>({
    queryKey: ['/api/end-users/stats'],
  });

  // Fetch end-users list
  const { data: endUsers = [] } = useQuery<EndUser[]>({
    queryKey: ['/api/end-users'],
  });

  // Fetch recent activities
  const { data: activities = [] } = useQuery<EndUserActivity[]>({
    queryKey: ['/api/end-users/activities'],
  });

  // Fetch purchase history for selected user
  const { data: userPurchases = [] } = useQuery<Purchase[]>({
    queryKey: ['/api/end-users', selectedUser, 'purchases'],
    enabled: !!selectedUser,
  });

  // Filter end-users based on search and status
  const filteredEndUsers = endUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = false;
    switch (statusFilter) {
      case 'all':
        matchesStatus = true;
        break;
      case 'active':
        matchesStatus = user.isActive === true;
        break;
      case 'highSpent':
        matchesStatus = parseFloat(user.totalSpent) > 100; // Users who spent more than $100
        break;
      case 'recentJoined':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        matchesStatus = user.createdAt ? new Date(user.createdAt) > thirtyDaysAgo : false;
        break;
      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  // Filter activities based on type
  const filteredActivities = activities.filter(activity => {
    return activityFilter === 'all' || activity.activityType === activityFilter;
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup': return <UserCheck className="h-4 w-4" style={createIconStyle('UserCheck', { primaryColor, secondaryColor })} />;
      case 'login': return <Activity className="h-4 w-4" style={createIconStyle('Activity', { primaryColor, secondaryColor })} />;
      case 'purchase': return <ShoppingCart className="h-4 w-4" style={createIconStyle('ShoppingCart', { primaryColor, secondaryColor })} />;
      default: return <Activity className="h-4 w-4" style={createIconStyle('Activity', { primaryColor, secondaryColor })} />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'signup': return 'bg-green-100 text-green-800';
      case 'login': return 'bg-blue-100 text-blue-800';
      case 'purchase': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (user: EndUser) => {
    if (user.isOnline) {
      return <Badge className="bg-green-100 text-green-800">Online</Badge>;
    } else if (user.isActive) {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
            <Users className="h-4 w-4" style={createIconStyle('Users', { primaryColor, secondaryColor })} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSignups || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4" style={createIconStyle('UserCheck', { primaryColor, secondaryColor })} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Purchased your plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Activity className="h-4 w-4" style={createIconStyle('Activity', { primaryColor, secondaryColor })} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLogins || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4" style={createIconStyle('ShoppingCart', { primaryColor, secondaryColor })} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPurchases || 0}</div>
            <p className="text-xs text-muted-foreground">
              Orders completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4" style={createIconStyle('DollarSign', { primaryColor, secondaryColor })} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                endUsers.reduce((sum, user) => sum + parseFloat(user.totalSpent), 0).toString()
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Sales & End-User Activity Section with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={createIconStyle('BarChart3', { primaryColor, secondaryColor })} />
            Plan Sales & End-User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full h-auto flex flex-wrap sm:grid sm:grid-cols-3 gap-1 p-1">
              <TabsTrigger value="endusers" className="text-xs px-2 py-1 flex-1 min-w-0">End Users</TabsTrigger>
              <TabsTrigger value="activities" className="text-xs px-2 py-1 flex-1 min-w-0">Activities</TabsTrigger>
              <TabsTrigger value="purchases" className="text-xs px-2 py-1 flex-1 min-w-0">Purchases</TabsTrigger>
            </TabsList>

            <TabsContent value="endusers" className="mt-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: secondaryColor || '#9ca3af' }} />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="highSpent">High Spent</SelectItem>
                    <SelectItem value="recentJoined">Recent Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Purchases</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEndUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}`
                                : user.email || 'Unknown User'
                              }
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(user)}
                        </TableCell>
                        <TableCell>
                          {user.createdAt 
                            ? format(new Date(user.createdAt), 'MMM d, yyyy')
                            : 'Unknown'
                          }
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt 
                            ? format(new Date(user.lastLoginAt), 'MMM d, yyyy')
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {user.totalPurchases}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatCurrency(user.totalSpent)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user.id)}
                          >
                            <Eye className="h-4 w-4" style={createIconStyle('Eye', { primaryColor, secondaryColor })} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
            {/* Activity Filter */}
            <div className="flex justify-between items-center mb-6">
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="signup">Signups</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {activity.user?.firstName && activity.user?.lastName
                            ? `${activity.user.firstName} ${activity.user.lastName}`
                            : activity.user?.email || 'Unknown User'
                          }
                        </span>
                        <Badge className={getActivityBadgeColor(activity.activityType)}>
                          {activity.activityType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description || `User performed ${activity.activityType} action`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" style={{ color: secondaryColor || '#9ca3af' }} />
                    {activity.createdAt 
                      ? format(new Date(activity.createdAt), 'MMM d, h:mm a')
                      : 'Unknown'
                    }
                  </div>
                </div>
              ))}
            </div>
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <PlanAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}