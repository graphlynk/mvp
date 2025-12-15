import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile, Post, type Link as ProfileLink } from "@shared/schema";
import { ExternalLink, Sparkles, Globe, Mail, Twitter, Linkedin, Instagram, Facebook, Youtube, Github, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useState } from "react";

function getSocialIcon(url: string, label: string) {
  const lowerUrl = url.toLowerCase();
  const lowerLabel = label.toLowerCase();
  
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerLabel.includes('twitter') || lowerLabel.includes('x.com')) {
    return <Twitter className="w-5 h-5" />;
  }
  if (lowerUrl.includes('linkedin.com') || lowerLabel.includes('linkedin')) {
    return <Linkedin className="w-5 h-5" />;
  }
  if (lowerUrl.includes('instagram.com') || lowerLabel.includes('instagram')) {
    return <Instagram className="w-5 h-5" />;
  }
  if (lowerUrl.includes('facebook.com') || lowerLabel.includes('facebook')) {
    return <Facebook className="w-5 h-5" />;
  }
  if (lowerUrl.includes('youtube.com') || lowerLabel.includes('youtube')) {
    return <Youtube className="w-5 h-5" />;
  }
  if (lowerUrl.includes('github.com') || lowerLabel.includes('github')) {
    return <Github className="w-5 h-5" />;
  }
  if (lowerLabel.includes('email') || lowerLabel.includes('contact')) {
    return <Mail className="w-5 h-5" />;
  }
  if (lowerLabel.includes('website') || lowerLabel.includes('site') || lowerLabel.includes('portfolio')) {
    return <Globe className="w-5 h-5" />;
  }
  return <ExternalLink className="w-5 h-5" />;
}

function getSocialName(url: string, label: string) {
  const lowerUrl = url.toLowerCase();
  const lowerLabel = label.toLowerCase();
  
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'Twitter';
  if (lowerUrl.includes('linkedin.com')) return 'LinkedIn';
  if (lowerUrl.includes('instagram.com')) return 'Instagram';
  if (lowerUrl.includes('facebook.com')) return 'Facebook';
  if (lowerUrl.includes('youtube.com')) return 'YouTube';
  if (lowerUrl.includes('github.com')) return 'GitHub';
  if (lowerUrl.includes('tiktok.com')) return 'TikTok';
  if (lowerLabel.includes('website') || lowerLabel.includes('site')) return 'Website';
  
  return label;
}

export default function PublicProfile() {
  const [, params] = useRoute("/u/:username");
  const username = params?.username;
  const [blogIndex, setBlogIndex] = useState(0);

  type ProfileWithLinks = Profile & { links?: ProfileLink[] };

  const { data: profile, isLoading, error } = useQuery<ProfileWithLinks>({
    queryKey: ["/api/profile", username],
    enabled: !!username,
  });

  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/blog/posts", username],
    enabled: !!username && username === "demo",
  });

  // Check if entity exists for canonical linking
  const { data: entity } = useQuery({
    queryKey: ["/api/entity", username],
    enabled: !!username,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-8">
        <Card className="max-w-md w-full p-12 text-center animate-in fade-in zoom-in duration-500">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Canonical URL - point to entity profile if it exists
  const canonicalUrl = entity 
    ? `${window.location.origin}/entity/${username}`
    : `${window.location.origin}/u/${username}`;

  return (
    <>
      <Helmet>
        <title>{profile.title || profile.username} - Graphlynk</title>
        <meta name="description" content={profile.bio || `${profile.title || profile.username} - Link Profile`} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Main Profile Card */}
          <Card className="overflow-hidden animate-in fade-in zoom-in duration-500 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="p-8">
              {/* Header Section with Avatar and Basic Info */}
              <div className="flex gap-6 mb-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 ring-4 ring-primary/20 shadow-lg" data-testid="avatar-profile">
                    {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.title || profile.username} className="object-cover" />}
                    <AvatarFallback className="text-5xl bg-gradient-to-br from-primary to-primary/70 text-white">
                      {getInitials(profile.title || profile.username)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Header Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1" data-testid="text-profile-name">
                        {profile.title || profile.username}
                      </h1>
                      <p className="text-sm text-slate-400">@{profile.username}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors" data-testid="button-profile-menu">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-slate-300 mb-4">📍 New York, United States</p>

                  {/* Badge Info */}
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-700">
                      CEO/Cofounder
                    </Badge>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-100 border-slate-600 hover:bg-slate-700">
                      📚 Master's Degree
                    </Badge>
                  </div>

                  {/* Verified Badge */}
                  {profile.showKgMetrics && (
                    <Badge variant="default" className="bg-primary text-primary-foreground" data-testid="badge-kg-verified">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              {profile.bio && (
                <div className="mb-8 pb-8 border-b border-slate-700">
                  <h2 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">Biography</h2>
                  <p className="text-sm text-slate-300 leading-relaxed" data-testid="text-profile-bio">
                    {profile.bio}
                  </p>
                </div>
              )}

              {/* Profiles Section */}
                {profile.links && profile.links.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wide">Profiles</h2>
                    <div className="grid grid-cols-2 gap-3" data-testid="links-container">
                      {profile.links
                        .slice()
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((link: ProfileLink) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                          data-testid={`link-${link.id}`}
                        >
                          <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-700/40 border border-slate-600/50 hover:bg-slate-700/60 hover:border-primary/50 transition-all duration-300">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                              {getSocialIcon(link.url, link.label)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-white group-hover:text-primary transition-colors duration-200">
                                {getSocialName(link.url, link.label)}
                              </div>
                              <div className="text-xs text-slate-400 truncate">
                                {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                          </div>
                        </a>
                      ))}
                  </div>
                </div>
              )}

              {/* Latest from Blog Section */}
              {posts.length > 0 && (
                <div className="border-t border-slate-700 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                      <span>📝 Latest from the Blog</span>
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBlogIndex(Math.max(0, blogIndex - 1))}
                        disabled={blogIndex === 0}
                        className="p-1 hover:bg-slate-700/50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="button-blog-prev"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-400" />
                      </button>
                      <button
                        onClick={() => setBlogIndex(Math.min(posts.length - 1, blogIndex + 1))}
                        disabled={blogIndex === posts.length - 1}
                        className="p-1 hover:bg-slate-700/50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="button-blog-next"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                  {posts[blogIndex] && (
                    <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:bg-slate-700/50 transition-colors" data-testid={`blog-post-${blogIndex}`}>
                      <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2">
                        {posts[blogIndex].title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {new Date(posts[blogIndex].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-slate-400 mt-8 animate-in fade-in zoom-in duration-700 delay-300">
            <p>
              Powered by{" "}
              <Link href="/">
                <span className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200">
                  Graphlynk
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* SEO JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": profile.title?.toLowerCase().includes("llc") || profile.title?.toLowerCase().includes("inc") 
                ? "Organization" 
                : "Person",
              name: profile.title || profile.username,
              url: typeof window !== 'undefined' ? window.location.href : '',
                sameAs: profile.links?.map((link: ProfileLink) => link.url) || [],
              ...(profile.avatarUrl && {
                [profile.title?.toLowerCase().includes("llc") || profile.title?.toLowerCase().includes("inc") ? "logo" : "image"]: profile.avatarUrl
              }),
            }),
          }}
        />
      </div>
    </>
  );
}
