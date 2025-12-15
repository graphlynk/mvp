import { User, Mail, Globe, MapPin, Calendar } from 'lucide-react';

export function ProfileContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">Profile</h2>
        <p className="text-white/70">Manage your GraphLynk profile and public information</p>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-white mb-6">Profile Information</h3>
          
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/50">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-sm text-white/80 mb-2 block">Display Name</label>
                <input
                  type="text"
                  defaultValue="John Smith"
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-white/80 mb-2 block">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Software engineer passionate about knowledge graphs and semantic web technologies."
                  className="w-full px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Email</label>
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/30 rounded-xl">
                <Mail className="w-4 h-4 text-white/60" />
                <input
                  type="email"
                  defaultValue="john.smith@example.com"
                  className="flex-1 outline-none bg-transparent text-white placeholder-white/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/80 mb-2 block">Website</label>
              <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/30 rounded-xl">
                <Globe className="w-4 h-4 text-white/60" />
                <input
                  type="text"
                  defaultValue="johnsmith.dev"
                  className="flex-1 outline-none bg-transparent text-white placeholder-white/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
          <h3 className="text-white mb-6">Profile Stats</h3>
          
          <div className="space-y-4">
            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Profile Views</span>
                <span className="text-white">1,234</span>
              </div>
            </div>
            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Connections</span>
                <span className="text-white">456</span>
              </div>
            </div>
            <div className="p-3 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/70">Graph Nodes</span>
                <span className="text-white">89</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="w-4 h-4" />
                <span>Joined November 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
