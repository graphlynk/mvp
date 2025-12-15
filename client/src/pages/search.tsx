import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@shared/schema";
import { Search as SearchIcon, ExternalLink, TrendingUp, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Search() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  interface SearchResult {
    title: string;
    link: string;
    displayLink: string;
    snippet: string;
    rank: number;
  }

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/me"],
  });

  const { data, isLoading } = useQuery<{ items: SearchResult[]; suggestions: string[] }>({
    queryKey: ["/api/search", searchQuery],
    enabled: searchQuery.length > 0,
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSearchQuery(suggestion);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" data-testid="button-back-dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-search-title">Search Tracking</h1>
              <p className="text-sm text-muted-foreground">Monitor your Google rankings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Search Form */}
        <Card className="mb-8" data-testid="card-search-form">
          <CardHeader>
            <CardTitle>Search Google</CardTitle>
            <CardDescription>
              Track where you or your competitors rank for specific keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Enter search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                data-testid="input-search-query"
              />
              <Button type="submit" disabled={isLoading} data-testid="button-search">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {data?.suggestions && data.suggestions.length > 0 && (
          <div className="mb-8" data-testid="suggestions-container">
            <h2 className="text-lg font-semibold mb-3">Related Searches</h2>
            <div className="flex gap-2 flex-wrap">
              {data.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  data-testid={`button-suggestion-${index}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {searchQuery && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <h2 className="text-2xl font-bold" data-testid="text-results-title">
                Results for "{searchQuery}"
              </h2>
              {data?.items && (
                <Badge variant="secondary" data-testid="badge-results-count">
                  {data.items.length} results
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Searching Google...</p>
              </div>
            ) : data?.items && data.items.length > 0 ? (
              <div className="space-y-4" data-testid="results-container">
                {data.items.map((result, index) => (
                  <Card key={index} className="hover-elevate" data-testid={`result-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary" data-testid={`rank-${index}`}>
                                #{result.rank}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Result Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-semibold hover:text-primary transition-colors truncate"
                              data-testid={`link-${index}`}
                            >
                              {result.title}
                            </a>
                            <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </div>

                          <div className="text-sm text-primary mb-2 truncate" data-testid={`display-link-${index}`}>
                            {result.displayLink}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`snippet-${index}`}>
                            {result.snippet}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No results found. Try a different search query.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && (
          <Card data-testid="card-empty-state">
            <CardContent className="p-12 text-center text-muted-foreground">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Start Tracking Rankings</h3>
              <p className="mb-6 max-w-md mx-auto">
                Enter a keyword or phrase above to see how you or your competitors rank on Google.
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("SEO tools");
                    setSearchQuery("SEO tools");
                  }}
                >
                  Try: SEO tools
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("link in bio");
                    setSearchQuery("link in bio");
                  }}
                >
                  Try: link in bio
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
