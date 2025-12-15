import { useState } from 'react';
import { Tier } from '@/types/graphlynk';
import { Globe, Activity, AlertTriangle, CheckCircle, XCircle, Search, RefreshCw, FileText, Smartphone, Gauge, Clock, TrendingUp, TrendingDown, ExternalLink, Filter, Download, Settings, Zap, Eye, Link, MapPin, Shield, AlertCircle, Info, Sparkles, Lock, Target, BarChart3, ChevronRight, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IndexationContentProps {
  tier: Tier;
}

type ViewMode = 'overview' | 'coverage' | 'errors' | 'performance' | 'sitemaps';
type TimeRange = '7d' | '30d' | '90d' | '1y';

interface CrawlStats {
  totalPages: number;
  indexed: number;
  notIndexed: number;
  errors: number;
  warnings: number;
  crawlRate: number;
  lastCrawl: string;
  avgResponseTime: number;
}

interface CoverageIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedUrls: number;
  lastDetected: string;
  status: 'active' | 'fixed' | 'ignored';
  premium?: boolean;
}

interface PageIssue {
  id: string;
  url: string;
  issue: string;
  category: string;
  severity: 'high' | 'medium' | 'low';
  discovered: string;
  statusCode?: number;
}

interface SitemapStatus {
  id: string;
  url: string;
  type: 'xml' | 'rss' | 'atom';
  urls: number;
  submitted: string;
  lastRead: string;
  status: 'success' | 'warning' | 'error';
  errors: number;
}

