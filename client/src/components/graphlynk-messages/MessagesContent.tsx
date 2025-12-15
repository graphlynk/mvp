import { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, Archive, X } from 'lucide-react';
import { Tier } from '@/types/graphlynk';
import { MessagesList } from './MessagesList';
import { ThreadView } from './ThreadView';
import { ComposeRequest } from './ComposeRequest';
import { MessagePreviewModal } from './MessagePreviewModal';
import { toast } from 'sonner';

interface MessagesContentProps {
  tier: Tier;
}

export type ThreadState = 'requested' | 'accepted' | 'in-progress' | 'closed';
export type Intent = 'hire' | 'collaborate' | 'service' | 'rights' | 'other';
export type ViewMode = 'inbox' | 'archived';

export interface Verification {
  domain: boolean;
  isni: string | null;
  orcid: string | null;
}

export interface Thread {
  id: string;
  participant: {
    name: string;
    handle: string;
    city: string;
    state: string;
    verification: Verification;
  };
  intent: Intent;
  state: ThreadState;
  preview: string;
  timestamp: string;
  unread: boolean;
  isArchived?: boolean;
  fields?: {
    budget?: string;
    timeline?: string;
    role?: string;
    service?: string;
  };
}

const mockThreads: Thread[] = [
  {
    id: '1',
    participant: {
      name: 'Sarah Chen',
      handle: '@sarahchen',
      city: 'San Francisco',
      state: 'CA',
      verification: { domain: true, isni: '0000000121234567', orcid: '0000-0002-1234-5678' }
    },
    intent: 'hire',
    state: 'accepted',
    preview: 'Looking forward to working with you on this project. I\'ve reviewed your portfolio and I think you\'re a perfect fit for our audio engineering needs.',
    timestamp: '2h ago',
    unread: true,
    isArchived: false,
    fields: { budget: '$5k-$10k', timeline: '2-4 weeks', role: 'Audio Engineer' }
  },
  {
    id: '2',
    participant: {
      name: 'Marcus Williams',
      handle: '@marcusw',
      city: 'Austin',
      state: 'TX',
      verification: { domain: true, isni: null, orcid: null }
    },
    intent: 'collaborate',
    state: 'requested',
    preview: 'I have a concept for a joint project that might interest you. It\'s a multimedia installation combining interactive audio and visual elements for a music festival in Austin this summer. I\'ve been following your work and think our styles would complement each other perfectly. Would love to discuss the details and see if you\'re interested in collaborating. The project has secured funding and we\'re looking to start development in the next few weeks.',
    timestamp: '5h ago',
    unread: true,
    isArchived: false,
    fields: { timeline: '3 months' }
  },
  {
    id: '3',
    participant: {
      name: 'Elena Rodriguez',
      handle: '@elenarodriguez',
      city: 'Miami',
      state: 'FL',
      verification: { domain: true, isni: '0000000121234568', orcid: null }
    },
    intent: 'service',
    state: 'in-progress',
    preview: 'Files uploaded. Let me know if you need anything else. The SEO audit is progressing well and I should have preliminary results by end of week.',
    timestamp: '1d ago',
    unread: false,
    isArchived: false,
    fields: { service: 'SEO Audit', timeline: '1 week' }
  },
  {
    id: '4',
    participant: {
      name: 'David Kim',
      handle: '@davidkim',
      city: 'New York',
      state: 'NY',
      verification: { domain: true, isni: null, orcid: null }
    },
    intent: 'other',
    state: 'closed',
    preview: 'Thanks for the inquiry. Maybe next time! Unfortunately the timing doesn\'t work for this project.',
    timestamp: '3d ago',
    unread: false,
    isArchived: true,
    fields: { service: 'Consultation' }
  },
  {
    id: '5',
    participant: {
      name: 'Jennifer Park',
      handle: '@jenniferpark',
      city: 'Los Angeles',
      state: 'CA',
      verification: { domain: true, isni: '0000000121234569', orcid: '0000-0002-1234-5679' }
    },
    intent: 'rights',
    state: 'requested',
    preview: 'Hi! I\'m interested in licensing your track "Midnight Echo" for use in an upcoming indie film. We\'re a small production company but we\'re offering fair compensation and full credits. The film is scheduled to premiere at Sundance next year. I\'d love to discuss terms and send you the script so you can get a feel for how your music would be used. Looking forward to hearing from you!',
    timestamp: '1h ago',
    unread: true,
    isArchived: false,
    fields: { budget: '$2k-$5k', timeline: '1 month' }
  }
];

