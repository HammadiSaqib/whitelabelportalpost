export type UserRole = "super_admin" | "super_admin_affiliate" | "white_label_client" | "white_label_affiliate" | "end_user";

export interface DashboardStats {
  totalRevenue: number;
  activeClients: number;
  commissionPaid: number;
  activePlans: number;
}

export interface CreatePlanFormData {
  name: string;
  description: string;
  monthlyPrice: string;
  affiliateCommissionPercent: string;
  maxUsers: string;
  features: string[];
}
