import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface RoleContextType {
  currentRole: string;
  canCreatePlans: boolean;
  canViewAllClients: boolean;
  canViewAllAffiliates: boolean;
  canManageUsers: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps) {
  const { user } = useAuth();
  const currentRole = user?.role || 'end_user';

  const canCreatePlans = currentRole === 'super_admin';
  const canViewAllClients = currentRole === 'super_admin';
  const canViewAllAffiliates = currentRole === 'super_admin';
  const canManageUsers = ['super_admin', 'white_label_client'].includes(currentRole);

  const value: RoleContextType = {
    currentRole,
    canCreatePlans,
    canViewAllClients,
    canViewAllAffiliates,
    canManageUsers,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}
