import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ArrowRight, User, FileText, Hash, Globe, Sparkles, Code } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenHelp?: () => void;
  onOpenMessages?: () => void;
}

type SearchTab = 'all' | 'profiles' | 'content' | 'keywords' | 'entities' | 'schema';

export function SearchOverlay({ isOpen, onClose, onNavigateToTab, onOpenHelp, onOpenMessages }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'all' as SearchTab, label: 'All', icon: Search },
    { id: 'profiles' as SearchTab, label: 'Profiles', icon: User },
    { id: 'content' as SearchTab, label: 'Content', icon: FileText },
    { id: 'keywords' as SearchTab, label: 'Keywords', icon: Hash },
    { id: 'entities' as SearchTab, label: 'Entities', icon: Globe },
    { id: 'schema' as SearchTab, label: 'Schema', icon: Code },
  ];

  const recentSearches = [
    { query: 'Authority Score trends', category: 'Dashboard', time: '2m ago' },
    { query: 'Schema validation errors', category: 'Technical', time: '1h ago' },
    { query: 'Top performing keywords', category: 'SEO', time: '3h ago' },
  ];

  const suggestedSearches = [
    { query: 'LLM Visibility metrics', category: 'Analytics', trending: true },
    { query: 'Indexation status check', category: 'Technical', trending: false },
    { query: 'Entity ranking improvements', category: 'SEO', trending: true },
  ];

  const quickActions = [
    { 
      label: 'New Blog Post', 
      icon: FileText, 
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        onClose();
        onNavigateToTab?.('blog');
      }
    },
    { 
      label: 'Run Schema Test', 
      icon: Code, 
      color: 'from-purple-500 to-pink-500',
      action: () => {
        onClose();
        onNavigateToTab?.('schema');
      }
    },
    { 
      label: 'AI Analysis', 
      icon: Sparkles, 
      color: 'from-amber-500 to-orange-500',
      action: () => {
        onClose();
        onNavigateToTab?.('llm');
      }
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 overlay-fade-in"
      onClick={onClose}
    >
      {/* Smart Mirror Backdrop with Reflective Surface */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#0b3d84]/20 to-black/70 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(110,231,245,0.05),transparent_50%)]"></div>
      </div>

      {/* Main Search Interface - Digital Screen with Mirror Technology */}
      <div 
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reflective Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-[#0b3d84]/10 via-[#6EE7F5]/10 to-[#0b3d84]/10 rounded-[2.5rem] blur-xl opacity-40"></div>
        
        {/* Main Panel */}
        <div className="relative glass-card-light dark:glass-card rounded-3xl shadow-2xl depth-shadow-lg overflow-hidden border-2 border-white/20 dark:border-white/10">
          {/* Header Section */}
          <div className="relative border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12161A]">
            {/* Search Bar */}
            <div className="flex items-center gap-4 p-6">
              <div className="p-3 glass-card-light dark:glass-card rounded-2xl">
                <Search className="w-6 h-6 text-[#0b3d84] dark:text-[#6EE7F5]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search profiles, content, keywords, entities..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#98A2B3] outline-none text-lg"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 group"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3] group-hover:text-red-500 transition-colors" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                          : 'glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content Area - Interactive Information Overlays */}
          <div className="relative max-h-[60vh] overflow-y-auto">
            {searchQuery === '' ? (
              <div className="p-8 space-y-8">
                {/* Quick Actions - Digital Screen Integration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    <h3 className="text-sm text-gray-700 dark:text-[#E6E9EE]">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          className="group relative p-6 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 overflow-hidden"
                          onClick={action.action}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
                          <div className="relative flex flex-col items-center gap-3">
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} glow-primary`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">{action.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Searches - Mirror Display */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    <h3 className="text-sm text-gray-700 dark:text-[#E6E9EE]">Recent Searches</h3>
                  </div>
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full group relative p-5 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 text-left overflow-hidden"
                        onClick={() => setSearchQuery(search.query)}
                      >
                        
                        <div className="relative flex items-center justify-between">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                              {search.query}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-[#98A2B3]">
                              <span className="px-2 py-1 glass-card-light dark:glass-card rounded-lg">{search.category}</span>
                              <span>{search.time}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 dark:text-[#98A2B3] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested Searches - Smart Mirror Recommendations */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    <h3 className="text-sm text-gray-700 dark:text-[#E6E9EE]">Trending Searches</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedSearches.map((search, index) => (
                      <button
                        key={index}
                        className="group relative p-5 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 text-left overflow-hidden"
                        onClick={() => setSearchQuery(search.query)}
                      >
                        
                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-1">
                            <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                              {search.query}
                            </p>
                            <span className="inline-block px-2 py-1 text-xs glass-card-light dark:glass-card rounded-lg text-gray-600 dark:text-[#98A2B3]">
                              {search.category}
                            </span>
                          </div>
                          {search.trending && (
                            <div className="px-2 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-emerald-500">Hot</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] rounded-full blur-lg opacity-20"></div>
                  <div className="relative p-8 glass-card-light dark:glass-card rounded-full">
                    <Search className="w-12 h-12 text-[#0b3d84] dark:text-[#6EE7F5]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-lg text-gray-900 dark:text-white">
                    Searching for <span className="text-[#0b3d84] dark:text-[#6EE7F5]">"{searchQuery}"</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                    in <span className="capitalize">{activeTab}</span> • AI-powered results
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#0b3d84] dark:bg-[#6EE7F5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#0b3d84] dark:bg-[#6EE7F5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#0b3d84] dark:bg-[#6EE7F5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Mirror Technology Info Display */}
          <div className="relative px-8 py-5 border-t border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12161A]">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <kbd className="px-3 py-2 glass-card-light dark:glass-card rounded-lg border border-gray-300 dark:border-white/20 shadow-sm">↑↓</kbd>
                  <span className="text-gray-700 dark:text-[#E6E9EE]">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-3 py-2 glass-card-light dark:glass-card rounded-lg border border-gray-300 dark:border-white/20 shadow-sm">↵</kbd>
                  <span className="text-gray-700 dark:text-[#E6E9EE]">Select</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-3 py-2 glass-card-light dark:glass-card rounded-lg border border-gray-300 dark:border-white/20 shadow-sm">ESC</kbd>
                  <span className="text-gray-700 dark:text-[#E6E9EE]">Close</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-[#98A2B3]">
                <Sparkles className="w-4 h-4" />
                <span>AI-Enhanced Search</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}