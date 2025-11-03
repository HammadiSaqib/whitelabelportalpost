import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getQueryFn } from "@/lib/queryClient";

export interface UserPreferences {
  id: number;
  userId: string;
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useUserPreferences() {
  const { user, isAuthenticated } = useAuth();
  
  const query = useQuery({
    queryKey: ['/api/preferences'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated && !!user,
    retry: false,
  });

  // Debug logging
  console.log('useUserPreferences Debug:', {
    user,
    isAuthenticated,
    queryData: query.data,
    queryError: query.error,
    queryStatus: query.status
  });

  return query;
}