import { StreamClient } from '@stream-io/node-sdk';

export default async function handler(req: any, res: any) {
  const apiKey = process.env.STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";
  const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
  const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Agent Session API is Online' });
  }

  if (req.method === 'POST') {
    try {
      const { callId, callType = "default", lesson, languageId } = req.body;

      if (!apiKey || !apiSecret) {
        return res.status(500).json({ error: "Stream API Key or Secret not configured" });
      }

      if (!callId) {
        return res.status(400).json({ error: "callId is required" });
      }

      const client = new StreamClient(apiKey, apiSecret);
      const call = client.video.call(callType, callId);

      await call.getOrCreate({ data: { created_by_id: "teacher" } });

      await call.update({
        settings_override: { transcription: { mode: 'auto-on', closed_caption_mode: 'auto-on' } },
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

      const agentResponse = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_type: callType, language_id: languageId }),
      });

      const data = await agentResponse.json();
      return res.status(agentResponse.status).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { callId, sessionId } = req.query;
      if (!callId || !sessionId) {
        return res.status(400).json({ error: "callId and sessionId are required" });
      }
      const agentResponse = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}`, { method: "DELETE" });
      return res.status(agentResponse.status).json({ success: agentResponse.ok });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
