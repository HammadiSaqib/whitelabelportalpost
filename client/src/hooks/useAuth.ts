import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useRoute } from "wouter";

export function useAuth() {
  // Get domain from current route if available
  const [matchDomainUser, paramsDomainUser] = useRoute("/:domain/user");
  const [matchDomainAffiliate, paramsDomainAffiliate] = useRoute("/:domain/affiliate");
  const [matchDomainRoot, paramsDomainRoot] = useRoute("/:domain");
  const rawDomain = paramsDomainUser?.domain || paramsDomainAffiliate?.domain || paramsDomainRoot?.domain;
  
  // Decode domain and strip query string if present
  const domain = rawDomain ? decodeURIComponent(rawDomain).split('?')[0] : undefined;
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user", domain],
    queryFn: domain ? 
      () => fetch(`/api/auth/user?domain=${domain}`).then(res => {
        if (!res.ok) {
          return null;
        }
        return res.json();
      }) :
      getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    domain,
  };
}
