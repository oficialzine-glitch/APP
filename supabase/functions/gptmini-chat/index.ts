import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { analysisId, message } = await req.json();

    if (!analysisId || !message) {
      return new Response(JSON.stringify({ error: "Missing analysisId or message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiKey = Deno.env.get("OPENAI_API_KEY")!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const authHeader = req.headers.get("Authorization");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader ?? "" } },
    });

    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: analysis } = await adminClient
      .from("facial_analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!analysis) {
      return new Response(JSON.stringify({ error: "Analysis not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: previousMessages } = await adminClient
      .from("chat_messages")
      .select("role, content")
      .eq("analysis_id", analysisId)
      .order("created_at", { ascending: true })
      .limit(20);

    const analysisItems: Array<{ score: number; category: string; feedback: string }> =
      Array.isArray(analysis.analysis) ? analysis.analysis : [];

    const scoresText = analysisItems.length > 0
      ? analysisItems.map(item => `${item.category}: ${item.score}/10`).join("\n")
      : "No individual scores available";

    const overallScore = analysis.overall_score ?? "N/A";

    const systemPrompt = `You are NextFace AI, an expert facial aesthetics consultant. You are analyzing a face with the following scores (out of 10):

Overall Score: ${overallScore}/10
${scoresText}

Provide personalized, specific, and actionable advice about the user's facial aesthetics. Be warm, encouraging, and professional. Keep responses concise (2-4 sentences). Focus on practical improvements and honest assessment.`;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...(previousMessages ?? []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: chatMessages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text().catch(() => "");
      throw new Error(`OpenAI error: ${openaiRes.status} ${errText}`);
    }

    const openaiData = await openaiRes.json();
    const assistantContent = openaiData.choices?.[0]?.message?.content ?? "";

    if (!assistantContent) {
      throw new Error("Empty response from OpenAI");
    }

    const { error: insertError } = await adminClient.from("chat_messages").insert({
      analysis_id: analysisId,
      user_id: user.id,
      role: "assistant",
      content: assistantContent,
    });

    if (insertError) {
      throw new Error(`Failed to save assistant message: ${insertError.message}`);
    }

    return new Response(JSON.stringify({ content: assistantContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
