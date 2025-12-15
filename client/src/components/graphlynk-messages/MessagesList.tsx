import { Briefcase, Users, Wrench, FileKey, HelpCircle, Circle } from 'lucide-react';
import { Thread, Intent, ThreadState } from './MessagesContent';

interface MessagesListProps {
  threads: Thread[];
  selectedThread: Thread | null;
  onSelectThread: (thread: Thread) => void;
  onPreviewThread: (thread: Thread) => void;
  onAcceptRequest: (threadId: string) => void;
  onDeclineRequest: (threadId: string) => void;
}

const intentConfig = {
  hire: { icon: Briefcase, label: 'Hire', color: 'text-blue-500 bg-blue-500/10' },
  collaborate: { icon: Users, label: 'Collaborate', color: 'text-purple-500 bg-purple-500/10' },
  service: { icon: Wrench, label: 'Service', color: 'text-green-500 bg-green-500/10' },
  rights: { icon: FileKey, label: 'Rights', color: 'text-orange-500 bg-orange-500/10' },
  other: { icon: HelpCircle, label: 'Other', color: 'text-gray-500 bg-gray-500/10' }
};

const stateConfig = {
  requested: { label: 'Requested', color: 'text-yellow-500' },
  accepted: { label: 'Accepted', color: 'text-green-500' },
  'in-progress': { label: 'In Progress', color: 'text-blue-500' },
  closed: { label: 'Closed', color: 'text-gray-500' }
};

export function MessagesList({ threads, selectedThread, onSelectThread, onPreviewThread, onAcceptRequest, onDeclineRequest }: MessagesListProps) {
  const handleThreadClick = (thread: Thread) => {
    // If thread is unread and in requested state, show preview modal
    if (thread.unread && thread.state === 'requested') {
      onPreviewThread(thread);
    } else {
      onSelectThread(thread);
    }
  };

  if (threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-gray-400 dark:text-[#98A2B3]" />
          </div>
          <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
            No conversations found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-white/5">
      {threads.map((thread) => {
        const intentInfo = intentConfig[thread.intent];
        const stateInfo = stateConfig[thread.state];
        const IntentIcon = intentInfo.icon;
        const isSelected = selectedThread?.id === thread.id;

        return (
          <button
            key={thread.id}
            onClick={() => handleThreadClick(thread)}
            className={`w-full px-6 py-5 text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/5 ${
              isSelected ? 'bg-gray-100 dark:bg-white/5 border-l-4 border-[#0b3d84]' : ''
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-black dark:text-white">{thread.participant.name}</h3>
                {thread.unread && (
                  <div className="w-2 h-2 bg-[#0b3d84] rounded-full"></div>
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-[#98A2B3]">
                {thread.timestamp}
              </span>
            </div>

            {/* Intent & State */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${intentInfo.color}`}>
                <IntentIcon className="w-3.5 h-3.5" />
                <span className="text-xs">{intentInfo.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <Circle className={`w-2 h-2 ${stateInfo.color} fill-current`} />
                <span className={`text-xs ${stateInfo.color}`}>{stateInfo.label}</span>
              </div>
            </div>

            {/* Fields Preview */}
            {thread.fields && (
              <div className="flex flex-wrap gap-2 mb-3">
                {thread.fields.budget && (
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-[#98A2B3] rounded">
                    {thread.fields.budget}
                  </span>
                )}
                {thread.fields.timeline && (
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-[#98A2B3] rounded">
                    {thread.fields.timeline}
                  </span>
                )}
                {thread.fields.role && (
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-[#98A2B3] rounded">
                    {thread.fields.role}
                  </span>
                )}
              </div>
            )}

            {/* Preview */}
            <p className="text-sm text-gray-600 dark:text-[#98A2B3] line-clamp-2">
              {thread.preview}
            </p>
          </button>
        );
      })}
    </div>
  );
}