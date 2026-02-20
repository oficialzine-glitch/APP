import React, { useState, useEffect } from 'react';
import {
  Search, ChevronRight, Sparkles, Dumbbell, Heart,
  Brain, Palette, Camera, Zap, MessageCircle, ScanFace,
  Clock, Star, X
} from 'lucide-react';
import { getHistory, AnalysisRow } from '../lib/history';
import { useAuth } from '../contexts/AuthContext';

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

const staticTopics: Topic[] = [
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${Math.floor(diffH)}h ago`;
  const diffD = diffH / 24;
  if (diffD < 2) return 'Yesterday';
  if (diffD < 7) return `${Math.floor(diffD)}d ago`;
  return d.toLocaleDateString();
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-blue-300';
  if (score >= 60) return 'text-cyan-400';
  if (score >= 40) return 'text-sky-400';
  return 'text-blue-400';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'from-blue-400 to-cyan-400';
  if (score >= 60) return 'from-cyan-400 to-blue-500';
  if (score >= 40) return 'from-sky-400 to-blue-500';
  return 'from-blue-500 to-sky-600';
}

export default function HaircutsPage({ onBack }: HaircutsPageProps) {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRow | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingAnalyses(true);
    getHistory({ userId: user.id, limit: 10 }).then(({ ok, data }) => {
      if (ok && data) setAnalyses(data);
    }).finally(() => setLoadingAnalyses(false));
  }, [user]);

  const filteredTopics = staticTopics.filter(
    t =>
      search.trim() === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectAnalysis = (row: AnalysisRow) => {
    setSelectedAnalysis(prev => prev?.id === row.id ? null : row);
  };

  const selectedScore = selectedAnalysis
    ? (selectedAnalysis.overall_score ?? selectedAnalysis.analysis?.overall ?? 0)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black pb-24">
      {/* Ambient header glow */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-2">
        {/* Hero text */}
        <div className="mb-6 mt-2">
          <h2 className="text-3xl font-bold text-white leading-tight mb-1">Ask, explore,</h2>
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

        {/* Previous analyses as context selectors */}
        {user && (
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <ScanFace className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-base">Ask about an analysis</h3>
            </div>

            {loadingAnalyses ? (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-shrink-0 w-32 h-28 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : analyses.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl px-4 py-5 text-center">
                <ScanFace className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No analyses yet — run your first scan!</p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {analyses.map(row => {
                  const score = row.overall_score ?? row.analysis?.overall ?? 0;
                  const date = formatDate(row.created_at);
                  const isSelected = selectedAnalysis?.id === row.id;
                  return (
                    <button
                      key={row.id}
                      onClick={() => handleSelectAnalysis(row)}
                      className={`flex-shrink-0 w-32 bg-slate-800/60 backdrop-blur-sm border rounded-2xl p-3 text-left transition-all duration-200 hover:scale-105 active:scale-95 group ${
                        isSelected
                          ? 'border-cyan-400/70 ring-1 ring-cyan-400/40 bg-cyan-950/40'
                          : 'border-slate-700/50 hover:border-cyan-500/40'
                      }`}
                    >
                      {/* Thumbnail or placeholder */}
                      <div className="w-full h-14 rounded-xl overflow-hidden mb-2 bg-slate-700/50 relative">
                        {row.image_url ? (
                          <img
                            src={row.image_url}
                            alt="analysis"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ScanFace className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <div className="w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`text-lg font-bold leading-none mb-0.5 ${getScoreColor(score)}`}>{score}</div>
                      <div className="text-slate-400 text-xs leading-tight">score</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-2.5 h-2.5 text-slate-600" />
                        <span className="text-slate-500 text-xs">{date}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Start chat CTA */}
        <div className="mb-8">
          <button className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_60%_at_80%_50%,rgba(255,255,255,.16)_0%,transparent_55%)] opacity-70" />
            <MessageCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {selectedAnalysis ? `Chat about score ${selectedScore}` : 'Start a new chat'}
            </span>
          </button>
          {selectedAnalysis && (
            <p className="text-center text-slate-500 text-xs mt-2">
              The AI will receive your full analysis as context
            </p>
          )}
        </div>

        {/* Footer badge */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>Powered by GPT — personalized for your face analysis</span>
        </div>
      </div>
    </div>
  );
}
