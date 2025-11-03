import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Users, MousePointer, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReferralLink {
  id: number;
  userId: string;
  referralCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReferralStats {
  totalClicks: number;
  totalSignups: number;
  conversionRate: number;
}

export function ReferralTracking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch referral link
  const { data: referralLink, isLoading: linkLoading } = useQuery<ReferralLink>({
    queryKey: ["/api/referral-link"],
    retry: false,
  });

  // Fetch referral stats
  const { data: stats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ["/api/referral-stats"],
    retry: false,
  });

  // Create referral link mutation
  const createLinkMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/referral-link", "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/referral-link"] });
      queryClient.invalidateQueries({ queryKey: ["/api/referral-stats"] });
      toast({
        title: "Success",
        description: "Your referral link has been created!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create referral link",
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = () => {
    if (!referralLink) return;
    
    const fullLink = `${window.location.origin}?ref=${referralLink.referralCode}`;
    navigator.clipboard.writeText(fullLink);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const handleCreateLink = () => {
    createLinkMutation.mutate();
  };

  if (linkLoading || statsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Referral Tracking</h2>
          <p className="text-muted-foreground">
            Share your referral link to earn commissions from White Label client signups
          </p>
        </div>
      </div>

      {/* Referral Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with potential White Label clients to track signups and earn commissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referralLink ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-300">
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Code: {referralLink.referralCode}
                </span>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono">
                  {window.location.origin}?ref={referralLink.referralCode}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No Referral Link Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your unique referral link to start tracking White Label client signups
              </p>
              <Button
                onClick={handleCreateLink}
                disabled={createLinkMutation.isPending}
              >
                {createLinkMutation.isPending ? "Creating..." : "Create Referral Link"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {referralLink && stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                Link visits from potential clients
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">White Label Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSignups}</div>
              <p className="text-xs text-muted-foreground">
                Successful client registrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Clicks to signup conversion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Referral Tracking Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Share Your Link</h4>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with potential White Label clients through email, social media, or direct contact.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Track Engagement</h4>
              <p className="text-sm text-muted-foreground">
                Monitor how many people click your link and track their interest in the platform.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Earn Commissions</h4>
              <p className="text-sm text-muted-foreground">
                When a referred user signs up as a White Label client, you earn commissions on their subscription.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">4. Get Paid</h4>
              <p className="text-sm text-muted-foreground">
                Receive monthly commission payouts based on your successful referrals and their subscription activity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}