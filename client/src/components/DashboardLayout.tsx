import Navigation from './Navigation';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
}

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation userRole={userRole} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}