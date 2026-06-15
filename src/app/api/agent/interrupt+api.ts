export async function POST(request: Request) {
  try {
    const { callId, sessionId } = await request.json();

    const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
    const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

    if (!callId || !sessionId) {
      return Response.json({ error: "callId and sessionId are required" }, { status: 400 });
    }

    // Proxy to Vision Agent server interrupt endpoint
    // Standard vision-agents server supports this endpoint
    console.log(`[Agent Proxy] Interrupting session: ${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}/interrupt`);
    const response = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}/interrupt`, {
      method: "POST",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn("Agent server interrupt failed:", errorData);
      return Response.json({ error: "Failed to interrupt agent" }, { status: response.status });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error interrupting agent:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
