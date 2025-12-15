import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Code, 
  Shield, 
  Sparkles, 
  User,
  FileText, 
  ShoppingBag, 
  CreditCard, 
  MessageSquare, 
  HelpCircle,
  Settings 
} from 'lucide-react';
import { TabId, Tier } from '@/types/graphlynk';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  tier: Tier;
}

const menuItems = [
  { id: 'dashboard' as TabId, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'llm' as TabId, label: 'LLM Visibility', icon: Sparkles, tier: 'platinum' as Tier },
  { id: 'search' as TabId, label: 'Search', icon: Search },
  { id: 'profile' as TabId, label: 'Profile & Links', icon: User },
  { id: 'messages' as TabId, label: 'Messages', icon: MessageSquare },
  { id: 'blog' as TabId, label: 'Blog Management', icon: FileText },
  { id: 'keywords' as TabId, label: 'SEO Hub', icon: TrendingUp },
  { id: 'indexation' as TabId, label: 'Indexation & Crawl', icon: Code },
  { id: 'schema' as TabId, label: 'Schema Health', icon: Shield },
  { id: 'products' as TabId, label: 'Digital Products', icon: ShoppingBag },
  { id: 'pricing' as TabId, label: 'Pricing & GKP', icon: CreditCard },
  { id: 'help' as TabId, label: 'Help & Docs', icon: HelpCircle },
  { id: 'settings' as TabId, label: 'Settings', icon: Settings },
];

const tierBadges = {
  free: { label: 'Free', color: 'bg-gray-600 text-gray-200' },
  premium: { label: 'Premium', color: 'bg-[#0b3d84] text-white' },
  platinum: { label: 'Platinum', color: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' },
};

export function Sidebar({ activeTab, onTabChange, tier }: SidebarProps) {
  const currentTier = tierBadges[tier];

  return (
    <aside className="w-72 bg-white dark:bg-[#12161A] border-r border-gray-200 dark:border-white/10 flex flex-col shadow-xl">
      {/* Logo/Brand */}
      <div className="p-8 border-b border-gray-200 dark:border-white/10" style={{ fontFamily: '"Geist Sans", sans-serif', letterSpacing: '-0.03em' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center glow-primary floating">
            <span className="text-white text-xl">G</span>
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white text-xl" style={{ fontFamily: '"Geist Sans", sans-serif', letterSpacing: '-0.03em' }}>Graphlynk</h1>
            <p className="text-xs text-gray-600 dark:text-[#98A2B3]" style={{ fontFamily: '"Geist Sans", sans-serif', letterSpacing: '-0.03em' }}>Authority Dashboard</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs bg-[#D946EF] text-white shimmer">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {currentTier.label}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.tier && tier !== item.tier && tier !== 'platinum';
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => !isLocked && onTabChange(item.id)}
                  disabled={isLocked}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-left group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white shadow-lg'
                      : isLocked
                      ? 'text-gray-400 dark:text-[#98A2B3] opacity-40 cursor-not-allowed'
                      : 'text-gray-700 dark:text-[#E6E9EE] hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-transparent group-hover:bg-gray-200 dark:group-hover:bg-white/10'
                    }`}>
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isLocked && (
                    <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-3 py-1.5 rounded-lg border border-purple-500/30 shimmer flex items-center justify-center">
                      Platinum
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="p-6 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4 p-4 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-cyan-500 rounded-xl flex items-center justify-center glow-primary">
              <span className="text-white">JD</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#12161A] glow-accent"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">John Doe</p>
            <p className="text-xs text-gray-600 dark:text-[#98A2B3]">john@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}