export function IndexationContent({ tier }: IndexationContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [showInspector, setShowInspector] = useState(false);
  const [inspectUrl, setInspectUrl] = useState('');

  // Mock data
  const crawlStats: CrawlStats = {
    totalPages: 15420,
    indexed: 14287,
    notIndexed: 892,
    errors: 241,
    warnings: 156,
    crawlRate: 1250,
    lastCrawl: '2024-11-07T10:30:00',
    avgResponseTime: 342
  };

  const coverageIssues: CoverageIssue[] = [
    {
      id: '1',
      type: 'error',
      severity: 'high',
      title: 'Server Error (5xx)',
      description: '24 pages returning 5xx server errors preventing indexation',
      affectedUrls: 24,
      lastDetected: '2024-11-07',
      status: 'active'
    },
    {
      id: '2',
      type: 'error',
      severity: 'high',
      title: 'Redirect Error',
      description: 'Redirect chains detected on 15 URLs causing crawl inefficiency',
      affectedUrls: 15,
      lastDetected: '2024-11-06',
      status: 'active'
    },
    {
      id: '3',
      type: 'warning',
      severity: 'medium',
      title: 'Soft 404 Detected',
      description: 'Pages returning 200 status but appear to be 404 errors',
      affectedUrls: 32,
      lastDetected: '2024-11-05',
      status: 'active',
      premium: true
    },
    {
      id: '4',
      type: 'warning',
      severity: 'medium',
      title: 'Duplicate Content',
      description: 'Multiple URLs with identical or very similar content',
      affectedUrls: 45,
      lastDetected: '2024-11-04',
      status: 'active'
    },
    {
      id: '5',
      type: 'info',
      severity: 'low',
      title: 'Crawled - Not Indexed',
      description: 'Pages crawled but not indexed in search results',
      affectedUrls: 67,
      lastDetected: '2024-11-07',
      status: 'active',
      premium: true
    },
  ];

  const pageIssues: PageIssue[] = [
    {
      id: '1',
      url: '/blog/seo-tips',
      issue: 'Server error (503)',
      category: 'Server Error',
      severity: 'high',
      discovered: '2024-11-07',
      statusCode: 503
    },
    {
      id: '2',
      url: '/products/category-a',
      issue: 'Redirect chain detected',
      category: 'Redirect',
      severity: 'medium',
      discovered: '2024-11-06'
    },
    {
      id: '3',
      url: '/about/team',
      issue: 'Slow response time (>3s)',
      category: 'Performance',
      severity: 'medium',
      discovered: '2024-11-05'
    },
    {
      id: '4',
      url: '/search?q=test',
      issue: 'Blocked by robots.txt',
      category: 'Access',
      severity: 'low',
      discovered: '2024-11-04'
    },
  ];

  const sitemaps: SitemapStatus[] = [
    {
      id: '1',
      url: '/sitemap.xml',
      type: 'xml',
      urls: 12450,
      submitted: '2024-10-01',
      lastRead: '2024-11-07',
      status: 'success',
      errors: 0
    },
    {
      id: '2',
      url: '/sitemap-blog.xml',
      type: 'xml',
      urls: 2890,
      submitted: '2024-10-01',
      lastRead: '2024-11-07',
      status: 'warning',
      errors: 12
    },
    {
      id: '3',
      url: '/rss-feed.xml',
      type: 'rss',
      urls: 150,
      submitted: '2024-10-15',
      lastRead: '2024-11-06',
      status: 'success',
      errors: 0
    },
  ];

  const coreWebVitals = {
    lcp: { value: 2.3, status: 'good', threshold: 2.5 },
    fid: { value: 85, status: 'good', threshold: 100 },
    cls: { value: 0.08, status: 'good', threshold: 0.1 },
  };

  const indexationRate = ((crawlStats.indexed / crawlStats.totalPages) * 100).toFixed(1);
  const errorRate = ((crawlStats.errors / crawlStats.totalPages) * 100).toFixed(2);

  const isPremiumLocked = (item: { premium?: boolean }) => {
    return item.premium && tier === 'free';
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center glow-primary">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">Indexation & Crawl</h1>
              <p className="text-gray-600 dark:text-[#98A2B3] text-sm">Monitor crawl health, indexation status, and site performance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
            <button 
              onClick={() => setShowInspector(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">URL Inspector</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-2 border border-gray-200 dark:border-white/10 inline-flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'coverage', label: 'Coverage', icon: Target },
            { id: 'errors', label: 'Errors & Warnings', icon: AlertTriangle },
            { id: 'performance', label: 'Performance', icon: Gauge },
            { id: 'sitemaps', label: 'Sitemaps', icon: MapPin },
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as ViewMode)}
                className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                  viewMode === view.id
                    ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview View */}
      {viewMode === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                  {indexationRate}%
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{crawlStats.indexed.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pages Indexed</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>+234 this week</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs">
                  {errorRate}%
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{crawlStats.errors}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crawl Errors</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                <span>Needs attention</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                  /day
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{crawlStats.crawlRate.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Crawl Rate</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>Last crawl: {new Date(crawlStats.lastCrawl).toLocaleString()}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Gauge className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs">
                  Avg
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{crawlStats.avgResponseTime}ms</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Response Time</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingDown className="w-3 h-3" />
                <span>-45ms improved</span>
              </div>
            </motion.div>
          </div>

          {/* Indexation Status Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-1">Indexation Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Distribution of page indexation status</p>
                </div>
                <div className="flex gap-2">
                  {(['7d', '30d', '90d', '1y'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        timeRange === range
                          ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white'
                          : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simplified Bar Chart */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Indexed</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{crawlStats.indexed.toLocaleString()} ({indexationRate}%)</span>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg" style={{ width: `${indexationRate}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Not Indexed</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{crawlStats.notIndexed.toLocaleString()}</span>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg overflow-hidden">
                    <div className="h-full bg-gray-400 rounded-lg" style={{ width: `${((crawlStats.notIndexed / crawlStats.totalPages) * 100).toFixed(1)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Errors</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{crawlStats.errors} ({errorRate}%)</span>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-lg" style={{ width: `${errorRate}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">Warnings</span>
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">{crawlStats.warnings}</span>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg" style={{ width: `${((crawlStats.warnings / crawlStats.totalPages) * 100).toFixed(1)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Gauge className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white text-sm">Core Web Vitals</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Performance metrics</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* LCP */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">LCP (Largest Contentful Paint)</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      coreWebVitals.lcp.status === 'good'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
                    }`}>
                      {coreWebVitals.lcp.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl text-gray-900 dark:text-white">{coreWebVitals.lcp.value}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">s</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${(coreWebVitals.lcp.value / coreWebVitals.lcp.threshold) * 100}%` }}></div>
                  </div>
                </div>

                {/* FID */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">FID (First Input Delay)</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      coreWebVitals.fid.status === 'good'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
                    }`}>
                      {coreWebVitals.fid.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl text-gray-900 dark:text-white">{coreWebVitals.fid.value}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">ms</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${(coreWebVitals.fid.value / coreWebVitals.fid.threshold) * 100}%` }}></div>
                  </div>
                </div>

                {/* CLS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">CLS (Cumulative Layout Shift)</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      coreWebVitals.cls.status === 'good'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400'
                    }`}>
                      {coreWebVitals.cls.status}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl text-gray-900 dark:text-white">{coreWebVitals.cls.value}</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${(coreWebVitals.cls.value / coreWebVitals.cls.threshold) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Issues */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">Recent Issues</h3>
              <button className="text-sm text-[#0b3d84] dark:text-[#6EE7F5] hover:underline flex items-center gap-1">
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {coverageIssues.slice(0, 3).map((issue, index) => {
                const Icon = issue.type === 'error' ? XCircle : issue.type === 'warning' ? AlertTriangle : Info;
                const isLocked = isPremiumLocked(issue);
                
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all cursor-pointer ${
                      isLocked ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        issue.type === 'error' ? 'bg-red-100 dark:bg-red-500/20' :
                        issue.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                        'bg-blue-100 dark:bg-blue-500/20'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          issue.type === 'error' ? 'text-red-600 dark:text-red-400' :
                          issue.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm text-gray-900 dark:text-white">{issue.title}</h4>
                          {isLocked && (
                            <Lock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{issue.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                          <span>{issue.affectedUrls} affected URLs</span>
                          <span>•</span>
                          <span>{new Date(issue.lastDetected).toLocaleDateString()}</span>
                          <span className={`px-2 py-0.5 rounded-full ${
                            issue.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                            issue.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Coverage View */}
      {viewMode === 'coverage' && (
        <div className="space-y-6">
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Coverage Issues</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">All indexation and crawl coverage problems</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {coverageIssues.map((issue, index) => {
                const Icon = issue.type === 'error' ? XCircle : issue.type === 'warning' ? AlertTriangle : Info;
                const isLocked = isPremiumLocked(issue);
                
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all cursor-pointer ${
                      isLocked ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        issue.type === 'error' ? 'bg-red-100 dark:bg-red-500/20' :
                        issue.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                        'bg-blue-100 dark:bg-blue-500/20'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          issue.type === 'error' ? 'text-red-600 dark:text-red-400' :
                          issue.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-gray-900 dark:text-white mb-1">{issue.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{issue.description}</p>
                          </div>
                          {isLocked && (
                            <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3 text-white" />
                              <span className="text-xs text-white">Premium</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">Affected URLs:</span>
                            <span className="text-sm text-gray-900 dark:text-white">{issue.affectedUrls}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">Detected:</span>
                            <span className="text-sm text-gray-900 dark:text-white">{new Date(issue.lastDetected).toLocaleDateString()}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            issue.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                            issue.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                            'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                          }`}>
                            {issue.severity} severity
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            issue.status === 'active' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                            issue.status === 'fixed' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                            'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                      </div>

                      <button className="px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all text-sm">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Errors View */}
      {viewMode === 'errors' && (
        <div className="glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white mb-1">Page Errors & Warnings</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Detailed list of page-level issues</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-700 dark:text-gray-300">URL</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Issue</th>
                  <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Category</th>
                  <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Severity</th>
                  <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Status Code</th>
                  <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Discovered</th>
                  <th className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageIssues.map((issue, index) => (
                  <motion.tr
                    key={issue.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-900 dark:text-white truncate max-w-xs">{issue.url}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white">{issue.issue}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                        {issue.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        issue.severity === 'high' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                        issue.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                      }`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {issue.statusCode && (
                        <span className={`px-3 py-1 rounded-lg text-sm ${
                          issue.statusCode >= 500 ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                          issue.statusCode >= 400 ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400' :
                          issue.statusCode >= 300 ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                          'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {issue.statusCode}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-white">
                      {new Date(issue.discovered).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance View */}
      {viewMode === 'performance' && (
        <div className="space-y-6">
          {/* Performance Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gauge className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl text-gray-900 dark:text-white mb-2">94</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Performance Score</p>
              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>+5 from last month</span>
              </div>
            </div>

            <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl text-gray-900 dark:text-white mb-2">98</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Usability</p>
              <div className="mt-4 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Excellent</span>
              </div>
            </div>

            <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl text-gray-900 dark:text-white mb-2">100</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">HTTPS Security</p>
              <div className="mt-4 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Performance Details */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white mb-6">Performance Metrics</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Time to First Byte (TTFB)</span>
                  <span className="text-sm text-gray-900 dark:text-white">245ms</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">First Contentful Paint (FCP)</span>
                  <span className="text-sm text-gray-900 dark:text-white">1.2s</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Speed Index</span>
                  <span className="text-sm text-gray-900 dark:text-white">1.8s</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Time to Interactive (TTI)</span>
                  <span className="text-sm text-gray-900 dark:text-white">2.9s</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Blocking Time (TBT)</span>
                  <span className="text-sm text-gray-900 dark:text-white">125ms</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemaps View */}
      {viewMode === 'sitemaps' && (
        <div className="space-y-6">
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Submitted Sitemaps</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your XML sitemaps and RSS feeds</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                <span>Add Sitemap</span>
              </button>
            </div>

            <div className="space-y-4">
              {sitemaps.map((sitemap, index) => (
                <motion.div
                  key={sitemap.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        sitemap.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                        sitemap.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                        'bg-red-100 dark:bg-red-500/20'
                      }`}>
                        <MapPin className={`w-6 h-6 ${
                          sitemap.status === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                          sitemap.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-gray-900 dark:text-white mb-1">{sitemap.url}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded uppercase">
                                {sitemap.type}
                              </span>
                              <span>{sitemap.urls.toLocaleString()} URLs</span>
                              {sitemap.errors > 0 && (
                                <span className="text-orange-600 dark:text-orange-400">
                                  {sitemap.errors} errors
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Submitted</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {new Date(sitemap.submitted).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Last Read</p>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {new Date(sitemap.lastRead).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg transition-colors">
                        <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* URL Inspector Modal */}
      <AnimatePresence>
        {showInspector && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowInspector(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="glass-card-light dark:glass-card rounded-2xl p-8 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">URL Inspector</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check indexation status and discover issues</p>
                  </div>
                  {tier === 'free' && (
                    <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">Premium</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Enter URL to inspect</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={inspectUrl}
                        onChange={(e) => setInspectUrl(e.target.value)}
                        placeholder="https://example.com/page"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                      />
                    </div>
                  </div>

                  {tier === 'free' && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white mb-1">Upgrade to Premium</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Get real-time URL inspection, detailed indexation reports, and advanced diagnostics.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowInspector(false)}
                      className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={tier === 'free'}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        tier === 'free'
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white hover:shadow-lg'
                      }`}
                    >
                      Inspect URL
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
