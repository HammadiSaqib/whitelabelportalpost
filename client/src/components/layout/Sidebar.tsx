import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useWhiteLabel } from "@/hooks/useWhiteLabel";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  BarChart3, 
  Package, 
  Users, 
  Handshake, 
  DollarSign, 
  Palette, 
  Settings, 
  Plug,
  Sparkles,
  Layout,
  LogOut,
  Menu,
  X,
  Megaphone,
  Folder
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onMobileToggle }: SidebarProps = {}) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { logoUrl } = useTheme();
  const { whiteLabel } = useWhiteLabel();

  const userRole = (user as any)?.role;

  const getNavigationForRole = () => {
    const baseNavigation = [
      {
        name: "Dashboard",
        items: [
          { name: "Overview", href: "/", icon: BarChart3 },
          { name: "Analytics", href: "/analytics", icon: BarChart3 },
        ]
      },
      {
        name: "Management", 
        items: [
          { name: "Subscriptions", href: "/subscriptions", icon: Package },
          { name: "Products", href: "/products", icon: Package },
          { name: "Collections", href: "/categories", icon: Folder },
          ...(userRole === 'super_admin' ? [{ name: "Organization", href: "/clients", icon: Users }] : []),
          ...(userRole === 'white_label_client' ? [{ name: "Users", href: "/users", icon: Users }] : []),
          { name: "Affiliates", href: "/affiliates", icon: Handshake },
        ]
      },
      {
        name: "Communication",
        items: [
          { name: "News Feed", href: "/news", icon: Megaphone },
        ]
      },
      {
        name: "Platform",
        items: [
          { name: "AI Content Studio", href: "/ai-content", icon: Sparkles },
          { name: "Landing Page Builder", href: "/landing-builder", icon: Layout },
          { name: "Platform Settings", href: "/settings", icon: Settings },
        ]
      }
    ];
    
    return baseNavigation;
  };

  const navigation = getNavigationForRole();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const userInfo = user as any; // Type assertion to access user properties

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-sidebar border-r border-sidebar-border
        flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center w-full px-2">
              {logoUrl ? (
                <div className="w-full h-16 rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={logoUrl} 
                    alt="Custom Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="text-primary-foreground text-2xl" />
                </div>
              )}
            </div>
            
            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileToggle}
              className="lg:hidden text-muted-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-6">
          <div className="px-4 space-y-1">
            {navigation.map((section) => (
              <div key={section.name} className="mb-8">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                  {section.name}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start px-4 py-3 h-auto rounded-xl transition-all duration-200 ${
                            isActive 
                              ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]"
                          }`}
                          onClick={() => onMobileToggle && onMobileToggle()}
                        >
                          <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={userInfo?.profileImageUrl || ""} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {userInfo?.firstName?.[0] || userInfo?.email?.[0] || "U"}
                {userInfo?.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                {userInfo?.firstName && userInfo?.lastName 
                  ? `${userInfo.firstName} ${userInfo.lastName}` 
                  : userInfo?.email || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {sessionStorage.getItem('selectedRole') || userInfo?.role?.replace('_', ' ') || "Super Admin"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
