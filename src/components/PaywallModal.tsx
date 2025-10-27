import React, { useState } from 'react';
import { X, Crown, Check } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanKey = 'yearly' | 'monthly' | 'weekly';

function PickPlanModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('yearly');

  if (!open) return null;

  const planClasses = (active: boolean) =>
    [
      'w-full text-left rounded-xl border p-4 transition',
      active
        ? 'border-cyan-400/60 bg-cyan-400/10'
        : 'border-slate-700/60 hover:border-slate-500/70 bg-slate-800/50',
    ].join(' ');

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop (click to close) */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-slate-700/60 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold">Choose Your Plan</h3>
          </div>
          <button
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            onClick={onClose}
            aria-label="Close plan modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3">
          {/* Yearly */}
          <button
            type="button"
            className={planClasses(selectedPlan === 'yearly')}
            onClick={() => setSelectedPlan('yearly')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Yearly</div>
                <div className="text-sm text-slate-400">
                  Best value • ~$0.40/week
                </div>
              </div>
              {selectedPlan === 'yearly' ? (
                <Check className="w-5 h-5 text-cyan-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-600" />
              )}
            </div>
          </button>

          {/* Monthly */}
          <button
            type="button"
            className={planClasses(selectedPlan === 'monthly')}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Monthly</div>
                <div className="text-sm text-slate-400">Standard</div>
              </div>
              {selectedPlan === 'monthly' ? (
                <Check className="w-5 h-5 text-cyan-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-600" />
              )}
            </div>
          </button>

          {/* Weekly */}
          <button
            type="button"
            className={planClasses(selectedPlan === 'weekly')}
            onClick={() => setSelectedPlan('weekly')}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Weekly</div>
                <div className="text-sm text-slate-400">Try it out</div>
              </div>
              {selectedPlan === 'weekly' ? (
                <Check className="w-5 h-5 text-cyan-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-600" />
              )}
            </div>
          </button>
        </div>

        {/* Footer (UI-only placeholders) */}
        <div className="px-5 pb-5 pt-2 space-y-3">
          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold py-3 rounded-xl hover:opacity-95 transition"
            // Placeholder only — no purchase logic wired
            onClick={() => {
              /* no-op */
            }}
          >
            Upgrade Now
          </button>

          <div className="text-center text-xs text-slate-400">
            Auto-renews. Cancel anytime.{' '}
            <span className="underline underline-offset-2 cursor-default opacity-80">
              Terms of Use
            </span>{' '}
            •{' '}
            <span className="underline underline-offset-2 cursor-default opacity-80">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [showPlanModal, setShowPlanModal] = useState(false);

  if (!isOpen) return null;

  const features = [
    { key: 'overall', label: 'Overall', score: 68, color: 'from-yellow-400 to-orange-500' },
    { key: 'potential', label: 'Potential', score: 91, color: 'from-emerald-400 to-emerald-500' },
    { key: 'jawline', label: 'Jawline', score: 56, color: 'from-orange-400 to-red-500' },
    { key: 'masculinity', label: 'Masculinity', score: 81, color: 'from-emerald-400 to-green-500' },
    { key: 'skin', label: 'Skin quality', score: 65, color: 'from-yellow-400 to-orange-500' },
    { key: 'cheekbones', label: 'Cheekbones', score: 76, color: 'from-yellow-400 to-green-500' }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'from-emerald-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-yellow-500';
    return 'from-orange-400 to-red-500';
  };

  const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
    return (
      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
        <div className="mb-2">
          <div className={`text-2xl font-bold ${getScoreColor(feature.score)} mb-1`}>
            {feature.score}
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full bg-gradient-to-r ${getProgressColor(feature.score)} transition-all duration-500`}
              style={{ width: `${feature.score}%` }}
            />
          </div>
        </div>
        <h3 className="text-white font-medium text-xs">{feature.label}</h3>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-950 to-black z-50 flex flex-col h-screen overflow-hidden">
      {/* Blue gradient overlay in top right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-bl from-cyan-400/15 via-blue-500/8 to-transparent rounded-full blur-2xl"></div>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white transition-colors z-20 bg-slate-800/60 rounded-full border border-slate-700/50"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content - Compact Layout */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 relative z-10 max-h-screen">
        {/* Header - Reduced spacing */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            UPGRADE NOW
          </h1>
          <p className="text-slate-400 text-base">
            Take the next step, looksmaxxing based on science.
          </p>
        </div>

        {/* Feature Cards Container - More compact */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <h2 className="text-xl font-bold text-white text-center mb-4">
              Get your ratings
            </h2>
            
            {/* 6 Feature Cards Grid - Restored original size */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Row 1 */}
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(68 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">68</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Overall</h3>
              </div>
              
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(91 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">91</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Potential</h3>
              </div>
              
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(56 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">56</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Jawline</h3>
              </div>
              
              {/* Row 2 */}
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(81 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">81</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Masculinity</h3>
              </div>
              
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(65 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">65</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Skin quality</h3>
              </div>
              
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#neonBlueGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(76 / 100) * 251} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">76</span>
                  </div>
                </div>
                <h3 className="text-white font-medium text-xs">Cheekbones</h3>
              </div>
              
              {/* SVG Gradient Definition */}
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="neonBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00FFFF" stopOpacity="1" />
                    <stop offset="25%" stopColor="#00E5FF" stopOpacity="1" />
                    <stop offset="50%" stopColor="#00B4FF" stopOpacity="1" />
                    <stop offset="75%" stopColor="#0080FF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0040FF" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Page indicators */}
            <div className="flex justify-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
            </div>

            {/* Stats */}
            <div className="text-center text-slate-400 text-sm">
              Powered by OpenAI
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Area - Fixed at bottom */}
      <div className="px-4 pb-6 relative z-10">
        {/* Pricing - Compact */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-white">$4.99</span>
            <span className="text-slate-400 text-sm">per week, auto-renews</span>
          </div>
        </div>

        {/* Unlock Button */}
        <button
          className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold py-3.5 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group mb-3"
          onClick={() => setShowPlanModal(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <span className="text-base font-medium mr-2">Upgrade to premium</span>
          <span className="text-lg"></span>
        </button>

        {/* Footer Links - placeholders */}
        <div className="flex justify-center space-x-6 text-slate-400 text-xs">
          <span className="hover:text-white transition-colors cursor-default">Terms of Use</span>
          <span className="hover:text-white transition-colors cursor-default">Restore Purchase</span>
          <span className="hover:text-white transition-colors cursor-default">Privacy Policy</span>
        </div>
      </div>

      {/* Pick Plan Modal (placeholder-only) */}
      <PickPlanModal open={showPlanModal} onClose={() => setShowPlanModal(false)} />
    </div>
  );
}
