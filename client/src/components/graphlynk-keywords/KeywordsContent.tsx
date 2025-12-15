import { useState } from 'react';
import { Tier } from '@/types/graphlynk';
import { Search, TrendingUp, TrendingDown, Plus, Filter, Target, Sparkles, Globe, Network, Eye, BarChart3, ChevronDown, Lock, Star, ArrowUpRight, ArrowDownRight, Minus, ExternalLink, RefreshCw, Download, Settings, Zap, Link2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KeywordsContentProps {
  tier: Tier;
}

type ViewMode = 'keywords' | 'entities' | 'relationships';
type FilterType = 'all' | 'tracked' | 'opportunities' | 'declining';

interface Keyword {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  searchVolume: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cpc: number;
  trend: 'up' | 'down' | 'stable';
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  premium?: boolean;
}

interface Entity {
  id: string;
  name: string;
  type: string;
  mentions: number;
  sentiment: number;
  trending: boolean;
  googleKnowledge: boolean;
  wikipediaLink?: string;
  connections: number;
  strength: number;
  premium?: boolean;
}

interface EntityRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

export function KeywordsContent({ tier }: KeywordsContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('keywords');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const keywords: Keyword[] = [
    {
      id: '1',
      keyword: 'AI content optimization',
      position: 3,
      previousPosition: 5,
      searchVolume: 12500,
      difficulty: 'Medium',
      cpc: 8.50,
      trend: 'up',
      url: '/blog/ai-optimization',
      clicks: 450,
      impressions: 15000,
      ctr: 3.0
    },
    {
      id: '2',
      keyword: 'entity SEO strategy',
      position: 7,
      previousPosition: 6,
      searchVolume: 8200,
      difficulty: 'Hard',
      cpc: 12.30,
      trend: 'down',
      url: '/help/entity-seo',
      clicks: 320,
      impressions: 11000,
      ctr: 2.9,
      premium: true
    },
    {
      id: '3',
      keyword: 'knowledge graph optimization',
      position: 2,
      previousPosition: 2,
      searchVolume: 15800,
      difficulty: 'Hard',
      cpc: 15.20,
      trend: 'stable',
      url: '/schema/knowledge-graph',
      clicks: 890,
      impressions: 22000,
      ctr: 4.0
    },
    {
      id: '4',
      keyword: 'schema markup generator',
      position: 1,
      previousPosition: 3,
      searchVolume: 9700,
      difficulty: 'Easy',
      cpc: 6.80,
      trend: 'up',
      url: '/tools/schema-generator',
      clicks: 1200,
      impressions: 18000,
      ctr: 6.7
    },
    {
      id: '5',
      keyword: 'semantic search optimization',
      position: 12,
      previousPosition: 15,
      searchVolume: 6400,
      difficulty: 'Medium',
      cpc: 9.40,
      trend: 'up',
      url: '/blog/semantic-search',
      clicks: 180,
      impressions: 8500,
      ctr: 2.1,
      premium: true
    },
  ];

  const entities: Entity[] = [
    {
      id: '1',
      name: 'GraphLynk',
      type: 'Organization',
      mentions: 15420,
      sentiment: 92,
      trending: true,
      googleKnowledge: true,
      wikipediaLink: 'https://wikipedia.org/graphlynk',
      connections: 45,
      strength: 95
    },
    {
      id: '2',
      name: 'Knowledge Graph',
      type: 'Concept',
      mentions: 8930,
      sentiment: 88,
      trending: true,
      googleKnowledge: true,
      connections: 38,
      strength: 87
    },
    {
      id: '3',
      name: 'Schema.org',
      type: 'Standard',
      mentions: 12500,
      sentiment: 95,
      trending: false,
      googleKnowledge: true,
      wikipediaLink: 'https://wikipedia.org/schema',
      connections: 52,
      strength: 98,
      premium: true
    },
    {
      id: '4',
      name: 'Semantic Search',
      type: 'Technology',
      mentions: 7200,
      sentiment: 85,
      trending: true,
      googleKnowledge: true,
      connections: 31,
      strength: 82
    },
    {
      id: '5',
      name: 'Entity SEO',
      type: 'Methodology',
      mentions: 5600,
      sentiment: 90,
      trending: true,
      googleKnowledge: false,
      connections: 28,
      strength: 76,
      premium: true
    },
  ];

  const relationships: EntityRelationship[] = [
    { id: '1', source: 'GraphLynk', target: 'Knowledge Graph', type: 'uses', strength: 95 },
    { id: '2', source: 'GraphLynk', target: 'Schema.org', type: 'implements', strength: 88 },
    { id: '3', source: 'Knowledge Graph', target: 'Semantic Search', type: 'enables', strength: 92 },
    { id: '4', source: 'Schema.org', target: 'Entity SEO', type: 'supports', strength: 85 },
    { id: '5', source: 'Semantic Search', target: 'Entity SEO', type: 'enhances', strength: 78 },
  ];

  // Stats calculations
  const totalKeywords = keywords.length;
  const improvingKeywords = keywords.filter(k => k.trend === 'up').length;
  const decliningKeywords = keywords.filter(k => k.trend === 'down').length;
  const avgPosition = (keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length).toFixed(1);
  const totalClicks = keywords.reduce((sum, k) => sum + k.clicks, 0);
  const totalImpressions = keywords.reduce((sum, k) => sum + k.impressions, 0);
  const avgCTR = ((totalClicks / totalImpressions) * 100).toFixed(2);

  const totalEntities = entities.length;
  const trendingEntities = entities.filter(e => e.trending).length;
  const avgSentiment = (entities.reduce((sum, e) => sum + e.sentiment, 0) / entities.length).toFixed(1);
  const googleKnowledgeCount = entities.filter(e => e.googleKnowledge).length;

  const filteredKeywords = keywords.filter(k => {
    const matchesSearch = searchQuery === '' || k.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'tracked' && k.position <= 10) ||
      (filterType === 'opportunities' && k.position > 10 && k.trend === 'up') ||
      (filterType === 'declining' && k.trend === 'down');
    return matchesSearch && matchesFilter;
  });

  const isPremiumLocked = (item: { premium?: boolean }) => {
    return item.premium && tier === 'free';
  };

  const getPositionChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) return { value: change, trend: 'up' as const };
    if (change < 0) return { value: Math.abs(change), trend: 'down' as const };
    return { value: 0, trend: 'stable' as const };
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center glow-primary">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">Keywords & Entities</h1>
              <p className="text-gray-600 dark:text-[#98A2B3] text-sm">Track rankings, analyze entities, and optimize your knowledge graph</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh Data</span>
            </button>
            <button 
              onClick={() => setShowAddKeyword(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Keyword</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-2 border border-gray-200 dark:border-white/10 inline-flex">
          <button
            onClick={() => setViewMode('keywords')}
            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
              viewMode === 'keywords'
                ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Keywords</span>
          </button>
          <button
            onClick={() => setViewMode('entities')}
            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
              viewMode === 'entities'
                ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Network className="w-4 h-4" />
            <span className="text-sm">Entities</span>
          </button>
          <button
            onClick={() => setViewMode('relationships')}
            className={`px-6 py-3 rounded-xl transition-all flex items-center gap-2 ${
              viewMode === 'relationships'
                ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span className="text-sm">Relationships</span>
          </button>
        </div>
      </div>

      {/* Keywords View */}
      {viewMode === 'keywords' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs">
                  Total
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalKeywords}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tracked Keywords</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  +{improvingKeywords}
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{avgPosition}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Position</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                  CTR {avgCTR}%
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalClicks.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs">
                  -{decliningKeywords} down
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalImpressions.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Impressions</p>
            </motion.div>
          </div>

          {/* Search & Filter */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search keywords..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'tracked', 'opportunities', 'declining'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className={`px-4 py-3 rounded-xl capitalize transition-all text-sm ${
                      filterType === filter
                        ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                        : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Keyword</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Position</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Change</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Volume</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Difficulty</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Clicks</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">CTR</th>
                    <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKeywords.map((keyword, index) => {
                    const positionChange = getPositionChange(keyword.position, keyword.previousPosition);
                    const isLocked = isPremiumLocked(keyword);
                    
                    return (
                      <motion.tr
                        key={keyword.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-gray-200 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors ${
                          isLocked ? 'opacity-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isLocked && <Lock className="w-4 h-4 text-purple-500" />}
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">{keyword.keyword}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{keyword.url}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm ${
                            keyword.position <= 3
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : keyword.position <= 10
                              ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                              : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400'
                          }`}>
                            {keyword.position}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            {positionChange.trend === 'up' && (
                              <>
                                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-emerald-500">+{positionChange.value}</span>
                              </>
                            )}
                            {positionChange.trend === 'down' && (
                              <>
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-500">-{positionChange.value}</span>
                              </>
                            )}
                            {positionChange.trend === 'stable' && (
                              <Minus className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                          {keyword.searchVolume.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                            keyword.difficulty === 'Easy'
                              ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : keyword.difficulty === 'Medium'
                              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                              : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                          }`}>
                            {keyword.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                          {keyword.clicks}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                          {keyword.ctr}%
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                              <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                              <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Entities View */}
      {viewMode === 'entities' && (
        <>
          {/* Entity KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <Sparkles className="w-5 h-5 text-[#6EE7F5]" />
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalEntities}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Entities</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                  Trending
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{trendingEntities}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Trending Entities</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs">
                  {avgSentiment}%
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{avgSentiment}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Sentiment</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                  Google KG
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{googleKnowledgeCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Knowledge Graph</p>
            </motion.div>
          </div>

          {/* Entity Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entities.map((entity, index) => {
              const isLocked = isPremiumLocked(entity);
              
              return (
                <motion.div
                  key={entity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all cursor-pointer relative ${
                    isLocked ? 'opacity-75' : ''
                  }`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3 text-white" />
                        <span className="text-xs text-white">Premium</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center">
                      <Network className="w-6 h-6 text-white" />
                    </div>
                    {entity.trending && (
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                  </div>

                  <h3 className="text-gray-900 dark:text-white mb-1">{entity.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{entity.type}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Mentions</span>
                      <span className="text-sm text-gray-900 dark:text-white">{entity.mentions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Sentiment</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${entity.sentiment}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{entity.sentiment}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Connections</span>
                      <span className="text-sm text-gray-900 dark:text-white">{entity.connections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Strength</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] rounded-full"
                            style={{ width: `${entity.strength}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{entity.strength}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
                    {entity.googleKnowledge && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded text-xs flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Google KG
                      </span>
                    )}
                    {entity.wikipediaLink && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded text-xs flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        Wikipedia
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Relationships View */}
      {viewMode === 'relationships' && (
        <>
          <div className="glass-card-light dark:glass-card rounded-2xl p-8 border border-gray-200 dark:border-white/10 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Entity Relationship Graph</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visualize connections between entities</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Optimize Graph</span>
              </button>
            </div>

            {/* Simplified Graph Visualization */}
            <div className="relative h-96 bg-white dark:bg-white/5 rounded-xl p-8 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Network className="w-20 h-20 text-[#0b3d84] dark:text-[#6EE7F5] mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Interactive Knowledge Graph</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {tier === 'free' ? 'Upgrade to Premium to unlock interactive graph visualization' : 'Coming soon'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Relationships List */}
          <div className="glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <h3 className="text-gray-900 dark:text-white">Entity Relationships</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage connections between entities
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {relationships.map((relationship, index) => (
                <motion.div
                  key={relationship.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-lg flex items-center justify-center">
                          <Network className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{relationship.source}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-px w-12 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5]" />
                        <span className="px-3 py-1 bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded-full text-xs">
                          {relationship.type}
                        </span>
                        <div className="h-px w-12 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5]" />
                      </div>

                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-900 dark:text-white">{relationship.target}</span>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Network className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-8">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Strength:</span>
                        <div className="w-24 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] rounded-full"
                            style={{ width: `${relationship.strength}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-900 dark:text-white">{relationship.strength}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Keyword Modal */}
      <AnimatePresence>
        {showAddKeyword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowAddKeyword(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 px-4"
            >
              <div className="glass-card-light dark:glass-card rounded-2xl p-8 border border-gray-200 dark:border-white/10">
                <h3 className="text-gray-900 dark:text-white mb-4">Add New Keyword</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Keyword</label>
                    <input
                      type="text"
                      placeholder="Enter keyword..."
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Target URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowAddKeyword(false)}
                      className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all">
                      Add Keyword
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
