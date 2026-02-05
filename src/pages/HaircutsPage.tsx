import React from 'react';

interface HaircutsPageProps {
  onBack: () => void;
}

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        <div className="mb-8 pt-4 animate-fade-in">
          <div className="relative inline-block w-full">
            <div className="rounded-xl overflow-hidden border-2 border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <img
                src="https://hebwatwkpszebonmrige.supabase.co/storage/v1/object/public/nextface%20images/Oval%20Face%20(4).png"
                alt="Haircut Guide"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Try on haircuts Button */}
        <div className="text-center mb-8">
          <div className="relative inline-block overflow-visible isolate">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-400/35 via-blue-500/28 to-blue-600/28 blur-2xl -z-10"
            />
            <button
              className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ring-1 ring-inset ring-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 overflow-visible"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl [background:radial-gradient(120%_60%_at_80%_50%,rgba(255,255,255,.16)_0%,transparent_55%)] opacity-70"
              />
              <span className="relative z-10">Try on haircuts</span>
            </button>
          </div>
        </div>

        {/* Content will be added later */}
      </div>
    </div>
  );
}
