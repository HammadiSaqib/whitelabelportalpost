import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

const createPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  commissionRate: z.string().optional(),
  maxUsers: z.string().optional(),
  features: z.array(z.string()).default([]),
});

type CreatePlanForm = z.infer<typeof createPlanSchema>;

interface CreatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableFeatures = [
  "Custom Branding",
  "Analytics Dashboard", 
  "API Access",
  "Priority Support",
  "Email Campaigns",
  "White-glove Setup",
  "Multi-user Access",
  "Advanced Reporting",
  "Custom Integrations",
  "24/7 Support",
];

export function CreatePlanModal({ open, onOpenChange }: CreatePlanModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreatePlanForm>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      commissionRate: "",
      maxUsers: "",
      features: ["Custom Branding", "Analytics Dashboard", "Email Campaigns"],
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: async (data: CreatePlanForm) => {
      const planData = {
        name: data.name,
        description: data.description || "",
        monthlyPrice: data.price, // Map price to monthlyPrice for backend
        affiliateCommissionPercentage: data.commissionRate || null,
        maxUsers: data.maxUsers ? parseInt(data.maxUsers) : null,
        features: data.features,
        isActive: true,
      };

      await apiRequest("POST", "/api/plans", planData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/plans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      toast({
        title: "Plan Created",
        description: "Your new plan has been created successfully.",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreatePlanForm) => {
    createPlanMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      <Input placeholder="e.g., Premium Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="99.00" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what's included in this plan..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="commissionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiliate Commission (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="50" 
                        step="0.1"
                        placeholder="15.0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Users (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
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
                  <FormLabel>Included Features</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {availableFeatures.map((feature) => (
                      <FormField
                        key={feature}
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={feature}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, feature])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== feature
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {feature}
                              </FormLabel>
                            </FormItem>
                          )
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPlanMutation.isPending}
              >
                {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
