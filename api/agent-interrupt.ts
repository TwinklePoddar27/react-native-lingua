export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Interrupt API is Online' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { callId, sessionId } = req.body;
    const agentServerUrl = process.env.AGENT_SERVER_URL || "http://localhost:8000";
    const cleanAgentUrl = agentServerUrl.replace(/\/$/, "");

    if (!callId || !sessionId) {
      return res.status(400).json({ error: "callId and sessionId are required" });
    }

    const agentResponse = await fetch(`${cleanAgentUrl}/calls/${callId}/sessions/${sessionId}/interrupt`, {
      method: "POST",
    });

    return res.status(agentResponse.status).json({ success: agentResponse.ok });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
