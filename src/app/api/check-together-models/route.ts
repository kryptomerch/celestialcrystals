import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'DEEPSEEK_API_KEY not found in environment variables',
      instructions: 'Add DEEPSEEK_API_KEY=your_together_ai_key to your .env.local file'
    });
  }

  try {
    // Check what models are available on Together AI
    const modelsResponse = await fetch('https://api.together.xyz/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      return NextResponse.json({
        success: false,
        error: `Failed to fetch models: ${modelsResponse.status}`,
        details: errorText,
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
      });
    }

    const modelsData = await modelsResponse.json();
    
    // Filter for DeepSeek models
    const deepseekModels = modelsData.filter((model: any) => 
      model.id && model.id.toLowerCase().includes('deepseek')
    );

    // Filter for chat/instruct models
    const chatModels = modelsData.filter((model: any) => 
      model.id && (
        model.id.toLowerCase().includes('chat') ||
        model.id.toLowerCase().includes('instruct') ||
        model.id.toLowerCase().includes('deepseek')
      )
    );

    // Get all available model IDs
    const allModelIds = modelsData.map((model: any) => model.id);
    const deepseekModelIds = deepseekModels.map((model: any) => model.id);
    const chatModelIds = chatModels.map((model: any) => model.id);

    // Try to find the best working model
    const possibleModels = [
      'deepseek-ai/deepseek-chat',
      'deepseek-ai/deepseek-coder-33b-instruct',
      'deepseek-ai/deepseek-llm-67b-chat',
      'deepseek-ai/deepseek-coder-6.7b-instruct',
      'deepseek-ai/deepseek-coder-1.3b-instruct',
      'meta-llama/Llama-2-7b-chat-hf',
      'meta-llama/Llama-2-13b-chat-hf',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO'
    ];

    const workingModel = possibleModels.find(model => allModelIds.includes(model));

    return NextResponse.json({
      success: true,
      message: 'Model check complete',
      data: {
        totalModels: modelsData.length,
        deepseekModels: deepseekModelIds,
        chatModels: chatModelIds.slice(0, 20), // First 20 chat models
        recommendedModel: workingModel,
        possibleModels: possibleModels.filter(model => allModelIds.includes(model)),
        sampleModels: allModelIds.slice(0, 30) // First 30 models
      },
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check Together AI models',
      details: error instanceof Error ? error.message : 'Unknown error',
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
    });
  }
}

export async function POST(request: NextRequest) {
  const { model } = await request.json();
  
  if (!model) {
    return NextResponse.json({
      success: false,
      error: 'Model name is required'
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'DEEPSEEK_API_KEY not configured'
    });
  }

  try {
    // Test the specific model
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant specializing in crystal healing and spiritual wellness.'
          },
          {
            role: 'user',
            content: 'Hello! Can you tell me about crystal healing?'
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Model test failed: ${response.status}`,
        details: errorText,
        model: model
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: `Model ${model} is working!`,
      response: data.choices[0]?.message?.content || 'No content received',
      model: model
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test model',
      details: error instanceof Error ? error.message : 'Unknown error',
      model: model
    });
  }
}
