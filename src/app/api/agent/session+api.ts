import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.STREAM_API_KEY || "";
const apiSecret = process.env.STREAM_API_SECRET || "";

export async function POST(request: Request) {
  try {
    const { callId, callType = "default", lesson, languageId } = await request.json();

    // Infer Agent Server URL: .env > localhost:8000 (standard for development)
    // We use localhost because the agent runs on the same machine as this API route.
    const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
    const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "Stream API Key or Secret not configured" }, { status: 500 });
    }

    if (!callId) {
        return Response.json({ error: "callId is required" }, { status: 400 });
    }

    const client = new StreamClient(apiKey, apiSecret);

    // 1. Pack lesson data into Stream call custom data and ensure permissions
    const call = client.video.call(callType, callId);

    // Get or Create the call to ensure it exists before triggering the agent
    await call.getOrCreate({
      data: {
        created_by_id: "teacher",
      }
    });

    // We update the call with custom data and also ensure the teacher has the right role
    await call.update({
      settings_override: {
        transcription: {
          mode: 'auto-on',
          closed_caption_mode: 'auto-on',
        }
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

    // 2. Ensure agent user exists and has permissions (admin role + goLive)
    // Upsert the teacher user with admin role
    await client.upsertUsers([
        { id: "teacher", name: "AI Teacher", role: "admin" }
    ]);

    // Also add the teacher as a member of the call with admin role
    await call.updateCallMembers({
        update_members: [
            { user_id: "teacher", role: "admin" }
        ]
    });

    // 3. Proxy to Vision Agent server
    console.log(`[Agent Proxy] Triggering session: ${cleanAgentUrl}/calls/${callId}/sessions`);
    const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        call_type: callType,
        language_id: languageId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Agent server error response:", errorData);
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error: any) {
    console.error("Error in agent session API:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const callId = url.searchParams.get("callId");
    const sessionId = url.searchParams.get("sessionId");

    if (!callId || !sessionId) {
      return Response.json({ error: "callId and sessionId are required" }, { status: 400 });
    }

    const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
    const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

    const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to stop agent session" }, { status: response.status });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error stopping agent session:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
