module.exports = async function handler(req, res) {    // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, prompt } = req.body;

  if (!apiKey || !prompt) {
        return res.status(400).json({ error: 'Missing apiKey or prompt' });
  }

  try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                          'Content-Type': 'application/json',
                          'x-api-key': apiKey,
                          'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                          model: 'claude-haiku-4-5-20251001',
                          max_tokens: 2048,
                          messages: [
                            {
                                          role: 'user',
                                          content: prompt,
                            },
                                    ],
                }),
        });

      if (!response.ok) {
              const errorData = await response.json();
              return res.status(response.status).json({ error: errorData });
      }

      const data = await response.json();
        return res.status(200).json(data);
  } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: error.message });
  }
}
