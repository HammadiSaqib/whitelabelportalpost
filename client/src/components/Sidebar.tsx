import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Sidebar() {
  const { user } = useAuth();
  const { currentRole } = useRole();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'super_admin_affiliate':
        return 'Super Admin Affiliate';
      case 'white_label_client':
        return 'White-Label Client';
      case 'white_label_affiliate':
        return 'White-Label Affiliate';
      case 'end_user':
        return 'End User';
      default:
        return 'User';
    }
  };

  const navigationItems = [
    {
      section: "Dashboard",
      items: [
        { name: "Overview", icon: "fas fa-tachometer-alt", active: true },
        { name: "Analytics", icon: "fas fa-chart-line", active: false },
      ]
    },
    {
      section: "Management",
      items: [
        { name: "Plans & Pricing", icon: "fas fa-box", active: false, roles: ['super_admin'] },
        { name: "White-Label Clients", icon: "fas fa-users", active: false, roles: ['super_admin'] },
        { name: "Affiliates", icon: "fas fa-handshake", active: false, roles: ['super_admin', 'white_label_client'] },
      ]
    },
    {
      section: "Platform",
      items: [
        { name: "Platform Settings", icon: "fas fa-cog", active: false, roles: ['super_admin'] },
        { name: "Integrations", icon: "fas fa-plug", active: false, roles: ['super_admin', 'white_label_client'] },
      ]
    }
  ];

  const shouldShowItem = (item: any) => {
    if (!item.roles) return true;
    return item.roles.includes(currentRole);
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WhiteLabel Pro</h1>
            <p className="text-xs text-gray-500">Multi-Tier Platform</p>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div className="p-4 border-b border-gray-200">
        <Select value={selectedRole} onValueChange={setSelectedRole} disabled>
          <SelectTrigger className="w-full">
            <SelectValue>{getRoleDisplayName(selectedRole)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="super_admin_affiliate">Super Admin Affiliate</SelectItem>
            <SelectItem value="white_label_client">White-Label Client</SelectItem>
            <SelectItem value="white_label_affiliate">White-Label Affiliate</SelectItem>
            <SelectItem value="end_user">End User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 space-y-2">
          {navigationItems.map((section) => (
            <div key={section.section} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
              {section.items
                .filter(shouldShowItem)
                .map((item) => (
                  <button
                    key={item.name}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      item.active
                        ? 'text-white bg-primary'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <i className={`${item.icon} mr-3 w-4`}></i>
                    {item.name}
                  </button>
                ))}
            </div>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=fff`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getRoleDisplayName(currentRole)}
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Button>
      </div>
    </aside>
  );
}
