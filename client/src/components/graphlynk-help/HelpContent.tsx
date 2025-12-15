import { useState } from 'react';
import { Search, BookOpen, Video, MessageCircle, FileText, ChevronDown, ChevronRight, ExternalLink, Play } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface HelpContentProps {
  tier: Tier;
}

type HelpTab = 'docs' | 'faq' | 'videos' | 'support';

const documentationArticles = [
  {
    category: 'Getting Started',
    articles: [
      { title: 'Quick Start Guide', description: 'Learn the basics of GraphLynk in 5 minutes', readTime: '5 min' },
      { title: 'Dashboard Overview', description: 'Understanding your authority metrics', readTime: '8 min' },
      { title: 'Setting Up Your Profile', description: 'Optimize your profile for maximum visibility', readTime: '10 min' },
    ]
  },
  {
    category: 'SEO Features',
    articles: [
      { title: 'Keyword Research & Entities', description: 'Master keyword analysis and entity tracking', readTime: '12 min' },
      { title: 'Indexation Monitoring', description: 'Keep track of your pages in search engines', readTime: '15 min' },
      { title: 'Schema Markup Best Practices', description: 'Implement structured data correctly', readTime: '20 min' },
    ]
  },
  {
    category: 'Advanced Features',
    articles: [
      { title: 'LLM Visibility Optimization', description: 'Get discovered by AI search engines', readTime: '18 min', isPremium: true },
      { title: 'Blog Management with AI', description: 'AI-powered content suggestions and optimization', readTime: '15 min', isPremium: true },
      { title: 'Digital Products Setup', description: 'Monetize your authority with digital products', readTime: '25 min' },
    ]
  },
];

const faqs = [
  {
    category: 'Account & Billing',
    questions: [
      {
        q: 'How do I upgrade to Premium or Platinum?',
        a: 'Navigate to the Pricing & GKP tab in the sidebar and select your preferred plan. You can upgrade or downgrade at any time, and changes take effect immediately.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via invoice.'
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, you can cancel your subscription at any time from the Settings page. You\'ll retain access until the end of your billing period.'
      },
    ]
  },
  {
    category: 'Features & Functionality',
    questions: [
      {
        q: 'What is the Authority Score?',
        a: 'The Authority Score is a comprehensive metric (0-100) that measures your overall online authority based on search visibility, entity recognition, backlinks, content quality, and LLM discoverability.'
      },
      {
        q: 'How often is data updated?',
        a: 'Free tier: Daily updates. Premium: Every 6 hours. Platinum: Real-time updates with instant alerts.'
      },
      {
        q: 'What is LLM Visibility?',
        a: 'LLM Visibility tracks how often your content appears in AI-powered search results from ChatGPT, Perplexity, and other LLM platforms. This feature is available on Platinum plans.'
      },
    ]
  },
  {
    category: 'Technical Support',
    questions: [
      {
        q: 'How do I integrate GraphLynk with my website?',
        a: 'We provide easy integration via API, WordPress plugin, and JavaScript snippet. Documentation is available in the "Getting Started" section with step-by-step instructions.'
      },
      {
        q: 'Is my data secure?',
        a: 'Yes, we use enterprise-grade encryption (AES-256) for data at rest and TLS 1.3 for data in transit. We\'re SOC 2 Type II certified and GDPR compliant.'
      },
      {
        q: 'Do you offer API access?',
        a: 'API access is available on Premium and Platinum plans. You can access all your data programmatically with rate limits based on your tier.'
      },
    ]
  },
];

const videoTutorials = [
  {
    category: 'Getting Started',
    videos: [
      { title: 'GraphLynk Dashboard Tour', duration: '5:32', thumbnail: 'dashboard-tour' },
      { title: 'First Steps: Setting Up Your Profile', duration: '8:15', thumbnail: 'setup-profile' },
      { title: 'Understanding Your Authority Metrics', duration: '6:45', thumbnail: 'metrics' },
    ]
  },
  {
    category: 'SEO Mastery',
    videos: [
      { title: 'Keyword Research Deep Dive', duration: '15:20', thumbnail: 'keywords', isPremium: true },
      { title: 'Schema Markup Made Easy', duration: '12:10', thumbnail: 'schema' },
      { title: 'Fixing Indexation Issues', duration: '10:30', thumbnail: 'indexation' },
    ]
  },
  {
    category: 'Advanced Techniques',
    videos: [
      { title: 'LLM Optimization Strategies', duration: '18:45', thumbnail: 'llm', isPremium: true },
      { title: 'AI-Powered Blog Content Creation', duration: '14:20', thumbnail: 'blog-ai', isPremium: true },
      { title: 'Monetizing Your Authority', duration: '20:15', thumbnail: 'monetize' },
    ]
  },
];

