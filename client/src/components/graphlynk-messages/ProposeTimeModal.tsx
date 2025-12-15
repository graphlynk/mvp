import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface ProposeTimeModalProps {
  onClose: () => void;
  participantName: string;
}

export function ProposeTimeModal({ onClose, participantName }: ProposeTimeModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the time proposal submission
    console.log('Proposing time:', { selectedDate, selectedTime, duration, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card-light dark:glass-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between sticky top-0 glass-card-light dark:glass-card z-10">
          <div>
            <h2 className="text-xl text-gray-900 dark:text-white">Propose Meeting Time</h2>
            <p className="text-sm text-gray-600 dark:text-[#98A2B3] mt-1">
              Suggest a time to meet with {participantName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-[#98A2B3]" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Date Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-[#0b3d84]/50"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#98A2B3] mb-2">
              <Clock className="w-4 h-4" />
              Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-[#0b3d84]/50"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-gray-700 dark:text-[#98A2B3] mb-2 block">
              Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-none focus:border-[#0b3d84]/50"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Meeting Notes */}
          <div>
            <label className="text-sm text-gray-700 dark:text-[#98A2B3] mb-2 block">
              Meeting Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add agenda items, meeting location/link, or other details..."
              rows={4}
              className="w-full px-4 py-3 glass-card-light dark:glass-card rounded-xl border border-gray-200 dark:border-white/10 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#98A2B3] focus:outline-none focus:border-[#0b3d84]/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0b3d84] to-[#9FF2FF] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Send Proposal
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 glass-card-light dark:glass-card text-black dark:text-white rounded-xl hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
