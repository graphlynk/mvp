import { AlertTriangle, Zap } from 'lucide-react';
import { Tier } from '@/types/graphlynk';

interface AlertsPanelProps {
  tier: Tier;
}

export function AlertsPanel({ tier }: AlertsPanelProps) {
  const alerts = [
    {
      type: 'error',
      title: 'Schema validation errors detected',
      description: '3 pages have invalid structured data',
      action: 'Fix with TaskAgent',
      canAutoFix: tier !== 'free',
    },
    {
      type: 'warning',
      title: 'Indexing delay',
      description: '12 URLs pending indexation for 7+ days',
      action: 'Review URLs',
      canAutoFix: false,
    },
    {
      type: 'info',
      title: 'New entity mention',
      description: 'Your brand was mentioned in 5 new sources',
      action: 'View Details',
      canAutoFix: false,
    },
  ];

  return (
    <div className="glass-card-light dark:glass-card rounded-3xl p-8 transition-all depth-shadow hover:depth-shadow-lg shimmer">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl text-gray-900 dark:text-white mb-2">Alerts</h2>
          <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Issues requiring attention</p>
        </div>
        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              alert.type === 'error'
                ? 'bg-red-500/5 border-red-500/30 hover:border-red-500/50'
                : alert.type === 'warning'
                ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
                : 'bg-blue-500/5 border-blue-500/30 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm text-gray-900 dark:text-white">{alert.title}</h3>
              {alert.canAutoFix && (
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center glow-accent">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-[#98A2B3] mb-4">{alert.description}</p>
            <button
              className={`text-xs px-4 py-2.5 rounded-xl transition-all duration-300 ${
                alert.canAutoFix
                  ? 'bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] text-white hover:scale-105 glow-primary'
                  : 'glass-card-light dark:glass-card text-gray-900 dark:text-white hover:scale-105'
              }`}
            >
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
