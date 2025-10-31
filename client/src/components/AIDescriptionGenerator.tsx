import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIDescriptionGeneratorProps {
  titleFieldId: string;
  descriptionFieldId: string;
  contentType: 'plan' | 'category' | 'news' | 'product';
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
  onContentGenerated?: (content: string) => void;
}

export default function AIDescriptionGenerator({
  titleFieldId,
  descriptionFieldId,
  contentType,
  className = "text-xs",
  size = "sm",
  variant = "outline",
  disabled = false,
  onContentGenerated
}: AIDescriptionGeneratorProps) {
  const { toast } = useToast();

  // AI Description Generation
  const generateDescriptionMutation = useMutation({
    mutationFn: async (data: { title: string; existingDescription?: string; contentType: string }) => {
      let prompt = '';
      let type = '';
      
      switch (data.contentType) {
        case 'plan':
          type = 'plan_description';
          prompt = data.existingDescription 
            ? `Enhance and improve this plan description for better clarity and correctness: "${data.existingDescription}" for plan "${data.title}"`
            : `Create a clear and compelling description for this plan: "${data.title}"`;
          break;
        case 'category':
          type = 'category_description';
          prompt = data.existingDescription 
            ? `Enhance and improve this category description for better clarity and correctness: "${data.existingDescription}" for category "${data.title}"`
            : `Create a clear and informative description for this category: "${data.title}"`;
          break;
        case 'news':
          type = 'news_content';
          prompt = data.existingDescription 
            ? `Enhance and improve this news content for better clarity and engagement: "${data.existingDescription}" with title "${data.title}"`
            : `Create engaging news content based on this title: "${data.title}"`;
          break;
        case 'product':
          type = 'product_description';
          prompt = data.existingDescription 
            ? `Enhance this product description: "${data.existingDescription}" for product "${data.title}"`
            : `Create a compelling product description for: "${data.title}"`;
          break;
        default:
          type = 'general_description';
          prompt = data.existingDescription 
            ? `Enhance and improve this description: "${data.existingDescription}" for "${data.title}"`
            : `Create a description for: "${data.title}"`;
      }

      const response = await apiRequest('/api/ai/generate-content', 'POST', {
        type,
        prompt,
        tone: 'professional',
        length: 'medium'
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // First, try to use the callback if provided
      if (onContentGenerated) {
        onContentGenerated(data.content);
      } else {
        // Fallback to direct DOM manipulation
        const descriptionField = document.getElementById(descriptionFieldId) as HTMLTextAreaElement | HTMLInputElement;
        if (descriptionField) {
          // Set the value
          descriptionField.value = data.content;
          descriptionField.focus();
          
          // Trigger multiple events to ensure React state updates
          const inputEvent = new Event('input', { bubbles: true });
          const changeEvent = new Event('change', { bubbles: true });
          
          // Dispatch both events to ensure React controlled components update
          descriptionField.dispatchEvent(inputEvent);
          descriptionField.dispatchEvent(changeEvent);
          
          // Also trigger a synthetic React event if possible
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
          )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set;
          
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(descriptionField, data.content);
            descriptionField.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
      
      toast({
        title: "Description Generated!",
        description: "AI has created an enhanced description for you.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate description. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleAIDescriptionGenerate = () => {
    const titleField = document.getElementById(titleFieldId) as HTMLInputElement;
    const descriptionField = document.getElementById(descriptionFieldId) as HTMLTextAreaElement | HTMLInputElement;
    
    const title = titleField?.value?.trim();
    if (!title) {
      const titleLabel = contentType === 'news' ? 'title' : 
                        contentType === 'plan' ? 'plan name' : 
                        contentType === 'category' ? 'category name' : 'title';
      
      toast({
        title: "Title Required",
        description: `Please enter a ${titleLabel} first to generate a description.`,
        variant: "destructive"
      });
      return;
    }

    const existingDescription = descriptionField?.value?.trim();
    generateDescriptionMutation.mutate({
      title,
      existingDescription,
      contentType
    });
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleAIDescriptionGenerate}
      disabled={disabled || generateDescriptionMutation.isPending}
      className={className}
    >
      <Wand2 className="h-3 w-3 mr-1" />
      {generateDescriptionMutation.isPending ? 'Generating...' : 'AI Generated Description'}
    </Button>
  );
}