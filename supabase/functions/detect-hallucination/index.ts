import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function callAI(apiKey: string, messages: { role: string; content: string }[]) {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 429 || status === 402) {
      throw { status, message: status === 429 ? "Rate limit exceeded. Please try again later." : "Usage limit reached. Please add credits." };
    }
    const t = await response.text();
    console.error("AI gateway error:", status, t);
    throw { status: 500, message: `AI gateway error: ${status}` };
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, mode, llmResponse } = body;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw { status: 500, message: "LOVABLE_API_KEY is not configured" };

    if (mode === "generate") {
      const generatedText = await callAI(LOVABLE_API_KEY, [
        {
          role: "system",
          content: "You are a helpful AI assistant. Answer the user's question with detailed, factual information. If you're unsure about something, still provide your best answer.",
        },
        { role: "user", content: prompt },
      ]);

      return new Response(JSON.stringify({ response: generatedText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "analyze") {
      const analysisPrompt = `You are an expert AI hallucination detector. Analyze the following AI-generated response to the given prompt for potential hallucinations.

PROMPT: "${prompt}"

AI RESPONSE: "${llmResponse}"

Analyze the response and return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "overallScore": <number 0-100 where 0 = no hallucination, 100 = completely hallucinated>,
  "riskLevel": "<low|medium|high|critical>",
  "claims": [
    {
      "text": "<the specific claim from the response>",
      "status": "<verified|uncertain|likely_hallucinated|hallucinated>",
      "confidence": <number 0-100>,
      "reason": "<brief explanation>"
    }
  ],
  "summary": "<2-3 sentence overall assessment>",
  "strategies_used": ["<list of detection strategies applied>"]
}

Be thorough but fair. Not everything uncertain is hallucinated.`;

      const analysisText = await callAI(LOVABLE_API_KEY, [
        { role: "system", content: "You are a hallucination detection system. Always respond with valid JSON only, no markdown formatting." },
        { role: "user", content: analysisPrompt },
      ]);

      const cleaned = analysisText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

      try {
        const analysis = JSON.parse(cleaned);
        return new Response(JSON.stringify({ analysis }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Failed to parse analysis JSON:", cleaned);
        return new Response(JSON.stringify({
          analysis: {
            overallScore: 50,
            riskLevel: "medium",
            claims: [],
            summary: "Analysis completed but parsing failed. Raw: " + cleaned.slice(0, 500),
            strategies_used: ["self-consistency"],
          },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Invalid mode. Use 'generate' or 'analyze'." }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("detect-hallucination error:", e);
    const status = e?.status || 500;
    const message = e?.message || (e instanceof Error ? e.message : "Unknown error");
    return new Response(JSON.stringify({ error: message }), {
      status, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