export function HelpContent({ tier }: HelpContentProps) {
  const [activeHelpTab, setActiveHelpTab] = useState<HelpTab>('docs');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Getting Started', 'Account & Billing']);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle ticket submission
    alert('Support ticket submitted! We\'ll respond within 24 hours.');
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 dark:text-white mb-2">HELP & DOCUMENTATION</h1>
          <p className="text-gray-600 dark:text-[#98A2B3]">Everything you need to master GraphLynk</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 glass-card-light dark:glass-card p-6 rounded-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documentation, FAQs, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          {[
            { id: 'docs' as HelpTab, label: 'Documentation', icon: BookOpen },
            { id: 'faq' as HelpTab, label: 'FAQ', icon: FileText },
            { id: 'videos' as HelpTab, label: 'Video Tutorials', icon: Video },
            { id: 'support' as HelpTab, label: 'Support Tickets', icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeHelpTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveHelpTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white shadow-lg'
                    : 'glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] hover:shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6">
          {/* Documentation Tab */}
          {activeHelpTab === 'docs' && (
            <div className="space-y-6">
              {documentationArticles.map((category) => (
                <div key={category.category} className="glass-card-light dark:glass-card rounded-2xl p-6">
                  <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.articles.map((article, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white dark:bg-[#1A1F26] rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-200 dark:border-white/10"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                                {article.title}
                              </h4>
                              {article.isPremium && tier === 'free' && (
                                <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-[#98A2B3]">{article.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{article.readTime} read</p>
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ Tab */}
          {activeHelpTab === 'faq' && (
            <div className="space-y-6">
              {faqs.map((category) => (
                <div key={category.category} className="glass-card-light dark:glass-card rounded-2xl p-6">
                  <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((item, idx) => {
                      const isExpanded = expandedCategories.includes(`${category.category}-${idx}`);
                      return (
                        <div
                          key={idx}
                          className="bg-white dark:bg-[#1A1F26] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-200"
                        >
                          <button
                            onClick={() => toggleCategory(`${category.category}-${idx}`)}
                            className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                          >
                            <span className="text-gray-900 dark:text-white">{item.q}</span>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 text-gray-600 dark:text-[#98A2B3] border-t border-gray-200 dark:border-white/10 pt-4">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Tutorials Tab */}
          {activeHelpTab === 'videos' && (
            <div className="space-y-6">
              {videoTutorials.map((category) => (
                <div key={category.category} className="glass-card-light dark:glass-card rounded-2xl p-6">
                  <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.videos.map((video, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-[#1A1F26] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-200 dark:border-white/10"
                      >
                        <div className="relative aspect-video bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] flex items-center justify-center">
                          <Play className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                          {video.isPremium && tier === 'free' && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white text-xs px-2 py-1 rounded">
                              Premium
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                            {video.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Support Tickets Tab */}
          {activeHelpTab === 'support' && (
            <div className="glass-card-light dark:glass-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                  Submit a Support Ticket
                </h3>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#E6E9EE] mb-2">
                    Message
                  </label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details about your issue or question..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-[#1A1F26] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#6EE7F5] transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    Submit Ticket
                  </button>
                  <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                    {tier === 'free' ? 'Response within 48 hours' : tier === 'premium' ? 'Response within 24 hours' : 'Priority support - Response within 4 hours'}
                  </p>
                </div>
              </form>

              {/* Response time info */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl">
                <h4 className="text-blue-900 dark:text-blue-300 mb-2">Support Response Times</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Free tier: 48 hours</li>
                  <li>• Premium tier: 24 hours</li>
                  <li>• Platinum tier: 4 hours (priority support)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
