import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  changeType: "positive" | "negative";
  bgColor: string;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  changeType,
  bgColor 
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className={`text-sm mt-1 flex items-center ${
              changeType === "positive" ? "text-success" : "text-warning"
            }`}>
              {changeType === "positive" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </p>
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
