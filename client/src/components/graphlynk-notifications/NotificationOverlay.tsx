import { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Check, 
  AlertTriangle, 
  TrendingUp, 
  Shield, 
  Code, 
  FileText, 
  Eye,
  ArrowRight,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  ArrowLeft,
  Mail,
  Smartphone,
  Volume2,
  MessageSquare
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationFilter = 'all' | 'unread' | 'alerts' | 'updates';
type NotificationType = 'alert' | 'success' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: any;
  actionLabel?: string;
  actionUrl?: string;
}

export function NotificationOverlay({ isOpen, onClose }: NotificationOverlayProps) {
  const [view, setView] = useState<'list' | 'settings'>('list');
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  
  // Settings State
  const [settings, setSettings] = useState({
    pushEnabled: true,
    soundEnabled: false,
    emailDigest: true,
    marketingEmails: false,
    mentions: true,
    updates: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Schema Validation Error',
      message: 'Critical schema errors detected on 3 pages. Immediate action required.',
      time: '5 min ago',
      isRead: false,
      icon: AlertTriangle,
      actionLabel: 'View Details',
      actionUrl: '#'
    },
    {
      id: '2',
      type: 'success',
      title: 'Indexation Complete',
      message: 'Successfully indexed 127 new pages. All systems operational.',
      time: '12 min ago',
      isRead: false,
      icon: Check,
      actionLabel: 'View Report',
      actionUrl: '#'
    },
    {
      id: '3',
      type: 'info',
      title: 'Keyword Ranking Update',
      message: '15 keywords moved up in rankings. Total improvement: +23 positions.',
      time: '1 hour ago',
      isRead: true,
      icon: TrendingUp,
      actionLabel: 'See Rankings',
      actionUrl: '#'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Security Alert',
      message: 'New login detected from unknown device in New York, NY.',
      time: '2 hours ago',
      isRead: false,
      icon: Shield,
      actionLabel: 'Review',
      actionUrl: '#'
    },
    {
      id: '5',
      type: 'info',
      title: 'LLM Visibility Report Ready',
      message: 'Your weekly LLM visibility analysis is now available.',
      time: '3 hours ago',
      isRead: true,
      icon: Eye,
      actionLabel: 'Open Report',
      actionUrl: '#'
    },
    {
      id: '6',
      type: 'success',
      title: 'Blog Post Published',
      message: '"10 SEO Tips for 2025" has been successfully published.',
      time: '5 hours ago',
      isRead: true,
      icon: FileText,
      actionLabel: 'View Post',
      actionUrl: '#'
    },
    {
      id: '7',
      type: 'info',
      title: 'API Usage Update',
      message: 'You\'ve used 75% of your monthly API quota.',
      time: '1 day ago',
      isRead: true,
      icon: Code,
      actionLabel: 'View Usage',
      actionUrl: '#'
    }
  ]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      // Reset view when closed
      setView('list');
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'alerts') return n.type === 'alert' || n.type === 'warning';
    if (activeFilter === 'updates') return n.type === 'info' || n.type === 'success';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationColors = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return {
          bg: 'from-red-500/10 to-orange-500/10',
          border: 'border-red-500/20',
          icon: 'text-red-500',
          badge: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          icon: 'text-yellow-500',
          badge: 'bg-yellow-500'
        };
      case 'success':
        return {
          bg: 'from-emerald-500/10 to-green-500/10',
          border: 'border-emerald-500/20',
          icon: 'text-emerald-500',
          badge: 'bg-emerald-500'
        };
      case 'info':
      default:
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          icon: 'text-[#0b3d84] dark:text-[#9FF2FF]',
          badge: 'bg-[#0b3d84] dark:bg-[#9FF2FF]'
        };
    }
  };

  const filters = [
    { id: 'all' as NotificationFilter, label: 'All', count: notifications.length },
    { id: 'unread' as NotificationFilter, label: 'Unread', count: unreadCount },
    { id: 'alerts' as NotificationFilter, label: 'Alerts', count: notifications.filter(n => n.type === 'alert' || n.type === 'warning').length },
    { id: 'updates' as NotificationFilter, label: 'Updates', count: notifications.filter(n => n.type === 'info' || n.type === 'success').length },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-end overlay-fade-in"
      onClick={onClose}
    >
      {/* Smart Mirror Backdrop with Reflective Surface */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#0b3d84]/20 to-black/70 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(110,231,245,0.05),transparent_50%)]"></div>
      </div>

      {/* Notification Panel - Slides in from right */}
      <div 
        className="relative w-full max-w-md h-full animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reflective Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-l from-[#0b3d84]/20 via-[#9FF2FF]/10 to-transparent rounded-l-3xl blur-xl opacity-40"></div>
        
        {/* Main Panel */}
        <div className="relative h-full glass-card-light dark:glass-card shadow-2xl depth-shadow-lg overflow-hidden border-l-2 border-white/20 dark:border-white/10 flex flex-col">
          
          {view === 'list' ? (
            <>
              {/* Header Section */}
              <div className="relative border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12161A] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 glass-card-light dark:glass-card rounded-2xl">
                      <Bell className="w-6 h-6 text-[#0b3d84] dark:text-[#9FF2FF]" />
                    </div>
                    <div>
                      <h2 className="text-xl text-gray-900 dark:text-white">Notifications</h2>
                      <p className="text-xs text-gray-600 dark:text-[#98A2B3]">{unreadCount} unread</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 group"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3] group-hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {filters.map((filter) => {
                    const isActive = activeFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white shadow-lg'
                            : 'glass-card-light dark:glass-card text-gray-700 dark:text-[#E6E9EE] hover:shadow-md'
                        }`}
                      >
                        <span className="text-sm">{filter.label}</span>
                        {filter.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-gray-200 dark:bg-white/10'
                          }`}>
                            {filter.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-4">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-2 px-4 py-2 glass-card-light dark:glass-card rounded-xl hover:shadow-md transition-all text-sm text-gray-700 dark:text-[#E6E9EE]"
                    >
                      <CheckCheck className="w-4 h-4" />
                      Mark all read
                    </button>
                  )}
                  <button 
                    onClick={() => setView('settings')}
                    className="flex items-center gap-2 px-4 py-2 glass-card-light dark:glass-card rounded-xl hover:shadow-md transition-all text-sm text-gray-700 dark:text-[#E6E9EE]"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="p-6 glass-card-light dark:glass-card rounded-full mb-4">
                      <Bell className="w-12 h-12 text-gray-400 dark:text-[#98A2B3]" />
                    </div>
                    <p className="text-gray-900 dark:text-white mb-2">No notifications</p>
                    <p className="text-sm text-gray-600 dark:text-[#98A2B3]">You're all caught up!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => {
                    const colors = getNotificationColors(notification.type);
                    const Icon = notification.icon;
                    
                    return (
                      <div
                        key={notification.id}
                        className={`group relative p-5 glass-card-light dark:glass-card rounded-2xl border ${colors.border} hover:shadow-lg transition-all duration-200 overflow-hidden ${
                          !notification.isRead ? 'border-2' : ''
                        }`}
                      >
                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className={`absolute top-0 left-0 w-1 h-full ${colors.badge}`}></div>
                        )}

                        {/* Background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`}></div>

                        <div className="relative">
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`p-3 glass-card-light dark:glass-card rounded-xl ${colors.icon}`}>
                              <Icon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h4 className={`text-sm text-gray-900 dark:text-white ${!notification.isRead ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </h4>
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </div>
                              
                              <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-3 line-clamp-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-[#98A2B3]">
                                  {notification.time}
                                </span>
                                
                                <div className="flex items-center gap-2">
                                  {!notification.isRead && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-xs px-3 py-1.5 glass-card-light dark:glass-card rounded-lg hover:bg-[#0b3d84] hover:text-white dark:hover:bg-[#9FF2FF] dark:hover:text-black transition-all text-gray-700 dark:text-[#E6E9EE]"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                  
                                  {notification.actionLabel && (
                                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-lg hover:shadow-lg transition-all">
                                      {notification.actionLabel}
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="relative px-6 py-4 border-t border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12161A]">
                <button className="w-full py-3 px-4 glass-card-light dark:glass-card rounded-xl hover:bg-gradient-to-r hover:from-[#0b3d84] hover:to-[#9FF2FF] hover:text-white transition-all duration-200 text-sm text-gray-700 dark:text-[#E6E9EE] flex items-center justify-center gap-2 group">
                  <span>See all notifications</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          ) : (
            /* Settings View */
            <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="relative border-b border-gray-200/80 dark:border-white/10 bg-white dark:bg-[#12161A] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setView('list')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors group"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-[#98A2B3] group-hover:text-[#0b3d84] dark:group-hover:text-[#6EE7F5]" />
                    </button>
                    <h2 className="text-xl text-gray-900 dark:text-white">Settings</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all duration-300 hover:scale-110 group"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3] group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] pl-1">
                  Manage how and when you receive notifications.
                </p>
              </div>

              {/* Settings Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* General */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0b3d84] dark:text-[#6EE7F5] uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" />
                    <span>General</span>
                  </div>
                  <div className="space-y-3 glass-card-light dark:glass-card rounded-2xl p-4 border border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive alerts on your device</p>
                      </div>
                      <Switch 
                        checked={settings.pushEnabled}
                        onCheckedChange={() => toggleSetting('pushEnabled')}
                      />
                    </div>
                    <div className="h-px bg-gray-200/50 dark:bg-white/5"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sound Effects</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Play sound on new notifications</p>
                      </div>
                      <Switch 
                        checked={settings.soundEnabled}
                        onCheckedChange={() => toggleSetting('soundEnabled')}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0b3d84] dark:text-[#6EE7F5] uppercase tracking-wider">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <div className="space-y-3 glass-card-light dark:glass-card rounded-2xl p-4 border border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Weekly Digest</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Summary of your weekly performance</p>
                      </div>
                      <Switch 
                        checked={settings.emailDigest}
                        onCheckedChange={() => toggleSetting('emailDigest')}
                      />
                    </div>
                    <div className="h-px bg-gray-200/50 dark:bg-white/5"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Marketing & Tips</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive SEO tips and product updates</p>
                      </div>
                      <Switch 
                        checked={settings.marketingEmails}
                        onCheckedChange={() => toggleSetting('marketingEmails')}
                      />
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#0b3d84] dark:text-[#6EE7F5] uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" />
                    <span>Activity</span>
                  </div>
                  <div className="space-y-3 glass-card-light dark:glass-card rounded-2xl p-4 border border-gray-200/50 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Mentions</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">When someone mentions you</p>
                      </div>
                      <Switch 
                        checked={settings.mentions}
                        onCheckedChange={() => toggleSetting('mentions')}
                      />
                    </div>
                    <div className="h-px bg-gray-200/50 dark:bg-white/5"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Project Updates</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Major changes to your projects</p>
                      </div>
                      <Switch 
                        checked={settings.updates}
                        onCheckedChange={() => toggleSetting('updates')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}