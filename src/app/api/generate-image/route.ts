import { NextRequest, NextResponse } from 'next/server';
import { AIImageGenerator, CRYSTAL_PROMPTS, AI_IMAGE_MODELS } from '@/lib/ai-image-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      crystalName, 
      style = 'product', 
      model = 'flux-schnell',
      customPrompt,
      width = 1024,
      height = 1024 
    } = body;

    if (!crystalName && !customPrompt) {
      return NextResponse.json(
        { success: false, error: 'Crystal name or custom prompt is required' },
        { status: 400 }
      );
    }

    const generator = new AIImageGenerator();

    let result;
    if (customPrompt) {
      // Use custom prompt
      result = await generator.generateImage({
        prompt: customPrompt,
        model: AI_IMAGE_MODELS[model as keyof typeof AI_IMAGE_MODELS]?.id,
        width,
        height
      });
    } else {
      // Use crystal template
      result = await generator.generateCrystalImage(crystalName, style, model);
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        metadata: result.metadata
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available models and templates
  return NextResponse.json({
    success: true,
    models: AI_IMAGE_MODELS,
    promptTemplates: CRYSTAL_PROMPTS
  });
}
