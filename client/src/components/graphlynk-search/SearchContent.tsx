import { useState } from 'react';
import { Tier } from '@/types/graphlynk';
import { Search, Filter, Clock, TrendingUp, Sparkles, ArrowRight, FileText, User, Link, Code, MessageSquare, Settings, Grid, List, ChevronDown, X, BookOpen, Zap, Star, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchContentProps {
  tier: Tier;
}

type SearchCategory = 'all' | 'profiles' | 'keywords' | 'help' | 'schema' | 'blog' | 'links';
type SearchFilter = 'recent' | 'popular' | 'alphabetical' | 'relevance';
type ViewMode = 'grid' | 'list';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  url: string;
  icon: any;
  premium?: boolean;
  metadata?: {
    date?: string;
    views?: number;
    status?: string;
    tags?: string[];
  };
}

export function SearchContent({ tier }: SearchContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [activeFilter, setActiveFilter] = useState<SearchFilter>('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Mock search results data
  const allResults: SearchResult[] = [
    {
      id: '1',
      title: 'John Smith - CEO Profile',
      description: 'Chief Executive Officer at TechCorp with 15+ years experience in software development',
      category: 'profiles',
      url: '/profile/john-smith',
      icon: User,
      metadata: { date: '2024-11-01', views: 1250, status: 'Active' }
    },
    {
      id: '2',
      title: 'Knowledge Graph Optimization',
      description: 'Learn how to optimize your knowledge graph for better search visibility',
      category: 'help',
      url: '/help/knowledge-graph',
      icon: BookOpen,
      metadata: { date: '2024-10-28', views: 3420 }
    },
    {
      id: '3',
      title: 'SEO Best Practices 2024',
      description: 'Complete guide to modern SEO strategies and entity-based optimization',
      category: 'blog',
      url: '/blog/seo-best-practices',
      icon: FileText,
      metadata: { date: '2024-11-05', views: 5670, tags: ['SEO', 'Strategy', 'Guide'] }
    },
    {
      id: '4',
      title: 'Schema.org Implementation',
      description: 'How to properly implement structured data using Schema.org vocabulary',
      category: 'schema',
      url: '/schema/implementation',
      icon: Code,
      premium: true,
      metadata: { date: '2024-11-03', views: 2180, tags: ['Schema', 'Technical SEO'] }
    },
    {
      id: '5',
      title: 'AI Content Generation',
      description: 'Advanced AI-powered content creation tools for blog posts and articles',
      category: 'blog',
      url: '/blog/ai-content',
      icon: Sparkles,
      premium: true,
      metadata: { date: '2024-11-07', views: 890, tags: ['AI', 'Content', 'Premium'] }
    },
    {
      id: '6',
      title: 'Link Building Strategies',
      description: 'Effective techniques for building high-quality backlinks',
      category: 'keywords',
      url: '/keywords/link-building',
      icon: Link,
      metadata: { date: '2024-10-25', views: 4320, tags: ['Links', 'SEO', 'Strategy'] }
    },
    {
      id: '7',
      title: 'Sarah Johnson - Marketing Director',
      description: 'Marketing Director specializing in digital transformation and brand strategy',
      category: 'profiles',
      url: '/profile/sarah-johnson',
      icon: User,
      metadata: { date: '2024-10-30', views: 980, status: 'Active' }
    },
    {
      id: '8',
      title: 'Entity SEO Guide',
      description: 'Understanding and implementing entity-based SEO for better rankings',
      category: 'help',
      url: '/help/entity-seo',
      icon: BookOpen,
      premium: true,
      metadata: { date: '2024-11-02', views: 2890 }
    },
  ];

  const recentSearches = [
    'knowledge graph optimization',
    'schema markup best practices',
    'competitor analysis',
    'entity SEO',
    'link building strategies'
  ];

  const categories = [
    { id: 'all', label: 'All Results', icon: Grid, count: allResults.length },
    { id: 'profiles', label: 'Profiles', icon: User, count: allResults.filter(r => r.category === 'profiles').length },
    { id: 'keywords', label: 'Keywords', icon: TrendingUp, count: allResults.filter(r => r.category === 'keywords').length },
    { id: 'help', label: 'Help & Docs', icon: BookOpen, count: allResults.filter(r => r.category === 'help').length },
    { id: 'schema', label: 'Schema', icon: Code, count: allResults.filter(r => r.category === 'schema').length },
    { id: 'blog', label: 'Blog Posts', icon: FileText, count: allResults.filter(r => r.category === 'blog').length },
  ];

  const filters = [
    { id: 'relevance', label: 'Most Relevant', icon: Star },
    { id: 'recent', label: 'Most Recent', icon: Clock },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp },
    { id: 'alphabetical', label: 'A-Z', icon: Filter },
  ];

  // Filter results based on search query and category
  const filteredResults = allResults.filter(result => {
    const matchesQuery = searchQuery === '' || 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || result.category === activeCategory;
    
    return matchesQuery && matchesCategory;
  });

  // Sort results based on active filter
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (activeFilter) {
      case 'recent':
        return (b.metadata?.date || '').localeCompare(a.metadata?.date || '');
      case 'popular':
        return (b.metadata?.views || 0) - (a.metadata?.views || 0);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      case 'relevance':
      default:
        return 0;
    }
  });

  const isPremiumLocked = (result: SearchResult) => {
    return result.premium && tier === 'free';
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center glow-primary">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white">Advanced Search</h1>
            <p className="text-gray-600 dark:text-[#98A2B3] text-sm">Search across profiles, keywords, documentation, and more</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for profiles, keywords, help articles..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-xl flex items-center gap-2 transition-all ${
                showFilters
                  ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                  : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Recent Searches */}
          {searchQuery === '' && (
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Recent:</span>
              {recentSearches.slice(0, 5).map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white">Filter Results</h3>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveFilter('relevance');
                  }}
                  className="text-xs text-[#0b3d84] dark:text-[#6EE7F5] hover:underline"
                >
                  Reset Filters
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id as SearchFilter)}
                      className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                        activeFilter === filter.id
                          ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                          : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="glass-card-light dark:glass-card rounded-2xl p-2 border border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as SearchCategory)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                      : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                  }`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found <span className="text-gray-900 dark:text-white">{sortedResults.length}</span> results
            {searchQuery && <span> for "<span className="text-[#0b3d84] dark:text-[#6EE7F5]">{searchQuery}</span>"</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-[#0b3d84] dark:bg-[#6EE7F5] text-white'
                : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-[#0b3d84] dark:bg-[#6EE7F5] text-white'
                : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Results */}
      {sortedResults.length === 0 ? (
        <div className="glass-card-light dark:glass-card rounded-2xl p-12 border border-gray-200 dark:border-white/10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0b3d84]/20 to-[#6EE7F5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-[#0b3d84] dark:text-[#6EE7F5]" />
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Try adjusting your search query or filters
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedResults.map((result, index) => {
            const Icon = result.icon;
            const isLocked = isPremiumLocked(result);
            
            return (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all group cursor-pointer relative ${
                  isLocked ? 'opacity-75' : ''
                } ${viewMode === 'list' ? 'flex items-center gap-6' : ''}`}
              >
                {isLocked && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">Premium</span>
                    </div>
                  </div>
                )}
                
                <div className={`w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white mb-2 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {result.description}
                  </p>

                  {result.metadata && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      {result.metadata.date && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(result.metadata.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {result.metadata.views && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{result.metadata.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {result.metadata.status && (
                        <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full">
                          {result.metadata.status}
                        </span>
                      )}
                    </div>
                  )}

                  {result.metadata?.tags && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {result.metadata.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded-lg text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`flex items-center gap-2 text-[#0b3d84] dark:text-[#6EE7F5] group-hover:gap-3 transition-all ${viewMode === 'list' ? '' : 'mt-4'}`}>
                  {isLocked ? (
                    <>
                      <span className="text-sm">Upgrade to view</span>
                      <Lock className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span className="text-sm">View details</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pro Tip */}
      {searchQuery === '' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white mb-1">Search Pro Tips</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use quotes for exact matches, <kbd className="px-2 py-1 bg-white/20 dark:bg-white/10 rounded text-xs mx-1">tag:SEO</kbd> to filter by tags, 
                or <kbd className="px-2 py-1 bg-white/20 dark:bg-white/10 rounded text-xs mx-1">⌘K</kbd> for quick search from anywhere
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
