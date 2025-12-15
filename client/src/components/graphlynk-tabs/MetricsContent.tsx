import { TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';

export function MetricsContent() {
  const stats = [
    { label: 'Total Views', value: '12,847', change: '+12.5%', icon: Eye },
    { label: 'Unique Visitors', value: '8,234', change: '+8.3%', icon: Users },
    { label: 'Engagement Rate', value: '64.2%', change: '+3.1%', icon: TrendingUp },
    { label: 'Avg. Session', value: '3m 42s', change: '+15.2%', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">Metrics</h2>
        <p className="text-white/70">Track your GraphLynk profile performance and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                  <Icon className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-xs text-green-300 bg-green-400/20 px-2 py-1 rounded-full border border-green-400/30">
                  {stat.change}
                </span>
              </div>
              <p className="text-white/70 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart placeholder */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-white mb-6">Visitor Trends</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[...Array(30)].map((_, i) => {
            const height = Math.random() * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t opacity-60 hover:opacity-100 transition-opacity shadow-lg"
                style={{ height: `${height}%` }}
              ></div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 text-xs text-white/60">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
