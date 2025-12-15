import { User } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User as UserIcon,
  Search,
  BookOpen,
  TrendingUp,
  Mail,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  Globe,
} from "lucide-react";
import { useLocation } from "wouter";

interface DashboardSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ user, activeTab, setActiveTab, onLogout }: DashboardSidebarProps) {
  const [, setLocation] = useLocation();
  const planBadgeVariant = user.plan === "AUTHORITY" ? "default" : user.plan === "PRO" ? "secondary" : "outline";

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'search', label: 'Search Tracking', icon: Search },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, proPlan: true },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, proPlan: true },
    { id: 'mailing', label: 'Mailing List', icon: Mail, proPlan: true },
  ];

  if (user.plan === "AUTHORITY") {
    navItems.push({ id: 'admin', label: 'Admin Tools', icon: Settings });
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col relative z-20 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
            G
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-lg">Graphlynk</h1>
            <p className="text-gray-500 text-xs">SEO Platform</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium truncate">{user.name || user.email}</p>
            </div>
          </div>
          <Badge variant={planBadgeVariant} className="w-full justify-center text-xs">
            {user.plan === "AUTHORITY" && <Crown className="w-3 h-3 mr-1" />}
            {user.plan === "PRO" && <Sparkles className="w-3 h-3 mr-1" />}
            {user.plan} Plan
          </Badge>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.proPlan && user.plan === "FREE";
          
          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && setActiveTab(item.id)}
              disabled={isDisabled}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`nav-${item.id}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              {item.proPlan && user.plan === "FREE" && (
                <Sparkles className="w-3 h-3 ml-auto" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