export function MessagesContent({ tier }: MessagesContentProps) {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('inbox');
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [stateHistory, setStateHistory] = useState<{ threadId: string; previousState: ThreadState } | null>(null);
  const [previewThread, setPreviewThread] = useState<Thread | null>(null);

  const sendLimit = tier === 'free' ? 3 : tier === 'premium' ? 10 : 25;
  const sentToday = 2; // Mock count

  const filteredThreads = threads.filter(thread => {
    // If no search query, just filter by view mode
    if (!searchQuery.trim()) {
      const isArchived = thread.isArchived === true;
      return viewMode === 'archived' ? isArchived : !isArchived;
    }

    // Comprehensive search across all fields
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      thread.participant.name.toLowerCase().includes(query) ||
      thread.participant.handle.toLowerCase().includes(query) ||
      thread.participant.city.toLowerCase().includes(query) ||
      thread.participant.state.toLowerCase().includes(query) ||
      thread.preview.toLowerCase().includes(query) ||
      thread.intent.toLowerCase().includes(query) ||
      thread.state.toLowerCase().includes(query) ||
      (thread.fields?.budget && thread.fields.budget.toLowerCase().includes(query)) ||
      (thread.fields?.timeline && thread.fields.timeline.toLowerCase().includes(query)) ||
      (thread.fields?.role && thread.fields.role.toLowerCase().includes(query)) ||
      (thread.fields?.service && thread.fields.service.toLowerCase().includes(query)) ||
      (thread.participant.verification.isni && thread.participant.verification.isni.toLowerCase().includes(query)) ||
      (thread.participant.verification.orcid && thread.participant.verification.orcid.toLowerCase().includes(query));
    
    const isArchived = thread.isArchived === true;
    const matchesView = viewMode === 'archived' ? isArchived : !isArchived;

    return matchesSearch && matchesView;
  });

  const handleAcceptRequest = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setStateHistory({ threadId, previousState: thread.state });
    }
    
    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, state: 'accepted' as ThreadState } : t
    ));
    if (selectedThread?.id === threadId) {
      setSelectedThread({ ...selectedThread, state: 'accepted' as ThreadState });
    }

    toast.success('Request accepted', {
      action: {
        label: 'Undo',
        onClick: () => handleUndo(threadId)
      },
      duration: 5000,
    });
  };

  const handleDeclineRequest = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setStateHistory({ threadId, previousState: thread.state });
    }

    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, state: 'closed' as ThreadState } : t
    ));
    // Optionally deselect if it was the selected thread
    if (selectedThread?.id === threadId) {
      setSelectedThread(null);
    }

    toast.success('Request declined', {
      action: {
        label: 'Undo',
        onClick: () => handleUndo(threadId)
      },
      duration: 5000,
    });
  };

  const handleUndo = (threadId: string) => {
    if (stateHistory && stateHistory.threadId === threadId) {
      setThreads(threads.map(t => 
        t.id === threadId ? { ...t, state: stateHistory.previousState } : t
      ));
      
      // Re-select the thread if it was the one being undone
      const restoredThread = threads.find(t => t.id === threadId);
      if (restoredThread) {
        setSelectedThread({ ...restoredThread, state: stateHistory.previousState });
      }
      
      setStateHistory(null);
      toast.success('Action undone');
    }
  };

  const handleRestoreToRequested = (threadId: string) => {
    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, state: 'requested' as ThreadState } : t
    ));
    
    // Re-select the thread with requested state
    const restoredThread = threads.find(t => t.id === threadId);
    if (restoredThread) {
      setSelectedThread({ ...restoredThread, state: 'requested' as ThreadState });
    }
    
    setStateHistory(null);
  };

  const handleArchiveThread = (threadId: string) => {
    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, isArchived: true } : t
    ));
    if (selectedThread?.id === threadId) {
      setSelectedThread(null);
    }
    toast.success('Thread archived');
  };

  const handleUnarchiveThread = (threadId: string) => {
    setThreads(threads.map(t => 
      t.id === threadId ? { ...t, isArchived: false } : t
    ));
    if (selectedThread?.id === threadId) {
      setSelectedThread(null);
    }
    toast.success('Thread restored to inbox');
  };

  const handlePreviewAccept = () => {
    if (previewThread) {
      handleAcceptRequest(previewThread.id);
    }
  };

  const handlePreviewDecline = () => {
    if (previewThread) {
      handleDeclineRequest(previewThread.id);
    }
  };

  const handlePreviewAskQuestion = () => {
    if (previewThread) {
      setSelectedThread(previewThread);
      toast.success('Thread opened. You can now ask questions before deciding.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#0B0D10]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-black dark:text-white mb-2">Messages</h1>
            <p className="text-gray-600 dark:text-[#98A2B3]">
              Intent-first conversations. {sentToday} of {sendLimit} requests sent today.
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Start a Request
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit mb-4">
          <button
            onClick={() => {
              setViewMode('inbox');
              setSelectedThread(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'inbox'
                ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => {
              setViewMode('archived');
              setSelectedThread(null);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'archived'
                ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Archive className="w-4 h-4" />
            Archived
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-[#98A2B3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-12 pr-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#98A2B3] hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button className="p-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 transition-all">
            <Filter className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
          </button>
        </div>
        
        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="mt-4 text-sm text-gray-600 dark:text-[#98A2B3]">
            Found {filteredThreads.length} {filteredThreads.length === 1 ? 'conversation' : 'conversations'} matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thread List */}
        <div className="w-80 border-r border-gray-200 dark:border-white/10 overflow-y-auto flex-shrink-0">
          <MessagesList
            threads={filteredThreads}
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
            onPreviewThread={setPreviewThread}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
          />
        </div>

        {/* Thread View or Empty State */}
        <div className="flex-1 min-w-0">
          {selectedThread ? (
            <ThreadView 
              thread={selectedThread} 
              tier={tier}
              onAcceptRequest={handleAcceptRequest}
              onDeclineRequest={handleDeclineRequest}
              onRestoreToRequested={handleRestoreToRequested}
              onArchive={() => handleArchiveThread(selectedThread.id)}
              onUnarchive={() => handleUnarchiveThread(selectedThread.id)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl glass-card-light dark:glass-card flex items-center justify-center">
                  {viewMode === 'archived' ? (
                    <Archive className="w-12 h-12 text-gray-400 dark:text-[#98A2B3]" />
                  ) : (
                    <MessageSquare className="w-12 h-12 text-gray-400 dark:text-[#98A2B3]" />
                  )}
                </div>
                <h3 className="text-black dark:text-white mb-2">
                  {viewMode === 'archived' ? 'No archived conversation selected' : 'No conversation selected'}
                </h3>
                <p className="text-gray-600 dark:text-[#98A2B3] mb-6">
                  {viewMode === 'archived' ? 'Select a thread to view or restore it' : 'Choose a thread or start a new request'}
                </p>
                {viewMode === 'inbox' && (
                  <button
                    onClick={() => setShowCompose(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Start a Request
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Overlay */}
      {showCompose && (
        <ComposeRequest
          tier={tier}
          onClose={() => setShowCompose(false)}
          sentToday={sentToday}
          sendLimit={sendLimit}
        />
      )}

      {/* Message Preview Modal */}
      {previewThread && (
        <MessagePreviewModal
          thread={previewThread}
          onClose={() => setPreviewThread(null)}
          onAccept={handlePreviewAccept}
          onDecline={handlePreviewDecline}
          onAskQuestion={handlePreviewAskQuestion}
        />
      )}
    </div>
  );
}