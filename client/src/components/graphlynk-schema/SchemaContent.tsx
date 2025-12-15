import { useState } from 'react';
import { Tier } from '@/types/graphlynk';
import { Code, CheckCircle, XCircle, AlertTriangle, Plus, Search, Filter, Download, Upload, Eye, Copy, Play, RefreshCw, Sparkles, Zap, Network, FileJson, Shield, Target, TrendingUp, Globe, Link2, Settings, ChevronRight, ChevronDown, Lock, ExternalLink, BookOpen, Layers, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SchemaContentProps {
  tier: Tier;
}

type ViewMode = 'overview' | 'builder' | 'validator' | 'templates' | 'deployed';
type SchemaType = 'Organization' | 'Product' | 'Article' | 'LocalBusiness' | 'Event' | 'Recipe' | 'FAQ' | 'HowTo' | 'Person' | 'WebSite' | 'BreadcrumbList';

interface SchemaItem {
  id: string;
  name: string;
  type: SchemaType;
  url: string;
  status: 'valid' | 'warning' | 'error';
  lastValidated: string;
  coverage: number;
  richResults: boolean;
  errors: number;
  warnings: number;
  deployed: boolean;
  premium?: boolean;
}

interface SchemaTemplate {
  id: string;
  name: string;
  type: SchemaType;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  category: string;
  usage: number;
  premium?: boolean;
}

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestion?: string;
  line?: number;
}

