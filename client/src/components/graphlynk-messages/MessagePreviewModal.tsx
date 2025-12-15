import { X, CheckCheck, AlertTriangle, Briefcase, Users, Wrench, FileKey, HelpCircle, MapPin, CheckCircle } from 'lucide-react';
import { Thread, Intent } from './MessagesContent';

interface MessagePreviewModalProps {
  thread: Thread;
  onAccept: () => void;
  onDecline: () => void;
  onAskQuestion: () => void;
  onClose: () => void;
}

const intentConfig = {
  hire: { icon: Briefcase, label: 'Hire', color: 'text-blue-500 bg-blue-500/10' },
  collaborate: { icon: Users, label: 'Collaborate', color: 'text-purple-500 bg-purple-500/10' },
  service: { icon: Wrench, label: 'Service', color: 'text-green-500 bg-green-500/10' },
  rights: { icon: FileKey, label: 'Rights', color: 'text-orange-500 bg-orange-500/10' },
  other: { icon: HelpCircle, label: 'Other', color: 'text-gray-500 bg-gray-500/10' }
};

export function MessagePreviewModal({ thread, onAccept, onDecline, onAskQuestion, onClose }: MessagePreviewModalProps) {
  const intentInfo = intentConfig[thread.intent];
  const IntentIcon = intentInfo.icon;

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const handleDecline = () => {
    onDecline();
    onClose();
  };

  const handleAskQuestion = () => {
    onAskQuestion();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10 sticky top-0 glass-card-light dark:glass-card rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center">
              <IntentIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-black dark:text-white">Message Preview</h2>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">{intentInfo.label} Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sender Info */}
          <div className="p-5 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center text-white text-xl flex-shrink-0">
                {thread.participant.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-black dark:text-white">{thread.participant.name}</h3>
                  {thread.participant.verification.domain && (
                    <CheckCircle className="w-4 h-4 text-[#0b3d84] dark:text-[#6EE7F5]" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3] mb-2">
                  {thread.participant.handle}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-[#98A2B3]">
                  <MapPin className="w-4 h-4" />
                  <span>{thread.participant.city}, {thread.participant.state}</span>
                </div>
                
                {/* Verification Badges */}
                {(thread.participant.verification.isni || thread.participant.verification.orcid) && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {thread.participant.verification.isni && (
                      <span className="text-xs px-2 py-1 bg-[#0b3d84]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded">
                        ISNI: {thread.participant.verification.isni}
                      </span>
                    )}
                    {thread.participant.verification.orcid && (
                      <span className="text-xs px-2 py-1 bg-[#0b3d84]/10 text-[#0b3d84] dark:text-[#6EE7F5] rounded">
                        ORCID: {thread.participant.verification.orcid}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Intent Badge */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-[#98A2B3]">Request Type:</span>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${intentInfo.color}`}>
              <IntentIcon className="w-4 h-4" />
              <span className="text-sm">{intentInfo.label}</span>
            </div>
          </div>

          {/* Request Details */}
          {thread.fields && (
            <div className="p-5 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
              <h4 className="text-black dark:text-white mb-4">Request Details</h4>
              <div className="space-y-3">
                {thread.fields.role && (
                  <div className="flex gap-3">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3] min-w-[100px]">Role:</span>
                    <span className="text-sm text-black dark:text-white font-medium">{thread.fields.role}</span>
                  </div>
                )}
                {thread.fields.service && (
                  <div className="flex gap-3">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3] min-w-[100px]">Service:</span>
                    <span className="text-sm text-black dark:text-white font-medium">{thread.fields.service}</span>
                  </div>
                )}
                {thread.fields.budget && (
                  <div className="flex gap-3">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3] min-w-[100px]">Budget:</span>
                    <span className="text-sm text-black dark:text-white font-medium">{thread.fields.budget}</span>
                  </div>
                )}
                {thread.fields.timeline && (
                  <div className="flex gap-3">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3] min-w-[100px]">Timeline:</span>
                    <span className="text-sm text-black dark:text-white font-medium">{thread.fields.timeline}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="p-5 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
            <h4 className="text-black dark:text-white mb-3">Message</h4>
            <p className="text-sm text-gray-600 dark:text-[#98A2B3] leading-relaxed whitespace-pre-wrap">
              {thread.preview}
            </p>
          </div>

          {/* Timestamp */}
          <div className="text-center">
            <span className="text-xs text-gray-500 dark:text-[#98A2B3]">
              Received {thread.timestamp}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-white/10 sticky bottom-0 glass-card-light dark:glass-card rounded-b-2xl">
          {thread.state === 'requested' ? (
            <>
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-3 glass-card-light dark:glass-card text-red-600 dark:text-red-400 rounded-xl hover:shadow-md transition-all border border-red-200 dark:border-red-500/20 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Decline
              </button>
              <button
                onClick={handleAskQuestion}
                className="flex-1 px-4 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
              >
                Ask a Question
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Accept Request
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
