import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Settings as SettingsIcon, 
  Trash2, 
  Activity, 
  Zap, 
  CreditCard,
  Mail,
  BarChart3,
  MessageSquare,
  Calendar,
  ExternalLink
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function IntegrationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'White-Label Client';

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['/api/integrations'],
  });

  const { data: availableServices } = useQuery({
    queryKey: ['/api/integrations/available'],
  });

  const { data: logs } = useQuery({
    queryKey: ['/api/integrations/logs'],
  });

  const configureMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/integrations/configure', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
      setShowConfigModal(false);
      setSelectedIntegration(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return apiRequest(`/api/integrations/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/integrations/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integrations'] });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/integrations/${id}/test`, 'POST');
    },
  });

  const handleConfigure = (service: any) => {
    setSelectedIntegration(service);
    setShowConfigModal(true);
  };

  const handleSubmitConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const configData = {
      serviceName: selectedIntegration.name,
      apiKey: formData.get('apiKey'),
      webhookUrl: formData.get('webhookUrl'),
      settings: {
        enabled: true,
        autoSync: formData.get('autoSync') === 'on',
        syncInterval: formData.get('syncInterval') || '24',
      },
    };
    configureMutation.mutate(configData);
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'nmi': return <CreditCard className="h-6 w-6" />;
      case 'nmi payment gateway': return <CreditCard className="h-6 w-6" />;
      case 'mailchimp': return <Mail className="h-6 w-6" />;
      case 'google analytics': return <BarChart3 className="h-6 w-6" />;
      case 'slack': return <MessageSquare className="h-6 w-6" />;
      case 'zapier': return <Zap className="h-6 w-6" />;
      case 'calendly': return <Calendar className="h-6 w-6" />;
      default: return <ExternalLink className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header title="Integrations" subtitle="Connect third-party services to enhance your platform" />
          <div className="p-6">
            <div className="text-center py-12">Loading integrations...</div>
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
          title="Integrations"
          subtitle="Connect third-party services to enhance your platform"
        />
        
        <div className="p-6">
          {/* Connected Integrations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
            </CardHeader>
            <CardContent>
              {integrations && integrations.length > 0 ? (
                <div className="space-y-4">
                  {integrations.map((integration: any, index: number) => (
                    <div key={integration.id || `integration-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-blue-600">
                          {getServiceIcon(integration.serviceName)}
                        </div>
                        <div>
                          <h3 className="font-medium">{integration.displayName}</h3>
                          <p className="text-sm text-gray-500">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => testConnectionMutation.mutate(integration.id)}
                          disabled={testConnectionMutation.isPending}
                        >
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConfigure(integration)}
                        >
                          <SettingsIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(integration.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No integrations configured yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Services</CardTitle>
            </CardHeader>
            <CardContent>
              {availableServices && availableServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableServices.map((service: any, index: number) => (
                    <div key={service.name || `service-${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-blue-600">
                          {getServiceIcon(service.name)}
                        </div>
                        <h3 className="font-medium">{service.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{service.category}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleConfigure(service)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No available services</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integration Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {logs && logs.length > 0 ? (
                <div className="space-y-3">
                  {logs.slice(0, 10).map((log: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.serviceName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Modal */}
          {showConfigModal && selectedIntegration && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  Configure {selectedIntegration.name || selectedIntegration.displayName}
                </h2>
                <form onSubmit={handleSubmitConfig} className="space-y-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      name="apiKey"
                      type="password"
                      defaultValue={selectedIntegration.apiKey || ''}
                      placeholder="Enter your API key"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                    <Input
                      id="webhookUrl"
                      name="webhookUrl"
                      defaultValue={selectedIntegration.webhookUrl || ''}
                      placeholder="https://your-webhook-url.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoSync"
                      name="autoSync"
                      defaultChecked={selectedIntegration.settings?.autoSync ?? true}
                    />
                    <Label htmlFor="autoSync">Enable auto-sync</Label>
                  </div>

                  <div>
                    <Label htmlFor="syncInterval">Sync Interval (hours)</Label>
                    <Input
                      id="syncInterval"
                      name="syncInterval"
                      type="number"
                      defaultValue={selectedIntegration.settings?.syncInterval || '24'}
                      min="1"
                      max="168"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="submit"
                      disabled={configureMutation.isPending}
                    >
                      {configureMutation.isPending ? 'Configuring...' : 'Save Configuration'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowConfigModal(false);
                        setSelectedIntegration(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}