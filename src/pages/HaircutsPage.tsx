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

        {/* Content will be added later */}
      </div>
    </div>
  );
}
