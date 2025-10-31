import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Wand2, Copy, Save, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentGeneratorProps {
  userId: string;
  onContentGenerated?: (content: any) => void;
}

export default function ContentGenerator({ userId, onContentGenerated }: ContentGeneratorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: 'product_description',
    prompt: '',
    tone: 'professional',
    length: 'medium',
    audience: '',
    keywords: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/ai/generate-content', 'POST', data);
      return await response.json();
    },
    onSuccess: (data: any) => {
      console.log('Generated content response:', data);
      const content = data.content || data.generatedContent || '';
      setGeneratedContent(content);
      setSuggestions(data.suggestions || []);
      if (onContentGenerated) {
        onContentGenerated(data);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/ai/content'] });
      toast({
        title: "Content Generated",
        description: "Your AI content has been generated successfully.",
      });
    },
    onError: (error: any) => {
      let errorMessage = "Failed to generate content. Please try again.";
      
      if (error?.message) {
        if (error.message.includes("quota exceeded")) {
          errorMessage = "API quota exceeded. Please check your OpenAI billing and usage limits.";
        } else if (error.message.includes("Invalid API key")) {
          errorMessage = "Invalid API key. Please verify your OpenAI configuration.";
        } else if (error.message.includes("Access denied")) {
          errorMessage = "Access denied. Please check your API key permissions.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Content Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const saveContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/ai/content', 'POST', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/content'] });
      toast({
        title: "Content Saved",
        description: "Your content has been saved to the library.",
      });
    },
  });

  const handleGenerate = () => {
    if (!formData.prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate({
      ...formData,
      userId,
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
    });
  };

  const handleSave = () => {
    if (!generatedContent.trim()) {
      toast({
        title: "No Content",
        description: "Generate content first before saving.",
        variant: "destructive",
      });
      return;
    }

    saveContentMutation.mutate({
      userId,
      type: formData.type,
      content: generatedContent,
      prompt: formData.prompt,
      metadata: {
        tone: formData.tone,
        length: formData.length,
        audience: formData.audience,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      },
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wand2 className="mr-2 h-5 w-5 text-purple-600" />
            Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product_description">Product Description</SelectItem>
                <SelectItem value="marketing_copy">Marketing Copy</SelectItem>
                <SelectItem value="email_template">Email Template</SelectItem>
                <SelectItem value="social_media">Social Media Post</SelectItem>
                <SelectItem value="blog_post">Blog Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prompt">Content Prompt *</Label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to create..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="length">Length</Label>
              <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              placeholder="e.g., small business owners, tech enthusiasts"
              value={formData.audience}
              onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="e.g., innovative, affordable, reliable"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={generateContentMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {generateContentMutation.isPending ? 'Generating...' : 'Generate Content'}
            </Button>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, prompt: "javascript coding platform for developers" }));
                  setTimeout(() => handleGenerate(), 100);
                }}
                disabled={generateContentMutation.isPending}
              >
                Test Tech
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, prompt: "business enterprise workflow solution" }));
                  setTimeout(() => handleGenerate(), 100);
                }}
                disabled={generateContentMutation.isPending}
              >
                Test Business
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, prompt: "video course tutorial platform" }));
                  setTimeout(() => handleGenerate(), 100);
                }}
                disabled={generateContentMutation.isPending}
              >
                Test Video
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Content</CardTitle>
            {generatedContent && (
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSave}
                  disabled={saveContentMutation.isPending}
                >
                  <Save className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {generateContentMutation.isPending ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ) : generatedContent ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">
                  {generatedContent}
                </pre>
              </div>
              
              {suggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Suggestions for Improvement:</h4>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                <p>Content type: {formData.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p>Tone: {formData.tone} • Length: {formData.length}</p>
                {formData.audience && <p>Audience: {formData.audience}</p>}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 mb-4">No content generated yet</p>
              <p className="text-sm text-gray-400">
                Fill out the form and click "Generate Content" to create AI-powered content
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}