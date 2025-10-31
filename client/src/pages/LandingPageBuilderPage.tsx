import { useState } from "react";
import AccessControlledRoute from "@/components/AccessControlledRoute";
import ModernFigmaBuilder from "@/components/landing-builder/ModernFigmaBuilder";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function LandingPageBuilderPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Landing Page Builder</h1>
          <div className="w-10"></div>
        </div>
        <Header 
          title="Landing Page Builder"
          subtitle="Create professional landing pages with our drag-and-drop builder"
        />
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <AccessControlledRoute 
              feature="landing_page_builder" 
              featureName="Landing Page Builder"
              description="Create professional landing pages with our drag-and-drop builder. Design custom pages to promote your products and services."
            >
              <ModernFigmaBuilder />
            </AccessControlledRoute>
          </div>
        </div>
      </main>
    </div>
  );
}