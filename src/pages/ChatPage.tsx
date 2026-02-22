import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Loader2, Copy, ThumbsUp, Volume2, MoreVertical, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

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

export default function ChatPage({ onBack, analysisId, analysisScore }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sending) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response (placeholder)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. AI integration coming soon!',
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner message="Loading chat..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">N</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">NextFace AI</h1>
                <p className="text-xs text-gray-400">
                  {analysisScore ? `Score ${analysisScore} Analysis` : 'Face Analysis Chat'}
                </p>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                  <Send className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Ask About Your Analysis</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Get personalized insights, ask questions about your score, and receive expert advice on improving your facial aesthetics.
                </p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-2xl text-left text-sm text-gray-300 transition-all">
                    What does my score mean?
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-2xl text-left text-sm text-gray-300 transition-all">
                    How can I improve my results?
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-2xl text-left text-sm text-gray-300 transition-all">
                    Tell me about my facial features
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[85%]">
                    <div
                      className={`rounded-3xl px-5 py-3.5 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/20'
                          : 'bg-[#1a1a1a] text-white border border-gray-800'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-2 ml-2">
                        <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                          <ThumbsUp className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center ml-auto mr-2 mt-2">
                        <span className="text-white text-xs">👤</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl px-5 py-3.5">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a0a] border-t border-gray-800">
          <div className="flex items-end space-x-2">
            <button className="p-2.5 hover:bg-gray-800 rounded-full transition-colors mb-1">
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Send message..."
                disabled={sending}
                rows={1}
                className="w-full px-5 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-3xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none disabled:opacity-50"
                style={{ maxHeight: '120px' }}
              />
            </div>
            <button className="p-2.5 hover:bg-gray-800 rounded-full transition-colors mb-1">
              <Volume2 className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sending}
              className="p-2.5 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 rounded-full transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-1 shadow-lg shadow-pink-500/20"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
