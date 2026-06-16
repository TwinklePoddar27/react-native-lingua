export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { callId, sessionId } = await request.json();
    const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
    const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

    if (!callId || !sessionId) {
      return new Response(JSON.stringify({ error: "callId and sessionId are required" }), { status: 400 });
    }

    const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}/interrupt`, {
      method: "POST",
    });

    return new Response(JSON.stringify({ success: response.ok }), { status: response.status });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
