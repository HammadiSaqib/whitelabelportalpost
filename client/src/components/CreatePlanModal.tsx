import { useState } from "react";
import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ChevronDown, ChevronUp } from "lucide-react";
import AIDescriptionGenerator from "@/components/AIDescriptionGenerator";

const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  monthlyPrice: z.string().min(1, "Price is required"),
  affiliateCommissionPercentage: z.string().optional(),
  maxUsers: z.string().optional(),
  features: z.array(z.string()).default([]),
  accesses: z.array(z.string()).default([]),
  allowAffiliatePromotion: z.boolean().default(false),
  scheduledAt: z.string().optional(),
});

type CreatePlanForm = z.infer<typeof createPlanSchema>;

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan?: any;
}

const availableFeatures = [
  { id: "custom_branding", label: "Custom Branding" },
  { id: "analytics_dashboard", label: "Analytics Dashboard" },
  { id: "api_access", label: "API Access" },
  { id: "priority_support", label: "Priority Support" },
  { id: "email_campaigns", label: "Email Campaigns" },
  { id: "white_glove_setup", label: "White-glove Setup" },
];

const availableAccesses = [
  { id: "categories", label: "Collections" },
  { id: "affiliates", label: "Affiliates" },
  { id: "ai_content_studio", label: "AI Content Studio" },
];

