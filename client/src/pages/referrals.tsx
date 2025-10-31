import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Users, Mail, Calendar, TrendingUp, DollarSign, Share2, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function ReferralsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState("");
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin Affiliate';

  const { data: referrals, isLoading } = useQuery({
    queryKey: ['/api/referrals/my'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/referrals/stats'],
  });

  const { data: commissionTiers } = useQuery({
    queryKey: ['/api/commission-tiers'],
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest('/api/referrals/invite', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/my'] });
      setInviteEmail("");
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      inviteMutation.mutate(inviteEmail);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole={selectedRole}>
        <div className="p-6">
          <div className="text-center py-12">Loading referral network...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={selectedRole}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Referral Network
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your referrals and track commission earnings
            </p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalReferrals || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.newReferrals || 0} this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeReferrals || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.conversionRate || 0}% conversion rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalCommissions || 0}</div>
              <p className="text-xs text-muted-foreground">
                +${stats?.monthlyCommissions || 0} this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.currentTier?.rate || 10}%</div>
              <p className="text-xs text-muted-foreground">
                {stats?.currentTier?.name || 'Standard'} tier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invite New Referral */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Invite New Referral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={inviteMutation.isPending}>
                <Mail className="mr-2 h-4 w-4" />
                Send Invite
              </Button>
            </form>
            {inviteMutation.isPending && (
              <p className="text-sm text-gray-600 mt-2">Sending invitation...</p>
            )}
          </CardContent>
        </Card>

        {/* Commission Tiers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Commission Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commissionTiers?.map((tier: any) => (
                <div
                  key={tier.id}
                  className={`p-4 border rounded-lg ${
                    stats?.currentTier?.id === tier.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {tier.name}
                    </h3>
                    {stats?.currentTier?.id === tier.id && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {tier.rate}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {tier.description}
                  </p>
                  <div className="text-xs text-gray-500">
                    Requires {tier.minReferrals} active referrals
                  </div>
                </div>
              ))}
              {(!commissionTiers || commissionTiers.length === 0) && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Commission tiers will be displayed here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals ({referrals?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referrals?.map((referral: any) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {referral.referredUserEmail || referral.email}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(referral.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        ${referral.totalCommissionEarned || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total earned
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {referral.subscriptions || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Subscriptions
                      </div>
                    </div>

                    <Badge className={getStatusColor(referral.status)}>
                      {referral.status}
                    </Badge>
                  </div>
                </div>
              ))}

              {(!referrals || referrals.length === 0) && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div className="text-gray-500 mb-4">No referrals yet</div>
                  <p className="text-sm text-gray-400 mb-6">
                    Start inviting people to grow your referral network
                  </p>
                  <Button onClick={() => document.getElementById('inviteEmail')?.focus()}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Send Your First Invite
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}