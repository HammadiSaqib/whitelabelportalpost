import { useQuery } from "@tanstack/react-query";

interface UserAccess {
  hasCategories: boolean;
  hasAffiliates: boolean;
  hasLandingPageBuilder: boolean;
  planName?: string;
}

export function useUserAccess() {
  return useQuery<UserAccess>({
    queryKey: ['/api/user/access'],
    staleTime: 0, // Always fetch fresh data to avoid caching issues
    cacheTime: 1000 * 60, // Keep in cache for 1 minute but always refetch
  });
}

export function hasAccess(userAccess: UserAccess | undefined, feature: 'categories' | 'affiliates' | 'landing_page_builder'): boolean {
  if (!userAccess) return false;
  
  switch (feature) {
    case 'categories':
      return userAccess.hasCategories;
    case 'affiliates':
      return userAccess.hasAffiliates;
    case 'landing_page_builder':
      return userAccess.hasLandingPageBuilder;
    default:
      return false;
  }
}