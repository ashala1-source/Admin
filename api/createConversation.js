import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TAVUS_API_KEY = "fa999107b41342fa8bc5255cc8c9dfe6";
  const REPLICA_ID = "rf4703150052";
  const PERSONA_ID = "pa6975faa9dc";

  try {
    const response = await fetch("https://api.tavus.io/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY,
      },
      body: JSON.stringify({
        replica_id: REPLICA_ID,
        persona_id: PERSONA_ID,
      }),
    });

    const data = await response.json();

    if (response.ok && data.conversation_url) {
      return res.status(200).json({ conversation_url: data.conversation_url });
    } else {
      return res.status(500).json({ error: data.message || "Failed to create conversation." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
