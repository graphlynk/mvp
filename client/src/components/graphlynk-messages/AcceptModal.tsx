import { X, CheckCheck } from 'lucide-react';
import { Thread } from './MessagesContent';

interface AcceptModalProps {
  thread: Thread;
  onAccept: () => void;
  onClose: () => void;
}

export function AcceptModal({ thread, onAccept, onClose }: AcceptModalProps) {
  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCheck className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-black dark:text-white">Accept Request</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center text-white">
                {thread.participant.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-black dark:text-white">{thread.participant.name}</h3>
                <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                  {thread.participant.handle}
                </p>
              </div>
            </div>
            
            {thread.fields && (
              <div className="space-y-2 mb-3">
                {thread.fields.role && (
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3]">Role:</span>
                    <span className="text-sm text-black dark:text-white">{thread.fields.role}</span>
                  </div>
                )}
                {thread.fields.budget && (
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3]">Budget:</span>
                    <span className="text-sm text-black dark:text-white">{thread.fields.budget}</span>
                  </div>
                )}
                {thread.fields.timeline && (
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-500 dark:text-[#98A2B3]">Timeline:</span>
                    <span className="text-sm text-black dark:text-white">{thread.fields.timeline}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
              {thread.preview}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-400">
              Accepting this request will open a direct message channel. You can start collaborating immediately.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
}
