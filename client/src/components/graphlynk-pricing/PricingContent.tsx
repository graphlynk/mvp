import { Tier } from '@/types/graphlynk';

interface PricingContentProps {
  tier: Tier;
  onTierChange: (tier: Tier) => void;
}

export function PricingContent({ tier, onTierChange }: PricingContentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl text-[#E6E9EE] mb-4">Pricing & GKP</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Free */}
        <div className="bg-[#12161A] border border-gray-800 rounded-lg p-6">
          <h3 className="text-xl text-[#E6E9EE] mb-2">Free</h3>
          <p className="text-3xl text-[#E6E9EE] mb-4">$0</p>
          <button 
            onClick={() => onTierChange('free')}
            className={`w-full py-2 rounded ${tier === 'free' ? 'bg-gray-600' : 'bg-[#0b3d84] hover:bg-[#0a3470]'} text-white transition-colors`}
          >
            {tier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        {/* Premium */}
        <div className="bg-[#12161A] border-2 border-[#0b3d84] rounded-lg p-6">
          <h3 className="text-xl text-[#E6E9EE] mb-2">Premium</h3>
          <p className="text-3xl text-[#E6E9EE] mb-4">$49<span className="text-sm text-[#98A2B3]">/mo</span></p>
          <button 
            onClick={() => onTierChange('premium')}
            className={`w-full py-2 rounded ${tier === 'premium' ? 'bg-gray-600' : 'bg-[#0b3d84] hover:bg-[#0a3470]'} text-white transition-colors`}
          >
            {tier === 'premium' ? 'Current Plan' : 'Upgrade'}
          </button>
        </div>

        {/* Platinum */}
        <div className="bg-[#12161A] border-2 border-purple-600 rounded-lg p-6">
          <h3 className="text-xl text-[#E6E9EE] mb-2">Platinum</h3>
          <p className="text-3xl text-[#E6E9EE] mb-4">$99<span className="text-sm text-[#98A2B3]">/mo</span></p>
          <button 
            onClick={() => onTierChange('platinum')}
            className={`w-full py-2 rounded ${tier === 'platinum' ? 'bg-gray-600' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white transition-colors`}
          >
            {tier === 'platinum' ? 'Current Plan' : 'Upgrade'}
          </button>
        </div>
      </div>
    </div>
  );
}
