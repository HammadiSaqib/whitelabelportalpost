import { Button } from "@/components/ui/button";
import { Bell, Plus, Menu, ArrowLeft, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showCreatePlan?: boolean;
}

export default function Header({ title, subtitle, showCreatePlan = false }: HeaderProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const selectedRole = sessionStorage.getItem('selectedRole') || user?.role || 'Super Admin';

  // Check if currently impersonating (from backend user data)
  const isImpersonating = user?.isImpersonating || false;
  const originalAdminRole = user?.originalAdminRole;

  // Stop impersonation mutation
  const stopImpersonationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/stop-impersonation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to stop impersonation: ${error}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Refresh user data and redirect to clients page
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      window.location.href = '/clients';
    },
  });

  const handleStopImpersonation = () => {
    if (confirm('Are you sure you want to stop impersonation and return to your admin account?')) {
      stopImpersonationMutation.mutate();
    }
  };

  const handleCreatePlan = () => {
    setLocation('/plans');
  };

  // Only show Create Plan button for Super Admin role and when explicitly requested
  const shouldShowCreatePlan = showCreatePlan && selectedRole === 'Super Admin';

  return (
    <header className="bg-card shadow-sm border-b border-border px-6 py-4">
      {/* Impersonation Notice Banner */}
      {isImpersonating && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                You are impersonating a white-label client
              </span>
              <span className="text-xs text-primary/80">
                (Original: {originalAdminRole})
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleStopImpersonation}
              disabled={stopImpersonationMutation.isPending}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
          </Button>
          {shouldShowCreatePlan && (
            <Button 
              onClick={handleCreatePlan}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
