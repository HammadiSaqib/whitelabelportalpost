import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Package, Plus, DollarSign, Users, ToggleLeft, ToggleRight, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import type { Plan } from "@shared/schema";
import CheckoutModal from "@/components/CheckoutModal";
import { useState } from "react";

export default function PlansTable() {
  const { currentRole } = useRole();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const { data: plans, isLoading } = useQuery<Plan[]>({
    queryKey: ['/api/plans'],
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest(`/api/plans/${id}`, 'PUT', { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
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
        description: "Failed to update plan",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount || amount === null || amount.trim() === '') {
      return 'Contact for Pricing';
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return 'Contact for Pricing';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const formatCommission = (rate: string | null) => {
    if (!rate || rate === null) {
      return 'Not Set';
    }
    const numRate = parseFloat(rate);
    if (isNaN(numRate)) {
      return 'Not Set';
    }
    // Convert from decimal to percentage (0.01 -> 1%, 1.0 -> 100%)
    return `${(numRate * 100).toFixed(0)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Subscription Plans</h3>
            <p className="text-sm text-muted-foreground">Manage your pricing tiers</p>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-modern animate-pulse">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-xl"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Subscription Plans</h3>
            <p className="text-sm text-muted-foreground">Manage your pricing tiers</p>
          </div>
          {currentRole === 'super_admin' && (
            <Button size="sm" className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          )}
        </div>
        <div className="text-center py-12 card-modern">
          <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold text-foreground mb-2">No plans created yet</h4>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first subscription plan to start offering services to your clients
          </p>
          {currentRole === 'super_admin' && (
            <Button className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Plan
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Subscription Plans</h3>
          <p className="text-sm text-muted-foreground">Manage your pricing tiers</p>
        </div>
        {currentRole === 'super_admin' && (
          <Button size="sm" className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {plans.map((plan) => {
          const ToggleIcon = plan.isActive ? ToggleRight : ToggleLeft;
          return (
            <div key={plan.id} className="card-modern card-hover group">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Plan Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {plan.name}
                        </h4>
                        <Badge variant={plan.isActive ? "default" : "secondary"} className="text-xs">
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                      
                      {/* Plan Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Price</p>
                            <p className="text-sm font-semibold text-foreground">
                              {formatCurrency(plan.monthlyPrice)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Commission</p>
                            <p className="text-sm font-semibold text-foreground">
                              {formatCommission(plan.affiliateCommissionPercentage)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Max Users</p>
                            <p className="text-sm font-semibold text-foreground">
                              {plan.maxUsers || 'Unlimited'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Purchase Button - Show for all plans */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button 
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowCheckoutModal(true);
                          }}
                          className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {plan.monthlyPrice && parseFloat(plan.monthlyPrice) > 0 
                            ? `Purchase for ${formatCurrency(plan.monthlyPrice)}`
                            : 'Purchase Now'
                          }
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {currentRole === 'super_admin' && (
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updatePlanMutation.mutate({ 
                          id: plan.id, 
                          isActive: !plan.isActive 
                        })}
                        disabled={updatePlanMutation.isPending}
                        className="hover:bg-muted"
                      >
                        <ToggleIcon className={`w-4 h-4 mr-2 ${plan.isActive ? 'text-green-500' : 'text-gray-400'}`} />
                        {plan.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-muted">
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => {
            setShowCheckoutModal(false);
            setSelectedPlan(null);
          }}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
