import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function QuickActions() {
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const getActionsForRole = (role: string) => {
    switch (role) {
      case 'super_admin':
        return [
          {
            title: "Invite White-Label Client",
            icon: "fas fa-user-plus",
            color: "text-primary",
            action: () => setLocation("/clients"),
          },
          {
            title: "View Analytics",
            icon: "fas fa-chart-bar",
            color: "text-primary",
            action: () => setLocation("/analytics"),
          },
          {
            title: "Platform Settings",
            icon: "fas fa-cogs",
            color: "text-muted-foreground",
            action: () => setLocation("/settings"),
          },
          {
            title: "Send Broadcast",
            icon: "fas fa-envelope",
            color: "text-primary",
            action: () => setLocation("/templates"),
          },
        ];
      case 'white_label_client':
        return [
          {
            title: "Add Product",
            icon: "fas fa-plus-circle",
            color: "text-primary",
            action: () => setLocation("/products"),
          },
          {
            title: "Invite Affiliate",
            icon: "fas fa-handshake",
            color: "text-primary",
            action: () => setLocation("/affiliates"),
          },
          {
            title: "Customize Branding",
            icon: "fas fa-palette",
            color: "text-muted-foreground",
            action: () => setLocation("/settings"),
          },
          {
            title: "View Reports",
            icon: "fas fa-chart-line",
            color: "text-primary",
            action: () => setLocation("/analytics"),
          },
        ];
      case 'super_admin_affiliate':
        return [
          {
            title: "View Performance",
            icon: "fas fa-chart-line",
            color: "text-primary",
            action: () => setLocation("/analytics"),
          },
          {
            title: "Check Commissions",
            icon: "fas fa-dollar-sign",
            color: "text-primary",
            action: () => setLocation("/commissions"),
          },
          {
            title: "Referral Links",
            icon: "fas fa-link",
            color: "text-muted-foreground",
            action: () => setLocation("/links"),
          },
        ];
      case 'white_label_affiliate':
        return [
          {
            title: "My Referrals",
            icon: "fas fa-users",
            color: "text-primary",
            action: () => setLocation("/referrals"),
          },
          {
            title: "Commission Tracker",
            icon: "fas fa-dollar-sign",
            color: "text-primary",
            action: () => setLocation("/commissions"),
          },
          {
            title: "Promotional Tools",
            icon: "fas fa-bullhorn",
            color: "text-muted-foreground",
            action: () => setLocation("/links"),
          },
        ];
      default:
        return [
          {
            title: "View Dashboard",
            icon: "fas fa-tachometer-alt",
            color: "text-primary",
            action: () => setLocation("/dashboard"),
          },
          {
            title: "Check Activity",
            icon: "fas fa-activity",
            color: "text-primary",
            action: () => setLocation("/analytics"),
          },
          {
            title: "Update Profile",
            icon: "fas fa-user-edit",
            color: "text-muted-foreground",
            action: () => setLocation("/settings"),
          },
        ];
    }
  };

  const actions = getActionsForRole(currentRole);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between p-3 bg-gray-50 hover:bg-gray-100 h-auto"
              onClick={action.action}
            >
              <div className="flex items-center">
                <i className={`${action.icon} ${action.color} mr-3`}></i>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
