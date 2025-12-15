import { X, BookOpen, MessageCircle, Video, Keyboard, FileText, Mail, ExternalLink, Zap, Users, Shield, MessageSquare, Network, FileKey, HelpCircle } from 'lucide-react';

interface HelpOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    question: string;
    answer: string;
  }[];
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    items: [
      {
        question: 'What is GraphLynk?',
        answer: 'Graphlynk is a professional networking and rights management platform designed for creatives, featuring intent-based messaging, verifiable credentials, and comprehensive rights tracking.'
      },
      {
        question: 'How do I upgrade my account?',
        answer: 'Navigate to Settings > Subscription to view available tiers (Free, Premium, Professional) and upgrade your account. Each tier offers different message limits, storage, and advanced features.'
      },
      {
        question: 'What are the different tier benefits?',
        answer: 'Free: 3 requests/day, basic features. Premium: 10 requests/day, priority support, advanced analytics. Professional: 25 requests/day, unlimited storage, API access, white-label options.'
      }
    ]
  },
  {
    id: 'messages',
    title: 'Messages & Communication',
    icon: MessageSquare,
    items: [
      {
        question: 'What are intent-based messages?',
        answer: 'Intent-based messaging allows you to categorize conversations by purpose: Hire, Collaborate, Service, Rights, or Other. This helps organize professional communications and set clear expectations.'
      },
      {
        question: 'How do I accept or decline a request?',
        answer: 'Click on unread "Requested" messages to open a preview modal with full details. You can Accept, Decline, or Ask a Question before deciding. All actions include an undo option via toast notifications.'
      },
      {
        question: 'Can I archive conversations?',
        answer: 'Yes! Use the Archive option in any thread to move it to the Archived tab. You can unarchive conversations anytime to restore them to your inbox.'
      },
      {
        question: 'How does the search function work?',
        answer: 'The search bar searches across all fields: names, handles, locations, message content, budgets, timelines, intent types, states, and verification IDs. It works independently in both Inbox and Archived tabs.'
      }
    ]
  },
  {
    id: 'network',
    title: 'Network & Connections',
    icon: Users,
    items: [
      {
        question: 'How do I build my network?',
        answer: 'Use the Network tab to discover and connect with other creatives. Filter by industry, location, skills, and verification status to find the right collaborators and professionals.'
      },
      {
        question: 'What are verification badges?',
        answer: 'Verification badges (Domain, ISNI, ORCID) confirm identity and credentials. Domain verification shows website ownership, ISNI identifies creative professionals, and ORCID is for researchers and academics.'
      },
      {
        question: 'How do I get verified?',
        answer: 'Go to Settings > Verification to connect your domain, ISNI, or ORCID credentials. Verification increases trust and visibility in the Graphlynk community.'
      }
    ]
  },
  {
    id: 'rights',
    title: 'Rights Management',
    icon: Shield,
    items: [
      {
        question: 'How does rights management work?',
        answer: 'Graphlynk helps you track licensing, usage rights, and permissions for your creative work. Document agreements, set terms, and maintain a clear record of who can use your content and how.'
      },
      {
        question: 'Can I license my work through GraphLynk?',
        answer: 'Yes! Use the Rights intent type in messages to negotiate licensing terms. You can specify budgets, timelines, and usage restrictions directly in the conversation.'
      },
      {
        question: 'What rights information should I track?',
        answer: 'Track licensing terms, usage periods, territories, compensation, attribution requirements, and any restrictions on how your work can be used or modified.'
      }
    ]
  }
];

const quickActions = [
  {
    icon: MessageCircle,
    title: 'Contact Support',
    description: 'Get help from our team',
    action: 'support@graphlynx.com'
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Detailed guides and tutorials',
    action: 'View Docs'
  },
  {
    icon: Video,
    title: 'Video Tutorials',
    description: 'Learn with step-by-step videos',
    action: 'Watch Now'
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description: 'Work faster with shortcuts',
    action: 'View All'
  }
];

const keyboardShortcuts = [
  { keys: ['Cmd', 'K'], description: 'Open search' },
  { keys: ['Cmd', 'N'], description: 'New message' },
  { keys: ['Cmd', 'Shift', 'A'], description: 'View notifications' },
  { keys: ['Cmd', '/'], description: 'Open help' },
  { keys: ['Esc'], description: 'Close overlay' }
];

export function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl h-full glass-card-light dark:glass-card border-l border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-card-light dark:glass-card border-b border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-black dark:text-white">Help & Support</h2>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">Get answers and learn about Graphlynk</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Actions */}
          <div>
            <h3 className="text-black dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 dark:hover:border-[#6EE7F5]/30 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0b3d84]/10 dark:bg-[#6EE7F5]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0b3d84]/20 dark:group-hover:bg-[#6EE7F5]/20 transition-all">
                        <Icon className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-black dark:text-white">{action.title}</h4>
                          <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-[#98A2B3]">{action.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="p-5 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
              <h3 className="text-black dark:text-white">Keyboard Shortcuts</h3>
            </div>
            <div className="space-y-3">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-[#98A2B3]">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <span
                        key={keyIndex}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-white/10 text-black dark:text-white rounded border border-gray-300 dark:border-white/20"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Sections */}
          {helpSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-4">
                  <SectionIcon className="w-5 h-5 text-[#0b3d84] dark:text-[#6EE7F5]" />
                  <h3 className="text-black dark:text-white">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10"
                    >
                      <h4 className="text-sm text-black dark:text-white mb-2">
                        {item.question}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-[#98A2B3] leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Contact Support */}
          <div className="p-6 bg-gradient-to-br from-[#0b3d84]/10 to-[#9FF2FF]/10 dark:from-[#0b3d84]/20 dark:to-[#6EE7F5]/20 rounded-xl border border-[#0b3d84]/20 dark:border-[#6EE7F5]/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-black dark:text-white mb-2">Still need help?</h3>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-4">
                  Our support team is here to help you with any questions or issues you may have.
                </p>
                <button className="px-4 py-2 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-lg hover:shadow-lg transition-all text-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-[#98A2B3]">
              Graphlynk v1.0.0 • © 2025 Graphlynk Technologies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}