export default function CreatePlanModal({ isOpen, onClose, editingPlan }: CreatePlanModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize selectedAction based on existing plan status
  const getInitialAction = () => {
    if (!editingPlan) return 'publish';
    
    if (editingPlan.status === 'draft') return 'draft';
    if (editingPlan.status === 'scheduled') return 'schedule';
    return 'publish'; // for 'published' or any other status
  };
  
  const [selectedAction, setSelectedAction] = useState<'publish' | 'draft' | 'schedule'>(getInitialAction());
  const [isEdit, setIsEdit] = useState(!!editingPlan); // Track if this is edit mode

  const form = useForm<CreatePlanForm>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: editingPlan?.name || "",
      description: editingPlan?.description || "",
      monthlyPrice: editingPlan?.monthlyPrice || "",
      affiliateCommissionPercentage: editingPlan?.affiliateCommissionPercentage || "",
      maxUsers: editingPlan?.maxUsers?.toString() || "",
      features: editingPlan?.features || ["custom_branding", "analytics_dashboard", "email_campaigns"],
      accesses: editingPlan?.accesses || ["categories"],
      allowAffiliatePromotion: editingPlan?.allowAffiliatePromotion || false,
      scheduledAt: editingPlan?.scheduledAt ? new Date(editingPlan.scheduledAt).toISOString().slice(0, 16) : "",
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      if (editingPlan) {
        return await apiRequest(`/api/plans/${editingPlan.id}`, 'PUT', planData);
      } else {
        return await apiRequest('/api/plans', 'POST', planData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      
      const messages = {
        publish: isEdit ? "Plan updated successfully!" : "Plan created successfully!",
        draft: isEdit ? "Plan updated as draft!" : "Plan saved as draft!",
        schedule: isEdit ? "Plan updated and scheduled!" : "Plan scheduled successfully!"
      };
      
      toast({
        title: "Success",
        description: messages[selectedAction],
      });
      handleClose();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          const returnTo = encodeURIComponent(window.location.href); window.location.href = `/api/login?returnTo=${returnTo}`;
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreatePlanForm) => {
    // Validate scheduled date for schedule action
    if (selectedAction === 'schedule' && !data.scheduledAt) {
      toast({
        title: "Schedule time required",
        description: "Please select a date and time for scheduling",
        variant: "destructive",
      });
      return;
    }
    
    // Map selectedAction to plan status
    const status = selectedAction === 'publish' ? 'published' : 
                   selectedAction === 'schedule' ? 'scheduled' : 'draft';
    
    // Handle different submission actions
    const planData = {
      name: data.name,
      description: data.description || null,
      monthlyPrice: data.monthlyPrice,
      affiliateCommissionPercentage: data.allowAffiliatePromotion ? data.affiliateCommissionPercentage : null,
      maxUsers: data.maxUsers ? parseInt(data.maxUsers) : null,
      features: data.features,
      accesses: data.accesses,
      allowAffiliatePromotion: data.allowAffiliatePromotion,
      isActive: selectedAction === 'publish', // Only true for published plans
      isMainSitePlan: selectedAction === 'publish', // Only true for published plans
      status: status,
      scheduledAt: selectedAction === 'schedule' && data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null
    };

    console.log('Creating plan with action:', selectedAction, 'status:', planData.status, 'scheduledAt:', planData.scheduledAt);
    createPlanMutation.mutate(planData);
  };

  // Get button text based on selected action
  const getButtonText = (isPending: boolean) => {
    if (isPending) {
      return isEdit ? "Updating..." : "Creating...";
    }
    
    switch (selectedAction) {
      case 'publish':
        return isEdit ? "Update Plan" : "Add Plan";
      case 'draft':
        return "Draft";
      case 'schedule':
        return "Schedule";
      default:
        return isEdit ? "Update Plan" : "Add Plan";
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedAction('publish'); // Reset to default action
    onClose();
  };

  // Reset selectedAction when editingPlan changes
  React.useEffect(() => {
    const initialAction = getInitialAction();
    setSelectedAction(initialAction);
    setIsEdit(!!editingPlan);
  }, [editingPlan]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Dashboard Plan</DialogTitle>
          <DialogDescription>
            Create a new plan that white-label clients can subscribe to.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input id="plan-name" placeholder="e.g., Premium Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="29.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Plan Description</FormLabel>
                    <AIDescriptionGenerator
                      titleFieldId="plan-name"
                      descriptionFieldId="plan-description"
                      contentType="plan"
                      onContentGenerated={(content) => 
                        form.setValue("description", content)
                      }
                    />
                  </div>
                  <FormControl>
                    <Textarea 
                      id="plan-description"
                      placeholder="Describe what's included in this plan..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowAffiliatePromotion"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Allow Affiliates To Promote Plan</FormLabel>
                    <FormDescription>
                      When enabled, affiliates can promote this plan and earn commissions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.watch("allowAffiliatePromotion") && (
                <FormField
                  control={form.control}
                  name="affiliateCommissionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commission Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="50" 
                          placeholder="15" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="maxUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Users</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100 (leave empty for unlimited)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Included Features</FormLabel>
                    <FormDescription>
                      Select the features included in this plan.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {availableFeatures.map((feature) => (
                      <FormField
                        key={feature.id}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={feature.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, feature.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== feature.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedAction === 'schedule' && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Date & Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="accesses"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Access Permissions</FormLabel>
                    <FormDescription>
                      Select which sections this plan provides access to.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {availableAccesses.map((access) => (
                      <FormField
                        key={access.id}
                        control={form.control}
                        name="accesses"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={access.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(access.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, access.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== access.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {access.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />



            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={createPlanMutation.isPending}
              >
                Cancel
              </Button>
              
              {/* Single Button with Upward Arrow Dropdown */}
              <div className="relative">
                <Button 
                  onClick={() => {
                    if (selectedAction === 'schedule' && !form.getValues().scheduledAt) {
                      toast({
                        title: "Schedule time required",
                        description: "Please select a date and time for scheduling",
                        variant: "destructive"
                      });
                      return;
                    }
                    
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={createPlanMutation.isPending}
                  className="pr-8"
                >
                  {getButtonText(createPlanMutation.isPending)}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={createPlanMutation.isPending}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-primary/10"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {selectedAction === 'draft' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('publish')}
                          className="cursor-pointer"
                        >
                          {isEdit ? 'Update Plan' : 'Add Plan'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('schedule')}
                          className="cursor-pointer"
                        >
                          Schedule
                        </DropdownMenuItem>
                      </>
                    )}
                    {selectedAction === 'schedule' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('publish')}
                          className="cursor-pointer"
                        >
                          {isEdit ? 'Update Plan' : 'Add Plan'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('draft')}
                          className="cursor-pointer"
                        >
                          Draft
                        </DropdownMenuItem>
                      </>
                    )}
                    {selectedAction === 'publish' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('draft')}
                          className="cursor-pointer"
                        >
                          Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setSelectedAction('schedule')}
                          className="cursor-pointer"
                        >
                          Schedule
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
