import { StreamClient } from '@stream-io/node-sdk';

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  const apiKey = process.env.STREAM_API_KEY || "";
  const apiSecret = process.env.STREAM_API_SECRET || "";

  try {
    if (!apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: "Stream API Key or Secret not configured on server" }),
        { status: 500 }
      );
    }

    const { userId, name, image, callId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
    }

    const client = new StreamClient(apiKey, apiSecret);

    // Upsert the user to ensure they have a name and image in Stream
    await client.upsertUsers([
        { id: userId, name: name || userId, image: image || "" },
    ]);

    // Generate token valid for 1 hour
    const token = client.generateUserToken({ user_id: userId, validity_in_seconds: 3600 });

    // If callId is provided, ensure the call is created
    if (callId) {
      const call = client.video.call("default", callId);
      await call.getOrCreate({
        data: {
          created_by_id: userId,
        },
      });
    }

    return new Response(JSON.stringify({ token, apiKey }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in Stream API route:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