export function SchemaContent({ tier }: SchemaContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [showAddSchema, setShowAddSchema] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data
  const schemas: SchemaItem[] = [
    {
      id: '1',
      name: 'GraphLynk Organization',
      type: 'Organization',
      url: 'https://graphlynk.com',
      status: 'valid',
      lastValidated: '2024-11-07T10:30:00',
      coverage: 100,
      richResults: true,
      errors: 0,
      warnings: 0,
      deployed: true
    },
    {
      id: '2',
      name: 'Blog Post Article',
      type: 'Article',
      url: 'https://graphlynk.com/blog/*',
      status: 'valid',
      lastValidated: '2024-11-07T09:15:00',
      coverage: 95,
      richResults: true,
      errors: 0,
      warnings: 2,
      deployed: true
    },
    {
      id: '3',
      name: 'Product Catalog',
      type: 'Product',
      url: 'https://graphlynk.com/products/*',
      status: 'warning',
      lastValidated: '2024-11-06T14:20:00',
      coverage: 87,
      richResults: false,
      errors: 0,
      warnings: 5,
      deployed: true,
      premium: true
    },
    {
      id: '4',
      name: 'FAQ Schema',
      type: 'FAQ',
      url: 'https://graphlynk.com/faq',
      status: 'error',
      lastValidated: '2024-11-05T11:00:00',
      coverage: 45,
      richResults: false,
      errors: 3,
      warnings: 1,
      deployed: false,
      premium: true
    },
    {
      id: '5',
      name: 'How-To Guides',
      type: 'HowTo',
      url: 'https://graphlynk.com/guides/*',
      status: 'valid',
      lastValidated: '2024-11-07T08:45:00',
      coverage: 92,
      richResults: true,
      errors: 0,
      warnings: 1,
      deployed: true
    },
  ];

  const templates: SchemaTemplate[] = [
    {
      id: '1',
      name: 'Organization Schema',
      type: 'Organization',
      description: 'Complete organization schema with social profiles and contact points',
      difficulty: 'Easy',
      category: 'Business',
      usage: 15420
    },
    {
      id: '2',
      name: 'Article with Author',
      type: 'Article',
      description: 'Blog post schema with author, publisher, and metadata',
      difficulty: 'Easy',
      category: 'Content',
      usage: 12890
    },
    {
      id: '3',
      name: 'Product with Reviews',
      type: 'Product',
      description: 'E-commerce product with reviews, ratings, and availability',
      difficulty: 'Medium',
      category: 'E-commerce',
      usage: 9540,
      premium: true
    },
    {
      id: '4',
      name: 'Local Business',
      type: 'LocalBusiness',
      description: 'Local business with opening hours, location, and services',
      difficulty: 'Medium',
      category: 'Business',
      usage: 8230
    },
    {
      id: '5',
      name: 'Event Schema',
      type: 'Event',
      description: 'Event with tickets, performers, and location details',
      difficulty: 'Advanced',
      category: 'Events',
      usage: 5670,
      premium: true
    },
    {
      id: '6',
      name: 'Recipe Schema',
      type: 'Recipe',
      description: 'Recipe with ingredients, instructions, and nutrition info',
      difficulty: 'Medium',
      category: 'Content',
      usage: 7890
    },
    {
      id: '7',
      name: 'FAQ Schema',
      type: 'FAQ',
      description: 'Frequently asked questions for rich snippets',
      difficulty: 'Easy',
      category: 'Content',
      usage: 11250
    },
    {
      id: '8',
      name: 'HowTo Schema',
      type: 'HowTo',
      description: 'Step-by-step instructions with images and tools',
      difficulty: 'Medium',
      category: 'Content',
      usage: 6420
    },
  ];

  const validationIssues: ValidationIssue[] = [
    {
      id: '1',
      type: 'error',
      field: 'offers.price',
      message: 'Missing required property "price"',
      suggestion: 'Add the "price" property to the offers object',
      line: 45
    },
    {
      id: '2',
      type: 'warning',
      field: 'image',
      message: 'Image should be high-resolution (minimum 1200px wide)',
      suggestion: 'Use a larger image for better rich results display',
      line: 23
    },
    {
      id: '3',
      type: 'error',
      field: 'datePublished',
      message: 'Invalid date format',
      suggestion: 'Use ISO 8601 format (YYYY-MM-DD)',
      line: 67
    },
  ];

  // Stats
  const totalSchemas = schemas.length;
  const validSchemas = schemas.filter(s => s.status === 'valid').length;
  const deployedSchemas = schemas.filter(s => s.deployed).length;
  const richResultsEnabled = schemas.filter(s => s.richResults).length;
  const avgCoverage = (schemas.reduce((sum, s) => sum + s.coverage, 0) / schemas.length).toFixed(1);
  const totalErrors = schemas.reduce((sum, s) => sum + s.errors, 0);
  const totalWarnings = schemas.reduce((sum, s) => sum + s.warnings, 0);

  const schemaTypes = [
    'all',
    'Organization',
    'Product',
    'Article',
    'LocalBusiness',
    'Event',
    'Recipe',
    'FAQ',
    'HowTo',
  ];

  const filteredSchemas = schemas.filter(schema => {
    const matchesSearch = searchQuery === '' || 
      schema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schema.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || schema.type === selectedType;
    return matchesSearch && matchesType;
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const isPremiumLocked = (item: { premium?: boolean }) => {
    return item.premium && tier === 'free';
  };

  const exampleSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GraphLynk",
    "url": "https://graphlynk.com",
    "logo": "https://graphlynk.com/logo.png",
    "description": "Advanced Knowledge Graph & SEO Platform",
    "sameAs": [
      "https://twitter.com/graphlynk",
      "https://linkedin.com/company/graphlynk"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@graphlynk.com"
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center glow-primary">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white">Advanced Schema Manager</h1>
              <p className="text-gray-600 dark:text-[#98A2B3] text-sm">Build, validate, and deploy structured data for maximum visibility</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import</span>
            </button>
            <button 
              onClick={() => setShowAddSchema(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Schema</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="glass-card-light dark:glass-card rounded-2xl p-2 border border-gray-200 dark:border-white/10 inline-flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'builder', label: 'Schema Builder', icon: Layers },
            { id: 'validator', label: 'Validator', icon: Shield },
            { id: 'templates', label: 'Templates', icon: FileJson },
            { id: 'deployed', label: 'Deployed', icon: Globe },
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
                <div className="w-10 h-10 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs">
                  Active
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalSchemas}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Schemas</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>{validSchemas} validated</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">
                  Live
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{deployedSchemas}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deployed</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-3 h-3" />
                <span>{avgCoverage}% coverage</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs">
                  Enhanced
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{richResultsEnabled}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rich Results</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                <Sparkles className="w-3 h-3" />
                <span>Eligible for SERP features</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs">
                  Issues
                </span>
              </div>
              <p className="text-3xl text-gray-900 dark:text-white mb-1">{totalErrors + totalWarnings}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Issues</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="text-red-600 dark:text-red-400">{totalErrors} errors</span>
                <span className="text-gray-400">•</span>
                <span className="text-yellow-600 dark:text-yellow-400">{totalWarnings} warnings</span>
              </div>
            </motion.div>
          </div>

          {/* Schema List */}
          <div className="glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-gray-900 dark:text-white mb-1">Your Schemas</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage all your structured data</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search schemas..."
                      className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                    />
                  </div>
                  <button className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {filteredSchemas.map((schema, index) => {
                const isLocked = isPremiumLocked(schema);
                const StatusIcon = schema.status === 'valid' ? CheckCircle : schema.status === 'warning' ? AlertTriangle : XCircle;
                
                return (
                  <motion.div
                    key={schema.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-6 hover:bg-white/50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                      isLocked ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        schema.status === 'valid' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                        schema.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                        'bg-red-100 dark:bg-red-500/20'
                      }`}>
                        <StatusIcon className={`w-6 h-6 ${
                          schema.status === 'valid' ? 'text-emerald-600 dark:text-emerald-400' :
                          schema.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="text-gray-900 dark:text-white mb-1">{schema.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{schema.url}</p>
                          </div>
                          {isLocked && (
                            <div className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-1">
                              <Lock className="w-3 h-3 text-white" />
                              <span className="text-xs text-white">Premium</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-3 mb-4">
                          <span className="px-3 py-1 bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded-full text-xs">
                            {schema.type}
                          </span>
                          {schema.deployed && (
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Deployed
                            </span>
                          )}
                          {schema.richResults && (
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full text-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Rich Results
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {schema.coverage}% coverage
                          </span>
                          {schema.errors > 0 && (
                            <span className="text-xs text-red-600 dark:text-red-400">
                              {schema.errors} errors
                            </span>
                          )}
                          {schema.warnings > 0 && (
                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                              {schema.warnings} warnings
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>
                          <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <Play className="w-3 h-3" />
                            <span>Test</span>
                          </button>
                          <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                            <Settings className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all group"
              onClick={() => setViewMode('builder')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">Visual Builder</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create schemas with our intuitive drag-and-drop builder
              </p>
              <div className="flex items-center gap-2 text-[#0b3d84] dark:text-[#6EE7F5] text-sm group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all group"
              onClick={() => setViewMode('validator')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">Validate Schema</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Test your schema markup and fix errors instantly
              </p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm group-hover:gap-3 transition-all">
                <span>Start Testing</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all group"
              onClick={() => setViewMode('templates')}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileJson className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 dark:text-white mb-2">Browse Templates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Start with pre-built schema templates for common use cases
              </p>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm group-hover:gap-3 transition-all">
                <span>View Library</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Schema Builder View */}
      {viewMode === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Builder Panel */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Schema Builder</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Build your schema visually</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Generate</span>
                </button>
                <button 
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-1 text-xs"
                >
                  <Code className="w-3 h-3" />
                  <span>Code Editor</span>
                </button>
              </div>
            </div>

            {/* Schema Type Selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Schema Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Organization', 'Product', 'Article', 'FAQ'].map((type) => (
                  <button
                    key={type}
                    className="px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="GraphLynk"
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">URL *</label>
                <input
                  type="url"
                  placeholder="https://graphlynk.com"
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Advanced Knowledge Graph & SEO Platform"
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Logo URL</label>
                <input
                  type="url"
                  placeholder="https://graphlynk.com/logo.png"
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors"
                />
              </div>

              <button className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/20 rounded-xl text-gray-600 dark:text-gray-400 hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Field</span>
              </button>
            </div>
          </div>

          {/* Code Preview Panel */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">JSON-LD Output</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Live preview of generated schema</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
                <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <Download className="w-3 h-3" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-900 dark:bg-black/50 rounded-xl p-6 overflow-x-auto">
              <pre className="text-sm text-emerald-400">
                <code>{JSON.stringify(exampleSchema, null, 2)}</code>
              </pre>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                <span>Validate Schema</span>
              </button>
              <button className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Deploy to Site</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validator View */}
      {viewMode === 'validator' && (
        <div className="space-y-6">
          {/* Validation Input */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Schema Validator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Test and validate your schema markup</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Rich Results Test</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Paste your schema or URL</label>
                <textarea
                  rows={8}
                  placeholder='{"@context": "https://schema.org", ...}'
                  className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#0b3d84] dark:focus:border-[#6EE7F5] transition-colors resize-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Validate Now</span>
                </button>
                <button className="px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 dark:text-white">Validation Results</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {validationIssues.filter(i => i.type === 'error').length} errors, {validationIssues.filter(i => i.type === 'warning').length} warnings
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {validationIssues.map((issue, index) => {
                const Icon = issue.type === 'error' ? XCircle : issue.type === 'warning' ? AlertTriangle : CheckCircle;
                
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      issue.type === 'error' ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' :
                      issue.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20' :
                      'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        issue.type === 'error' ? 'text-red-600 dark:text-red-400' :
                        issue.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm text-gray-900 dark:text-white">{issue.field}</h4>
                          {issue.line && (
                            <span className="text-xs text-gray-500 dark:text-gray-500">Line {issue.line}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{issue.message}</p>
                        {issue.suggestion && (
                          <div className="flex items-start gap-2 mt-2 p-2 bg-white/50 dark:bg-white/5 rounded-lg">
                            <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">{issue.suggestion}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Rich Results Preview */}
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-gray-900 dark:text-white mb-4">Rich Results Preview</h3>
            <div className="p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-lg flex-shrink-0"></div>
                <div>
                  <h4 className="text-[#0b3d84] dark:text-[#6EE7F5] mb-1">GraphLynk - Advanced Knowledge Graph Platform</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-2">https://graphlynk.com</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Advanced Knowledge Graph & SEO Platform for building and managing structured data...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates View */}
      {viewMode === 'templates' && (
        <>
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Schema Templates Library</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pre-built templates for common schema types</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {schemaTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                        : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    {type === 'all' ? 'All Templates' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => {
              const isLocked = isPremiumLocked(template);
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
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

                  <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-xl flex items-center justify-center mb-4">
                    <FileJson className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-gray-900 dark:text-white mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{template.description}</p>

                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded text-xs">
                      {template.type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      template.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                      template.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {template.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {template.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <span>{template.usage.toLocaleString()} uses</span>
                  </div>

                  <button className="w-full px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Use Template</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Deployed View */}
      {viewMode === 'deployed' && (
        <div className="space-y-6">
          <div className="glass-card-light dark:glass-card rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 dark:text-white mb-1">Deployed Schemas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitor live schema performance</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Scan Site</span>
              </button>
            </div>

            {/* Deployment Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </div>
                <p className="text-2xl text-gray-900 dark:text-white">{deployedSchemas}</p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Warnings</span>
                </div>
                <p className="text-2xl text-gray-900 dark:text-white">{totalWarnings}</p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Errors</span>
                </div>
                <p className="text-2xl text-gray-900 dark:text-white">{totalErrors}</p>
              </div>
            </div>

            {/* URL Coverage Map */}
            <div className="space-y-3">
              {schemas.filter(s => s.deployed).map((schema, index) => (
                <motion.div
                  key={schema.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                      <div>
                        <h4 className="text-sm text-gray-900 dark:text-white">{schema.url}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{schema.type}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      schema.status === 'valid' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
                      schema.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                    }`}>
                      {schema.status === 'valid' ? <CheckCircle className="w-3 h-3" /> :
                       schema.status === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
                      {schema.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Coverage: {schema.coverage}%</span>
                    <span>•</span>
                    <span>Last validated: {new Date(schema.lastValidated).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-3 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] rounded-full"
                      style={{ width: `${schema.coverage}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Schema Modal */}
      <AnimatePresence>
        {showAddSchema && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-50"
              onClick={() => setShowAddSchema(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
            >
              <div className="glass-card-light dark:glass-card rounded-2xl p-8 border border-gray-200 dark:border-white/10">
                <h3 className="text-gray-900 dark:text-white mb-6">Create New Schema</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {['Organization', 'Product', 'Article', 'LocalBusiness', 'Event', 'Recipe'].map((type) => (
                    <button
                      key={type}
                      className="p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-[#0b3d84] dark:hover:border-[#6EE7F5] transition-all text-sm text-gray-700 dark:text-gray-300"
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddSchema(false)}
                    className="flex-1 px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      setShowAddSchema(false);
                      setViewMode('builder');
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
