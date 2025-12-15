import { TrendingUp, TrendingDown } from 'lucide-react';

export function ThisWeekPanel() {
  const winners = [
    { term: 'Voice Search Optimization', rank: 3, volume: '12.4K', delta: 15 },
    { term: 'Schema Markup Best Practices', rank: 7, volume: '8.2K', delta: 12 },
    { term: 'Entity SEO Strategy', rank: 12, volume: '5.8K', delta: 8 },
  ];

  const losers = [
    { term: 'Traditional Link Building', rank: 24, volume: '4.1K', delta: 8 },
    { term: 'Meta Keywords Tag', rank: 45, volume: '2.3K', delta: 12 },
  ];

  return (
    <div className="glass-card-light dark:glass-card rounded-3xl p-8 transition-all depth-shadow hover:depth-shadow-lg">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#0b3d84] to-[#6EE7F5] rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl text-gray-900 dark:text-white">This Week's Winners & Losers</h2>
          <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Keyword ranking changes</p>
        </div>
      </div>

      {/* Winners */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-sm text-gray-900 dark:text-white">Rising</h3>
        </div>
        <div className="space-y-3">
          {winners.map((item, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-5 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                  {item.term}
                </p>
                <p className="text-xs text-gray-600 dark:text-[#98A2B3] mt-1">
                  Rank #{item.rank} · {item.volume} searches
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                +{item.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Losers */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-sm text-gray-900 dark:text-white">Declining</h3>
        </div>
        <div className="space-y-3">
          {losers.map((item, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-5 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                  {item.term}
                </p>
                <p className="text-xs text-gray-600 dark:text-[#98A2B3] mt-1">
                  Rank #{item.rank} · {item.volume} searches
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-xl text-red-600 dark:text-red-400 text-sm">
                <TrendingDown className="w-4 h-4" />
                -{item.delta}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-3 text-sm text-gray-700 dark:text-[#98A2B3] hover:text-gray-900 dark:hover:text-white glass-card-light dark:glass-card rounded-2xl hover:shadow-md transition-all duration-200 text-center">
        View All Changes
      </button>
    </div>
  );
}
