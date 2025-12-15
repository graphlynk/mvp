import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, MoreVertical, CheckCheck, Clock, FileText, Calendar, X, Archive, BellOff, Mail, Trash2, Ban, Flag, Undo2 } from 'lucide-react';
import { Thread } from './MessagesContent';
import { Tier } from '@/types/graphlynk';
import { BriefGenerator } from './BriefGenerator';
import { ProposeTimeModal } from './ProposeTimeModal';
import { ShareFilesModal } from './ShareFilesModal';
import { DeclineModal } from './DeclineModal';
import { AcceptModal } from './AcceptModal';
import { toast } from 'sonner';

interface ThreadViewProps {
  thread: Thread;
  tier: Tier;
  onAcceptRequest: (threadId: string) => void;
  onDeclineRequest: (threadId: string) => void;
  onRestoreToRequested?: (threadId: string) => void;
  onArchive?: (threadId: string) => void;
  onUnarchive?: (threadId: string) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
  read?: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'them',
    content: "Hi! I'm interested in hiring you for audio engineering work. I have a 10-track album that needs mixing and mastering.",
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    sender: 'me',
    content: "Thanks for reaching out! I'd be happy to help. Can you tell me more about the project timeline and your budget range?",
    timestamp: '10:45 AM',
    read: true
  },
  {
    id: '3',
    sender: 'them',
    content: "We're looking to have this completed within 2-4 weeks. Budget is flexible between $5k-$10k depending on the scope.",
    timestamp: '11:20 AM',
  },
  {
    id: '4',
    sender: 'me',
    content: "Perfect! That timeline works for me. I can deliver high-quality mixing and mastering for all 10 tracks within that budget. Let me create a brief with the details.",
    timestamp: '11:35 AM',
    read: true
  }
];

