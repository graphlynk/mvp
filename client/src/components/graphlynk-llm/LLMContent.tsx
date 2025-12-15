import { Tier } from '@/types/graphlynk';

interface LLMContentProps {
  tier: Tier;
}

export function LLMContent({ tier }: LLMContentProps) {
  if (tier !== 'platinum') {
    return (
      <div className="p-8">
        <div className="bg-[#12161A] border border-gray-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl text-[#E6E9EE] mb-4">LLM Visibility</h1>
          <p className="text-[#98A2B3] mb-6">This feature is available for Platinum tier only</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
            Upgrade to Platinum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl text-[#E6E9EE] mb-4">LLM Visibility</h1>
      <p className="text-[#98A2B3]">LLM dashboard coming soon...</p>
    </div>
  );
}
