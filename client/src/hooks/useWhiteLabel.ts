import { useQuery } from "@tanstack/react-query";

export interface WhiteLabel {
  id: number;
  businessName: string;
  domain: string;
  domainPath: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useWhiteLabel() {
  // Get domain from URL path
  const domain = window.location.pathname.split('/')[1] || '';
  
  // List of system routes that are not white label domains
  const systemRoutes = [
    'users', 'dashboard', 'settings', 'plans', 'affiliates', 
    'admin', 'login', 'register', 'profile', 'billing',
    'api', 'uploads', 'assets', 'static'
  ];
  
  // Only fetch white label data if the domain is not a system route
  const isSystemRoute = systemRoutes.includes(domain.toLowerCase()) || !domain;
  
  const { data: whiteLabel, isLoading, error } = useQuery<WhiteLabel>({
    queryKey: ["/api/white-labels/by-domain", domain],
    queryFn: async () => {
      if (!domain || isSystemRoute) {
        return null;
      }
      
      const response = await fetch(`/api/white-labels/by-domain/${domain}`);
      if (!response.ok) {
        if (response.status === 401) {
          // Authentication error - return null instead of throwing
          return null;
        }
        if (response.status === 403 || response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch white label data");
      }
      return response.json();
    },
    retry: false,
    enabled: !!domain && !isSystemRoute,
  });

  // Debug logging
  console.log('useWhiteLabel Debug:', {
    domain,
    isSystemRoute,
    whiteLabel,
    isLoading,
    error
  });

  return {
    whiteLabel,
    isLoading,
    error,
    hasWhiteLabel: !!whiteLabel,
  };
}