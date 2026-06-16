import { StreamClient } from '@stream-io/node-sdk';

export default async function handler(request: Request) {
  const apiKey = process.env.STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";
  const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
  const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

  if (request.method === 'POST') {
    try {
      const { callId, callType = "default", lesson, languageId } = await request.json();

      if (!apiKey || !apiSecret) {
        return new Response(JSON.stringify({ error: "Stream API Key or Secret not configured" }), { status: 500 });
      }

      if (!callId) {
        return new Response(JSON.stringify({ error: "callId is required" }), { status: 400 });
      }

      const client = new StreamClient(apiKey, apiSecret);
      const call = client.video.call(callType, callId);

      await call.getOrCreate({ data: { created_by_id: "teacher" } });

      await call.update({
        settings_override: {
          transcription: { mode: 'auto-on', closed_caption_mode: 'auto-on' }
        },
        custom: lesson ? {
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          language_id: languageId,
          goals: lesson.goals?.map((g: any) => g.description) || [],
          vocabulary: lesson.vocabList?.map((v: any) => ({ word: v.word, translation: v.translation })) || [],
          phrases: lesson.phrases?.map((p: any) => ({ text: p.text, translation: p.translation })) || [],
          teacher_prompt: lesson.aiPrompt?.systemPrompt || "",
          scenario: lesson.aiPrompt?.scenarioDescription || "",
          initial_message: lesson.aiPrompt?.initialMessage || "",
        } : {}
      });

      await client.upsertUsers([{ id: "teacher", name: "AI Teacher", role: "admin" }]);
      await call.updateCallMembers({ update_members: [{ user_id: "teacher", role: "admin" }] });

      const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_type: callType, language_id: languageId }),
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), { status: response.status, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const url = new URL(request.url);
      const callId = url.searchParams.get("callId");
      const sessionId = url.searchParams.get("sessionId");

      if (!callId || !sessionId) {
        return new Response(JSON.stringify({ error: "callId and sessionId are required" }), { status: 400 });
      }

      const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}`, {
        method: "DELETE",
      });

      return new Response(JSON.stringify({ success: response.ok }), { status: response.status });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
