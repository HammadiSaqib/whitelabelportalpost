import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/useTheme";
import { createIconStyle } from "@/utils/iconColors";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Eye, 
  Calendar,
  Building2,
  Package,
  ShoppingCart,
  BarChart3,
  X
} from "lucide-react";

interface WhiteLabelClient {
  id: number;
  businessName: string;
  domainPath: string;
  userEmail: string;
  userName: string;
  totalPlans: number;
  totalRevenue: number;
  totalEndUsers: number;
  createdAt: string;
}

interface PlanAnalytic {
  planId: number;
  planName: string;
  totalSales: number;
  totalRevenue: number;
}

interface PurchaseRecord {
  id: number;
  amount: number;
  planName: string;
  userEmail: string;
  userName: string;
  purchaseDate: string;
}

interface PlanPurchaser {
  id: number;
  amount: number;
  userEmail: string;
  userName: string;
  userId: string;
  userRole: string;
  purchaseDate: string;
  isWhiteLabelClient: boolean;
  isEndUser: boolean;
  whiteLabelBusinessName?: string;
  whiteLabelDomainPath?: string;
}

export default function SuperAdminPlanAnalytics() {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showPurchasersModal, setShowPurchasersModal] = useState(false);
  const { primaryColor, secondaryColor } = useTheme();
  
  // Fetch Super Admin specific data
  const { data: whiteLabelClients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/super-admin/white-labels'],
    onSuccess: (data) => {
      console.log('🏢 WHITE LABEL CLIENTS DATA:', data);
      console.log('📊 WHITE LABEL CLIENTS COUNT:', data?.length || 0);
    },
    onError: (error) => {
      console.error('💥 WHITE LABEL CLIENTS ERROR:', error);
    }
  });

  const { data: mainSitePlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/super-admin/main-site-plans'],
    onSuccess: (data) => {
      console.log('📋 MAIN SITE PLANS DATA:', data);
      console.log('📊 MAIN SITE PLANS COUNT:', data?.length || 0);
    },
    onError: (error) => {
      console.error('💥 MAIN SITE PLANS ERROR:', error);
    }
  });

  const { data: planAnalytics = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/super-admin/plan-analytics'],
    onSuccess: (data) => {
      console.log('📈 PLAN ANALYTICS DATA:', data);
      console.log('📊 PLAN ANALYTICS COUNT:', data?.length || 0);
      if (data && data.length > 0) {
        data.forEach((plan: PlanAnalytic, index: number) => {
          console.log(`  Plan ${index + 1}: "${plan.planName}" - Sales: ${plan.totalSales}, Revenue: $${plan.totalRevenue}`);
        });
      }
    },
    onError: (error) => {
      console.error('💥 PLAN ANALYTICS ERROR:', error);
    }
  });

  const { data: purchaseHistory = [], isLoading: purchasesLoading } = useQuery({
    queryKey: ['/api/super-admin/purchase-history'],
    onSuccess: (data) => {
      console.log('🛒 PURCHASE HISTORY DATA:', data);
      console.log('📊 PURCHASE HISTORY COUNT:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('💰 RECENT PURCHASES:');
        data.slice(0, 5).forEach((purchase: PurchaseRecord, index: number) => {
          console.log(`  Purchase ${index + 1}: ${purchase.planName} - $${purchase.amount} by ${purchase.userEmail}`);
        });
      }
    },
    onError: (error) => {
      console.error('💥 PURCHASE HISTORY ERROR:', error);
    }
  });

  // Fetch plan purchasers when a plan is selected
  const { data: planPurchasers = [], isLoading: purchasersLoading } = useQuery({
    queryKey: [`/api/super-admin/plan-purchasers/${selectedPlanId}`],
    enabled: !!selectedPlanId,
    onSuccess: (data) => {
      console.log('👥 PLAN PURCHASERS DATA for Plan ID', selectedPlanId, ':', data);
      console.log('📊 PLAN PURCHASERS COUNT:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('🛒 PURCHASERS LIST:');
        data.forEach((purchaser: PlanPurchaser, index: number) => {
          console.log(`  Purchaser ${index + 1}: ${purchaser.userEmail} - $${purchaser.amount} (${purchaser.userRole})`);
        });
      }
    },
    onError: (error) => {
      console.error('💥 PLAN PURCHASERS ERROR for Plan ID', selectedPlanId, ':', error);
    }
  });

  console.log('🎯 PLAN ANALYTICS DEBUG - Plan Purchasers:', planPurchasers, 'Selected Plan ID:', selectedPlanId);

  // Fetch white label tracking data


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total stats
  const totalMainSiteRevenue = (planAnalytics as PlanAnalytic[]).reduce((sum, plan) => sum + plan.totalRevenue, 0);
  const totalMainSiteSales = (planAnalytics as PlanAnalytic[]).reduce((sum, plan) => sum + plan.totalSales, 0);
  const totalWhiteLabelRevenue = (whiteLabelClients as WhiteLabelClient[]).reduce((sum: number, client: WhiteLabelClient) => sum + client.totalRevenue, 0);
  const totalWhiteLabelClients = (whiteLabelClients as WhiteLabelClient[]).filter((client: WhiteLabelClient) => client.totalPlans > 0).length;

  const handlePlanClick = (planId: number) => {
    setSelectedPlanId(planId);
    setShowPurchasersModal(true);
  };

  const closePurchasersModal = () => {
    setShowPurchasersModal(false);
    setSelectedPlanId(null);
  };

  const selectedPlan = (planAnalytics as PlanAnalytic[]).find(plan => plan.planId === selectedPlanId);

  if (clientsLoading || plansLoading || analyticsLoading || purchasesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor || '#3b82f6' }}></div>
        <p className="ml-2" style={{ color: secondaryColor || '#64748b' }}>Loading platform analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" style={{ color: primaryColor || '#3b82f6' }} />
        <h2 className="text-2xl font-bold" style={{ color: primaryColor || '#111827' }}>Plan Sales & White Label Activity</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: secondaryColor || '#64748b' }}>Main Site Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalMainSiteRevenue)}</p>
                <p className="text-sm" style={{ color: primaryColor || '#3b82f6' }}>{totalMainSiteSales} sales</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor || '#3b82f6'}20` }}>
                <DollarSign className="h-6 w-6" style={{ color: primaryColor || '#3b82f6' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: secondaryColor || '#64748b' }}>Active White Labels</p>
                <p className="text-2xl font-bold">{totalWhiteLabelClients}</p>
                <p className="text-sm" style={{ color: secondaryColor || '#64748b' }}>{(whiteLabelClients as WhiteLabelClient[]).length} total clients</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}>
                <Building2 className="h-6 w-6" style={createIconStyle('Building2', { primaryColor, secondaryColor })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: secondaryColor || '#64748b' }}>White Label Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalWhiteLabelRevenue)}</p>
                <p className="text-sm text-purple-600">Client-generated</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: secondaryColor || '#64748b' }}>Main Site Plans</p>
                <p className="text-2xl font-bold">{(mainSitePlans as any[]).length}</p>
                <p className="text-sm" style={{ color: secondaryColor || '#64748b' }}>Platform plans</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}>
                <Package className="h-6 w-6" style={createIconStyle('Package', { primaryColor, secondaryColor })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* White Label Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              White Label Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(whiteLabelClients as WhiteLabelClient[]).length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 mx-auto mb-4" style={{ color: secondaryColor || '#9ca3af' }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: primaryColor || '#111827' }}>No White Label Clients</h3>
                  <p style={{ color: secondaryColor || '#64748b' }}>White label clients will appear here once they sign up.</p>
                </div>
              ) : (
                (whiteLabelClients as WhiteLabelClient[]).map((client: WhiteLabelClient) => (
                  <div key={client.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${secondaryColor || '#f8fafc'}20` }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium" style={{ color: primaryColor || '#111827' }}>{client.businessName}</h3>
                        {client.totalPlans > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: secondaryColor || '#64748b' }}>{client.userEmail}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: secondaryColor || '#6b7280' }}>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(client.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {client.totalPlans} plans
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {client.totalEndUsers} users
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: primaryColor || '#111827' }}>
                        {formatCurrency(client.totalRevenue)}
                      </div>
                      <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>
                        Total Revenue
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {(purchaseHistory as PurchaseRecord[]).length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4" style={{ color: secondaryColor || '#9ca3af' }} />
                  <h3 className="text-lg font-medium mb-2" style={{ color: primaryColor || '#111827' }}>No Recent Purchases</h3>
                  <p style={{ color: secondaryColor || '#64748b' }}>Purchase history will appear here.</p>
                </div>
              ) : (
                (purchaseHistory as PurchaseRecord[]).slice(0, 10).map((purchase: PurchaseRecord) => (
                  <div key={purchase.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${primaryColor || '#3B82F6'}20` }}>
                      <ShoppingCart className="h-4 w-4" style={createIconStyle('ShoppingCart', { primaryColor, secondaryColor })} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Plan Purchase: {purchase.planName}</p>
                      <p className="text-sm" style={{ color: secondaryColor || '#64748b' }}>
                        {purchase.userName || purchase.userEmail}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium" style={{ color: primaryColor || '#111827' }}>{formatCurrency(purchase.amount)}</div>
                      <div className="text-sm" style={{ color: secondaryColor || '#6b7280' }}>
                        {formatDate(purchase.purchaseDate)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Plan Analytics
            <Badge variant="outline" className="ml-2">Main Site Plans Only</Badge>
          </CardTitle>
          <p className="text-sm mt-1" style={{ color: secondaryColor || '#64748b' }}>
            Track sales performance and buyer information for main site plans
          </p>
        </CardHeader>
        <CardContent>
          {(planAnalytics as PlanAnalytic[]).length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" style={{ color: secondaryColor || '#9ca3af' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: primaryColor || '#111827' }}>No Plan Sales Yet</h3>
              <p style={{ color: secondaryColor || '#64748b' }}>
                Sales data for main site plans will appear here once purchases are made.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(planAnalytics as PlanAnalytic[]).map((plan: PlanAnalytic) => (
                <div 
                  key={plan.planId} 
                  className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  style={{ 
                    borderColor: `${primaryColor || '#e5e7eb'}40`,
                    '&:hover': { borderColor: `${primaryColor || '#3b82f6'}60` }
                  }}
                  onClick={() => handlePlanClick(plan.planId)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: primaryColor || '#111827' }}>{plan.planName}</h3>
                      <p className="text-sm" style={{ color: secondaryColor || '#64748b' }}>Click to view purchasers</p>
                    </div>
                    <Eye className="h-5 w-5" style={{ color: secondaryColor || '#9ca3af' }} />
                  </div>
                  
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${primaryColor || '#3b82f6'}10` }}>
                      <div className="text-xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>
                        {formatCurrency(plan.totalRevenue)}
                      </div>
                      <div className="text-xs mt-1" style={{ color: secondaryColor || '#64748b' }}>Total Revenue</div>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${primaryColor || '#3b82f6'}10` }}>
                      <div className="text-xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>
                        {plan.totalSales}
                      </div>
                      <div className="text-xs mt-1" style={{ color: secondaryColor || '#64748b' }}>Total Sales</div>
                    </div>
                  </div>
                  
                  {/* Performance Indicator */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm" style={{ color: secondaryColor || '#64748b' }}>
                        <TrendingUp className="h-4 w-4" />
                        <span>Performance:</span>
                      </div>
                      <Badge 
                        variant={
                          plan.totalRevenue > 100 ? 'default' : 
                          plan.totalRevenue > 50 ? 'secondary' : 
                          'outline'
                        }
                        className={
                          plan.totalRevenue > 100 ? 'bg-green-100 text-green-800' : 
                          plan.totalRevenue > 50 ? 'text-white' : 
                          'text-gray-800'
                        }
                        style={
                          plan.totalRevenue > 50 && plan.totalRevenue <= 100 ? 
                          { backgroundColor: primaryColor || '#3b82f6' } : 
                          plan.totalRevenue <= 50 ? 
                          { backgroundColor: `${secondaryColor || '#64748b'}20`, color: secondaryColor || '#64748b' } : 
                          {}
                        }
                      >
                        {plan.totalRevenue > 100 ? 'Excellent' : 
                         plan.totalRevenue > 50 ? 'Good' : 
                         'Getting Started'}
                      </Badge>
                    </div>
                    <div className="text-sm" style={{ color: secondaryColor || '#6b7280' }}>
                      {plan.totalSales > 0 ? 
                        `$${(plan.totalRevenue / plan.totalSales).toFixed(2)} avg sale` : 
                        'No sales yet'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase History
            <Badge variant="outline" className="ml-2">Main Site Plans</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4" style={{ color: secondaryColor || '#9ca3af' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: primaryColor || '#111827' }}>No Purchase History</h3>
              <p style={{ color: secondaryColor || '#64748b' }}>Purchase records will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ borderColor: `${secondaryColor || '#e5e7eb'}40` }}>
                    <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>User</th>
                    <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Plan</th>
                    <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Amount</th>
                    <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Date</th>
                    <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseHistory.slice(0, 15).map((purchase: PurchaseRecord) => (
                    <tr key={purchase.id} className="border-b hover:bg-opacity-50 transition-colors" 
                        style={{ 
                          borderColor: `${secondaryColor || '#f3f4f6'}60`,
                          '&:hover': { backgroundColor: `${secondaryColor || '#f8fafc'}30` }
                        }}>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium" style={{ color: primaryColor || '#111827' }}>
                            {purchase.userName || 'Unknown User'}
                          </div>
                          <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>{purchase.userEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium" style={{ color: primaryColor || '#111827' }}>{purchase.planName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium" style={{ color: primaryColor || '#111827' }}>
                          {formatCurrency(purchase.amount)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div style={{ color: secondaryColor || '#64748b' }}>{formatDate(purchase.purchaseDate)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>



      {/* Plan Purchasers Modal */}
      <Dialog open={showPurchasersModal} onOpenChange={setShowPurchasersModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Plan Purchasers: {selectedPlan?.planName}
              <Badge variant="outline" className="ml-2">
                {(planPurchasers as any[]).length} purchasers
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {purchasersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor || '#3b82f6' }}></div>
                <p className="ml-2" style={{ color: secondaryColor || '#64748b' }}>Loading purchasers...</p>
              </div>
            ) : (planPurchasers as any[]).length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4" style={{ color: secondaryColor || '#9ca3af' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: primaryColor || '#111827' }}>No Purchasers Yet</h3>
                <p style={{ color: secondaryColor || '#64748b' }}>This plan hasn't been purchased yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: primaryColor || '#3b82f6' }}>
                          {(planPurchasers as any[]).filter((p: any) => p.isWhiteLabelClient).length}
                        </div>
                        <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>White Label Clients</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(planPurchasers as any[]).filter((p: any) => p.isEndUser).length}
                        </div>
                        <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>End Users</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency((planPurchasers as any[]).reduce((sum: number, p: any) => sum + p.amount, 0))}
                        </div>
                        <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>Total Revenue</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Purchaser List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b" style={{ borderColor: `${secondaryColor || '#e5e7eb'}40` }}>
                        <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Purchaser</th>
                        <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Type</th>
                        <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>White Label</th>
                        <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Amount</th>
                        <th className="py-3 px-4 font-medium" style={{ color: primaryColor || '#111827' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(planPurchasers as any[]).map((purchaser: any) => (
                        <tr key={purchaser.id} className="border-b hover:bg-opacity-50 transition-colors" 
                            style={{ 
                              borderColor: `${secondaryColor || '#f3f4f6'}60`,
                              '&:hover': { backgroundColor: `${secondaryColor || '#f8fafc'}30` }
                            }}>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium" style={{ color: primaryColor || '#111827' }}>
                                {purchaser.userName || 'Unknown User'}
                              </div>
                              <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>{purchaser.userEmail}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={purchaser.isWhiteLabelClient ? 'default' : 'secondary'}
                              className={
                                purchaser.isWhiteLabelClient ? 
                                'text-white' : 
                                'text-gray-800'
                              }
                              style={
                                purchaser.isWhiteLabelClient ? 
                                { backgroundColor: primaryColor || '#3b82f6' } : 
                                { backgroundColor: `${secondaryColor || '#64748b'}20`, color: secondaryColor || '#64748b' }
                              }
                            >
                              {purchaser.isWhiteLabelClient ? 'White Label Client' : 'End User'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {purchaser.whiteLabelBusinessName ? (
                              <div>
                                <div className="font-medium" style={{ color: primaryColor || '#111827' }}>
                                  {purchaser.whiteLabelBusinessName}
                                </div>
                                <div className="text-sm" style={{ color: secondaryColor || '#64748b' }}>
                                  /{purchaser.whiteLabelDomainPath}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: secondaryColor || '#6b7280' }}>Direct purchase</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-green-600">
                              {formatCurrency(purchaser.amount)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-600">{formatDate(purchaser.purchaseDate)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}