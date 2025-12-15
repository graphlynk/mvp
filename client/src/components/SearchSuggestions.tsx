import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

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

const popularSearches = [
  { query: "how to create a Google Knowledge graph", searchVolume: "8.2K" },
  { query: "what is google knowledge graph", searchVolume: "12.5K" },
  { query: "how to get google knowledge graph", searchVolume: "6.8K" },
  { query: "how to create a knowledge graph panel", searchVolume: "4.3K" },
  { query: "google knowledge graph example", searchVolume: "9.1K" },
  { query: "schema markup for knowledge graph", searchVolume: "5.7K" },
];

export function SearchSuggestions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch real search results
  const { data: searchResults, isLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/search", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!res.ok) {
        throw new Error('Search failed');
      }
      return res.json();
    },
    enabled: debouncedQuery.length >= 3,
  });

  const showResults = (isFocused || isExpanded) && searchQuery.length >= 0;
  const hasResults = searchResults && searchResults.items.length > 0;

  // Expand on focus
  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };

  // Estimate search volume based on rank (higher rank = higher volume)
  const estimateSearchVolume = (rank: number): string => {
    const volumes = ["24K", "18K", "15K", "12K", "9.5K", "8.2K", "6.8K", "5.4K", "4.1K", "3.2K"];
    return volumes[rank - 1] || "2.5K";
  };

  // Check if URL is a YouTube video
  const isYouTubeVideo = (url: string): boolean => {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/");
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Extract metadata from result
  const getResultMetadata = (result: SearchResult): { date?: string; source?: string; type?: string } => {
    const metadata: { date?: string; source?: string; type?: string } = {};

    // Extract date from multiple sources (videos and articles)
    let dateStr: string | undefined;
    
    // Try video upload date first
    if (result.pagemap?.videoobject?.[0]?.uploaddate) {
      dateStr = result.pagemap.videoobject[0].uploaddate;
    }
    // Try article published time
    else if (result.pagemap?.metatags?.[0]?.['article:published_time']) {
      dateStr = result.pagemap.metatags[0]['article:published_time'];
    }
    // Try generic date published
    else if (result.pagemap?.metatags?.[0]?.datepublished) {
      dateStr = result.pagemap.metatags[0].datepublished;
    }
    // Try OG published time
    else if (result.pagemap?.metatags?.[0]?.['og:updated_time']) {
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
      } catch (e) {
        // Invalid date, skip
      }
    }

    // Determine result type
    if (isYouTubeVideo(result.link)) {
      metadata.type = 'Video';
    }

    // Extract source/site name - prefer og:site_name, fallback to domain
    if (result.pagemap?.metatags?.[0]?.['og:site_name']) {
      metadata.source = result.pagemap.metatags[0]['og:site_name'];
    } else if (result.displayLink) {
      // Get registrable domain (e.g. "spotify.com" not "open.spotify.com")
      const parts = result.displayLink.split('/')[0].replace('www.', '').split('.');
      if (parts.length >= 2) {
        // Take last two parts for proper domain (e.g. "example.com")
        const domain = parts.slice(-2).join('.');
        metadata.source = domain.charAt(0).toUpperCase() + domain.slice(1).split('.')[0];
      } else {
        metadata.source = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
    }

    return metadata;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto" 
      data-testid="search-suggestions-widget"
    >
      <Card 
        className={`
          bg-background/95 backdrop-blur-md border-border/50 shadow-xl overflow-hidden
          transition-all duration-500 ease-out
          ${isExpanded ? 'scale-100 opacity-100' : 'scale-100 opacity-100'}
        `}
      >
        {/* Search Input */}
        <div className="p-4 flex items-center gap-3 border-b border-border/50 ml-[204px] mr-[204px]">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder="Search: knowledge graph, SEO tips, schema markup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-0"
            data-testid="input-search-autocomplete"
          />
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
        </div>

        {/* Search Results with smooth transition */}
        <div 
          className={`
            transition-all duration-500 ease-out overflow-hidden
            ${showResults ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="overflow-y-auto max-h-[600px]" data-testid="suggestions-list">
            {isLoading && debouncedQuery.length >= 3 ? (
              <div className="p-8 text-center animate-in fade-in duration-300">
                <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : hasResults ? (
              <div className="p-6 space-y-1 animate-in fade-in slide-in-from-top-2 duration-500">
                {/* Search info */}
                {searchResults.searchInformation && (
                  <p className="text-xs text-muted-foreground mb-4">
                    About {searchResults.searchInformation.formattedTotalResults || "1,000"} results 
                    {searchResults.searchInformation.formattedSearchTime && ` (${searchResults.searchInformation.formattedSearchTime} seconds)`}
                  </p>
                )}

                {/* Results - Google Style */}
                {searchResults.items.map((result, index) => {
                  const videoId = isYouTubeVideo(result.link) ? getYouTubeVideoId(result.link) : null;
                  const metadata = getResultMetadata(result);
                  
                  return (
                    <div 
                      key={index} 
                      className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300" 
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`result-${index}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">#{result.rank}</span>
                          </div>
                        </div>

                        {/* Result Content */}
                        <div className="flex-1 min-w-0">
                          {/* URL, Metadata, and Search Volume */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm text-green-600 dark:text-green-500">
                              {result.displayLink}
                            </span>
                            {metadata.source && (
                              <span className="text-xs text-muted-foreground">
                                › {metadata.source}
                              </span>
                            )}
                            {metadata.type && (
                              <Badge variant="outline" className="text-xs">
                                {metadata.type}
                              </Badge>
                            )}
                            {metadata.date && (
                              <span className="text-xs text-muted-foreground">
                                • {metadata.date}
                              </span>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {estimateSearchVolume(result.rank)}/mo
                            </Badge>
                          </div>

                          {/* Title */}
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mb-2 group"
                          >
                            <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline font-normal line-clamp-2">
                              {result.title}
                            </h3>
                          </a>

                          {/* Snippet */}
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">
                            {result.snippet}
                          </p>

                          {/* YouTube Video Embed */}
                          {videoId && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-border">
                              <iframe
                                width="100%"
                                height="280"
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
                    </div>
                  );
                })}

                {/* Showing results footer */}
                <div className="text-center pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Showing real-time results for "{debouncedQuery}"
                  </p>
                </div>
              </div>
            ) : debouncedQuery.length >= 3 ? (
              <div className="p-8 text-center animate-in fade-in duration-300">
                <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No results found. Try a different search.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {popularSearches.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 flex items-center gap-4 hover-elevate cursor-pointer group animate-in fade-in slide-in-from-top-1 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`suggestion-${index}`}
                    onClick={() => setSearchQuery(suggestion.query)}
                  >
                    <Search className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                    <div className="flex-1 text-sm text-foreground/90 group-hover:text-foreground">
                      {suggestion.query}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary" data-testid={`volume-${index}`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{suggestion.searchVolume}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
