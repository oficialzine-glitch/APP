import React from 'react';

interface HaircutsPageProps {
  onBack: () => void;
}

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black" />
  );
}
