import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const authHeader = req.headers.get("Authorization");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader! },
        },
      }
    );

    // Get user's medicines for context
    const { data: medicines } = await supabaseClient
      .from("medicines")
      .select("*")
      .eq("active", true);

    const medicineContext = medicines && medicines.length > 0
      ? `\n\nCurrent medicines:\n${medicines.map(m => 
          `- ${m.name} (${m.dosage}): ${m.frequency} at ${m.times.join(", ")}`
        ).join("\n")}`
      : "\n\nNo medicines currently scheduled.";

    const systemPrompt = `You are a warm, caring AI companion designed for elderly users. You provide comprehensive support including:

🔔 Medicine Management:
- Remind users about their medicines with warm, gentle voice alerts
- Help add new medicines to their schedule
- Track when medicines are taken
- Provide medication guidance

📅 Health & Appointments:
- Help schedule and remember doctor appointments
- Provide health tips and wellness guidance
- Answer health-related questions in simple terms

🆘 Safety & Emergency:
- Guide users on how to send SOS alerts to family
- Help with location sharing for safety
- Available 24/7 for emergency assistance
- Stay calm and clear during emergencies

💬 Companionship:
- Engage in warm, friendly conversation
- Provide emotional support and comfort
- Remember user preferences and past conversations
- Be patient, kind, and understanding

Your personality:
- Speak in simple, clear language
- Be extremely patient and kind
- Show genuine care and empathy
- Keep responses concise but warm
- Use encouraging and positive language

When users want to manage medicines, gently guide them to the medicines page: "I can help you with that! Let me guide you to your medicine page where you can see all your medicines and add new ones."

${medicineContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "I'm a bit overwhelmed right now. Please try again in a moment." 
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "Service temporarily unavailable. Please try again later." 
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get response from AI");
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Medicine chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "I couldn't understand that. Could you please say it again?" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