export function ThreadView({ thread, tier, onAcceptRequest, onDeclineRequest, onRestoreToRequested, onArchive, onUnarchive }: ThreadViewProps) {
  const [message, setMessage] = useState('');
  const [showBriefGenerator, setShowBriefGenerator] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showProposeTimeModal, setShowProposeTimeModal] = useState(false);
  const [showShareFilesModal, setShowShareFilesModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canShowReadReceipts = thread.state !== 'requested';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdownMenu(false);
      }
    };

    if (showDropdownMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdownMenu]);

  const handleUndoDecline = () => {
    if (onRestoreToRequested) {
      onRestoreToRequested(thread.id);
    } else {
      // Fallback to onAcceptRequest if onRestoreToRequested is not provided
      onAcceptRequest(thread.id);
    }
    setShowDropdownMenu(false);
    toast.success('Thread restored to pending', {
      description: 'You can now choose to Accept, Decline, or Ask a Question',
      duration: 3000,
    });
  };

  const handleArchive = () => {
    setShowDropdownMenu(false);
    if (onArchive) {
      onArchive(thread.id);
    } else {
      toast.success('Thread archived');
    }
  };

  const handleUnarchive = () => {
    setShowDropdownMenu(false);
    if (onUnarchive) {
      onUnarchive(thread.id);
    } else {
      toast.success('Thread restored');
    }
  };

  const handleMute = () => {
    setShowDropdownMenu(false);
    toast.success('Notifications muted', {
      action: {
        label: 'Undo',
        onClick: () => toast.success('Mute undone')
      },
      duration: 5000,
    });
  };

  const handleMarkUnread = () => {
    setShowDropdownMenu(false);
    toast.success('Marked as unread');
  };

  const handleDelete = () => {
    setShowDropdownMenu(false);
    toast.error('Thread deleted', {
      action: {
        label: 'Undo',
        onClick: () => toast.success('Delete undone')
      },
      duration: 5000,
    });
  };

  const handleBlock = () => {
    setShowDropdownMenu(false);
    toast.error(`${thread.participant.name} blocked`, {
      action: {
        label: 'Undo',
        onClick: () => toast.success('Block undone')
      },
      duration: 5000,
    });
  };

  const handleReport = () => {
    setShowDropdownMenu(false);
    toast.info('Report submitted for review');
  };

  const handleAskQuestion = () => {
    // Pre-fill with a question prompt and focus the input
    setMessage("I have a question about ");
    setShowQuickActions(false);
    // Focus the message input
    setTimeout(() => {
      messageInputRef.current?.focus();
      // Move cursor to end
      if (messageInputRef.current) {
        const length = messageInputRef.current.value.length;
        messageInputRef.current.setSelectionRange(length, length);
      }
    }, 100);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Thread Header */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-white/10 glass-card-light dark:glass-card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Name & Handle with Action Buttons */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center text-white text-sm">
                  {thread.participant.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-black dark:text-white">{thread.participant.name}</h2>
                  <p className="text-xs text-gray-600 dark:text-[#98A2B3]">
                    {thread.participant.handle}
                  </p>
                </div>
              </div>

              {/* Action Bar (If Accepted) */}
              {thread.state === 'accepted' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowBriefGenerator(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:shadow-lg transition-all text-xs ${
                      showBriefGenerator
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'glass-card-light dark:glass-card text-black dark:text-white border border-gray-200 dark:border-white/10 hover:shadow-md'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Brief
                  </button>
                  <button
                    onClick={() => setShowProposeTimeModal(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:shadow-lg transition-all text-xs ${
                      showProposeTimeModal
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'glass-card-light dark:glass-card text-black dark:text-white border border-gray-200 dark:border-white/10 hover:shadow-md'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Time
                  </button>
                  <button
                    onClick={() => setShowShareFilesModal(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:shadow-lg transition-all text-xs ${
                      showShareFilesModal
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'glass-card-light dark:glass-card text-black dark:text-white border border-gray-200 dark:border-white/10 hover:shadow-md'
                    }`}
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    Files
                  </button>
                </div>
              )}
            </div>

            {/* Verification Badges & Location (Compact) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-600 dark:text-[#98A2B3]">
              {thread.participant.verification.domain && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-xs">
                  <CheckCheck className="w-3 h-3" />
                  Domain
                </span>
              )}
              {thread.participant.verification.isni && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-xs">
                  <CheckCheck className="w-3 h-3" />
                  ISNI
                </span>
              )}
              {thread.participant.verification.orcid && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs">
                  <CheckCheck className="w-3 h-3" />
                  ORCID
                </span>
              )}
              <span>•</span>
              <span>{thread.participant.city}, {thread.participant.state}</span>
            </div>

            {/* Request Details (Compact) */}
            {thread.fields && (
              <div className="mt-2 p-2 glass-card-light dark:glass-card rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex flex-wrap gap-2 text-xs">
                  {thread.fields.role && (
                    <span className="text-gray-600 dark:text-[#98A2B3]">
                      <strong className="text-black dark:text-white">Role:</strong> {thread.fields.role}
                    </span>
                  )}
                  {thread.fields.budget && (
                    <>
                      <span>•</span>
                      <span className="text-gray-600 dark:text-[#98A2B3]">
                        <strong className="text-black dark:text-white">Budget:</strong> {thread.fields.budget}
                      </span>
                    </>
                  )}
                  {thread.fields.timeline && (
                    <>
                      <span>•</span>
                      <span className="text-gray-600 dark:text-[#98A2B3]">
                        <strong className="text-black dark:text-white">Timeline:</strong> {thread.fields.timeline}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
              onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            >
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
            </button>

            {showDropdownMenu && (
              <div className="absolute right-0 top-12 min-w-[200px] glass-card-light dark:glass-card border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="py-2">
                  {thread.state === 'closed' && (
                    <>
                      <button
                        className="w-full text-left px-4 py-2.5 text-sm text-black dark:text-white hover:bg-gradient-to-r hover:from-[#0b3d84]/10 hover:to-[#9FF2FF]/10 transition-all flex items-center gap-3"
                        onClick={handleUndoDecline}
                      >
                        <Undo2 className="w-4 h-4 text-green-500" />
                        Undo Decline
                      </button>
                      <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                    </>
                  )}
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-black dark:text-white hover:bg-gradient-to-r hover:from-[#0b3d84]/10 hover:to-[#9FF2FF]/10 transition-all flex items-center gap-3"
                    onClick={thread.isArchived ? handleUnarchive : handleArchive}
                  >
                    <Archive className="w-4 h-4 text-blue-500" />
                    {thread.isArchived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-black dark:text-white hover:bg-gradient-to-r hover:from-[#0b3d84]/10 hover:to-[#9FF2FF]/10 transition-all flex items-center gap-3"
                    onClick={handleMute}
                  >
                    <BellOff className="w-4 h-4 text-orange-500" />
                    Mute Notifications
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-black dark:text-white hover:bg-gradient-to-r hover:from-[#0b3d84]/10 hover:to-[#9FF2FF]/10 transition-all flex items-center gap-3"
                    onClick={handleMarkUnread}
                  >
                    <Mail className="w-4 h-4 text-purple-500" />
                    Mark as Unread
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Thread
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                    onClick={handleBlock}
                  >
                    <Ban className="w-4 h-4" />
                    Block User
                  </button>
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                    onClick={handleReport}
                  >
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions (Conditional) */}
      {showQuickActions && thread.state === 'requested' && (
        <div className="px-6 py-2 bg-yellow-50 dark:bg-yellow-500/10 border-b border-yellow-200 dark:border-yellow-500/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAcceptModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-lg hover:shadow-lg transition-all text-sm"
            >
              Accept
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              className="px-3 py-1.5 glass-card-light dark:glass-card text-black dark:text-white rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-white/10 text-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAskQuestion}
              className="px-3 py-1.5 glass-card-light dark:glass-card text-black dark:text-white rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-white/10 text-sm"
            >
              Ask Question
            </button>
            <button
              onClick={() => setShowQuickActions(false)}
              className="ml-auto p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-[#98A2B3]" />
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {mockMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-5 py-3.5 rounded-2xl break-words ${
                  msg.sender === 'me'
                    ? 'bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white'
                    : 'glass-card-light dark:glass-card text-black dark:text-white border border-gray-200 dark:border-white/10'
                }`}
              >
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
              <div className="flex items-center gap-2 px-2">
                <span className="text-xs text-gray-500 dark:text-[#98A2B3]">
                  {msg.timestamp}
                </span>
                {msg.sender === 'me' && canShowReadReceipts && msg.read && (
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="px-6 py-3 border-t border-gray-200 dark:border-white/10 glass-card-light dark:glass-card">
        <div className="flex items-end gap-3">
          <button className="p-2 glass-card-light dark:glass-card rounded-lg hover:shadow-md transition-all border border-gray-200 dark:border-white/10">
            <Paperclip className="w-4 h-4 text-gray-600 dark:text-[#98A2B3]" />
          </button>
          <div className="flex-1">
            <textarea
              ref={messageInputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              className="w-full px-3 py-2 glass-card-light dark:glass-card rounded-lg border border-gray-200 dark:border-white/10 text-[15px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
            />
          </div>
          <button
            disabled={!message.trim()}
            className="p-2 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {thread.state === 'requested' && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            <Clock className="w-3 h-3 inline mr-1" />
            Read receipts will appear after you accept this request
          </p>
        )}
      </div>

      {/* Brief Generator Modal */}
      {showBriefGenerator && (
        <BriefGenerator
          thread={thread}
          tier={tier}
          onClose={() => setShowBriefGenerator(false)}
        />
      )}

      {/* Propose Time Modal */}
      {showProposeTimeModal && (
        <ProposeTimeModal
          participantName={thread.participant.name}
          onClose={() => setShowProposeTimeModal(false)}
        />
      )}

      {/* Share Files Modal */}
      {showShareFilesModal && (
        <ShareFilesModal
          participantName={thread.participant.name}
          onClose={() => setShowShareFilesModal(false)}
        />
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <DeclineModal
          thread={thread}
          onDecline={() => onDeclineRequest(thread.id)}
          onClose={() => setShowDeclineModal(false)}
        />
      )}

      {/* Accept Modal */}
      {showAcceptModal && (
        <AcceptModal
          thread={thread}
          onAccept={() => onAcceptRequest(thread.id)}
          onClose={() => setShowAcceptModal(false)}
        />
      )}
    </div>
  );
}