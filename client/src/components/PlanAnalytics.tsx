import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Search,
  Eye,
  Calendar,
  CreditCard
} from "lucide-react";

interface PlanAnalyticsData {
  planId: number;
  planName: string;
  totalSales: number;
  totalRevenue: number;
  totalPurchases: number;
  purchasers: Array<{
    userId: string;
    email: string;
    purchaseDate: string;
    amount: number;
    transactionId: string;
    status: string;
    businessName: string;
    whiteLabelId: number;
  }>;
  recentPurchases: Array<{
    userId: string;
    email: string;
    purchaseDate: string;
    amount: number;
    transactionId: string;
    businessName: string;
  }>;
}

export default function PlanAnalytics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanAnalyticsData | null>(null);

  const { data: planAnalytics = [], isLoading } = useQuery<PlanAnalyticsData[]>({
    queryKey: ["/api/plans/analytics"],
  });

  const filteredPlans = planAnalytics.filter(plan =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date not available';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.planName} Analytics</h3>
            <p className="text-gray-600">Detailed sales and customer information</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedPlan(null)}
            className="flex items-center gap-2"
          >
            ← Back to Plans
          </Button>
        </div>

        {/* Plan Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedPlan.totalSales}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedPlan.totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Purchases</p>
                  <p className="text-2xl font-bold text-purple-600">{selectedPlan.totalPurchases}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Buyers</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedPlan.purchasers?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Plan Purchasers
            </CardTitle>
            <CardDescription>
              All customers who purchased this plan across all white-label clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPlan.purchasers && selectedPlan.purchasers.length > 0 ? (
                selectedPlan.purchasers.map((purchaser, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{purchaser.email}</p>
                        <p className="text-sm text-gray-600">
                          Purchased on {formatDate(purchaser.purchaseDate)}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          via {purchaser.businessName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(purchaser.amount)}</p>
                      <Badge variant={purchaser.status === 'completed' ? 'default' : 'secondary'}>
                        {purchaser.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No purchases yet for this plan</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Purchases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Purchases
            </CardTitle>
            <CardDescription>
              Latest transactions for this plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPlan.recentPurchases && selectedPlan.recentPurchases.length > 0 ? (
                selectedPlan.recentPurchases.map((purchase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{purchase.email}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(purchase.purchaseDate)} • {purchase.transactionId}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          via {purchase.businessName}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">{formatCurrency(purchase.amount)}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-gray-500">No recent purchases</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Plan Analytics</h3>
          <p className="text-gray-600">Track sales performance and buyer information for all plans</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.planId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.planName}</span>
                <Badge variant="secondary">{plan.totalSales} sales</Badge>
              </CardTitle>
              <CardDescription>
                Plan performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Revenue */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Total Revenue</span>
                  </div>
                  <span className="font-semibold text-green-600">{formatCurrency(plan.totalRevenue)}</span>
                </div>

                {/* Purchases */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Purchases</span>
                  </div>
                  <span className="font-semibold text-blue-600">{plan.totalSales}</span>
                </div>

                {/* Unique Buyers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Unique Buyers</span>
                  </div>
                  <span className="font-semibold text-purple-600">{plan.totalSales}</span>
                </div>

                {/* View Details Button */}
                <Button 
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No plans found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first plan to see analytics'}
          </p>
        </div>
      )}
    </div>
  );
}