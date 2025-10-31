import { useAuth } from "@/hooks/useAuth";
import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { WhiteLabelClientDashboard } from "./WhiteLabelClientDashboard";
import { AffiliateDashboard } from "./AffiliateDashboard";
import { EndUserDashboard } from "./EndUserDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "white_label_client":
      return <WhiteLabelClientDashboard />;
    case "super_admin_affiliate":
    case "white_label_affiliate":
      return <AffiliateDashboard />;
    case "end_user":
    default:
      return <EndUserDashboard />;
  }
}

function EndUserDashboard() {
  const quickActions = [
    {
      icon: Package,
      title: "Browse Products",
      description: "Explore available products and services",
      action: "browse_products"
    },
    {
      icon: BarChart3,
      title: "My Activity",
      description: "View your usage and activity history",
      action: "view_activity"
    },
    {
      icon: Settings,
      title: "Profile Settings",
      description: "Update your profile and preferences",
      action: "profile_settings"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h1>
          <p className="text-muted-foreground">Explore the platform and discover what's available to you.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                      <Button variant="outline" size="sm">
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Welcome Message */}
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">
              You're all set!
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As an end user, you have access to browse and interact with the platform content. 
              Explore the available features and connect with the services you need.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
