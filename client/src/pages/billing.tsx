import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Menu
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function BillingPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: billingInfo, isLoading } = useQuery({
    queryKey: ['/api/billing/info'],
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['/api/subscriptions/my'],
  });

  const { data: invoices } = useQuery({
    queryKey: ['/api/billing/invoices'],
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ['/api/billing/payment-methods'],
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return apiRequest('/api/billing/payment-method', 'POST', paymentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing/payment-methods'] });
    },
  });

  const downloadInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      return apiRequest(`/api/billing/invoices/${invoiceId}/download`, 'GET');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return `bg-green-100 text-green-800`;
      case 'past_due': return `bg-red-100 text-red-800`;
      case 'canceled': return `bg-gray-100 text-gray-800`;
      case 'trialing': return `bg-blue-100 text-blue-800`;
      default: return `bg-yellow-100 text-yellow-800`;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header title="Billing" subtitle="Manage your subscription and billing information" />
          <div className="p-6">
            <div className="text-center py-12">Loading billing information...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Billing & Subscriptions"
          subtitle="Manage your subscription and billing information"
        />
        
        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'subscriptions', label: 'Subscriptions' },
              { id: 'invoices', label: 'Invoices' },
              { id: 'payment', label: 'Payment Methods' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? `bg-white shadow-sm`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{
                  color: selectedTab === tab.id ? (primaryColor || '#3b82f6') : undefined
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Billing Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                    <DollarSign className="h-4 w-4" style={{ color: primaryColor }} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${billingInfo?.currentBalance || '0.00'}</div>
                    <p className="text-xs text-muted-foreground">
                      {billingInfo?.currentBalance > 0 ? 'Amount due' : 'Account credit'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                    <Calendar className="h-4 w-4" style={{ color: secondaryColor }} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {billingInfo?.nextPaymentDate 
                        ? new Date(billingInfo.nextPaymentDate).toLocaleDateString()
                        : 'N/A'
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${billingInfo?.nextPaymentAmount || '0.00'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
                    <CheckCircle className="h-4 w-4" style={{ color: primaryColor }} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{billingInfo?.planName || 'Free'}</div>
                    <Badge className={getStatusColor(billingInfo?.status || 'active')}>
                      {billingInfo?.status || 'Active'}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Billing Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {billingInfo?.recentActivity && billingInfo.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {billingInfo.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'payment' ? 'bg-green-100' : 
                              activity.type === 'refund' ? 'bg-blue-100' : 'bg-yellow-100'
                            }`}>
                              {activity.type === 'payment' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : activity.type === 'refund' ? (
                                <DollarSign className="h-4 w-4 text-blue-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${activity.amount}</p>
                            <Badge className={getPaymentStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent billing activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Subscriptions Tab */}
          {selectedTab === 'subscriptions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {subscriptions && subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      {subscriptions.map((subscription: any) => (
                        <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div style={{ color: primaryColor || '#3b82f6' }}>
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-medium">{subscription.planName}</h3>
                              <p className="text-sm text-gray-500">
                                ${subscription.amount}/{subscription.interval}
                              </p>
                              <p className="text-xs text-gray-400">
                                Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No active subscriptions</p>
                      <Button className="mt-4">Browse Plans</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Invoices Tab */}
          {selectedTab === 'invoices' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice History</CardTitle>
                </CardHeader>
                <CardContent>
                  {invoices && invoices.length > 0 ? (
                    <div className="space-y-3">
                      {invoices.map((invoice: any) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <FileText className="h-5 w-5" style={{ color: primaryColor || '#3b82f6' }} />
                            <div>
                              <h3 className="font-medium">Invoice #{invoice.number}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(invoice.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="font-medium">${invoice.amount}</p>
                              <Badge className={getPaymentStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadInvoiceMutation.mutate(invoice.id)}
                              disabled={downloadInvoiceMutation.isPending}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No invoices found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Methods Tab */}
          {selectedTab === 'payment' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentMethods && paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((method: any) => (
                        <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                            <div>
                              <h3 className="font-medium">**** **** **** {method.lastFour}</h3>
                              <p className="text-sm text-gray-500">
                                {method.brand} • Expires {method.expMonth}/{method.expYear}
                              </p>
                              {method.isDefault && (
                                <Badge variant="outline" className="mt-1">Default</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            {!method.isDefault && (
                              <Button size="sm" variant="outline">
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payment methods on file</p>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}