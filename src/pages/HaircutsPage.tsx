import React, { useState, useEffect } from 'react';
import {
  Search, Sparkles, Dumbbell, Heart,
  Brain, Palette, Camera, Zap, MessageCircle, ScanFace,
  Clock, Trash2
} from 'lucide-react';
import { getHistory, AnalysisRow } from '../lib/history';
import { useAuth } from '../contexts/AuthContext';
import {
  getChatSessions,
  getChatSessionByAnalysis,
  createChatSession,
  deleteChatSession,
  ChatSession,
} from '../lib/chatSessions';

interface HaircutsPageProps {
  onBack: () => void;
}

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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingAnalyses(true);
    getHistory({ userId: user.id, limit: 10 }).then(({ ok, data }) => {
      if (ok && data) setAnalyses(data);
    }).finally(() => setLoadingAnalyses(false));

    setLoadingSessions(true);
    getChatSessions(user.id).then(({ ok, data }) => {
      if (ok) setChatSessions(data);
    }).finally(() => setLoadingSessions(false));
  }, [user]);

  const handleSelectAnalysis = (row: AnalysisRow) => {
    setSelectedAnalysis(prev => prev?.id === row.id ? null : row);
  };

  const selectedScore = selectedAnalysis
    ? (selectedAnalysis.overall_score ?? selectedAnalysis.analysis?.overall ?? 0)
    : null;

  const analysisHasChat = (analysisId: string) =>
    chatSessions.some(s => s.analysis_id === analysisId);

  const handleStartChat = async () => {
    if (!user || !selectedAnalysis) return;
    setStartingChat(true);
    try {
      const existing = await getChatSessionByAnalysis(user.id, selectedAnalysis.id);
      if (existing.ok && existing.data) {
        // session already exists — open it
        // TODO: navigate to chat view with existing.data.id
        console.log('Resuming chat session:', existing.data.id);
        return;
      }
      const score = selectedAnalysis.overall_score ?? selectedAnalysis.analysis?.overall ?? 0;
      const result = await createChatSession({
        userId: user.id,
        analysisId: selectedAnalysis.id,
        analysisScore: score,
      });
      if (result.ok && result.data) {
        setChatSessions(prev => [result.data!, ...prev]);
        // TODO: navigate to chat view with result.data.id
        console.log('Created chat session:', result.data.id);
      }
    } finally {
      setStartingChat(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    const { ok } = await deleteChatSession(sessionId);
    if (ok) {
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    }
    setDeletingId(null);
  };

  const sessionForSelected = selectedAnalysis
    ? chatSessions.find(s => s.analysis_id === selectedAnalysis.id) ?? null
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
                  const hasChat = analysisHasChat(row.id);
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
                      <div className="w-full h-14 rounded-xl overflow-hidden mb-2 bg-slate-700/50 relative">
                        {row.image_url ? (
                          <img src={row.image_url} alt="analysis" className="w-full h-full object-cover" />
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
                        {hasChat && !isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-2.5 h-2.5 text-white" />
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
          <button
            onClick={handleStartChat}
            disabled={!selectedAnalysis || startingChat}
            className={`w-full relative overflow-hidden text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              selectedAnalysis
                ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95'
                : 'bg-slate-700/60 cursor-not-allowed opacity-60'
            }`}
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_60%_at_80%_50%,rgba(255,255,255,.16)_0%,transparent_55%)] opacity-70" />
            <MessageCircle className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {startingChat
                ? 'Opening chat…'
                : sessionForSelected
                  ? `Continue chat · Score ${selectedScore}`
                  : selectedAnalysis
                    ? `Start chat · Score ${selectedScore}`
                    : 'Select an analysis above'}
            </span>
          </button>
          {selectedAnalysis && (
            <p className="text-center text-slate-500 text-xs mt-2">
              {sessionForSelected
                ? 'Resuming your existing conversation for this analysis'
                : 'The AI will receive your full analysis as context'}
            </p>
          )}
        </div>

        {/* Chat history */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold text-base">Chat history</h3>
            </div>

            {loadingSessions ? (
              <div className="flex flex-col gap-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : chatSessions.length === 0 ? (
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl px-4 py-5 text-center">
                <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No chats yet — start one above!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {chatSessions.map(session => {
                  const analysis = analyses.find(a => a.id === session.analysis_id);
                  const messageCount = session.messages?.length ?? 0;
                  const isDeleting = deletingId === session.id;
                  return (
                    <button
                      key={session.id}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-cyan-500/40 hover:bg-slate-800/80 active:scale-[0.99] transition-all duration-200 group text-left"
                    >
                      {/* Avatar / thumbnail */}
                      <div className={`w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${getScoreBg(session.analysis_score)}`}>
                        {analysis?.image_url ? (
                          <img src={analysis.image_url} alt="analysis" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ScanFace className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${getScoreColor(session.analysis_score)}`}>
                            Score {session.analysis_score}
                          </span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-slate-400 text-xs">{formatDate(session.updated_at)}</span>
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5 truncate">
                          {messageCount === 0
                            ? 'No messages yet'
                            : `${messageCount} message${messageCount !== 1 ? 's' : ''}`}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        disabled={isDeleting}
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        {isDeleting
                          ? <div className="w-3 h-3 border border-slate-500 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer badge */}
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>Powered by GPT — personalized for your face analysis</span>
        </div>
      </div>
    </div>
  );
}
