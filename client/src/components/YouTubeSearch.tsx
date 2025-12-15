import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Search, Play, TrendingUp, Clock, ThumbsUp, MessageCircle, FileDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  duration?: string;
  engagement?: number;
}

interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
  totalResults: number;
  tier: string;
  remaining?: number;
  filters?: any;
}

interface User {
  id: number;
  email: string;
  username: string | null;
  plan: "FREE" | "PRO" | "AUTHORITY";
}

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const { toast } = useToast();

  // Fetch current user to check plan tier
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
    retry: false,
  });

  // Auto-enable advanced search for PRO/AUTHORITY users
  useEffect(() => {
    if (user && (user.plan === "PRO" || user.plan === "AUTHORITY")) {
      setIsAdvanced(true);
    }
  }, [user]);

  // Free tier search
  const { data: searchResults, isLoading } = useQuery<YouTubeSearchResponse>({
    queryKey: ["/api/youtube/search", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Search failed");
      }
      return res.json();
    },
    enabled: !!searchQuery && !isAdvanced,
  });

  // Advanced search (for paid users)
  const { data: advancedResults, isLoading: advancedLoading } = useQuery<YouTubeSearchResponse>({
    queryKey: ["/api/youtube/search/advanced", searchQuery],
    queryFn: async () => {
      const res = await fetch(`/api/youtube/search/advanced?q=${encodeURIComponent(searchQuery)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Advanced search failed");
      }
      return res.json();
    },
    enabled: !!searchQuery && isAdvanced,
  });

  const results = isAdvanced ? advancedResults : searchResults;
  const loading = isAdvanced ? advancedLoading : isLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchQuery(query);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleExport = async (format: "json" | "csv") => {
    if (!results?.videos) return;
    
    try {
      await fetch("/api/youtube/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          videos: results.videos,
          format,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
        
        // Download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `youtube-search-results.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
      
      toast({
        title: "Export successful",
        description: `Results exported as ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export results",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4" data-testid="youtube-search-widget">
      <Card className="bg-background/95 backdrop-blur-md border-border/50 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-border/50">
          {/* Search Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Play className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">YouTube Video Search</h2>
              <p className="text-sm text-muted-foreground">
                {user && (user.plan === "PRO" || user.plan === "AUTHORITY")
                  ? `${user.plan} tier - Unlimited searches with advanced analytics`
                  : "Free tier - 10 searches per hour"}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="text"
                placeholder="Search YouTube videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 text-base border-border/50 focus-visible:border-primary transition-all"
                data-testid="input-youtube-search"
              />
            </div>
            <Button 
              type="submit" 
              className="h-12 px-6"
              disabled={loading}
              data-testid="button-search-youtube"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>

          {/* Rate Limit Info */}
          {results && results.tier === "free" && results.remaining !== undefined && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{results.remaining} searches remaining this hour</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && results.videos.length > 0 && (
          <div className="p-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">
                  {results.totalResults} {results.totalResults === 1 ? "result" : "results"}
                </h3>
                <Badge variant="outline" className="capitalize">
                  {results.tier} tier
                </Badge>
              </div>

              {/* Export Options (PRO/AUTHORITY only) */}
              {results.tier !== "free" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("json")}
                    data-testid="button-export-json"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("csv")}
                    data-testid="button-export-csv"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                </div>
              )}
            </div>

            {/* Video Results - Left Aligned, Rich Design */}
            <div className="space-y-4">
              {results.videos.map((video, index) => (
                <div
                  key={video.id}
                  className="group relative flex gap-4 p-4 rounded-xl border border-border/50 hover-elevate active-elevate-2 transition-all animate-in fade-in slide-in-from-left-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`video-result-${index}`}
                >
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-40 h-24 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    {/* Channel and Date */}
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                      <span className="font-medium">{video.channelTitle}</span>
                      <span>•</span>
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-2"
                      data-testid={`link-video-${index}`}
                    >
                      {video.title}
                    </a>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {video.description}
                    </p>

                    {/* Stats (PRO/AUTHORITY only) */}
                    {results.tier !== "free" && video.viewCount !== undefined && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">{formatViews(video.viewCount)} views</span>
                        </div>
                        {video.likeCount !== undefined && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{formatViews(video.likeCount)}</span>
                          </div>
                        )}
                        {video.commentCount !== undefined && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MessageCircle className="w-4 h-4" />
                            <span>{formatViews(video.commentCount)}</span>
                          </div>
                        )}
                        {video.engagement !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {video.engagement.toFixed(2)}% engagement
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Watch Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4 mr-2" />
                        Watch
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !results && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search YouTube Videos</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {user && (user.plan === "PRO" || user.plan === "AUTHORITY")
                ? `Enter a search query to find YouTube videos. You have unlimited searches with advanced analytics including views, likes, comments, and engagement metrics.`
                : `Enter a search query to find YouTube videos. Free tier users get 10 searches per hour. Upgrade to PRO for unlimited searches and advanced analytics.`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Searching YouTube...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && results && results.videos.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
