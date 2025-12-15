import { motion, AnimatePresence } from 'motion/react';
import { X, Search, TrendingUp, Loader2, Sparkles, Copy, Download, ExternalLink, Check, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  rank: number;
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  pagemap?: {
    cse_thumbnail?: Array<{ src: string }>;
    videoobject?: Array<{
      embedurl?: string;
      thumbnailurl?: string;
      name?: string;
      uploaddate?: string;
    }>;
    metatags?: Array<{
      'og:site_name'?: string;
      'article:published_time'?: string;
      datepublished?: string;
      'og:updated_time'?: string;
      [key: string]: string | undefined;
    }>;
  };
}

interface SearchResponse {
  items: SearchResult[];
  suggestions: string[];
  searchInformation?: {
    formattedTotalResults?: string;
    formattedSearchTime?: string;
  };
}

interface KGResult {
  id: string;
  kgmid: string | null;
  name: string;
  types: string[];
  score: number;
  description: string;
  detailed: {
    body: string;
    url: string;
    license: string;
    source: string;
  } | null;
  image: string | null;
  entityHome: string | null;
  url: string | null;
  sameAs: string[];
  seeOnGoogleUrl: string | null;
}

interface KGSearchResponse {
  query: string;
  items: KGResult[];
  totalResults: number;
  timestamp: string;
  cached?: boolean;
  error?: string;
  configured?: boolean;
}

const popularSearches = [
  { query: "how to create a Google Knowledge graph", searchVolume: "8.2K" },
  { query: "what is google knowledge graph", searchVolume: "12.5K" },
  { query: "how to get google knowledge graph", searchVolume: "6.8K" },
  { query: "how to create a knowledge graph panel", searchVolume: "4.3K" },
  { query: "google knowledge graph example", searchVolume: "9.1K" },
  { query: "schema markup for knowledge graph", searchVolume: "5.7K" },
];

const kgPopularSearches = [
  { query: "Albert Einstein", searchVolume: "25K" },
  { query: "Apple Inc", searchVolume: "18K" },
  { query: "Taylor Swift", searchVolume: "32K" },
  { query: "Tesla", searchVolume: "22K" },
  { query: "New York City", searchVolume: "15K" },
  { query: "The Beatles", searchVolume: "12K" },
];

const typeFilters = ["Person", "Organization", "MusicGroup", "CreativeWork", "Book", "Movie", "Place"];

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchType?: 'knowledge-graph-db' | 'google-kg-api';
}

