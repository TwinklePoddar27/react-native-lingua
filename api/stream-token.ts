import { StreamClient } from '@stream-io/node-sdk';

export default async function handler(req: any, res: any) {
  // Allow browser to check if server is alive
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Lingua API is Online', message: 'Send a POST request with userId to get a token.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";

  try {
    if (!apiKey || !apiSecret) {
      return res.status(500).json({ error: "Stream API Key or Secret not configured on server" });
    }

    const { userId, name, image, callId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const client = new StreamClient(apiKey, apiSecret);
    await client.upsertUsers([{ id: userId, name: name || userId, image: image || "" }]);
    const token = client.generateUserToken({ user_id: userId, validity_in_seconds: 3600 });

    if (callId) {
      const call = client.video.call("default", callId);
      await call.getOrCreate({ data: { created_by_id: userId } });
    }

    return res.status(200).json({ token, apiKey });
  } catch (error: any) {
    console.error("Error in Stream API route:", error);
    return res.status(500).json({ error: error.message });
  }
}
