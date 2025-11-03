import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface SuperAdminRouteProps {
  children: ReactNode;
}

export default function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  const { user } = useAuth();

  // Only Super Admin can access
  if (user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833-.73 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            This feature is only available to Super Administrators.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}