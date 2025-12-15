import { Tier } from '@/types/graphlynk';
import { KPIStrip } from './KPIStrip';
import { ThisWeekPanel } from './ThisWeekPanel';
import { AlertsPanel } from './AlertsPanel';
import { QuickActions } from './QuickActions';
import { TrendingPanel } from './TrendingPanel';
import { SuggestedTopics } from '@/components/graphlynk-dashboard-blog/SuggestedTopics';
import { KnowledgeGraph } from './KnowledgeGraph';

interface DashboardContentProps {
  tier: Tier;
}

export function DashboardContent({ tier }: DashboardContentProps) {
  return (
    <div className="p-10 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-xs font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#0b3d84] to-[#6EE7F5] dark:from-[#ffffff] dark:to-[#98A2B3] uppercase drop-shadow-[0_0_8px_rgba(11,61,132,0.3)] dark:drop-shadow-[0_0_15px_rgba(110,231,245,0.5)] ambient-pulse">SEO & VISIBILITY OVERVIEW</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse glow-accent"></div>
          Live Data
        </div>
      </div>

      {/* KPI Strip */}
      <KPIStrip tier={tier} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* This Week */}
        <div className="lg:col-span-2">
          <ThisWeekPanel tier={tier} />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions tier={tier} />
        </div>
      </div>

      {/* Alerts & Trending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AlertsPanel tier={tier} />
        <TrendingPanel tier={tier} />
      </div>

      {/* Suggested Topics & Knowledge Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KnowledgeGraph />
        </div>
        <div>
          <SuggestedTopics tier={tier} />
        </div>
      </div>
    </div>
  );
}
