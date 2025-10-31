import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Brain, Wand2, FileText, Target, TrendingUp, Sparkles, Download, Copy, Save, Menu } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ContentGenerator from "@/components/ai/ContentGenerator";
import AIInsights from "@/components/ai/AIInsights";

export default function AIContentPage() {
  const { user } = useAuth();
  const { primaryColor, secondaryColor } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("generator");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'White-Label Client';

  const { data: generatedContent } = useQuery({
    queryKey: ['/api/ai/content', user?.id],
  });

  const { data: contentStats } = useQuery({
    queryKey: ['/api/ai/content/stats', user?.id],
  });

  const { data: recommendations } = useQuery({
    queryKey: ['/api/ai/recommendations', user?.id],
  });

  const { data: optimizations } = useQuery({
    queryKey: ['/api/ai/optimizations', user?.id],
  });

  const optimizeContentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/ai/optimize-content', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/optimizations'] });
    },
  });

  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/ai/generate-recommendations', 'POST', { 
        userId: user?.id, 
        context: 'content' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/recommendations'] });
    },
  });

  const handleOptimizeContent = (content: string, type: string) => {
    optimizeContentMutation.mutate({
      content,
      type,
      userId: user?.id,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">AI Content</h1>
          <div className="w-10"></div>
        </div>

        <Header 
          title="AI Content Studio"
          subtitle="Create, optimize, and manage your content with AI-powered tools"
        />
        
        <div className="p-6">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => generateRecommendationsMutation.mutate()}
              disabled={generateRecommendationsMutation.isPending}
              className="text-white hover:opacity-90"
              style={{ 
                background: `linear-gradient(to right, ${primaryColor || '#8b5cf6'}, ${secondaryColor || '#3b82f6'})` 
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Suggestions
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="text-white border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor || '#8b5cf6'}, ${primaryColor}CC || '#8b5cf6CC', ${primaryColor}99 || '#8b5cf699')` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white opacity-90">Content Generated</CardTitle>
                <FileText className="h-5 w-5 text-white opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats?.totalGenerated || '127'}</div>
                <p className="text-xs text-white opacity-90 mt-1">
                  +{contentStats?.recentlyGenerated || '18'} this month
                </p>
              </CardContent>
            </Card>

            <Card className="text-white border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${secondaryColor || '#3b82f6'}, ${secondaryColor}CC || '#3b82f6CC', ${secondaryColor}99 || '#3b82f699')` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white opacity-90">Optimizations</CardTitle>
                <Target className="h-5 w-5 text-white opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats?.totalOptimizations || '89'}</div>
                <p className="text-xs text-white opacity-90 mt-1">
                  Avg improvement: {contentStats?.avgImprovement || '24'}%
                </p>
              </CardContent>
            </Card>

            <Card className="text-white border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${primaryColor || '#10b981'}, ${primaryColor}CC || '#10b981CC', ${primaryColor}99 || '#10b98199')` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white opacity-90">Success Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-white opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats?.successRate || '94'}%</div>
                <p className="text-xs text-white opacity-90 mt-1">
                  Quality score improvement
                </p>
              </CardContent>
            </Card>

            <Card className="text-white border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${secondaryColor || '#f59e0b'}, ${secondaryColor}CC || '#f59e0bCC', ${secondaryColor}99 || '#f59e0b99')` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white opacity-90">Time Saved</CardTitle>
                <Brain className="h-5 w-5 text-white opacity-80" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{contentStats?.timeSaved || '34'} hrs</div>
                <p className="text-xs text-white opacity-90 mt-1">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generator" className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4" />
                <span>Generator</span>
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Content Library</span>
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Optimizer</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Insights</span>
              </TabsTrigger>
            </TabsList>

            {/* Content Generator Tab */}
            <TabsContent value="generator">
              <ContentGenerator 
                userId={user?.id || ''} 
                onContentGenerated={(content) => {
                  queryClient.invalidateQueries({ queryKey: ['/api/ai/content'] });
                }}
              />
            </TabsContent>

            {/* Content Library Tab */}
            <TabsContent value="library">
              <Card>
                <CardHeader>
                  <CardTitle>Content Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedContent?.length > 0 ? (
                      generatedContent.map((content: any) => (
                        <div key={content.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{content.title || 'Generated Content'}</h3>
                              <p className="text-sm text-gray-500">{content.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm line-clamp-3">{content.content}</p>
                          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                            <span>Created {new Date(content.createdAt).toLocaleDateString()}</span>
                            <span className="px-2 py-1 rounded text-white text-xs" style={{ backgroundColor: primaryColor || '#3b82f6' }}>
                              {content.tone || 'Professional'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No content generated yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Optimizer Tab */}
            <TabsContent value="optimize">
              <Card>
                <CardHeader>
                  <CardTitle>Content Optimizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {optimizations?.length > 0 ? (
                      optimizations.map((optimization: any) => (
                        <div key={optimization.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">Optimization Analysis</h3>
                              <p className="text-sm text-gray-500">{optimization.type}</p>
                            </div>
                            <div className="text-sm font-medium" style={{ color: primaryColor || '#10b981' }}>
                              +{optimization.score || '24'}% improvement
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Original Content:</p>
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-sm">
                                <p className="line-clamp-3">{optimization.originalContent}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-2">Optimized Content:</p>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded text-sm">
                                <p className="line-clamp-3">{optimization.optimizedContent}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No optimizations yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights">
              <div className="space-y-6">
                <AIInsights 
                  userId={user?.id || ''} 
                  context="content"
                />
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations?.length > 0 ? (
                        recommendations.map((rec: any) => (
                          <div key={rec.id} className="border rounded-lg p-4">
                            <h3 className="font-medium mb-2">{rec.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                Impact: {rec.impact || 'High'}
                              </span>
                              <Button size="sm">Apply</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No recommendations available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}