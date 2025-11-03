
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Download, 
  Calendar, 
  Users, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  commissionsPaid: number;
  pendingPayouts: number;
  netProfit: number;
  activeSubscriptions: number;
  affiliateCount: number;
}

interface CommissionPayout {
  id: number;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  commissionType: 'referral' | 'recurring';
  status: 'pending' | 'paid' | 'cancelled';
  subscriptionPlan: string;
  clientName: string;
  createdAt: string;
  paidAt?: string;
}

interface RevenueBreakdown {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

export default function Revenue() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [statusFilter, setStatusFilter] = useState("all");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: revenueStats, isLoading: statsLoading } = useQuery<RevenueStats>({
    queryKey: ["/api/revenue/stats", selectedPeriod],
    retry: false,
  });

  const { data: commissionPayouts, isLoading: payoutsLoading } = useQuery<CommissionPayout[]>({
    queryKey: ["/api/revenue/commissions", statusFilter],
    retry: false,
  });

  const { data: revenueBreakdown, isLoading: breakdownLoading } = useQuery<RevenueBreakdown[]>({
    queryKey: ["/api/revenue/breakdown", selectedPeriod],
    retry: false,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your revenue data export is being prepared.",
    });
  };

  const handleProcessPayouts = () => {
    toast({
      title: "Processing Payouts",
      description: "Commission payouts are being processed.",
    });
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const mockStats: RevenueStats = {
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    revenueGrowth: 12.5,
    commissionsPaid: 18750,
    pendingPayouts: 5250,
    netProfit: 101000,
    activeSubscriptions: 143,
    affiliateCount: 28
  };

  const mockPayouts: CommissionPayout[] = [
    {
      id: 1,
      affiliateName: "John Smith",
      affiliateEmail: "john@example.com",
      amount: 500,
      commissionType: "referral",
      status: "pending",
      subscriptionPlan: "Pro Plan",
      clientName: "Tech Corp",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      affiliateName: "Sarah Johnson",
      affiliateEmail: "sarah@example.com",
      amount: 750,
      commissionType: "recurring",
      status: "paid",
      subscriptionPlan: "Enterprise Plan",
      clientName: "Global Solutions",
      createdAt: "2024-01-10T10:00:00Z",
      paidAt: "2024-01-12T10:00:00Z"
    }
  ];

  const mockBreakdown: RevenueBreakdown[] = [
    { source: "Enterprise Plans", amount: 75000, percentage: 60, growth: 15 },
    { source: "Pro Plans", amount: 37500, percentage: 30, growth: 8 },
    { source: "Basic Plans", amount: 12500, percentage: 10, growth: -2 }
  ];

  const stats = revenueStats || mockStats;
  const payouts = commissionPayouts || mockPayouts;
  const breakdown = revenueBreakdown || mockBreakdown;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Revenue & Commissions"
          subtitle="Track platform revenue, affiliate commissions, and payouts"
        />

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-primary hover:bg-blue-700 text-white" size="sm" onClick={handleProcessPayouts}>
                Process Payouts
              </Button>
            </div>
          </div>

          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-600" />
                  <span className="text-green-600">+{stats.revenueGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Commissions Paid</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.commissionsPaid)}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.affiliateCount} active affiliates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Payouts</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.pendingPayouts)}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {payouts.filter(p => p.status === 'pending').length} awaiting payout
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.netProfit)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  After commission deductions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="payouts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="payouts">Commission Payouts</TabsTrigger>
              <TabsTrigger value="breakdown">Revenue Breakdown</TabsTrigger>
              <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="payouts">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    Commission Payouts
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {payoutsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Loading payouts...</div>
                    </div>
                  ) : payouts.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Affiliate</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payouts.map((payout) => (
                          <TableRow key={payout.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{payout.affiliateName}</p>
                                <p className="text-sm text-gray-500">{payout.affiliateEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>{payout.clientName}</TableCell>
                            <TableCell>{payout.subscriptionPlan}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(payout.amount)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {payout.commissionType}
                              </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(payout.status)}</TableCell>
                            <TableCell>{formatDate(payout.createdAt)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Commission Payouts Found
                      </h3>
                      <p className="text-gray-500">
                        Commission payouts will appear here when affiliates earn commissions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-6 h-6 mr-2" />
                      Revenue by Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {breakdown.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{source.source}</p>
                            <p className="text-sm text-gray-500">{source.percentage}% of total revenue</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(source.amount)}</p>
                            <p className={`text-sm flex items-center ${source.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {source.growth >= 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                              {Math.abs(source.growth)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Active Subscriptions</span>
                        <span className="font-bold">{stats.activeSubscriptions}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Monthly Revenue</span>
                        <span className="font-bold">{formatCurrency(stats.monthlyRevenue)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Average Revenue per User</span>
                        <span className="font-bold">{formatCurrency(stats.totalRevenue / stats.activeSubscriptions)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">Commission Rate</span>
                        <span className="font-bold">{((stats.commissionsPaid / stats.totalRevenue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Revenue Trends Chart Coming Soon
                    </h3>
                    <p className="text-gray-500">
                      Interactive charts showing revenue and commission trends over time will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
