import React, { useState } from 'react';
import { Search, ChevronRight, Sparkles, Dumbbell, Heart, Brain, Palette, Camera, Star, Zap, MessageCircle } from 'lucide-react';

interface HaircutsPageProps {
  onBack: () => void;
}

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
}

interface HistoryItem {
  id: string;
  topic: string;
  preview: string;
  icon: React.ReactNode;
  iconGradient: string;
  time: string;
}

const topics: Topic[] = [
  {
    id: 'glow-tips',
    title: 'Glow tips',
    subtitle: 'Skincare & radiance',
    icon: <Sparkles className="w-6 h-6 text-white" />,
    gradient: 'from-cyan-500/30 to-blue-600/30',
    iconBg: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'fitness',
    title: 'Fitness advice',
    subtitle: 'Body & training',
    icon: <Dumbbell className="w-6 h-6 text-white" />,
    gradient: 'from-blue-500/30 to-cyan-400/30',
    iconBg: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'mental',
    title: 'Confidence boost',
    subtitle: 'Mindset & self-image',
    icon: <Brain className="w-6 h-6 text-white" />,
    gradient: 'from-sky-500/30 to-blue-400/30',
    iconBg: 'from-sky-400 to-blue-500',
  },
  {
    id: 'style',
    title: 'Style guide',
    subtitle: 'Fashion & aesthetics',
    icon: <Palette className="w-6 h-6 text-white" />,
    gradient: 'from-teal-500/30 to-cyan-500/30',
    iconBg: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'health',
    title: 'Wellness',
    subtitle: 'Habits & routines',
    icon: <Heart className="w-6 h-6 text-white" />,
    gradient: 'from-blue-400/30 to-sky-500/30',
    iconBg: 'from-blue-400 to-sky-400',
  },
  {
    id: 'photo',
    title: 'Photo tips',
    subtitle: 'Look your best',
    icon: <Camera className="w-6 h-6 text-white" />,
    gradient: 'from-cyan-400/30 to-blue-500/30',
    iconBg: 'from-cyan-500 to-blue-400',
  },
];

const historyItems: HistoryItem[] = [
  {
    id: '1',
    topic: 'Skincare routine',
    preview: 'Best morning routine for oily skin',
    icon: <Sparkles className="w-5 h-5 text-white" />,
    iconGradient: 'from-cyan-400 to-blue-500',
    time: '2h ago',
  },
  {
    id: '2',
    topic: 'Fitness advice',
    preview: 'How to build muscle while staying lean',
    icon: <Dumbbell className="w-5 h-5 text-white" />,
    iconGradient: 'from-blue-500 to-cyan-400',
    time: 'Yesterday',
  },
  {
    id: '3',
    topic: 'Style guide',
    preview: 'Outfits that complement sharp jawlines',
    icon: <Palette className="w-5 h-5 text-white" />,
    iconGradient: 'from-teal-400 to-cyan-500',
    time: '3d ago',
  },
  {
    id: '4',
    topic: 'Confidence boost',
    preview: 'Daily habits to improve self-confidence',
    icon: <Brain className="w-5 h-5 text-white" />,
    iconGradient: 'from-sky-400 to-blue-500',
    time: '1w ago',
  },
];

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  const [search, setSearch] = useState('');

  const filteredTopics = topics.filter(
    t =>
      search.trim() === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-24">
      {/* Ambient header glow */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-cyan-500/10 to-transparent" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-2">
        {/* Hero text */}
        <div className="mb-6 mt-2">
          <h2 className="text-3xl font-bold text-white leading-tight mb-1">
            Ask, explore,
          </h2>
          <h2 className="text-3xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              glow up.
            </span>
          </h2>
          <p className="text-slate-400 text-sm mt-2">Your AI beauty & lifestyle coach</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/70 backdrop-blur-sm border border-slate-700/60 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
          />
        </div>

        {/* Topic cards — horizontal scroll */}
        <div className="mb-8">
          <h3 className="text-white font-semibold text-base mb-3">Choose a topic</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {filteredTopics.map(topic => (
              <button
                key={topic.id}
                className={`flex-shrink-0 w-36 bg-gradient-to-br ${topic.gradient} backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 text-left hover:border-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-200 group`}
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${topic.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {topic.icon}
                </div>
                <div className="text-white font-semibold text-sm leading-tight mb-0.5">{topic.title}</div>
                <div className="text-slate-400 text-xs leading-tight">{topic.subtitle}</div>
                <div className="mt-3 flex items-center justify-end">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-cyan-400" viewBox="0 0 12 12" fill="none">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick start button */}
        <div className="mb-8">
          <button className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_60%_at_80%_50%,rgba(255,255,255,.16)_0%,transparent_55%)] opacity-70" />
            <MessageCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Start a new chat</span>
          </button>
        </div>

        {/* History section */}
        {historyItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-base">History</h3>
              <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">See all</button>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden divide-y divide-slate-700/40">
              {historyItems.map(item => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-700/30 active:bg-slate-700/50 transition-colors duration-150 text-left"
                >
                  <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${item.iconGradient} rounded-xl flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{item.topic}</div>
                    <div className="text-slate-400 text-xs truncate">{item.preview}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-slate-500 text-xs">{item.time}</span>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>Powered by GPT — personalized for your face analysis</span>
        </div>
      </div>
    </div>
  );
}
