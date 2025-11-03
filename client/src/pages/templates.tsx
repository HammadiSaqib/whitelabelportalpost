import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Users, 
  Star, 
  MessageSquare, 
  DollarSign, 
  Phone, 
  Mail,
  Wand2,
  Move,
  Plus,
  Trash2,
  Eye,
  Save,
  Download,
  Edit3
} from "lucide-react";

interface LandingPageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'contact' | 'about' | 'cta';
  title: string;
  content: any;
  order: number;
}

interface DragDropTemplate {
  id: string;
  name: string;
  sections: LandingPageSection[];
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const colorThemes = [
  { primary: '#3b82f6', secondary: '#1e40af', accent: '#60a5fa' }, // Blue
  { primary: '#10b981', secondary: '#047857', accent: '#34d399' }, // Green
  { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' }, // Orange
  { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }, // Purple
];

const availableWidgets = [
  { 
    type: 'hero', 
    icon: Layout, 
    title: 'Hero Section', 
    description: 'Main banner with headline and CTA',
    defaultContent: {
      headline: 'Transform Your Business Today',
      subheadline: 'Discover the power of our innovative solution',
      ctaText: 'Get Started',
      backgroundImage: ''
    }
  },
  { 
    type: 'features', 
    icon: Star, 
    title: 'Features', 
    description: 'Showcase your key features',
    defaultContent: {
      title: 'Why Choose Us',
      features: [
        { title: 'Fast & Reliable', description: 'Lightning fast performance you can count on' },
        { title: 'Secure', description: 'Enterprise-grade security for your peace of mind' },
        { title: '24/7 Support', description: 'Round-the-clock customer support' }
      ]
    }
  },
  { 
    type: 'testimonials', 
    icon: MessageSquare, 
    title: 'Testimonials', 
    description: 'Customer reviews and feedback',
    defaultContent: {
      title: 'What Our Customers Say',
      testimonials: [
        { name: 'John Doe', company: 'Tech Corp', text: 'Amazing service that transformed our business!' },
        { name: 'Jane Smith', company: 'StartupXYZ', text: 'Incredible results in just a few weeks.' }
      ]
    }
  },
  { 
    type: 'pricing', 
    icon: DollarSign, 
    title: 'Pricing', 
    description: 'Pricing plans and packages',
    defaultContent: {
      title: 'Choose Your Plan',
      plans: [
        { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2'] },
        { name: 'Pro', price: '$99', features: ['All Basic features', 'Feature 3', 'Feature 4'] }
      ]
    }
  },
  { 
    type: 'contact', 
    icon: Phone, 
    title: 'Contact', 
    description: 'Contact form and information',
    defaultContent: {
      title: 'Get In Touch',
      subtitle: 'We\'d love to hear from you',
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567'
    }
  }
];

export default function TemplatesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("drag-drop");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState<DragDropTemplate>({
    id: 'new',
    name: 'New Landing Page',
    sections: [],
    theme: 'Professional Blue',
    colors: colorThemes[0]
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';

  // Fetch existing templates
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['/api/templates'],
  });

  // Save template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) throw new Error('Failed to save template');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Template Saved",
        description: "Your landing page template has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  });

  // AI generation mutation
  const generateWithAiMutation = useMutation({
    mutationFn: async (data: { prompt: string; sections: string[] }) => {
      return apiRequest('/api/ai/generate-landing-page', 'POST', data);
    },
    onSuccess: (data) => {
      setCurrentTemplate(prev => ({
        ...prev,
        name: data.name,
        sections: data.sections
      }));
      toast({
        title: "AI Generation Complete",
        description: "Your landing page has been generated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate landing page. Please try again.",
        variant: "destructive",
      });
    }
  });

  const addSection = (type: string) => {
    const widget = availableWidgets.find(w => w.type === type);
    if (!widget) return;

    const newSection: LandingPageSection = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: widget.title,
      content: widget.defaultContent,
      order: currentTemplate.sections.length
    };

    setCurrentTemplate(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionId: string) => {
    setCurrentTemplate(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const renderSectionPreview = (section: LandingPageSection) => {
    const bgColor = currentTemplate.colors.primary;
    const textColor = '#ffffff';

    switch (section.type) {
      case 'hero':
        return (
          <div 
            className="py-20 text-center text-white relative"
            style={{ backgroundColor: bgColor }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-5xl font-bold mb-6">{section.content.headline}</h1>
              <p className="text-xl mb-8 opacity-90">{section.content.subheadline}</p>
              <Button size="lg" variant="secondary">
                {section.content.ctaText}
              </Button>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="py-16 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{section.content.title}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {section.content.features.map((feature: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-6 text-center">
                      <Star className="h-8 w-8 mx-auto mb-4" style={{ color: bgColor }} />
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      case 'testimonials':
        return (
          <div className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{section.content.title}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {section.content.testimonials.map((testimonial: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <p className="mb-4">"{testimonial.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-8 px-4 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500">{section.title} Section</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header 
          title="Landing Page Builder"
          subtitle="Create stunning landing pages with drag-and-drop or AI assistance"
        />
        
        <div className="p-6">
          <div className="flex justify-end gap-3 mb-6">
            <Button 
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button 
              onClick={() => saveTemplateMutation.mutate(currentTemplate)}
              disabled={saveTemplateMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Template
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="drag-drop" className="flex items-center gap-2">
                <Move className="h-4 w-4" />
                Drag & Drop Builder
              </TabsTrigger>
              <TabsTrigger value="ai-generator" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                AI Page Generator
              </TabsTrigger>
            </TabsList>

            {/* Drag & Drop Builder */}
            <TabsContent value="drag-drop" className="space-y-6">
              {previewMode ? (
                <div className="space-y-0">
                  {currentTemplate.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <div key={section.id}>
                        {renderSectionPreview(section)}
                      </div>
                    ))}
                  {currentTemplate.sections.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sections added yet. Switch to edit mode to start building.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Widget Library */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          Widgets
                        </CardTitle>
                        <CardDescription>
                          Drag widgets to build your page
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {availableWidgets.map((widget) => {
                          const IconComponent = widget.icon;
                          return (
                            <Button
                              key={widget.type}
                              variant="outline"
                              className="w-full justify-start h-auto p-3"
                              onClick={() => addSection(widget.type)}
                            >
                              <div className="flex items-start gap-3">
                                <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-medium text-sm">{widget.title}</div>
                                  <div className="text-xs text-gray-500">{widget.description}</div>
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Theme Selector */}
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palette className="h-5 w-5" />
                          Theme
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select 
                          value={currentTemplate.theme} 
                          onValueChange={(theme) => {
                            const themeIndex = ['Professional Blue', 'Nature Green', 'Warm Orange', 'Creative Purple'].indexOf(theme);
                            setCurrentTemplate(prev => ({
                              ...prev,
                              theme,
                              colors: colorThemes[themeIndex] || colorThemes[0]
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Professional Blue">Professional Blue</SelectItem>
                            <SelectItem value="Nature Green">Nature Green</SelectItem>
                            <SelectItem value="Warm Orange">Warm Orange</SelectItem>
                            <SelectItem value="Creative Purple">Creative Purple</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Page Builder Area */}
                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Page Builder</CardTitle>
                        <CardDescription>
                          Build your landing page by adding sections from the widget library
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {currentTemplate.sections.map((section) => (
                            <div key={section.id} className="border rounded-lg p-4 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{section.title}</h3>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => removeSection(section.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 capitalize">
                                {section.type} section
                              </div>
                            </div>
                          ))}
                          {currentTemplate.sections.length === 0 && (
                            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                              <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>Add widgets from the left panel to start building your page</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* AI Page Generator */}
            <TabsContent value="ai-generator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    AI Landing Page Generator
                  </CardTitle>
                  <CardDescription>
                    Describe your ideal landing page and let AI create it for you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ai-prompt">Describe your landing page</Label>
                      <Textarea
                        id="ai-prompt"
                        placeholder="E.g., Create a landing page for a SaaS productivity tool with a hero section, features, pricing, and testimonials..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label>Select Sections to Include</Label>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {availableWidgets.map((widget) => {
                          const IconComponent = widget.icon;
                          return (
                            <div key={widget.type} className="flex items-center space-x-2">
                              <Checkbox
                                id={widget.type}
                                checked={selectedSections.includes(widget.type)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSections([...selectedSections, widget.type]);
                                  } else {
                                    setSelectedSections(selectedSections.filter(s => s !== widget.type));
                                  }
                                }}
                              />
                              <Label 
                                htmlFor={widget.type} 
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <IconComponent className="h-4 w-4" />
                                {widget.title}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button 
                      onClick={() => generateWithAiMutation.mutate({ 
                        prompt: aiPrompt, 
                        sections: selectedSections 
                      })}
                      disabled={!aiPrompt || selectedSections.length === 0 || generateWithAiMutation.isPending}
                      className="w-full"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      {generateWithAiMutation.isPending ? 'Generating...' : 'Generate Landing Page'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}