import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, Calendar, Download, Filter, Users, Eye, CreditCard, History } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function CommissionsPage() {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin Affiliate';

  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/commissions/my'],
  });

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/commissions/stats'],
  });

  const { data: payoutHistory = [], isLoading: payoutsLoading } = useQuery({
    queryKey: ['/api/payouts/history'],
  });

  const isLoading = commissionsLoading || statsLoading || payoutsLoading;

  const exportCommissions = () => {
    const data = {
      commissions,
      stats,
      filters: { timeFilter, statusFilter },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getCommissionTypeColor = (type: string) => {
    switch (type) {
      case 'referral': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'subscription': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'one_time': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Commission Tracking" />
          <main className="flex-1 overflow-auto p-6">
            <div className="text-center py-12">Loading commission data...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Commission Tracking" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Commission Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your earnings and payout history
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={exportCommissions} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="commissions" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Commissions</span>
              </TabsTrigger>
              <TabsTrigger value="payouts" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Payouts</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.totalEarned || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      All time earnings
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.monthlyEarnings || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.monthlyGrowth || 0}% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${stats.pendingAmount || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting payout
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRate || 10}%</div>
                    <p className="text-xs text-muted-foreground">
                      Average rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="90d">Last 90 days</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-6">
              {/* Commissions List */}
              <Card>
                <CardHeader>
                  <CardTitle>Commission History ({commissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commissions.map((commission: any) => (
                      <div
                        key={commission.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {commission.description || 'Commission Earned'}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(commission.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>From: {commission.referralSource || 'Direct'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              ${commission.amount}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {commission.rate}% rate
                            </div>
                          </div>

                          <div className="flex flex-col space-y-1">
                            <Badge className={getStatusColor(commission.status)}>
                              {commission.status}
                            </Badge>
                            <Badge variant="outline" className={getCommissionTypeColor(commission.type)}>
                              {commission.type}
                            </Badge>
                          </div>

                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {commissions.length === 0 && (
                      <div className="text-center py-12">
                        <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <div className="text-gray-500 mb-4">No commissions yet</div>
                        <p className="text-sm text-gray-400">
                          Start promoting products to earn your first commission
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-6">
              {/* Payout History */}
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payoutHistory.map((payout: any) => (
                      <div
                        key={payout.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                            <Download className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Payout #{payout.id}
                            </h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(payout.createdAt).toLocaleDateString()} • {payout.method}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">
                              ${payout.amount}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {payout.commissionsCount} commissions
                            </div>
                          </div>

                          <Badge className={getStatusColor(payout.status)}>
                            {payout.status}
                          </Badge>
                        </div>
                      </div>
                    ))}

                    {payoutHistory.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Download className="h-8 w-8 mx-auto mb-4 opacity-50" />
                        <p>No payout history available</p>
                        <p className="text-sm">Payouts will appear here once processed</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}