import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/hooks/useRole";
import { DollarSign, Users, HandHeart, Package, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  activeClients: number;
  commissionsPaid: number;
  activePlans: number;
}

export default function StatsCards() {
  const { currentRole } = useRole();
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-modern animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 bg-muted rounded-xl"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      bgColor: "bg-gradient-to-br from-emerald-400 to-teal-500",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-700",
    },
    {
      title: "Active Clients",
      value: stats.activeClients.toString(),
      change: "+8.2%",
      changeType: "positive" as const,
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-400 to-indigo-500",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      title: "Commission Paid",
      value: formatCurrency(stats.commissionsPaid),
      change: "-2.1%",
      changeType: "negative" as const,
      icon: HandHeart,
      bgColor: "bg-gradient-to-br from-purple-400 to-pink-500",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
    },
    {
      title: "Active Plans",
      value: stats.activePlans.toString(),
      change: "+2 new this month",
      changeType: "positive" as const,
      icon: Package,
      bgColor: "bg-gradient-to-br from-orange-400 to-red-500",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      borderColor: "border-orange-200 dark:border-orange-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.changeType === 'positive' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={stat.title} className={`card-modern card-hover animate-scale-in overflow-hidden group border-2 ${stat.borderColor} ${stat.cardBg} shadow-lg hover:shadow-xl transition-all duration-300 hover-glow-blue`}>
            <CardContent className="p-6 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity animate-shimmer" />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200 hover-bounce animate-pulse-rainbow`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor} group-hover:animate-wiggle`} />
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full hover-float ${
                    stat.changeType === 'positive' 
                      ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30'
                  }`}>
                    <TrendIcon className="w-3 h-3 mr-1 group-hover:animate-heartbeat" />
                    {stat.change}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors animate-gradient-x bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
