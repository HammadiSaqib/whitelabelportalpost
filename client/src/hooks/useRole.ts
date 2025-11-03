import { useRoleContext } from "@/components/RoleProvider";

export function useRole() {
  return useRoleContext();
}
