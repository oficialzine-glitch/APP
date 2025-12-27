import React from 'react';

interface HaircutsPageProps {
  onBack: () => void;
}

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Blank page - content will be added later */}
      </div>
    </div>
  );
}
