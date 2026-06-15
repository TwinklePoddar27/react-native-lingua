import { StreamClient } from '@stream-io/node-sdk';

const apiKey = process.env.STREAM_API_KEY || "";
const apiSecret = process.env.STREAM_API_SECRET || "";
const AGENT_SERVER_URL = process.env.AGENT_SERVER_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const { callId, callType = "default", lesson, languageId } = await request.json();

    if (!apiKey || !apiSecret) {
      return Response.json({ error: "Stream API Key or Secret not configured" }, { status: 500 });
    }

    if (!callId) {
        return Response.json({ error: "callId is required" }, { status: 400 });
    }

    const client = new StreamClient(apiKey, apiSecret);

    // 1. Pack lesson data into Stream call custom data and ensure permissions
    const call = client.video.call(callType, callId);

    // We update the call with custom data and also ensure the teacher has the right role
    await call.update({
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
    console.log(`Proxying session request to agent server: ${AGENT_SERVER_URL}/calls/${callId}/sessions`);
    const response = await fetch(`${AGENT_SERVER_URL}/calls/${callId}/sessions`, {
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

    const response = await fetch(`${AGENT_SERVER_URL}/calls/${callId}/sessions/${sessionId}`, {
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