export function AdvancedSearchModal({ isOpen, onClose, searchType = 'knowledge-graph-db' }: AdvancedSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset results when search type changes
  useEffect(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedTypes([]);
  }, [searchType]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Fetch CSE search results
  const { data: searchResults, isLoading: cseLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) throw new Error('Search failed');
      return res.json();
    },
    enabled: searchType === 'knowledge-graph-db' && debouncedQuery.length >= 3,
  });

  // Fetch Knowledge Graph API results
  const { data: kgResults, isLoading: kgLoading, error: kgError } = useQuery<KGSearchResponse>({
    queryKey: ["/api/kgsearch", debouncedQuery, selectedTypes.join(','), limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: debouncedQuery,
        limit: limit.toString(),
      });
      if (selectedTypes.length > 0) {
        params.append('types', selectedTypes.join(','));
      }
      const res = await fetch(`/api/kgsearch?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Search failed');
      }
      return data;
    },
    enabled: searchType === 'google-kg-api' && debouncedQuery.length >= 2,
  });

  const isLoading = searchType === 'knowledge-graph-db' ? cseLoading : kgLoading;
  const hasResults = searchType === 'knowledge-graph-db' 
    ? searchResults && searchResults.items.length > 0
    : kgResults && kgResults.items && kgResults.items.length > 0;

  const estimateSearchVolume = (rank: number): string => {
    const volumes = ["24K", "18K", "15K", "12K", "9.5K", "8.2K", "6.8K", "5.4K", "4.1K", "3.2K"];
    return volumes[rank - 1] || "2.5K";
  };

  const isYouTubeVideo = (url: string): boolean => {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/");
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const getResultMetadata = (result: SearchResult): { date?: string; source?: string; type?: string } => {
    const metadata: { date?: string; source?: string; type?: string } = {};

    let dateStr: string | undefined;
    if (result.pagemap?.videoobject?.[0]?.uploaddate) {
      dateStr = result.pagemap.videoobject[0].uploaddate;
    } else if (result.pagemap?.metatags?.[0]?.['article:published_time']) {
      dateStr = result.pagemap.metatags[0]['article:published_time'];
    } else if (result.pagemap?.metatags?.[0]?.datepublished) {
      dateStr = result.pagemap.metatags[0].datepublished;
    } else if (result.pagemap?.metatags?.[0]?.['og:updated_time']) {
      dateStr = result.pagemap.metatags[0]['og:updated_time'];
    }

    if (dateStr) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          metadata.date = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        }
      } catch (e) {}
    }

    if (isYouTubeVideo(result.link)) {
      metadata.type = 'Video';
    }

    if (result.pagemap?.metatags?.[0]?.['og:site_name']) {
      metadata.source = result.pagemap.metatags[0]['og:site_name'];
    } else if (result.displayLink) {
      const parts = result.displayLink.split('/')[0].replace('www.', '').split('.');
      if (parts.length >= 2) {
        const domain = parts.slice(-2).join('.');
        metadata.source = domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];
      } else {
        metadata.source = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    }

    return metadata;
  };

  // Generate JSON-LD for a KG result
  const generateJsonLd = (result: KGResult): object => {
    const types = result.types || [];
    let schemaType = 'Thing';
    if (types.includes('Person')) schemaType = 'Person';
    else if (types.includes('Organization')) schemaType = 'Organization';
    else if (types.includes('Place')) schemaType = 'Place';
    else if (types.includes('MusicGroup')) schemaType = 'MusicGroup';
    else if (types.includes('CreativeWork') || types.includes('Book') || types.includes('Movie')) {
      schemaType = types.find(t => ['Book', 'Movie'].includes(t)) || 'CreativeWork';
    }

    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "@id": result.id,
      name: result.name,
    };

    if (result.description) jsonLd.description = result.description;
    if (result.url) jsonLd.url = result.url;
    if (result.image) jsonLd.image = result.image;
    if (result.sameAs && result.sameAs.length > 0) jsonLd.sameAs = result.sameAs;
    if (result.detailed?.url) jsonLd.mainEntityOfPage = result.detailed.url;

    return jsonLd;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const downloadJson = () => {
    if (!kgResults?.items) return;
    const data = JSON.stringify(kgResults.items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kg-results-${debouncedQuery.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (!kgResults?.items) return;
    const headers = ['ID', 'Name', 'Types', 'Score', 'Description', 'URL', 'Image'];
    const rows = kgResults.items.map(item => [
      item.id,
      item.name,
      item.types.join('; '),
      item.score.toString(),
      item.description,
      item.url || '',
      item.image || ''
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kg-results-${debouncedQuery.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHostname = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-[#0B0D10] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-white rounded-full transition-all hover:scale-110 hover:rotate-90"
              data-testid="button-close-search"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-[#0b3d84] via-[#0b3d84]/90 to-[#9FF2FF] p-8 pb-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="relative flex items-center gap-4 mb-6"
              >
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white">
                      {searchType === 'google-kg-api' ? 'Google Knowledge Graph Explorer' : 'Knowledge Graph Search'}
                    </h2>
                    <Badge variant="outline" className="border-white/30 bg-white/10 text-white animate-pulse relative overflow-visible">
                      <span className="absolute inset-0 rounded-full bg-green-400/50 blur-md animate-ping" />
                      <span className="relative flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
                        Live
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {searchType === 'google-kg-api' 
                      ? 'Search entities in the Google Knowledge Graph API' 
                      : 'Discover real-time SEO insights & knowledge graph data'}
                  </p>
                </div>
              </motion.div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={searchType === 'google-kg-api' 
                    ? "Search for people, organizations, places, creative works..." 
                    : "Search for knowledge graph topics, SEO strategies, schema markup..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="pl-14 pr-14 h-16 text-lg bg-white dark:bg-[#1A1F2E] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-0 focus:ring-2 focus:ring-white/30 rounded-2xl shadow-2xl font-medium"
                  data-testid="input-modal-search"
                />
                {isLoading && (
                  <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-[#9FF2FF]" />
                )}
              </div>

              {/* Filters for KG API */}
              {searchType === 'google-kg-api' && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
                    data-testid="button-toggle-filters"
                  >
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-xl">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {typeFilters.map(type => (
                              <button
                                key={type}
                                onClick={() => toggleTypeFilter(type)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  selectedTypes.includes(type)
                                    ? 'bg-white text-[#0b3d84]'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                                data-testid={`filter-type-${type.toLowerCase()}`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="text-white/80 text-sm">Results limit:</label>
                            <input
                              type="range"
                              min="1"
                              max="20"
                              value={limit}
                              onChange={(e) => setLimit(parseInt(e.target.value))}
                              className="w-32"
                            />
                            <span className="text-white font-medium">{limit}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto max-h-[calc(90vh-280px)] custom-scrollbar bg-gray-50 dark:bg-[#0B0D10]">
              {/* KG API Error State */}
              {searchType === 'google-kg-api' && kgError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-16 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                    <X className="w-10 h-10 text-red-500" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {(kgError as Error).message || 'Search failed'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please try again or check your API configuration
                  </p>
                </motion.div>
              )}

              {isLoading && debouncedQuery.length >= (searchType === 'google-kg-api' ? 2 : 3) ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-16 text-center"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 animate-ping">
                      <Loader2 className="w-12 h-12 text-[#9FF2FF]/50" />
                    </div>
                    <Loader2 className="relative w-12 h-12 animate-spin text-[#0b3d84] mx-auto" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6">
                    {searchType === 'google-kg-api' ? 'Searching Google Knowledge Graph...' : 'Searching knowledge graph...'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Analyzing millions of data points</p>
                </motion.div>
              ) : hasResults ? (
                <div className="p-8 space-y-6">
                  {/* Export actions for KG API */}
                  {searchType === 'google-kg-api' && kgResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-[#0b3d84]/5 to-[#9FF2FF]/5 rounded-xl border border-[#0b3d84]/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] rounded-lg">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          Found {kgResults.totalResults} entities
                          {kgResults.cached && <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">(cached)</span>}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={downloadJson} data-testid="button-download-json">
                          <Download className="w-4 h-4 mr-1" />
                          JSON
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadCsv} data-testid="button-download-csv">
                          <Download className="w-4 h-4 mr-1" />
                          CSV
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* CSE Results */}
                  {searchType === 'knowledge-graph-db' && searchResults && (
                    <>
                      {searchResults.searchInformation && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0b3d84]/5 to-[#9FF2FF]/5 rounded-xl border border-[#0b3d84]/10"
                        >
                          <div className="p-2 bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] rounded-lg">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-200">
                            Found {searchResults.searchInformation.formattedTotalResults || "1,000"} results
                            {searchResults.searchInformation.formattedSearchTime && 
                              <span className="text-gray-600 dark:text-gray-400 font-normal"> in {searchResults.searchInformation.formattedSearchTime}s</span>}
                          </span>
                        </motion.div>
                      )}

                      {searchResults.items.map((result, index) => {
                        const videoId = isYouTubeVideo(result.link) ? getYouTubeVideoId(result.link) : null;
                        const metadata = getResultMetadata(result);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-2xl bg-white dark:bg-[#1A1F2E] border-2 border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 dark:hover:border-[#9FF2FF]/30 transition-all duration-300 hover:shadow-2xl group"
                            data-testid={`modal-result-${index}`}
                          >
                            <div className="flex items-start gap-5">
                              <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                  <span className="text-xl font-bold text-white">#{result.rank}</span>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">
                                    {result.displayLink}
                                  </span>
                                  {metadata.source && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded">{metadata.source}</span>
                                  )}
                                  {metadata.type && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">{metadata.type}</Badge>
                                  )}
                                  {metadata.date && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{metadata.date}</span>
                                  )}
                                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0b3d84]/10 to-[#9FF2FF]/10 rounded-lg border border-[#0b3d84]/20">
                                    <TrendingUp className="w-3.5 h-3.5 text-[#0b3d84] dark:text-[#9FF2FF]" />
                                    <span className="text-xs font-bold text-[#0b3d84] dark:text-[#9FF2FF]">{estimateSearchVolume(result.rank)}/mo</span>
                                  </div>
                                </div>

                                <a
                                  href={result.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block mb-3"
                                >
                                  <h3 className="text-xl font-bold text-[#0b3d84] dark:text-[#0b3d84] line-clamp-2">
                                    {result.title}
                                  </h3>
                                </a>

                                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2 mb-3">
                                  {result.snippet}
                                </p>

                                {videoId && (
                                  <div className="mt-4 rounded-lg overflow-hidden border border-border shadow-lg">
                                    <iframe
                                      width="100%"
                                      height="315"
                                      src={`https://www.youtube.com/embed/${videoId}`}
                                      title={result.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="bg-black"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </>
                  )}

                  {/* Knowledge Graph API Results */}
                  {searchType === 'google-kg-api' && kgResults && kgResults.items.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 rounded-2xl bg-white dark:bg-[#1A1F2E] border-2 border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 dark:hover:border-[#9FF2FF]/30 transition-all duration-300 hover:shadow-2xl group"
                      data-testid={`kg-result-${index}`}
                    >
                      <div className="flex items-start gap-5">
                        {/* Image or Score Badge */}
                        <div className="flex-shrink-0">
                          {result.image ? (
                            <img 
                              src={result.image} 
                              alt={result.name}
                              className="w-20 h-20 rounded-xl object-cover shadow-lg border-2 border-gray-200 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center shadow-lg">
                              <span className="text-2xl font-bold text-white">{result.name.charAt(0)}</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {result.types.slice(0, 3).map((type, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
                                {type}
                              </Badge>
                            ))}
                            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#0b3d84]/10 to-[#9FF2FF]/10 rounded-lg border border-[#0b3d84]/20">
                              <TrendingUp className="w-3.5 h-3.5 text-[#0b3d84] dark:text-[#9FF2FF]" />
                              <span className="text-xs font-bold text-[#0b3d84] dark:text-[#9FF2FF]">Score: {result.score.toFixed(0)}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {result.name}
                          </h3>

                          {result.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{result.description}</p>
                          )}

                          {result.detailed?.body && (
                            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 mb-3">
                              {result.detailed.body}
                            </p>
                          )}

                          {/* sameAs links */}
                          {result.sameAs && result.sameAs.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {result.sameAs.slice(0, 5).map((link, i) => (
                                <a 
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-white/5 rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
                                >
                                  {getHostname(link)}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Graph ID (kgmid) */}
                          {result.kgmid && (
                            <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Graph ID:</span>
                              <code className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded">{result.kgmid}</code>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => copyToClipboard(result.kgmid!, `kgmid-${index}`)}
                                data-testid={`button-copy-kgmid-${index}`}
                              >
                                {copiedId === `kgmid-${index}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </Button>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5 flex-wrap">
                            {/* Entity Home button - only show if official website exists */}
                            {result.entityHome && (
                              <a href={result.entityHome} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="default" data-testid={`button-entity-home-${index}`}>
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                  Entity Home
                                </Button>
                              </a>
                            )}
                            {/* Fallback Visit button when no official entityHome - uses fallback chain */}
                            {!result.entityHome && (
                              <a 
                                href={result.detailed?.url || (result.sameAs && result.sameAs[0]) || `https://www.google.com/search?q=${encodeURIComponent(result.name)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="secondary" data-testid={`button-visit-${index}`}>
                                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                  Visit
                                </Button>
                              </a>
                            )}
                            {/* See on Google button - always show with fallback to name search */}
                            <a 
                              href={result.seeOnGoogleUrl || `https://www.google.com/search?q=${encodeURIComponent(result.name)}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline" data-testid={`button-see-on-google-${index}`}>
                                <Search className="w-3.5 h-3.5 mr-1" />
                                See on Google
                              </Button>
                            </a>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(result.id, `id-${index}`)}
                              data-testid={`button-copy-id-${index}`}
                            >
                              {copiedId === `id-${index}` ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                              Copy @id
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), `json-${index}`)}
                              data-testid={`button-copy-json-${index}`}
                            >
                              {copiedId === `json-${index}` ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                              Copy JSON
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(JSON.stringify(generateJsonLd(result), null, 2), `jsonld-${index}`)}
                              data-testid={`button-copy-jsonld-${index}`}
                            >
                              {copiedId === `jsonld-${index}` ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                              Copy JSON-LD
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : debouncedQuery.length >= (searchType === 'google-kg-api' ? 2 : 3) && !kgError ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-16 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search terms or explore our popular searches below</p>
                </motion.div>
              ) : (
                <div className="p-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 mb-6"
                  >
                    <div className="p-2 bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] rounded-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {searchType === 'google-kg-api' ? 'Popular Entity Searches' : 'Popular Knowledge Graph Searches'}
                    </h3>
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(searchType === 'google-kg-api' ? kgPopularSearches : popularSearches).map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSearchQuery(suggestion.query)}
                        className="p-5 rounded-xl bg-white dark:bg-[#1A1F2E] border-2 border-gray-200 dark:border-white/10 hover:border-[#0b3d84] dark:hover:border-[#9FF2FF] cursor-pointer group transition-all hover:shadow-lg"
                        data-testid={`modal-suggestion-${index}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-gradient-to-br from-[#0b3d84]/10 to-[#9FF2FF]/10 rounded-lg group-hover:scale-110 transition-transform">
                            <Search className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
                          </div>
                          <div className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-[#0b3d84] dark:group-hover:text-[#9FF2FF] transition-colors">
                            {suggestion.query}
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#0b3d84]/10 to-[#9FF2FF]/10 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-[#0b3d84] dark:text-[#9FF2FF]" />
                            <span className="text-sm font-bold text-[#0b3d84] dark:text-[#9FF2FF]">{suggestion.searchVolume}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
