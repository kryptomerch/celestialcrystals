// AI Image Generation Service using Together AI
export interface ImageGenerationRequest {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    prompt: string;
    seed: number;
    steps: number;
  };
}

// Available models on Together AI (free tier)
export const AI_IMAGE_MODELS = {
  'flux-schnell': {
    name: 'Flux.1-schnell',
    id: 'black-forest-labs/FLUX.1-schnell-Free',
    description: 'Fast, high-quality images - Completely FREE',
    maxWidth: 1024,
    maxHeight: 1024,
    free: true,
    bestFor: 'Product photos, realistic images'
  },
  'sdxl': {
    name: 'Stable Diffusion XL',
    id: 'stabilityai/stable-diffusion-xl-base-1.0',
    description: 'Versatile, detailed images - FREE tier available',
    maxWidth: 1024,
    maxHeight: 1024,
    free: true,
    bestFor: 'Lifestyle images, marketing content'
  },
  'playground': {
    name: 'Playground v2.5',
    id: 'playgroundai/playground-v2.5-1024px-aesthetic',
    description: 'Artistic, aesthetic images - FREE tier',
    maxWidth: 1024,
    maxHeight: 1024,
    free: true,
    bestFor: 'Artistic arrangements, social media'
  }
};

// Crystal-specific prompt templates
export const CRYSTAL_PROMPTS = {
  product: {
    template: "Professional product photography of {crystalName} crystal bracelet, clean white background, studio lighting, high resolution, detailed texture, commercial photography style, 4K quality",
    examples: [
      "Professional product photography of Tiger Eye crystal bracelet, clean white background, studio lighting, high resolution, detailed texture, commercial photography style, 4K quality",
      "Professional product photography of Amethyst crystal bracelet, clean white background, studio lighting, high resolution, detailed texture, commercial photography style, 4K quality"
    ]
  },
  lifestyle: {
    template: "Lifestyle photo of person wearing {crystalName} crystal bracelet, natural lighting, modern minimalist setting, hands in focus, peaceful atmosphere, high quality photography",
    examples: [
      "Lifestyle photo of person wearing Rose Quartz crystal bracelet, natural lighting, modern minimalist setting, hands in focus, peaceful atmosphere, high quality photography",
      "Lifestyle photo of person wearing Clear Quartz crystal bracelet, natural lighting, modern minimalist setting, hands in focus, peaceful atmosphere, high quality photography"
    ]
  },
  artistic: {
    template: "Artistic arrangement of {crystalName} crystals and bracelet, mystical atmosphere, soft ethereal lighting, spiritual energy, beautiful composition, dreamy aesthetic",
    examples: [
      "Artistic arrangement of Moonstone crystals and bracelet, mystical atmosphere, soft ethereal lighting, spiritual energy, beautiful composition, dreamy aesthetic",
      "Artistic arrangement of Labradorite crystals and bracelet, mystical atmosphere, soft ethereal lighting, spiritual energy, beautiful composition, dreamy aesthetic"
    ]
  },
  social: {
    template: "Instagram-style flat lay of {crystalName} crystal bracelet with crystals, sage, candles, aesthetic arrangement, soft natural lighting, boho style, social media ready",
    examples: [
      "Instagram-style flat lay of Black Obsidian crystal bracelet with crystals, sage, candles, aesthetic arrangement, soft natural lighting, boho style, social media ready",
      "Instagram-style flat lay of Citrine crystal bracelet with crystals, sage, candles, aesthetic arrangement, soft natural lighting, boho style, social media ready"
    ]
  }
};

export class AIImageGenerator {
  private apiKey: string;
  private baseUrl = 'https://api.together.xyz/v1/images/generations';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.TOGETHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Together AI API key not found. Set TOGETHER_API_KEY environment variable.');
    }
  }

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'Together AI API key not configured'
      };
    }

    try {
      const model = request.model || 'black-forest-labs/FLUX.1-schnell-Free';
      const width = Math.min(request.width || 1024, 1024);
      const height = Math.min(request.height || 1024, 1024);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt: request.prompt,
          width,
          height,
          steps: request.steps || 4, // Flux.1-schnell works well with 4 steps
          n: 1,
          seed: request.seed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data[0] && data.data[0].url) {
        return {
          success: true,
          imageUrl: data.data[0].url,
          metadata: {
            model,
            prompt: request.prompt,
            seed: data.data[0].seed || request.seed || 0,
            steps: request.steps || 4
          }
        };
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('AI Image Generation Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Generate crystal bracelet product image
  async generateCrystalImage(
    crystalName: string, 
    style: keyof typeof CRYSTAL_PROMPTS = 'product',
    model: keyof typeof AI_IMAGE_MODELS = 'flux-schnell'
  ): Promise<ImageGenerationResponse> {
    const promptTemplate = CRYSTAL_PROMPTS[style];
    const prompt = promptTemplate.template.replace('{crystalName}', crystalName);
    const selectedModel = AI_IMAGE_MODELS[model];

    return this.generateImage({
      prompt,
      model: selectedModel.id,
      width: 1024,
      height: 1024,
      steps: model === 'flux-schnell' ? 4 : 20
    });
  }

  // Generate multiple variations
  async generateVariations(
    crystalName: string,
    count: number = 3
  ): Promise<ImageGenerationResponse[]> {
    const styles: (keyof typeof CRYSTAL_PROMPTS)[] = ['product', 'lifestyle', 'artistic'];
    const promises = styles.slice(0, count).map(style => 
      this.generateCrystalImage(crystalName, style)
    );

    return Promise.all(promises);
  }

  // Get available models
  getAvailableModels() {
    return AI_IMAGE_MODELS;
  }

  // Get prompt templates
  getPromptTemplates() {
    return CRYSTAL_PROMPTS;
  }
}

// Utility function to save generated image to your storage
export async function saveGeneratedImage(
  imageUrl: string, 
  filename: string,
  directory: string = '/images/ai-generated'
): Promise<string> {
  try {
    // Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to download image');
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // In a real implementation, you'd save to your storage service
    // For now, return the original URL
    console.log(`Would save image to: ${directory}/${filename}`);
    
    return imageUrl; // Return the Together AI URL for now
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

// Default instance
export const aiImageGenerator = new AIImageGenerator();
