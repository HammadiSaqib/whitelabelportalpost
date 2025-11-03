import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Brain, TrendingUp, Lightbulb, Target, RefreshCw } from "lucide-react";

interface AIInsightsProps {
  userId: string;
  context: 'dashboard' | 'analytics' | 'revenue' | 'marketing';
}

export default function AIInsights({ userId, context }: AIInsightsProps) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: insights, isLoading } = useQuery({
    queryKey: ['/api/ai/insights', userId, context],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest('/api/ai/generate-insights', 'POST', { userId, context });
      setIsGenerating(false);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/insights', userId, context] });
    },
    onError: () => {
      setIsGenerating(false);
    },
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'growth': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'optimization': return <Target className="h-4 w-4 text-blue-600" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      default: return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Ensure insights is properly typed as an array
  const insightsArray = Array.isArray(insights) ? insights : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5 text-purple-600" />
            AI Insights ({insightsArray.length})
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => generateInsightsMutation.mutate()}
            disabled={generateInsightsMutation.isPending || isGenerating}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${(generateInsightsMutation.isPending || isGenerating) ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insightsArray.length > 0 ? (
            insightsArray.map((insight: any, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {insight.title}
                    </h4>
                    {insight.priority && (
                      <Badge className={`text-xs ${getInsightColor(insight.priority)}`}>
                        {insight.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {insight.description}
                  </p>
                  {insight.metric && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      {insight.metric}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Brain className="h-8 w-8 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 mb-4">No insights available</p>
              <Button 
                size="sm" 
                onClick={() => generateInsightsMutation.mutate()}
                disabled={generateInsightsMutation.isPending || isGenerating}
              >
                <Brain className="h-3 w-3 mr-1" />
                Generate AI Insights
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}