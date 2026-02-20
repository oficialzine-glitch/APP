import { supabase } from './supabaseClient';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type ChatSession = {
  id: string;
  user_id: string;
  analysis_id: string;
  analysis_score: number;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
};

export async function getChatSessions(userId: string): Promise<{ ok: boolean; data: ChatSession[] }> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('getChatSessions error:', error);
    return { ok: false, data: [] };
  }
  return { ok: true, data: data ?? [] };
}

export async function getChatSessionByAnalysis(
  userId: string,
  analysisId: string
): Promise<{ ok: boolean; data: ChatSession | null }> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('analysis_id', analysisId)
    .maybeSingle();

  if (error) {
    console.error('getChatSessionByAnalysis error:', error);
    return { ok: false, data: null };
  }
  return { ok: true, data };
}

export async function createChatSession(opts: {
  userId: string;
  analysisId: string;
  analysisScore: number;
}): Promise<{ ok: boolean; data: ChatSession | null }> {
  const { userId, analysisId, analysisScore } = opts;
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, analysis_id: analysisId, analysis_score: analysisScore, messages: [] }])
    .select()
    .maybeSingle();

  if (error) {
    console.error('createChatSession error:', error);
    return { ok: false, data: null };
  }
  return { ok: true, data };
}

export async function deleteChatSession(sessionId: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('deleteChatSession error:', error);
    return { ok: false };
  }
  return { ok: true };
}
