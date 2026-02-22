import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, Copy, ThumbsUp, Volume2, MoreVertical, Plus, RefreshCw, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { saveChatMessage } from '../lib/chat';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatPageProps {
  onBack: () => void;
  analysisId: string;
  analysisScore?: number;
}

const SUGGESTIONS = [
  'How can I improve my results?',
  'What are my strongest features?',
];

export default function ChatPage({ onBack, analysisId, analysisScore }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? inputValue).trim();
    if (!content || sending) return;
    setInputValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    if (user && analysisId) {
      saveChatMessage(user.id, analysisId, 'user', content);
    }

    setTimeout(() => {
      const aiResponse = 'This is a placeholder response. AI integration coming soon!';
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setSending(false);

      if (user && analysisId) {
        saveChatMessage(user.id, analysisId, 'assistant', aiResponse);
      }
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#111111]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2 C20 2 21.8 11.5 26 16 C30.2 20.5 38 20 38 20 C38 20 30.2 19.5 26 24 C21.8 28.5 20 38 20 38 C20 38 18.2 28.5 14 24 C9.8 19.5 2 20 2 20 C2 20 9.8 20.5 14 16 C18.2 11.5 20 2 20 2Z" fill="white" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">NextFace AI</p>
                <p className="text-xs text-slate-400 leading-tight">
                  {analysisScore ? `Score ${analysisScore} Analysis` : 'Face Analysis Chat'}
                </p>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 pt-8">
              <div className="relative w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center shadow-2xl shadow-cyan-500/20 border border-white/8">
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2 C20 2 21.8 11.5 26 16 C30.2 20.5 38 20 38 20 C38 20 30.2 19.5 26 24 C21.8 28.5 20 38 20 38 C20 38 18.2 28.5 14 24 C9.8 19.5 2 20 2 20 C2 20 9.8 20.5 14 16 C18.2 11.5 20 2 20 2Z" fill="url(#sparkGrad)" />
                </svg>
                <div className="absolute inset-0 rounded-full blur-xl bg-cyan-400/15 -z-10" />
              </div>
              <div className="text-center px-4">
                <h2 className="text-2xl font-bold text-white mb-2">Ask About Your Analysis</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Get personalized insights, ask questions about your score, and receive expert advice on improving your facial aesthetics.
                </p>
              </div>
              <div className="w-full flex flex-row gap-3 mt-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="flex-1 px-4 py-5 bg-gradient-to-b from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 rounded-2xl text-center text-sm text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-900/40 active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mb-6">
                      <span className="text-white text-[10px] font-bold">AI</span>
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[78%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 rounded-br-md'
                          : 'bg-[#1c1c1e] text-white border border-white/6 rounded-bl-md'
                      }`}
                    >
                      {message.content}
                    </div>

                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 mt-2 ml-1">
                        <button className="p-1.5 hover:bg-white/8 rounded-lg transition-colors group">
                          <Copy className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                        </button>
                        <button className="p-1.5 hover:bg-white/8 rounded-lg transition-colors group">
                          <ThumbsUp className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                        </button>
                        <button className="p-1.5 hover:bg-white/8 rounded-lg transition-colors group">
                          <Volume2 className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                        </button>
                        <button className="p-1.5 hover:bg-white/8 rounded-lg transition-colors group">
                          <RefreshCw className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                        </button>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border border-white/10 flex items-center justify-center flex-shrink-0 mb-1">
                      <span className="text-white text-xs font-semibold">{userInitial}</span>
                    </div>
                  )}
                </div>
              ))}

              {sending && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                    <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                  </div>
                  <div className="bg-[#1c1c1e] border border-white/6 rounded-3xl rounded-bl-md px-5 py-4">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="px-4 pt-3 pb-5 bg-[#0d0d0d] border-t border-white/5">
          <div className="flex items-end gap-2">
            <button className="p-2.5 rounded-full hover:bg-white/8 transition-colors flex-shrink-0 mb-1">
              <Plus className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex-1 bg-[#1c1c1e] border border-white/8 rounded-3xl px-4 py-3 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Send message..."
                disabled={sending}
                rows={1}
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none resize-none disabled:opacity-50 leading-relaxed"
                style={{ maxHeight: '120px' }}
              />
            </div>

            <button className="p-2.5 rounded-full hover:bg-white/8 transition-colors flex-shrink-0 mb-1">
              <Mic className="w-5 h-5 text-slate-400" />
            </button>

            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || sending}
              className="p-2.5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0 mb-1"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center justify-center mt-3 gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          </div>
        </div>

      </div>
    </div>
  );
}
