import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Activity } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function RecentActivity() {
  const { user } = useAuth();
  
  // Determine which endpoint to use based on user role
  const getActivitiesEndpoint = () => {
    const selectedRole = sessionStorage.getItem('selectedRole') || user?.role;
    
    // White label clients should see their domain-specific activities
    if (selectedRole === 'white_label_client' || selectedRole === 'White-Label Client' || selectedRole === 'White Label') {
      return '/api/end-users/activities';
    }
    
    // Super admins and others see general platform activities
    return '/api/activities';
  };

  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: [getActivitiesEndpoint(), Date.now()], // Add timestamp to force fresh data
    refetchInterval: 5000, // Refresh every 5 seconds for testing
    staleTime: 0, // Consider data stale immediately
    cacheTime: 0, // Don't cache data
    enabled: !!user, // Only fetch when user is available
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'client_joined':
        return { icon: 'fas fa-user-plus', bgColor: 'bg-green-50', iconColor: 'text-green-600' };
      case 'commission_paid':
        return { icon: 'fas fa-dollar-sign', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' };
      case 'affiliate_approved':
        return { icon: 'fas fa-handshake', bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' };
      case 'plan_created':
        return { icon: 'fas fa-box', bgColor: 'bg-purple-50', iconColor: 'text-purple-600' };
      default:
        return { icon: 'fas fa-info-circle', bgColor: 'bg-gray-50', iconColor: 'text-gray-600' };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clock text-gray-400"></i>
            </div>
            <p className="text-gray-500">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 6).map((activity) => {
            const iconData = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${iconData.bgColor} rounded-full flex items-center justify-center`}>
                  <i className={`${iconData.icon} ${iconData.iconColor} text-xs`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-primary hover:text-blue-700">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
