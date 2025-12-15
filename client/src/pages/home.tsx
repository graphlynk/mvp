import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Link2, BookOpen, Mail, Sparkles, TrendingUp, Users, Zap, Database, Globe } from "lucide-react";
import heroImage from "@assets/generated_images/Knowledge_graph_hero_background_c07d5c18.png";
import { AdvancedSearchModal } from "@/components/AdvancedSearchModal";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

type SearchType = 'knowledge-graph-db' | 'google-kg-api';

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (ref.current) {
      const elements = ref.current.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => observer.disconnect();
  }, []);
  
  return ref;
}

export default function Home() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedSearchType, setSelectedSearchType] = useState<SearchType>('knowledge-graph-db');
  const scrollRef = useScrollReveal();

  return (
    <div className="min-h-screen" ref={scrollRef}>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        {/* Enhanced HD Particle System */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated Wires/Connectors with Light Flow */}
          {[...Array(12)].map((_, i) => {
            const startX = (i * 18 + 5) % 100;
            const startY = (i * 22 + 10) % 100;
            const endX = ((i + 1) * 18 + 5) % 100;
            const endY = ((i + 1) * 22 + 10) % 100;
            const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
            
            return (
              <div
                key={`wire-${i}`}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent origin-left"
                style={{
                  left: `${startX}%`,
                  top: `${startY}%`,
                  width: `${distance * 5}px`,
                  transform: `rotate(${angle}deg)`,
                  opacity: 0.4,
                  boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)',
                  animation: `wire-light-flow ${3 + (i % 4)}s linear infinite`,
                  animationDelay: `${i * 0.3}s`,
                  filter: 'blur(1px)',
                }}
              />
            );
          })}

          {/* Light Particles Flowing Through Wires */}
          {[...Array(24)].map((_, i) => (
            <div
              key={`light-${i}`}
              className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.8)]"
              style={{
                left: `${(i * 12 + 8) % 100}%`,
                top: `${(i * 15 + 12) % 100}%`,
                animation: `wire-light-particle ${2 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}

          {/* Node Glow Effects - Pulsing lights on nodes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`glow-${i}`}
              className="absolute w-4 h-4 rounded-md bg-gradient-to-br from-cyan-300/60 to-cyan-300/30 shadow-[0_0_20px_8px_rgba(34,211,238,0.6)]"
              style={{
                left: `${(i * 17 + 18) % 92}%`,
                top: `${(i * 23 + 12) % 92}%`,
                animation: `node-glow-${(i % 3) + 1} ${2 + (i % 4) * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>
        
        {/* Fixed Dark Overlay - Clean and Clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/50 to-slate-900/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 text-center">
          <Badge variant="outline" className="mb-6 border-primary-foreground/30 bg-primary-foreground/10 backdrop-blur-md text-primary-foreground" data-testid="badge-hero">
            <Sparkles className="w-3 h-3 mr-1" />
            Professional SEO & Knowledge Graph Platform
          </Badge>
          
          <h1 className="text-6xl font-bold text-primary-foreground mb-6 tracking-tight" data-testid="text-hero-title">
            Build Your Brand's
            <br />
            Knowledge Graph & SEO
          </h1>
          
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Create SEO-optimized link profiles with schema markup, publish engaging blogs with newsletters, 
            and track your search rankings—all in one professional platform.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap mb-12" data-testid="hero-cta-container">
            <Link href="/login">
              <Button size="lg" variant="default" className="bg-background text-foreground border-2 border-background hover:bg-background/90" data-testid="button-get-started">
                Get Started Free
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/u/demo">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 backdrop-blur-md text-primary-foreground hover:bg-primary-foreground/20" data-testid="button-view-demo">
                View Demo Profile
              </Button>
            </Link>
          </div>

          {/* Google-Style Search Bar */}
          <div className="max-w-2xl mx-auto" data-testid="search-container">
            <div
              onClick={() => setShowSearchModal(true)}
              className="cursor-pointer group"
              data-testid="search-trigger"
            >
              <div className="relative flex items-center h-14 bg-background border border-border rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 px-5 gap-3">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                
                <span className="flex-1 text-muted-foreground text-base truncate">
                  {selectedSearchType === 'knowledge-graph-db' 
                    ? 'Search knowledge graph database...' 
                    : 'Search Google Knowledge Graph...'}
                </span>

                {/* Compact Mode Toggle */}
                <div className="flex items-center gap-1 bg-muted rounded-full p-0.5 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSearchType('knowledge-graph-db');
                    }}
                    className={`p-2 rounded-full transition-all ${
                      selectedSearchType === 'knowledge-graph-db'
                        ? 'bg-background shadow-sm text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Knowledge Graph Database"
                    data-testid="toggle-kg-db"
                  >
                    <Database className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSearchType('google-kg-api');
                    }}
                    className={`p-2 rounded-full transition-all ${
                      selectedSearchType === 'google-kg-api'
                        ? 'bg-background shadow-sm text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Google Knowledge Graph API"
                    data-testid="toggle-google-kg"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Helper text below search */}
            <p className="text-center text-sm text-primary-foreground/70 mt-3">
              {selectedSearchType === 'knowledge-graph-db'
                ? 'Real-time SEO insights • 12K+ trending searches'
                : 'Explore entities, people, organizations & places'}
            </p>
          </div>
        </div>
      </section>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} searchType={selectedSearchType} />

      {/* Features Section */}
      <section className="relative py-24 px-6 sm:px-8 lg:px-12 bg-background overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 scroll-reveal">
            <Badge variant="outline" className="mb-4" data-testid="badge-features">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Platform Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight" data-testid="text-features-title">
              Everything You Need for SEO Success
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-features-subtitle">
              Professional tools designed for marketers, content creators, and businesses 
              who want to dominate search rankings and build authority.
            </p>
          </div>

          {/* Responsive Feature Grid with Flip Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* SEO Profiles Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-1 group h-72 [perspective:1000px]" data-testid="card-feature-profiles">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <Link2 className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">SEO-Optimized Profiles</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Create stunning link-in-bio pages with JSON-LD schema markup for maximum search visibility
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Why SEO Profiles Matter</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>78% of local searches lead to offline purchases</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Schema markup increases CTR by up to 30%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Rich snippets appear in 36% of search results</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Search Rank Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-2 group h-72 [perspective:1000px]" data-testid="card-feature-search">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <Search className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">Search Rank Tracking</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Monitor your Google rankings with real-time data and competitive analysis tools
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Rank Tracking Insights</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Top 3 positions capture 75% of all clicks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Daily rank updates across 100+ search engines</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Competitor analysis reveals growth opportunities</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Blog Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-3 group h-72 [perspective:1000px]" data-testid="card-feature-blog">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">Blog & Newsletter</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Publish SEO-friendly blog posts and automatically send weekly digests to your subscribers
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Content Marketing Power</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Companies with blogs generate 67% more leads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Email marketing ROI averages $42 for every $1</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Consistent publishing increases organic traffic 3x</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Schema Builder Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-4 group h-72 [perspective:1000px]" data-testid="card-feature-schema">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">Schema Markup Builder</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Generate Person, Organization, and SocialProfile schemas to boost Knowledge Graph presence
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Knowledge Graph Benefits</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Google processes 8.5B searches daily using KG</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Structured data helps 40% of voice searches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Entity recognition improves brand authority</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Analytics Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-5 group h-72 [perspective:1000px]" data-testid="card-feature-analytics">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">Advanced Analytics</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Track performance metrics, engagement data, and SEO insights in beautiful dashboards
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Data-Driven Decisions</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Data-driven companies are 23x more likely to acquire customers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Real-time insights reduce decision lag by 65%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Visual dashboards improve comprehension 400%</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Mailing Flip Card */}
            <div className="scroll-reveal scroll-reveal-delay-6 group h-72 [perspective:1000px]" data-testid="card-feature-mailing">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-105">
                {/* Front */}
                <Card className="absolute inset-0 h-full border border-transparent bg-card/50 backdrop-blur-sm shadow-sm group-hover:border-[#1e3a5f] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center pb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5">
                      <Mail className="w-7 h-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-semibold mb-2">Mailing List Management</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Build and engage your audience with integrated email subscription and newsletter features
                    </CardDescription>
                  </CardHeader>
                </Card>
                {/* Back */}
                <Card className="absolute inset-0 h-full border-2 border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardHeader className="h-full flex flex-col justify-center">
                    <CardTitle className="text-lg font-bold mb-3 text-white">Email Marketing Facts</CardTitle>
                    <ul className="space-y-2 text-sm text-white/90">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>4.03 billion people use email worldwide</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Segmented campaigns drive 760% revenue increase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-300">✓</span>
                        <span>Personalized emails deliver 6x transaction rates</span>
                      </li>
                    </ul>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-5xl font-bold mb-6" data-testid="text-pricing-title">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-pricing-subtitle">
              Choose the plan that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="scroll-reveal scroll-reveal-delay-1" data-testid="card-plan-free">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Core profile page</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Limited search queries</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Basic analytics</span>
                </div>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full" variant="outline" data-testid="button-plan-free">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary shadow-lg scale-105 scroll-reveal scroll-reveal-delay-2" data-testid="card-plan-pro">
              <CardHeader>
                <Badge className="w-fit mb-2" data-testid="badge-popular">Popular</Badge>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4">For serious marketers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Everything in Free</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Schema markup builder</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Blog & newsletter</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Advanced analytics</span>
                </div>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full" data-testid="button-plan-pro">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Authority Plan */}
            <Card className="scroll-reveal scroll-reveal-delay-3" data-testid="card-plan-authority">
              <CardHeader>
                <CardTitle className="text-2xl">Authority</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="mt-4">Maximum impact & support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Expert SEO consultation</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm">Priority support</span>
                </div>
                <Link href="/login" className="block mt-6">
                  <Button className="w-full" variant="outline" data-testid="button-plan-authority">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Build Your Authority?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90" data-testid="text-cta-subtitle">
            Join thousands of professionals who trust Graphlynk for their SEO and Knowledge Graph needs.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" data-testid="button-cta">
              Start Building Today
              <Zap className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
}
