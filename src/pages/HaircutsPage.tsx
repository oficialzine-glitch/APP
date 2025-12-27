import React from 'react';
import { ArrowLeft, Scissors } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HaircutsPageProps {
  onBack: () => void;
}

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4 animate-fade-in">
          <button
            onClick={onBack}
            className="p-3 bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/60 transition-all duration-300 mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors duration-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{t.haircuts}</h1>
            <p className="text-slate-400">AI-powered hairstyle recommendations</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 mb-8 animate-slide-up">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Haircut Recommendations</h2>
            <p className="text-slate-300 mb-6">
              Get personalized hairstyle suggestions based on your facial features and face shape.
            </p>
            <div className="text-slate-400 text-sm">
              This feature is coming soon! Stay tuned for AI-powered haircut recommendations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
