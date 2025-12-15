import { Lightbulb, TrendingUp, Lock } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface SuggestedTopicsProps {
  tier: Tier;
}

export function SuggestedTopics({ tier }: SuggestedTopicsProps) {
  const topics = [
    {
      title: 'Voice Search Optimization for E-commerce',
      reason: 'Trending +320% in your niche',
      difficulty: 'Medium',
      volume: '4.8K',
      available: tier !== 'free',
    },
    {
      title: 'Implementing FAQ Schema for Rich Snippets',
      reason: 'High conversion potential',
      difficulty: 'Low',
      volume: '2.3K',
      available: tier !== 'free',
    },
    {
      title: 'Local SEO: Optimizing for "Near Me" Searches',
      reason: 'Gap in your content',
      difficulty: 'Medium',
      volume: '6.1K',
      available: tier !== 'free',
    },
    {
      title: 'Understanding Core Web Vitals Impact',
      reason: 'Your audience is searching',
      difficulty: 'High',
      volume: '8.9K',
      available: tier !== 'free',
    },
    {
      title: 'Structured Data for Product Pages',
      reason: 'Competitors ranking well',
      difficulty: 'Medium',
      volume: '3.4K',
      available: tier !== 'free',
    },
  ];

  const difficultyColors = {
    Low: 'text-emerald-600 dark:text-emerald-400',
    Medium: 'text-amber-600 dark:text-amber-400',
    High: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="glass-card-light dark:glass-card rounded-3xl p-8 transition-all depth-shadow hover:depth-shadow-lg shimmer">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl text-gray-900 dark:text-white">Suggested Topics</h2>
        </div>
        {tier === 'free' && (
          <Lock className="w-4 h-4 text-gray-600 dark:text-[#98A2B3]" />
        )}
      </div>

      {tier === 'free' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-[#0b3d84]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-[#0b3d84]" />
          </div>
          <h3 className="text-gray-900 dark:text-white mb-2">AI-Powered Topic Suggestions</h3>
          <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
            Get personalized content ideas based on trending keywords, gaps in your content, and competitor analysis.
          </p>
          <button className="px-4 py-2 bg-[#D946EF] text-white rounded-lg hover:scale-105 transition-all duration-300 glow-primary">
            Upgrade to Premium
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="p-4 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer group border border-transparent hover:border-[#0b3d84]/30"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                  {topic.title}
                </h3>
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              </div>
              
              <p className="text-xs text-gray-600 dark:text-[#98A2B3] mb-3">{topic.reason}</p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className={difficultyColors[topic.difficulty as keyof typeof difficultyColors]}>
                    {topic.difficulty}
                  </span>
                  <span className="text-gray-600 dark:text-[#98A2B3]">{topic.volume} searches</span>
                </div>
                <button className="text-[#0b3d84] dark:text-[#6EE7F5] hover:underline transition-colors">
                  Create →
                </button>
              </div>
            </div>
          ))}
          
          <button className="w-full py-3 text-sm text-gray-700 dark:text-[#98A2B3] hover:text-gray-900 dark:hover:text-white glass-card-light dark:glass-card rounded-2xl hover:shadow-md transition-all duration-200">
            Load More Suggestions
          </button>
        </div>
      )}
    </div>
  );
}
