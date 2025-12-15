import { Plus, Upload, FileText, Link as LinkIcon } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface QuickActionsProps {
  tier: Tier;
}

export function QuickActions({ tier }: QuickActionsProps) {
  const actions = [
    { icon: Plus, label: 'Create Content Brief', color: 'from-[#0b3d84] to-cyan-600' },
    { icon: Upload, label: 'Submit URLs', color: 'from-purple-600 to-pink-600' },
    { icon: FileText, label: 'Add Schema', color: 'from-green-600 to-emerald-600' },
    { icon: LinkIcon, label: 'Create Short Link', color: 'from-orange-600 to-red-600' },
  ];

  return (
    <div className="glass-card-light dark:glass-card rounded-3xl p-8 transition-all depth-shadow hover:depth-shadow-lg shimmer h-full">
      <h2 className="text-xl text-gray-900 dark:text-white mb-6">Quick Actions</h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center gap-4 p-5 glass-card-light dark:glass-card rounded-2xl hover:shadow-lg transition-all duration-200 group border border-transparent hover:border-[#0b3d84]/30"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center transition-all duration-200`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm text-gray-900 dark:text-white group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5] transition-colors">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upgrade prompt for free tier */}
      {tier === 'free' && (
        <div className="mt-6 p-6 mirror-surface rounded-2xl border border-purple-500/30 shimmer">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center glow-accent">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-1">Unlock More Features</h3>
              <p className="text-xs text-gray-600 dark:text-[#98A2B3]">
                Upgrade to Premium for advanced analytics, regional insights, and TaskAgent automation.
              </p>
            </div>
          </div>
          <button className="mx-auto px-8 py-3 bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white rounded-xl text-sm hover:shadow-lg transition-all duration-200 block">
            View Pricing
          </button>
        </div>
      )}
    </div>
  );
}
