import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Link2,
  BookOpen,
  Mail,
  Search,
  TrendingUp,
  Sparkles,
  Play,
  Globe,
} from "lucide-react";
import { AIAssistant } from "@/components/AIAssistant";
import { AIInsights } from "@/components/AIInsights";
import { EntityIngestionTool } from "@/components/EntityIngestionTool";

interface DashboardHomeProps {
  user: User;
}

export function DashboardHome({ user }: DashboardHomeProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-welcome">
          Welcome back{user.name ? `, ${user.name}` : ""}!
        </h2>
        <p className="text-gray-600 text-lg" data-testid="text-welcome-subtitle">
          Manage your SEO presence and grow your online authority
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-stat-profile">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-500">Profile Views</CardDescription>
            <CardTitle className="text-4xl font-bold text-gray-900">0</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-stat-posts">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-500">Blog Posts</CardDescription>
            <CardTitle className="text-4xl font-bold text-gray-900">0</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-stat-subscribers">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-500">Subscribers</CardDescription>
            <CardTitle className="text-4xl font-bold text-gray-900">0</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm" data-testid="card-stat-rank">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide font-semibold text-gray-500">Avg. Rank</CardDescription>
            <CardTitle className="text-4xl font-bold text-gray-900">-</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* AI Intelligence Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Intelligence Center
          </h3>
          <p className="text-gray-600">
            Supercharge your SEO with AI-powered insights and assistance
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIAssistant />
          <AIInsights />
        </div>
      </div>

      {/* Action Cards */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/profile">
            <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm" data-testid="card-action-profile">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <Link2 className="w-7 h-7 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">My Profile</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Create and customize your SEO-optimized link-in-bio page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-manage-profile">
                  Manage Profile
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search">
            <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm" data-testid="card-action-search">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Search Tracking</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Monitor Google rankings and analyze search performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-track-rankings">
                  Track Rankings
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/blog">
            <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm" data-testid="card-action-blog">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-cyan-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Blog Posts</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {user.plan === "FREE" ? (
                    <>
                      <Badge variant="secondary" className="mb-2">Pro Feature</Badge>
                      <p className="text-gray-600">Publish SEO-friendly blog posts with newsletters</p>
                    </>
                  ) : (
                    "Publish SEO-friendly blog posts with newsletters"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={user.plan === "FREE"}
                  data-testid="button-manage-blog"
                >
                  {user.plan === "FREE" ? "Upgrade to Pro" : "Manage Blog"}
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/youtube">
            <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm" data-testid="card-action-youtube">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                  <Play className="w-7 h-7 text-red-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">YouTube Search</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Search YouTube videos with advanced analytics
                  {user.plan !== "FREE" && (
                    <Badge variant="secondary" className="mt-2">Premium Analytics</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-youtube-search">
                  {user.plan === "FREE" ? "Search Videos (Free)" : "Advanced Search"}
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/subscribers">
            <Card className="hover-elevate cursor-pointer h-full bg-white border-gray-200 shadow-sm" data-testid="card-action-subscribers">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-green-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Mailing List</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {user.plan === "FREE" ? (
                    <>
                      <Badge variant="secondary" className="mb-2">Pro Feature</Badge>
                      <p className="text-gray-600">Build and engage your email subscriber base</p>
                    </>
                  ) : (
                    "Build and engage your email subscriber base"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={user.plan === "FREE"}
                  data-testid="button-manage-subscribers"
                >
                  {user.plan === "FREE" ? "Upgrade to Pro" : "Manage Subscribers"}
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover-elevate bg-white border-gray-200 shadow-sm" data-testid="card-action-analytics">
            <CardHeader>
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Analytics</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {user.plan === "FREE" ? (
                  <>
                    <Badge variant="secondary" className="mb-2">Pro Feature</Badge>
                    <p className="text-gray-600">Advanced insights and performance metrics</p>
                  </>
                ) : (
                  "Advanced insights and performance metrics"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" 
                disabled={user.plan === "FREE"}
                data-testid="button-view-analytics"
              >
                {user.plan === "FREE" ? "Upgrade to Pro" : "View Analytics"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admin Tools - Entity Ingestion */}
      {user.plan === "AUTHORITY" && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Admin Tools</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EntityIngestionTool />
            <Link href="/entities">
              <Card className="hover-elevate cursor-pointer h-full bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white">Browse Entities</CardTitle>
                      <CardDescription className="text-blue-100">
                        View all unclaimed entity profiles
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-browse-entities">
                    Browse Unclaimed Entities
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {user.plan === "FREE" && (
        <Card className="bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-blue-500/20 border-blue-400/30 shadow-xl backdrop-blur-md" data-testid="card-upgrade-cta">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Sparkles className="w-7 h-7 text-blue-300" />
              Unlock Pro Features
            </CardTitle>
            <CardDescription className="text-base text-blue-100">
              Get access to blog publishing, schema markup builder, advanced analytics, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button className="shadow-md bg-white text-blue-900 hover:bg-blue-50" data-testid="button-upgrade-pro">
                Upgrade to Pro - $29/mo
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" data-testid="button-compare-plans">
                Compare Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
