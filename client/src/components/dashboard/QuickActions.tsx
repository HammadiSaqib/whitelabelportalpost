import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, BarChart3, Settings, Mail, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const quickActions = {
  super_admin: [
    {
      icon: UserPlus,
      label: "Invite White-Label Client",
      description: "Send invitation to new client",
      action: "invite_client",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "Platform performance metrics",
      action: "view_analytics",
    },
    {
      icon: Settings,
      label: "Platform Settings",
      description: "Configure platform options",
      action: "platform_settings",
    },
    {
      icon: Mail,
      label: "Send Broadcast",
      description: "Email all clients",
      action: "send_broadcast",
    },
  ],
  white_label_client: [
    {
      icon: UserPlus,
      label: "Invite End Users",
      description: "Add users to your portal",
      action: "invite_users",
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "User engagement metrics",
      action: "view_analytics",
    },
    {
      icon: Settings,
      label: "Brand Settings",
      description: "Customize your portal",
      action: "brand_settings",
    },
    {
      icon: Mail,
      label: "Email Campaign",
      description: "Message your users",
      action: "email_campaign",
    },
  ],
  super_admin_affiliate: [
    {
      icon: UserPlus,
      label: "Find Prospects",
      description: "Discover potential clients",
      action: "find_prospects",
    },
    {
      icon: BarChart3,
      label: "My Performance",
      description: "View referral metrics",
      action: "view_performance",
    },
  ],
  white_label_affiliate: [
    {
      icon: UserPlus,
      label: "Refer Users",
      description: "Share referral links",
      action: "refer_users",
    },
    {
      icon: BarChart3,
      label: "My Commissions",
      description: "Track earnings",
      action: "view_commissions",
    },
  ],
  end_user: [
    {
      icon: BarChart3,
      label: "View Activity",
      description: "Your usage stats",
      action: "view_activity",
    },
    {
      icon: Settings,
      label: "Profile Settings",
      description: "Update preferences",
      action: "profile_settings",
    },
  ],
};

export function QuickActions() {
  const { user } = useAuth();
  const userRole = user?.role || "end_user";
  const actions = quickActions[userRole as keyof typeof quickActions] || quickActions.end_user;

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // TODO: Implement action handlers
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between h-auto p-3 hover:bg-muted"
                onClick={() => handleAction(action.action)}
              >
                <div className="flex items-center text-left">
                  <Icon className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
