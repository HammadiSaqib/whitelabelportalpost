import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Users, HandHeart, Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/analytics/stats"],
  });

  const statsData = [
    {
      title: "Total Revenue",
      value: stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0",
      change: "+12.5% from last month",
      trend: "up",
      icon: DollarSign,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      title: "Active Clients",
      value: stats ? stats.activeClients.toString() : "0",
      change: "+8.2% from last month",
      trend: "up",
      icon: Users,
      colorClass: "text-secondary-foreground",
      bgClass: "bg-secondary/10",
    },
    {
      title: "Commission Paid",
      value: stats ? `$${stats.commissionsPaid.toLocaleString()}` : "$0",
      change: "-2.1% from last month",
      trend: "down",
      icon: HandHeart,
      colorClass: "text-accent-foreground",
      bgClass: "bg-accent/10",
    },
    {
      title: "Active Plans",
      value: stats ? stats.activePlans.toString() : "0",
      change: "2 new this month",
      trend: "up",
      icon: Package,
      colorClass: "text-primary",
      bgClass: "bg-primary/5",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="mr-1 h-3 w-3" />;
      case "down":
        return <TrendingDown className="mr-1 h-3 w-3" />;
      default:
        return <Minus className="mr-1 h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-primary";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className={cn("text-sm mt-1 flex items-center", getTrendColor(stat.trend))}>
                    {getTrendIcon(stat.trend)}
                    {stat.change}
                  </p>
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgClass)}>
                  <Icon className={cn("text-xl", stat.colorClass)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
