import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserPlus, DollarSign, HandHeart, Package, Settings, Users, ShoppingCart, CreditCard } from "lucide-react";
import type { ActivityLog } from "@shared/schema";

const activityIcons = {
  plan_created: Package,
  plan_updated: Package,
  plan_deleted: Package,
  plan_subscribed: ShoppingCart,
  product_created: Package,
  branding_updated: Settings,
  user_invited: UserPlus,
  user_registered: UserPlus,
  user_login: Users,
  commission_paid: DollarSign,
  affiliate_approved: HandHeart,
  subscription_created: Users,
  referral_earned: DollarSign,
  purchase_completed: CreditCard,
  default: Settings,
};

const activityColors = {
  plan_created: "text-green-600 bg-green-50",
  plan_updated: "text-blue-600 bg-blue-50",
  plan_deleted: "text-red-600 bg-red-50",
  plan_subscribed: "text-green-600 bg-green-50",
  product_created: "text-purple-600 bg-purple-50",
  branding_updated: "text-yellow-600 bg-yellow-50",
  user_invited: "text-green-600 bg-green-50",
  user_registered: "text-blue-600 bg-blue-50",
  user_login: "text-gray-600 bg-gray-50",
  commission_paid: "text-blue-600 bg-blue-50",
  affiliate_approved: "text-yellow-600 bg-yellow-50",
  subscription_created: "text-purple-600 bg-purple-50",
  referral_earned: "text-green-600 bg-green-50",
  purchase_completed: "text-green-600 bg-green-50",
  default: "text-gray-600 bg-gray-50",
};

export function RecentActivity() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["/api/activities"],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const getActivityIcon = (action: string) => {
    return activityIcons[action as keyof typeof activityIcons] || activityIcons.default;
  };

  const getActivityColors = (action: string) => {
    return activityColors[action as keyof typeof activityColors] || activityColors.default;
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return "Some time ago";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.length > 0 ? (
            <>
              {activities.slice(0, 6).map((activity: ActivityLog) => {
                const Icon = getActivityIcon(activity.type || activity.action);
                const colors = getActivityColors(activity.type || activity.action);
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.createdAt ? formatTimeAgo(activity.createdAt.toString()) : "Some time ago"}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/80">
                View All Activity
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-xs mt-1">Activity will appear here as you use the platform</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
