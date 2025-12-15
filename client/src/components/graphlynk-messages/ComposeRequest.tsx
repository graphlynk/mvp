import { useState } from 'react';
import { X, Briefcase, Users, Wrench, FileKey, HelpCircle, AlertCircle, Paperclip } from 'lucide-react';
import { Tier, Intent } from './MessagesContent';

interface ComposeRequestProps {
  tier: Tier;
  onClose: () => void;
  sentToday: number;
  sendLimit: number;
}

const intentOptions = [
  { id: 'hire' as Intent, icon: Briefcase, label: 'Hire', description: 'Commission or contract work' },
  { id: 'collaborate' as Intent, icon: Users, label: 'Collaborate', description: 'Joint projects or partnerships' },
  { id: 'service' as Intent, icon: Wrench, label: 'Service Inquiry', description: 'Professional services' },
  { id: 'rights' as Intent, icon: FileKey, label: 'Rights & Licensing', description: 'Asset licensing or permissions' },
  { id: 'other' as Intent, icon: HelpCircle, label: 'Other', description: 'General inquiry' }
];

export function ComposeRequest({ tier, onClose, sentToday, sendLimit }: ComposeRequestProps) {
  const [step, setStep] = useState<'intent' | 'fields'>('intent');
  const [selectedIntent, setSelectedIntent] = useState<Intent | null>(null);
  const [recipient, setRecipient] = useState('');
  
  // Common fields
  const [message, setMessage] = useState('');
  
  // Hire fields
  const [role, setRole] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [location, setLocation] = useState('');
  const [links, setLinks] = useState('');
  
  // Collaborate fields
  const [concept, setConcept] = useState('');
  const [rightsSplit, setRightsSplit] = useState('');
  const [references, setReferences] = useState('');
  
  // Service fields
  const [serviceType, setServiceType] = useState('');
  const [scope, setScope] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // Rights fields
  const [assets, setAssets] = useState('');
  const [use, setUse] = useState('');
  const [term, setTerm] = useState('');
  const [territory, setTerritory] = useState('');

  const canSend = sentToday < sendLimit;

  const handleIntentSelect = (intent: Intent) => {
    setSelectedIntent(intent);
    setStep('fields');
  };

  const isFormValid = () => {
    if (!recipient || !message) return false;
    
    switch (selectedIntent) {
      case 'hire':
        return role && budget && timeline && deliverables;
      case 'collaborate':
        return concept && timeline && rightsSplit;
      case 'service':
        return serviceType && scope && deadline;
      case 'rights':
        return assets && use && term && territory && budget;
      case 'other':
        return true;
      default:
        return false;
    }
  };

  const renderFields = () => {
    switch (selectedIntent) {
      case 'hire':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Audio Engineer"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., $5k-$10k or N/A"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Timeline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 2-4 weeks"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Location/Remote <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Remote or Los Angeles"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                Deliverables <span className="text-red-500">*</span>
              </label>
              <textarea
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="What do you need delivered?"
                rows={3}
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
              />
            </div>
          </>
        );

      case 'collaborate':
        return (
          <>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                Concept <span className="text-red-500">*</span>
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your collaboration idea..."
                rows={3}
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Timeline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 3 months"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Rights Split <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={rightsSplit}
                  onChange={(e) => setRightsSplit(e.target.value)}
                  placeholder="e.g., 50/50"
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
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="Links to examples or inspiration"
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
              />
            </div>
          </>
        );

      case 'service':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="e.g., SEO Audit"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g., 1 week"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                Scope <span className="text-red-500">*</span>
              </label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="What services do you need?"
                rows={3}
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                Reference Links
              </label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="Website or project links"
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
              />
            </div>
          </>
        );

      case 'rights':
        return (
          <>
            <div>
              <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                Asset(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={assets}
                onChange={(e) => setAssets(e.target.value)}
                placeholder="What assets need licensing?"
                className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Use <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={use}
                  onChange={(e) => setUse(e.target.value)}
                  placeholder="e.g., Commercial, Editorial"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Term <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., 1 year, Perpetual"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Territory <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  placeholder="e.g., Worldwide, US only"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., $1k-$5k"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>
            </div>
          </>
        );

      case 'other':
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card-light dark:glass-card rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 px-8 py-6 border-b border-gray-200 dark:border-white/10 glass-card-light dark:glass-card z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-black dark:text-white mb-1">Start a Request</h2>
              <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                Messaging on Graphlynk is intentional. Choose an intent and add the required details.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
            </button>
          </div>
          
          {/* Send Limit Warning */}
          {!canSend && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Daily send limit reached ({sentToday}/{sendLimit})
                </p>
                <p className="text-xs text-gray-600 dark:text-[#98A2B3] mt-1">
                  Upgrade to {tier === 'free' ? 'Premium' : 'Platinum'} for more daily requests
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
          {step === 'intent' ? (
            <>
              <h3 className="text-black dark:text-white">Choose Intent</h3>
              <div className="grid grid-cols-1 gap-4">
                {intentOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleIntentSelect(option.id)}
                      className="flex items-start gap-4 p-6 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b3d84] to-[#9FF2FF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-black dark:text-white mb-1">{option.label}</h4>
                        <p className="text-sm text-gray-600 dark:text-[#98A2B3]">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Recipient */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  To <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="@username or name"
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50"
                />
              </div>

              {/* Dynamic Fields */}
              {renderFields()}

              {/* Message */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Message (one sentence) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Concise opener that gets to the point..."
                  rows={2}
                  maxLength={280}
                  className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-[#98A2B3] mt-1 text-right">
                  {message.length}/280
                </p>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
                  Attachments (optional)
                </label>
                <button className="flex items-center gap-2 px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 hover:border-[#0b3d84]/30 transition-all text-gray-600 dark:text-[#98A2B3]">
                  <Paperclip className="w-5 h-5" />
                  <span className="text-sm">Add files (max 10MB each)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {step === 'fields' && (
          <div className="sticky bottom-0 px-8 py-6 border-t border-gray-200 dark:border-white/10 glass-card-light dark:glass-card flex items-center justify-between">
            <button
              onClick={() => setStep('intent')}
              className="px-6 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
            >
              Back
            </button>
            <button
              disabled={!isFormValid() || !canSend}
              title={!isFormValid() ? 'Add required fields to send' : !canSend ? 'Daily send limit reached' : ''}
              className="px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}