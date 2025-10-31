import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Copy, Link as LinkIcon, Eye, BarChart3, Edit, Trash2, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function LinksPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin Affiliate';

  const { data: links, isLoading } = useQuery({
    queryKey: ['/api/promotional-links/my'],
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products/available'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/promotional-links/stats'],
  });

  const createMutation = useMutation({
    mutationFn: async (linkData: any) => {
      return apiRequest('/api/promotional-links', {
        method: 'POST',
        body: JSON.stringify(linkData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotional-links/my'] });
      setShowCreateForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/promotional-links/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promotional-links/my'] });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const linkData = {
      productId: parseInt(formData.get('productId') as string),
      customSlug: formData.get('customSlug') || null,
      utm_source: formData.get('utm_source') || null,
      utm_medium: formData.get('utm_medium') || null,
      utm_campaign: formData.get('utm_campaign') || null,
    };

    createMutation.mutate(linkData);
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole={selectedRole}>
        <div className="p-6">
          <div className="text-center py-12">Loading promotional links...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={selectedRole}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Promotional Links
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your affiliate links
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create Link
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Active promotional links</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClicks || 0}</div>
              <p className="text-xs text-muted-foreground">All time clicks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversions || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.conversionRate || 0}% rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.topLink?.clicks || 0}</div>
              <p className="text-xs text-muted-foreground">Best performing link</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Link Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Promotional Link</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productId">Product</Label>
                    <select
                      id="productId"
                      name="productId"
                      required
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="">Select a product</option>
                      {products?.map((product: any) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="customSlug">Custom Slug (optional)</Label>
                    <Input
                      id="customSlug"
                      name="customSlug"
                      placeholder="my-special-offer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="utm_source">UTM Source (optional)</Label>
                    <Input
                      id="utm_source"
                      name="utm_source"
                      placeholder="facebook"
                    />
                  </div>
                  <div>
                    <Label htmlFor="utm_medium">UTM Medium (optional)</Label>
                    <Input
                      id="utm_medium"
                      name="utm_medium"
                      placeholder="social"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="utm_campaign">UTM Campaign (optional)</Label>
                    <Input
                      id="utm_campaign"
                      name="utm_campaign"
                      placeholder="summer-sale-2024"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button type="submit" disabled={createMutation.isPending}>
                    Create Link
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Promotional Links ({links?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links?.map((link: any) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                        <LinkIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {link.productName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Created {new Date(link.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
                          {link.shortUrl}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(link.shortUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {(link.utm_source || link.utm_medium || link.utm_campaign) && (
                      <div className="flex space-x-2">
                        {link.utm_source && (
                          <Badge variant="secondary">Source: {link.utm_source}</Badge>
                        )}
                        {link.utm_medium && (
                          <Badge variant="secondary">Medium: {link.utm_medium}</Badge>
                        )}
                        {link.utm_campaign && (
                          <Badge variant="secondary">Campaign: {link.utm_campaign}</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {link.clicks || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        clicks
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {link.conversions || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        conversions
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteMutation.mutate(link.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {(!links || links.length === 0) && (
                <div className="text-center py-12">
                  <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <div className="text-gray-500 mb-4">No promotional links yet</div>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Link
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}