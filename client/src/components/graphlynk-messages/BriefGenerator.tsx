import { useState } from 'react';
import { X, FileText, Download, Sparkles, Lock } from 'lucide-react';
import { Thread, Tier } from './MessagesContent';

interface BriefGeneratorProps {
  thread: Thread;
  tier: Tier;
  onClose: () => void;
}

export function BriefGenerator({ thread, tier, onClose }: BriefGeneratorProps) {
  const [scope, setScope] = useState('');
  const [milestones, setMilestones] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [budget, setBudget] = useState(thread.fields?.budget || '');
  const [dueDate, setDueDate] = useState('');
  const [links, setLinks] = useState('');
  const [generated, setGenerated] = useState(false);

  const canExportPDF = true; // All tiers
  const canExportCSV = tier === 'premium' || tier === 'platinum';
  const canUseAPI = tier === 'platinum';

  const handleGenerate = () => {
    // Auto-populate from thread data
    setScope(`${thread.intent.charAt(0).toUpperCase() + thread.intent.slice(1)} request for ${thread.fields?.role || 'services'}`);
    setMilestones('1. Initial consultation\n2. Project kickoff\n3. Mid-project review\n4. Final delivery');
    setDeliverables(thread.fields?.role ? `Professional ${thread.fields.role} services` : 'As discussed');
    setGenerated(true);
  };

  const exportOptions = [
    {
      id: 'pdf',
      label: 'Export PDF',
      available: canExportPDF,
      watermark: tier === 'free',
      icon: FileText
    },
    {
      id: 'csv',
      label: 'Export CSV',
      available: canExportCSV,
      tier: 'Premium',
      icon: FileText
    },
    {
      id: 'api',
      label: 'Send to API/Webhook',
      available: canUseAPI,
      tier: 'Platinum',
      icon: Sparkles
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 px-8 py-6 border-b border-gray-200 dark:border-white/10 glass-card-light dark:glass-card z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-black dark:text-white mb-1">Create Brief</h2>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                Convert this accepted request into a structured project brief
              </p>
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
        <div className="px-8 py-6 space-y-6">
          {!generated ? (
            <>
              {/* Thread Context */}
              <div className="p-6 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10">
                <h3 className="text-black dark:text-white mb-4">Request Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-[#98A2B3]">From:</span>
                    <p className="text-black dark:text-white">{thread.participant.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-[#98A2B3]">Intent:</span>
                    <p className="text-black dark:text-white capitalize">{thread.intent}</p>
                  </div>
                  {thread.fields?.budget && (
                    <div>
                      <span className="text-gray-600 dark:text-[#98A2B3]">Budget:</span>
                      <p className="text-black dark:text-white">{thread.fields.budget}</p>
                    </div>
                  )}
                  {thread.fields?.timeline && (
                    <div>
                      <span className="text-gray-600 dark:text-[#98A2B3]">Timeline:</span>
                      <p className="text-black dark:text-white">{thread.fields.timeline}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Generate Button */}
              <div className="text-center">
                <button
                  onClick={handleGenerate}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 inline-flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Brief with AI
                </button>
                <p className="text-xs text-gray-600 dark:text-[#98A2B3] mt-3">
                  We'll auto-populate fields based on your conversation
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Brief Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                    Project Scope
                  </label>
                  <textarea
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                    Milestones
                  </label>
                  <textarea
                    value={milestones}
                    onChange={(e) => setMilestones(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                    Deliverables
                  </label>
                  <textarea
                    value={deliverables}
                    onChange={(e) => setDeliverables(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                      Budget
                    </label>
                    <input
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                    Reference Links
                  </label>
                  <input
                    type="text"
                    value={links}
                    onChange={(e) => setLinks(e.target.value)}
                    placeholder="Add relevant links..."
                    className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                  />
                </div>
              </div>

              {/* Export Options */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                <h3 className="text-black dark:text-white mb-4">Export Brief</h3>
                <div className="grid grid-cols-1 gap-3">
                  {exportOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        disabled={!option.available}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          option.available
                            ? 'glass-card-light dark:glass-card border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 hover:shadow-lg'
                            : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            option.available
                              ? 'bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF]'
                              : 'bg-gray-300 dark:bg-gray-700'
                          }`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm text-black dark:text-white">
                              {option.label}
                              {option.watermark && (
                                <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                                  (with watermark)
                                </span>
                              )}
                            </p>
                            {!option.available && option.tier && (
                              <p className="text-xs text-gray-500 dark:text-[#98A2B3]">
                                Requires {option.tier}
                              </p>
                            )}
                          </div>
                        </div>
                        {!option.available && (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        {option.available && (
                          <Download className="w-4 h-4 text-gray-600 dark:text-[#98A2B3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {generated && (
          <div className="sticky bottom-0 px-8 py-6 border-t border-gray-200 dark:border-white/10 glass-card-light dark:glass-card flex items-center justify-between">
            <button
              onClick={() => setGenerated(false)}
              className="px-6 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
            >
              Regenerate
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
