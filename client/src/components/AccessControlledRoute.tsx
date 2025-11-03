import { ReactNode } from "react";
import { useUserAccess, hasAccess } from "@/hooks/useUserAccess";
import UpgradeYourPlan from "./UpgradeYourPlan";

interface AccessControlledRouteProps {
  feature: 'categories' | 'affiliates' | 'landing_page_builder';
  featureName: string;
  description?: string;
  children: ReactNode;
}

export default function AccessControlledRoute({ 
  feature, 
  featureName, 
  description, 
  children 
}: AccessControlledRouteProps) {
  const { data: userAccess, isLoading } = useUserAccess();

  // Show loading while checking access
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>;
  }

  // Check if user has access to this feature
  if (!hasAccess(userAccess, feature)) {
    return (
      <UpgradeYourPlan 
        feature={featureName} 
        description={description}
      />
    );
  }

  // User has access, render the children
  return <>{children}</>;
}