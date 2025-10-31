import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/BrandLogo';
import {
  Settings, Users, DollarSign, TrendingUp, Package, BarChart3, 
  Shield, Upload, Eye, CreditCard, Globe, Palette, Brush, 
  Mail, MessageCircle, Download, Play, BookOpen, Star, 
  Heart, Bell, User, Link as LinkIcon, Share2, Target,
  Calendar, PlusCircle, FileText, Zap, Database, Layout,
  Menu, X, LogOut, Home
} from 'lucide-react';

interface NavigationProps {
  userRole: string;
}

const getNavigationItems = (role: string) => {
  switch (role) {
    case 'Super Admin':
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Settings, label: 'Dashboard Plans', path: '/plans' },
        { icon: Users, label: 'White-Label Clients', path: '/clients' },
        { icon: TrendingUp, label: 'Super Admin Affiliates', path: '/affiliates' },
        { icon: Shield, label: 'Commission Rules', path: '/commission-rules' },
        { icon: CreditCard, label: 'Billing & Payments', path: '/billing' },
        { icon: BarChart3, label: 'Platform Analytics', path: '/analytics' },
        { icon: Database, label: 'System Settings', path: '/system-settings' },
        { icon: Eye, label: 'Impersonate Users', path: '/impersonate' },
      ];

    case 'Super Admin Affiliate':
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: LinkIcon, label: 'Referral Links', path: '/links' },
        { icon: Users, label: 'My Referrals', path: '/referrals' },
        { icon: Target, label: 'Conversion Tracking', path: '/tracking' },
        { icon: BarChart3, label: 'Performance Analytics', path: '/analytics' },
        { icon: Package, label: 'Available Plans', path: '/plans' },
        { icon: FileText, label: 'Reports', path: '/reports' },
      ];

    case 'White-Label Client':
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Digital Products', path: '/products' },
        { icon: Users, label: 'End Users', path: '/end-users' },
        { icon: TrendingUp, label: 'My Affiliates', path: '/my-affiliates' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Globe, label: 'Portal Settings', path: '/portal-settings' },
        { icon: Eye, label: 'Preview Portal', path: '/preview' },
        { icon: Settings, label: 'Account Settings', path: '/settings' },
      ];

    case 'White-Label Affiliate':
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Products to Promote', path: '/products' },
        { icon: LinkIcon, label: 'My Links', path: '/links' },
        { icon: BarChart3, label: 'Traffic Analytics', path: '/analytics' },
        { icon: Target, label: 'Performance', path: '/performance' },
        { icon: Settings, label: 'Account Settings', path: '/settings' },
      ];

    case 'End User':
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: Package, label: 'Browse Products', path: '/browse' },
        { icon: Download, label: 'My Downloads', path: '/downloads' },
        { icon: Play, label: 'My Courses', path: '/courses' },
        { icon: Star, label: 'Favorites', path: '/favorites' },
        { icon: BookOpen, label: 'Library', path: '/library' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Bell, label: 'Notifications', path: '/notifications' },
        { icon: MessageCircle, label: 'Support', path: '/support' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];

    default:
      return [
        { icon: Home, label: 'Dashboard', path: '/' },
      ];
  }
};

export default function Navigation({ userRole }: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  
  const navigationItems = getNavigationItems(userRole);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand Logo Section */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <BrandLogo size="md" className="mb-4" />
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
        <div className="flex items-center space-x-3">
          <Avatar className="ring-2 ring-green-200 dark:ring-green-700">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-teal-500 text-white font-semibold">
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName || ''}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-10 px-3 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                      : 'text-foreground/80 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={`h-4 w-4 mr-3 transition-all duration-200 ${isActive ? 'text-white animate-pulse' : 'hover-bounce'}`} />
                  <span className="truncate">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/40 dark:hover:to-orange-900/40 transition-all duration-200 hover-glow-pink"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3 hover-wiggle" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900 border-r transform transition-transform ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r">
        {sidebarContent}
      </div>
    </>
  );
}