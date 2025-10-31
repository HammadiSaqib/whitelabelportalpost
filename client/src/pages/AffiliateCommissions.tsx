import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Copy, 
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Link
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function AffiliateCommissions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customReferralCode, setCustomReferralCode] = useState(user?.referralCode || '');

  // Fetch affiliate commission data
  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['/api/affiliate/commissions'],
    enabled: user?.role === 'super_admin_affiliate'
  });

  // Fetch affiliate statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/affiliate/stats'],
    enabled: user?.role === 'super_admin_affiliate'
  });

  // Fetch referral link performance
  const { data: referralPerformance = [], isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/affiliate/referral-performance'],
    enabled: user?.role === 'super_admin_affiliate'
  });

  const handleUpdateReferralCode = async () => {
    try {
      await apiRequest('/api/affiliate/update-referral-code', 'POST', {
        referralCode: customReferralCode
      });
      toast({
        title: "Success",
        description: "Referral code updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update referral code",
        variant: "destructive",
      });
    }
  };

  const copyReferralLink = (referralCode: string) => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/pricing?${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Number(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (user?.role !== 'super_admin_affiliate') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">This page is only available for Super Admin Affiliates.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Commissions</h1>
        <p className="text-gray-600">Track your referrals and commission earnings</p>
      </div>

      {/* Referral URL Management */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Your Referral URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="referralCode">Custom Referral Code</Label>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    id="referralCode"
                    value={customReferralCode}
                    onChange={(e) => setCustomReferralCode(e.target.value)}
                    placeholder="Enter custom referral code"
                    className="flex-1"
                  />
                  <Button onClick={handleUpdateReferralCode} className="shrink-0">
                    Update
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a memorable code for your referral URLs
                </p>
              </div>
              <div>
                <Label>Your Referral URLs</Label>
                <div className="space-y-2 mt-2">
                  {user?.referralCode && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 bg-gray-50 rounded">
                      <code className="flex-1 text-sm break-all">
                        {window.location.origin}/pricing?{user.referralCode}
                      </code>
                      <div className="flex gap-1 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyReferralLink(user.referralCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`/pricing?${user.referralCode}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Generator */}
        {user?.referralCode && (
          <QRCodeGenerator
            url={`${window.location.origin}/pricing?${user.referralCode}`}
            title="Referral URL"
            size={150}
          />
        )}
      </div>

      {/* Statistics Overview */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalCommissions || 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalReferrals || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.conversionRate || '0%'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Link Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalClicks || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Commission History */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
        </CardHeader>
        <CardContent>
          {commissionsLoading ? (
            <div className="text-center py-8">Loading commissions...</div>
          ) : commissions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No commissions yet</p>
              <p className="text-sm text-gray-400">
                Share your referral links to start earning commissions!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Date</th>
                    <th className="text-left py-3 px-2">Customer</th>
                    <th className="text-left py-3 px-2">Plan</th>
                    <th className="text-left py-3 px-2">Plan Amount</th>
                    <th className="text-left py-3 px-2">Commission %</th>
                    <th className="text-left py-3 px-2">Commission</th>
                    <th className="text-left py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((commission: any) => (
                    <tr key={commission.id} className="border-b">
                      <td className="py-3 px-2">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        {commission.purchaserUsername || 'Unknown'}
                      </td>
                      <td className="py-3 px-2">
                        {commission.planName}
                      </td>
                      <td className="py-3 px-2">
                        {formatCurrency(commission.planAmount)}
                      </td>
                      <td className="py-3 px-2">
                        {commission.commissionPercentage}%
                      </td>
                      <td className="py-3 px-2 font-medium">
                        {formatCurrency(commission.commissionAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <Badge className={getStatusColor(commission.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(commission.status)}
                            {commission.status}
                          </div>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Link Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {performanceLoading ? (
            <div className="text-center py-8">Loading performance data...</div>
          ) : referralPerformance.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No performance data available yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referralPerformance.map((performance: any) => (
                <div key={performance.referralCode} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">/pricing?{performance.referralCode}</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyReferralLink(performance.referralCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Clicks</p>
                      <p className="font-medium">{performance.totalClicks || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Signups</p>
                      <p className="font-medium">{performance.totalSignups || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Purchases</p>
                      <p className="font-medium text-green-600">
                        {performance.totalPurchases || 0}
                        {performance.totalClicks > 0 && (
                          <span className="text-gray-500 ml-1">
                            ({((performance.totalPurchases || 0) / performance.totalClicks * 100).toFixed(1)}%)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}