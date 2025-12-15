import { Flame, TrendingUp } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface TrendingPanelProps {
  tier: Tier;
}

export function TrendingPanel({ tier }: TrendingPanelProps) {
  const trending = [
    {
      type: 'keyword',
      term: 'AI search optimization',
      score: 95,
      delta: '+245%',
      intent: 'Informational',
      difficulty: 'Medium',
    },
    {
      type: 'topic',
      term: 'Entity-based SEO',
      score: 88,
      delta: '+180%',
      intent: 'Commercial',
      difficulty: 'High',
    },
    {
      type: 'question',
      term: 'How to optimize for Google SGE?',
      score: 82,
      delta: '+156%',
      intent: 'Informational',
      difficulty: 'Low',
    },
  ];

  const difficultyColors = {
    Low: 'text-emerald-600 dark:text-emerald-400',
    Medium: 'text-amber-600 dark:text-amber-400',
    High: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="glass-card-light dark:glass-card rounded-3xl p-8 transition-all depth-shadow hover:depth-shadow-lg shimmer">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl text-gray-900 dark:text-white mb-2">Trending This Week</h2>
          <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Hot topics in your niche</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center glow-accent floating">
          <Flame className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="space-y-4">
        {trending.map((item, index) => (
          <div
            key={index}
            className="group p-6 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-[#0b3d84]/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-lg">
                    {item.type}
                  </span>
                  <span className={`text-xs px-3 py-1.5 bg-white/50 dark:bg-white/10 rounded-lg ${difficultyColors[item.difficulty as keyof typeof difficultyColors]}`}>
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-white mb-2 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                  {item.term}
                </p>
                <p className="text-xs text-gray-600 dark:text-[#98A2B3]">{item.intent}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {item.delta}
                </div>
                <div className="text-3xl text-gray-900 dark:text-white">{item.score}</div>
              </div>
            </div>
            
            {tier !== 'free' ? (
              <div className="flex gap-3 mt-4">
                <button className="flex-1 text-xs px-4 py-2.5 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl hover:scale-105 transition-all duration-300 glow-primary">
                  Create Brief
                </button>
                <button className="flex-1 text-xs px-4 py-2.5 glass-card-light dark:glass-card text-gray-900 dark:text-white rounded-xl hover:scale-105 transition-all duration-300">
                  Track
                </button>
              </div>
            ) : (
              <div className="mt-4 p-3 glass-card-light dark:glass-card rounded-xl">
                <p className="text-xs text-gray-600 dark:text-[#98A2B3] flex items-center gap-2">
                  <span className="text-[#6EE7F5]">Premium:</span> Unlock actions & detailed insights
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
