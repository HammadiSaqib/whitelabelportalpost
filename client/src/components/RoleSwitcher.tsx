import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function RoleSwitcher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const typedUser = user as User | undefined;
  const [selectedRole, setSelectedRole] = useState<string>(typedUser?.role || 'end_user');

  const roleOptions = [
    { value: 'super_admin', label: 'Super Admin', description: 'Platform owner with full access' },
    { value: 'super_admin_affiliate', label: 'Super Admin Affiliate', description: 'Promotes platform to white-label clients' },
    { value: 'white_label_client', label: 'White-Label Client', description: 'Business that purchases platform plans' },
    { value: 'white_label_affiliate', label: 'White-Label Affiliate', description: 'Promotes white-label client services' },
    { value: 'end_user', label: 'End User', description: 'Customer of white-label business' },
  ];

  const setRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      await apiRequest('/api/auth/set-role', 'POST', { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      toast({
        title: "Role Updated",
        description: `Successfully switched to ${roleOptions.find(r => r.value === selectedRole)?.label}`,
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
        description: "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const handleRoleChange = () => {
    if (selectedRole !== typedUser?.role) {
      setRoleMutation.mutate(selectedRole);
    }
  };

  const currentRoleInfo = roleOptions.find(r => r.value === typedUser?.role);
  const selectedRoleInfo = roleOptions.find(r => r.value === selectedRole);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Role Testing Panel
        </CardTitle>
        <p className="text-sm text-gray-600">
          Switch between different user roles to test platform features
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Current Role: {currentRoleInfo?.label}
          </label>
          <p className="text-xs text-gray-500 mb-3">
            {currentRoleInfo?.description}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Switch To:
          </label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  <div>
                    <div className="font-medium">{role.label}</div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRoleInfo && selectedRole !== typedUser?.role && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> {selectedRoleInfo.description}
            </p>
          </div>
        )}

        <Button
          onClick={handleRoleChange}
          disabled={selectedRole === typedUser?.role || setRoleMutation.isPending}
          className="w-full"
        >
          {setRoleMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Switching...
            </>
          ) : selectedRole === typedUser?.role ? (
            'Current Role'
          ) : (
            `Switch to ${selectedRoleInfo?.label}`
          )}
        </Button>

        {typedUser?.role === 'super_admin' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800 mb-2">Testing Data</p>
            <div className="flex gap-2">
              <SampleDataButton queryClient={queryClient} toast={toast} />
              <Button 
                onClick={() => {
                  fetch('/api/setup/white-label', {
                    method: 'POST',
                    credentials: 'include',
                  }).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
                    queryClient.invalidateQueries({ queryKey: ['/api/categories/my'] });
                    queryClient.invalidateQueries({ queryKey: ['/api/products/my'] });
                    toast({
                      title: "Account Setup Complete",
                      description: "White-label account created successfully",
                    });
                  }).catch(() => {
                    toast({
                      title: "Error",
                      description: "Failed to setup account",
                      variant: "destructive",
                    });
                  });
                }}
                variant="outline"
                size="sm"
              >
                Setup White-Label
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Super Admin:</strong> Create plans, manage all clients and affiliates</p>
          <p><strong>Super Admin Affiliate:</strong> Invite white-label clients, earn commissions</p>
          <p><strong>White-Label Client:</strong> Manage products, invite affiliates, customize branding</p>
          <p><strong>White-Label Affiliate:</strong> Promote client services, track earnings</p>
          <p><strong>End User:</strong> Browse products and services, basic interactions</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SampleDataButton({ queryClient, toast }: { queryClient: any; toast: any }) {
  const seedDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('/api/dev/seed-data', 'POST');
    },
    onSuccess: () => {
      toast({
        title: "Sample data created",
        description: "Platform now has sample plans and activities to test with.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/plans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
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
        description: "Failed to create sample data",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => seedDataMutation.mutate()}
      disabled={seedDataMutation.isPending}
      variant="outline"
      size="sm"
      className="w-full"
    >
      {seedDataMutation.isPending ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
          Creating...
        </>
      ) : (
        'Create Sample Data'
      )}
    </Button>
  );
}