import { CreditCard, Check } from 'lucide-react';

export function SubscriptionContent() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic profile',
        'Up to 10 graph nodes',
        'Community support',
        'Basic analytics',
      ],
      current: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Advanced profile',
        'Unlimited graph nodes',
        'Priority support',
        'Advanced analytics',
        'AI assistance',
        'Custom branding',
      ],
      current: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced security',
      ],
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h2 className="text-white mb-2">Subscription</h2>
        <p className="text-white/70">Manage your GraphLynk subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-500/80 to-cyan-500/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-blue-400/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white mb-1">Pro Plan</h3>
            <p className="text-blue-100">$19/month • Renews on Dec 1, 2024</p>
          </div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm text-white border border-white/30">Active</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl p-6 ${
              plan.current ? 'border-2 border-blue-400' : 'border border-white/20'
            }`}
          >
            {plan.current && (
              <span className="inline-block px-3 py-1 bg-blue-400/20 text-blue-300 rounded-full text-xs mb-4 border border-blue-400/30">
                Current Plan
              </span>
            )}
            <h3 className="text-white mb-2">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl text-white">{plan.price}</span>
              <span className="text-white/70 ml-2">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-xl transition-all ${
                plan.current
                  ? 'backdrop-blur-xl bg-white/10 text-white/60 cursor-default border border-white/20'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/50'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Billing Info */}
      <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
        <h3 className="text-white mb-6">Payment Method</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 backdrop-blur-xl bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
            <CreditCard className="w-6 h-6 text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-white">•••• •••• •••• 4242</p>
            <p className="text-sm text-white/70">Expires 12/2025</p>
          </div>
          <button className="text-blue-300 hover:text-blue-200">Edit</button>
        </div>
      </div>
    </div>
  );
}
