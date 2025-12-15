import { Link } from "wouter";
import { ArrowLeft, Code, Lock, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-xl font-bold">API Documentation</h1>
          <div className="w-[160px]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">YouTube Search API</h1>
          <p className="text-lg text-muted-foreground">
            Access YouTube video search functionality with our REST API. Free tier includes basic search,
            while PRO and AUTHORITY plans unlock advanced analytics and unlimited requests.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm">Free Tier</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">10</p>
              <p className="text-xs text-muted-foreground">requests per hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm">PRO Tier</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Unlimited</p>
              <p className="text-xs text-muted-foreground">+ advanced analytics</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle className="text-sm">Authentication</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Cookie</p>
              <p className="text-xs text-muted-foreground">Session-based</p>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <Tabs defaultValue="free" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="free">Free Tier</TabsTrigger>
            <TabsTrigger value="advanced">PRO/AUTHORITY</TabsTrigger>
          </TabsList>

          {/* Free Tier Endpoint */}
          <TabsContent value="free" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Basic YouTube Search</CardTitle>
                  <Badge variant="outline">GET</Badge>
                </div>
                <CardDescription>
                  Search YouTube videos with basic information. Rate limited to 10 requests per hour.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Endpoint</h4>
                  <code className="block p-3 bg-muted rounded-lg text-sm">
                    GET /api/youtube/search?q={"{query}"}
                  </code>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                  <div className="space-y-2">
                    <div className="flex gap-4 text-sm">
                      <code className="bg-muted px-2 py-1 rounded">q</code>
                      <span className="text-muted-foreground">Search query (required)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Response</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`{
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Video Title",
      "description": "Video description...",
      "thumbnail": "https://i.ytimg.com/...",
      "channelTitle": "Channel Name",
      "publishedAt": "2024-01-01T00:00:00Z",
      "url": "https://www.youtube.com/watch?v=..."
    }
  ],
  "totalResults": 10,
  "tier": "free",
  "remaining": 9
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Example Request</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`fetch('/api/youtube/search?q=javascript+tutorial')
  .then(res => res.json())
  .then(data => console.log(data.videos));`}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Rate Limiting</h4>
                  <p className="text-sm text-muted-foreground">
                    When rate limit is exceeded, you'll receive a 429 status code with details about when the limit resets.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tier Endpoint */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced YouTube Search</CardTitle>
                  <Badge>GET</Badge>
                </div>
                <CardDescription>
                  Advanced search with detailed analytics, filters, and unlimited requests. Requires PRO or AUTHORITY plan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Endpoint</h4>
                  <code className="block p-3 bg-muted rounded-lg text-sm">
                    GET /api/youtube/search/advanced
                  </code>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">q</code>
                      <span className="text-muted-foreground">Search query (required)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">maxResults</code>
                      <span className="text-muted-foreground">Results per page (1-50, default: 25)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">order</code>
                      <span className="text-muted-foreground">Sort order: date, rating, relevance, title, viewCount</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">videoDuration</code>
                      <span className="text-muted-foreground">Filter: any, short, medium, long</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">videoDefinition</code>
                      <span className="text-muted-foreground">Quality: any, high, standard</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">publishedAfter</code>
                      <span className="text-muted-foreground">RFC 3339 timestamp (e.g., 2024-01-01T00:00:00Z)</span>
                    </div>
                    <div className="flex gap-4">
                      <code className="bg-muted px-2 py-1 rounded">publishedBefore</code>
                      <span className="text-muted-foreground">RFC 3339 timestamp</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Response (includes analytics)</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`{
  "videos": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Video Title",
      "description": "Video description...",
      "thumbnail": "https://i.ytimg.com/...",
      "channelTitle": "Channel Name",
      "publishedAt": "2024-01-01T00:00:00Z",
      "url": "https://www.youtube.com/watch?v=...",
      "viewCount": 1000000,
      "likeCount": 50000,
      "commentCount": 2500,
      "duration": "PT5M30S",
      "engagement": 5.25
    }
  ],
  "totalResults": 25,
  "tier": "pro",
  "filters": { ... }
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Example Request</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`fetch('/api/youtube/search/advanced?q=react+tutorial&order=viewCount&maxResults=50&videoDefinition=high')
  .then(res => res.json())
  .then(data => {
    console.log('Total results:', data.totalResults);
    console.log('Top video:', data.videos[0]);
    console.log('Engagement rate:', data.videos[0].engagement + '%');
  });`}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Export Endpoint */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Export Results</CardTitle>
                  <Badge>POST</Badge>
                </div>
                <CardDescription>
                  Export search results as JSON or CSV. PRO/AUTHORITY plans only.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Endpoint</h4>
                  <code className="block p-3 bg-muted rounded-lg text-sm">
                    POST /api/youtube/export
                  </code>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Request Body</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`{
  "videos": [...], // Array of video results
  "format": "json" // or "csv"
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Example Request</h4>
                  <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`fetch('/api/youtube/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    videos: results.videos,
    format: 'csv'
  })
}).then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-results.csv';
    a.click();
  });`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Codes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
            <CardDescription>Common error responses you may encounter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">400</code>
                <span className="text-muted-foreground">Bad Request - Missing or invalid parameters</span>
              </div>
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">401</code>
                <span className="text-muted-foreground">Unauthorized - Authentication required (advanced endpoints)</span>
              </div>
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">403</code>
                <span className="text-muted-foreground">Forbidden - PRO/AUTHORITY plan required</span>
              </div>
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">429</code>
                <span className="text-muted-foreground">Too Many Requests - Rate limit exceeded (free tier)</span>
              </div>
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">500</code>
                <span className="text-muted-foreground">Internal Server Error - YouTube API error</span>
              </div>
              <div className="flex gap-4">
                <code className="bg-muted px-2 py-1 rounded">503</code>
                <span className="text-muted-foreground">Service Unavailable - YouTube API not configured</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>How to authenticate your API requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Free Tier</h4>
              <p className="text-sm text-muted-foreground">
                No authentication required. Rate limiting is based on IP address or authenticated user session.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">PRO/AUTHORITY Tier</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Requires active session cookie. Login through the web interface to receive authentication cookie.
              </p>
              <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto">
{`fetch('/api/youtube/search/advanced?q=tutorial', {
  credentials: 'include' // Include session cookie
})`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        <Card className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-6 h-6" />
              Ready to unlock advanced features?
            </CardTitle>
            <CardDescription>
              Upgrade to PRO for unlimited searches, advanced analytics, and export capabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">
                View Plans
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
