import AccessControlledRoute from "@/components/AccessControlledRoute";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/useTheme";
import { Plus, Users, DollarSign } from "lucide-react";

export default function AffiliatesPage() {
  const { primaryColor, secondaryColor } = useTheme();
  const { data: affiliates, isLoading } = useQuery({
    queryKey: ['/api/affiliates'],
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Affiliates"
          subtitle="Manage your affiliate partners and track their performance"
        />
        
        <div className="p-6">
          <AccessControlledRoute 
            feature="affiliates" 
            featureName="Affiliate Management"
            description="Recruit, manage, and track affiliate partners who promote your products. Set commission rates and monitor their performance."
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Affiliate Partners</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Invite Affiliate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Affiliates</p>
                      <p className="text-2xl font-bold">{affiliates?.length || 0}</p>
                    </div>
                    <Users className="w-8 h-8" style={{ color: primaryColor }} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                      <p className="text-2xl font-bold">$2,450</p>
                    </div>
                    <DollarSign className="w-8 h-8" style={{ color: secondaryColor }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Affiliate List</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoading && (!affiliates || affiliates.length === 0) ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No affiliates yet</h3>
                    <p className="text-gray-600 mb-4">Start building your affiliate network by inviting your first partner</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Invite First Affiliate
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {affiliates?.map((affiliate: any) => (
                      <div key={affiliate.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{affiliate.name || affiliate.email}</h4>
                          <p className="text-sm text-gray-600">{affiliate.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Commission Rate</p>
                          <p className="text-lg font-bold text-green-600">{affiliate.commissionRate || 10}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </AccessControlledRoute>
        </div>
      </main>
    </div>
  );
}