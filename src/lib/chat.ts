import { supabase } from './supabase';

export async function saveChatMessage(
  userId: string,
  analysisId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    analysis_id: analysisId,
    role,
    content,
  });

  if (error) {
    console.error('Failed to save chat message:', error);
  }
}
