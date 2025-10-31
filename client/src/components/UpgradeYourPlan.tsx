import { AlertTriangle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UpgradeYourPlanProps {
  feature: string;
  description?: string;
}

export default function UpgradeYourPlan({ feature, description }: UpgradeYourPlanProps) {
  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/pricing';
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full text-center border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader className="pb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Upgrade Your Plan
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Access to <span className="font-semibold text-orange-600">{feature}</span> is not included in your current plan.
            {description && (
              <span className="block mt-2 text-sm">{description}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3 mb-4"
            size="lg"
          >
            Upgrade Now
          </Button>
          <p className="text-sm text-gray-500">
            Contact support or upgrade to a higher-tier plan to unlock this feature.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}