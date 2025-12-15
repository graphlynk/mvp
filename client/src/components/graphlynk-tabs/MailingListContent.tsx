import { Mail, Users, Send, TrendingUp } from 'lucide-react';

export function MailingListContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">Mailing List</h2>
        <p className="text-white/70">Manage your email subscribers and campaigns</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
              <Users className="w-5 h-5 text-blue-300" />
            </div>
            <span className="text-sm text-white/70">Total Subscribers</span>
          </div>
          <p className="text-3xl text-white mb-1">1,249</p>
          <p className="text-sm text-green-300 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +18.2% this month
          </p>
        </div>

        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-400/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
              <Mail className="w-5 h-5 text-green-300" />
            </div>
            <span className="text-sm text-white/70">Open Rate</span>
          </div>
          <p className="text-3xl text-white mb-1">55.2%</p>
          <p className="text-sm text-green-300 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +3.4% vs last month
          </p>
        </div>

        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 hover:bg-white/15 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400/30 to-pink-400/30 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
              <Send className="w-5 h-5 text-purple-300" />
            </div>
            <span className="text-sm text-white/70">Campaigns Sent</span>
          </div>
          <p className="text-3xl text-white mb-1">23</p>
          <p className="text-sm text-white/70">3 this month</p>
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-white mb-6">Recent Subscribers</h3>
        <div className="space-y-3">
          {[
            { email: 'john.doe@example.com', date: '2 hours ago' },
            { email: 'jane.smith@example.com', date: '5 hours ago' },
            { email: 'mike.wilson@example.com', date: '1 day ago' },
          ].map((subscriber, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                <Mail className="w-5 h-5 text-blue-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{subscriber.email}</p>
                <p className="text-xs text-white/60">{subscriber.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
