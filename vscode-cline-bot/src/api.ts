const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface AIRequest {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens?: number;
  temperature?: number;
}

export async function callAI(request: AIRequest, apiKey: string): Promise<string> {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('AI API error: ' + response.status + ' ' + response.statusText);
  }

interface AIResponse {
  choices: { message: { content: string } }[];
}

  const data = await response.json() as AIResponse;
  return data.choices[0].message.content;
}
