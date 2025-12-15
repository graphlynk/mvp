import { TrendingUp, TrendingDown, Eye, Clock, Award, Globe, Sparkles, Zap } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface KPIStripProps {
  tier: Tier;
}

export function KPIStrip({ tier }: KPIStripProps) {
  const kpis = [
    {
      label: 'Authority Score',
      value: '87',
      delta: '+5',
      trend: 'up',
      icon: Award,
      available: true,
    },
    {
      label: 'Search Visibility',
      value: '2.4K',
      delta: '+12.3%',
      trend: 'up',
      icon: Eye,
      available: true,
    },
    {
      label: 'Indexation Rate',
      value: '94%',
      delta: '+2%',
      trend: 'up',
      icon: Clock,
      available: true,
    },
    {
      label: 'Entity Rank Δ',
      value: '#12',
      delta: '+3',
      trend: 'up',
      icon: TrendingUp,
      available: tier !== 'free',
    },
    {
      label: 'Top Regions',
      value: 'US, UK',
      delta: 'CA new',
      trend: 'neutral',
      icon: Globe,
      available: tier !== 'free',
    },
    {
      label: 'LLM Discoverability',
      value: '78%',
      delta: '+8%',
      trend: 'up',
      icon: Sparkles,
      available: tier === 'platinum',
    },
    {
      label: 'TaskAgent Impact',
      value: '45',
      delta: '+12',
      trend: 'up',
      icon: Zap,
      available: tier !== 'free',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isBlurred = !kpi.available;

        return (
          <div
            key={index}
            className={`glass-card-light dark:glass-card rounded-2xl p-6 relative transition-all duration-500 hover:scale-105 depth-shadow group ${
              isBlurred ? 'opacity-50' : 'shimmer'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {isBlurred && (
              <div className="absolute inset-0 backdrop-blur-md bg-white/30 dark:bg-black/30 rounded-2xl flex items-center justify-center z-10">
                <span className="text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg glow-accent">
                  {tier === 'free' ? 'Premium+' : 'Platinum'}
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Icon className="w-6 h-6 text-[#0b3d84] dark:text-[#6EE7F5] flex-shrink-0" strokeWidth={2} />
              </div>
            </div>
            
            <div className="text-3xl text-gray-900 dark:text-white mb-2 group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
              {kpi.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-[#98A2B3] mb-2">{kpi.label}</div>
            
            {kpi.trend !== 'neutral' && (
              <div
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs min-w-[70px] mx-auto ${
                  kpi.trend === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                {kpi.delta}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
