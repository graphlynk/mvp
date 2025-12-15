import { useState } from 'react';
import { Tier } from '@/types/graphlynk';
import { 
  User, 
  Bell, 
  Shield, 
  Key, 
  Palette, 
  Globe, 
  Database, 
  Zap,
  Eye,
  EyeOff,
  Copy,
  Check,
  Settings as SettingsIcon,
  Lock,
  TrendingUp,
  MessageSquare,
  Search
} from 'lucide-react';

interface SettingsContentProps {
  tier: Tier;
}

type SettingsTab = 'account' | 'notifications' | 'security' | 'api' | 'appearance' | 'integrations' | 'privacy' | 'advanced';

export function SettingsContent({ tier }: SettingsContentProps) {
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('account');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const settingsTabs = [
    { id: 'account' as SettingsTab, label: 'Account', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
    { id: 'api' as SettingsTab, label: 'API Keys', icon: Key, tier: 'premium' },
    { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
    { id: 'integrations' as SettingsTab, label: 'Integrations', icon: Zap, tier: 'premium' },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock },
    { id: 'advanced' as SettingsTab, label: 'Advanced', icon: Database, tier: 'platinum' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <User className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Profile Information
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">First Name</label>
              <input 
                type="text" 
                defaultValue="John"
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Last Name</label>
              <input 
                type="text" 
                defaultValue="Doe"
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Email Address</label>
            <input 
              type="email" 
              defaultValue="john@example.com"
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Company</label>
            <input 
              type="text" 
              defaultValue="GraphLynk Inc."
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Website URL</label>
            <input 
              type="url" 
              defaultValue="https://graphlynk.com"
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200">
            Save Changes
          </button>
          <button className="px-6 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-[#E6E9EE] rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200">
            Cancel
          </button>
        </div>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Change Password</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Current Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">New Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
            />
          </div>
        </div>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200">
          Update Password
        </button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Bell className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Notification Preferences
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Receive updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Get real-time alerts in browser</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Weekly Reports</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Receive weekly performance summaries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={weeklyReports}
                onChange={(e) => setWeeklyReports(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Security Alerts</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Critical security notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={securityAlerts}
                onChange={(e) => setSecurityAlerts(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Alert Types</h3>
        <div className="space-y-4">
          {[
            'Schema validation errors',
            'Indexation issues detected',
            'New keyword rankings',
            'Backlink changes',
            'Site speed alerts',
            'Security vulnerabilities'
          ].map((alert) => (
            <label key={alert} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-all">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#0b3d84] dark:text-[#9FF2FF] bg-gray-100 border-gray-300 rounded focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF]" />
              <span className="text-gray-700 dark:text-[#E6E9EE]">{alert}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
          <div>
            <p className="text-gray-900 dark:text-white mb-2">2FA Status: Enabled</p>
            <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Your account is protected with two-factor authentication</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Active
          </div>
        </div>
        <button className="mt-4 px-6 py-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-200 border border-red-500/20">
          Disable 2FA
        </button>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Active Sessions</h3>
        <div className="space-y-4">
          {[
            { device: 'Chrome on MacBook Pro', location: 'San Francisco, CA', time: 'Active now', current: true },
            { device: 'Safari on iPhone 15', location: 'San Francisco, CA', time: '2 hours ago', current: false },
            { device: 'Chrome on Windows', location: 'New York, NY', time: '1 day ago', current: false }
          ].map((session, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded">Current</span>
                  )}
                </p>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">{session.location} • {session.time}</p>
              </div>
              {!session.current && (
                <button className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiKeys = () => {
    const isLocked = tier === 'free';
    
    if (isLocked) {
      return (
        <div className="glass-card-light dark:glass-card p-12 rounded-3xl border border-gray-200 dark:border-white/10 text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-purple-500" />
          <h3 className="text-xl text-gray-900 dark:text-white mb-3">API Access Locked</h3>
          <p className="text-gray-600 dark:text-[#98A2B3] mb-6 max-w-md mx-auto">
            API keys are available for Premium and Platinum tier users. Upgrade your plan to unlock programmatic access to GraphLynk.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 shimmer">
            Upgrade to Premium
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Key className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
            API Keys
          </h3>
          <div className="space-y-4">
            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 dark:text-white">Production API Key</p>
                  <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Created on Jan 15, 2025</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs">Active</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type={showApiKey ? "text" : "password"}
                  value="glk_live_a8f7d9e2c4b1f3a6d8e5c7b9a2f4d6e8"
                  readOnly
                  className="flex-1 px-4 py-3 bg-white dark:bg-[#12161A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" /> : <Eye className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />}
                </button>
                <button
                  onClick={() => copyToClipboard('glk_live_a8f7d9e2c4b1f3a6d8e5c7b9a2f4d6e8')}
                  className="p-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 dark:text-white">Development API Key</p>
                  <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Created on Jan 10, 2025</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs">Active</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  value="glk_dev_b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4"
                  readOnly
                  className="flex-1 px-4 py-3 bg-white dark:bg-[#12161A] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white font-mono text-sm"
                />
                <button className="p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
                </button>
                <button className="p-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200">
            Generate New Key
          </button>
        </div>

        <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <h3 className="text-gray-900 dark:text-white mb-6">API Usage</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-[#0b3d84]/10 to-[#9FF2FF]/10 rounded-xl border border-[#0b3d84]/20">
              <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-2">Requests Today</p>
              <p className="text-3xl text-gray-900 dark:text-white">2,847</p>
              <p className="text-xs text-gray-500 dark:text-[#98A2B3] mt-1">of 10,000 limit</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/20">
              <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-2">Success Rate</p>
              <p className="text-3xl text-gray-900 dark:text-white">99.8%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Excellent</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
              <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-2">Avg Response</p>
              <p className="text-3xl text-gray-900 dark:text-white">142ms</p>
              <p className="text-xs text-gray-500 dark:text-[#98A2B3] mt-1">Very fast</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAppearance = () => (
    <div className="space-y-6">
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Palette className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Theme Preferences
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-6 bg-white border-2 border-[#0b3d84] rounded-xl cursor-pointer hover:shadow-lg transition-all">
            <div className="w-full h-24 bg-gray-100 rounded-lg mb-3"></div>
            <p className="text-center text-gray-900">Light</p>
          </div>
          <div className="p-6 bg-[#12161A] border-2 border-gray-600 rounded-xl cursor-pointer hover:shadow-lg transition-all">
            <div className="w-full h-24 bg-gray-800 rounded-lg mb-3"></div>
            <p className="text-center text-white">Dark</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-white to-[#12161A] border-2 border-gray-400 rounded-xl cursor-pointer hover:shadow-lg transition-all">
            <div className="w-full h-24 bg-gradient-to-r from-gray-100 to-gray-800 rounded-lg mb-3"></div>
            <p className="text-center text-gray-700 dark:text-white">Auto</p>
          </div>
        </div>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Accent Color</h3>
        <div className="grid grid-cols-6 gap-4">
          {['#0b3d84', '#6EE7F5', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((color) => (
            <button
              key={color}
              className="w-full aspect-square rounded-xl hover:scale-110 transition-all border-4 border-white dark:border-[#12161A] shadow-lg"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Compact Mode</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Reduce spacing and padding</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Animations</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Enable UI animations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => {
    const isLocked = tier === 'free';
    
    if (isLocked) {
      return (
        <div className="glass-card-light dark:glass-card p-12 rounded-3xl border border-gray-200 dark:border-white/10 text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-purple-500" />
          <h3 className="text-xl text-gray-900 dark:text-white mb-3">Integrations Locked</h3>
          <p className="text-gray-600 dark:text-[#98A2B3] mb-6 max-w-md mx-auto">
            Third-party integrations are available for Premium and Platinum users. Connect your favorite tools and automate your workflows.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 shimmer">
            Upgrade to Premium
          </button>
        </div>
      );
    }

    const integrations = [
      { name: 'Google Search Console', icon: Globe, connected: true, color: 'from-blue-500 to-cyan-500' },
      { name: 'Google Analytics', icon: TrendingUp, connected: true, color: 'from-orange-500 to-yellow-500' },
      { name: 'Slack', icon: MessageSquare, connected: false, color: 'from-purple-500 to-pink-500' },
      { name: 'Zapier', icon: Zap, connected: false, color: 'from-orange-500 to-red-500' },
      { name: 'Ahrefs', icon: Search, connected: true, color: 'from-blue-600 to-purple-600' },
      { name: 'SEMrush', icon: TrendingUp, connected: false, color: 'from-orange-600 to-red-600' },
    ];

    return (
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Connected Services
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.name} className="p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center`}>
                  <integration.icon className="w-6 h-6 text-white" />
                </div>
                {integration.connected ? (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs">Connected</span>
                ) : (
                  <span className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-lg text-xs">Not Connected</span>
                )}
              </div>
              <h4 className="text-gray-900 dark:text-white mb-2">{integration.name}</h4>
              <button className={`w-full py-2 rounded-lg text-sm transition-all ${
                integration.connected
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                  : 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white hover:shadow-lg'
              }`}>
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Data & Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Make Profile Public</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Allow others to view your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
            <div>
              <p className="text-gray-900 dark:text-white">Analytics Tracking</p>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Help us improve with usage data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
        <h3 className="text-gray-900 dark:text-white mb-6">Data Management</h3>
        <div className="space-y-4">
          <button className="w-full p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-200 dark:border-white/10">
            <p className="text-gray-900 dark:text-white mb-1">Download Your Data</p>
            <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Export all your account data</p>
          </button>
          <button className="w-full p-4 bg-red-500/10 rounded-xl text-left hover:bg-red-500/20 transition-all border border-red-500/20">
            <p className="text-red-600 dark:text-red-400 mb-1">Delete Account</p>
            <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently delete your account and all data</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdvanced = () => {
    const isLocked = tier !== 'platinum';
    
    if (isLocked) {
      return (
        <div className="glass-card-light dark:glass-card p-12 rounded-3xl border border-gray-200 dark:border-white/10 text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-purple-500" />
          <h3 className="text-xl text-gray-900 dark:text-white mb-3">Advanced Settings Locked</h3>
          <p className="text-gray-600 dark:text-[#98A2B3] mb-6 max-w-md mx-auto">
            Advanced configuration options are exclusive to Platinum tier members. Upgrade to access webhooks, custom domains, and more.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 shimmer">
            Upgrade to Platinum
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <h3 className="text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Database className="w-5 h-5 text-[#0b3d84] dark:text-[#9FF2FF]" />
            Advanced Configuration
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Custom Domain</label>
              <input 
                type="text" 
                placeholder="dashboard.yourdomain.com"
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Webhook URL</label>
              <input 
                type="url" 
                placeholder="https://api.yourdomain.com/webhook"
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">Data Retention (days)</label>
              <input 
                type="number" 
                defaultValue="365"
                className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0b3d84] dark:focus:ring-[#9FF2FF] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gray-200 dark:border-white/10">
          <h3 className="text-gray-900 dark:text-white mb-6">Developer Options</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white">Debug Mode</p>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Show detailed error messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-900 dark:text-white">API Rate Limiting</p>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Enforce API request limits</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0b3d84]/20 dark:peer-focus:ring-[#9FF2FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#0b3d84] peer-checked:to-[#9FF2FF]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case 'account': return renderAccountSettings();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'api': return renderApiKeys();
      case 'appearance': return renderAppearance();
      case 'integrations': return renderIntegrations();
      case 'privacy': return renderPrivacy();
      case 'advanced': return renderAdvanced();
      default: return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-full p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-[#0b3d84] dark:text-[#9FF2FF]" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-[#98A2B3]">
          Manage your account preferences and configuration
        </p>
      </div>

      {/* Settings Navigation */}
      <div className="glass-card-light dark:glass-card p-2 rounded-2xl border border-gray-200 dark:border-white/10 mb-8 inline-flex gap-2 flex-wrap">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSettingsTab === tab.id;
          const isLocked = Boolean(tab.tier && tier !== tab.tier && tier !== 'platinum');
          
          return (
            <button
              key={tab.id}
              onClick={() => !isLocked && setActiveSettingsTab(tab.id)}
              disabled={isLocked}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white shadow-lg'
                  : isLocked
                  ? 'text-gray-400 dark:text-[#98A2B3] opacity-40 cursor-not-allowed'
                  : 'text-gray-700 dark:text-[#E6E9EE] hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
              {isLocked && <Lock className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      {renderSettingsContent()}
    </div>
  );
}
