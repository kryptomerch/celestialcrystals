import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface BlogGenerationRequest {
  topic: string;
  crystalName?: string;
  keywords?: string[];
  tone?: 'professional' | 'casual' | 'spiritual' | 'educational';
  length?: 'short' | 'medium' | 'long';
}

export interface SocialMediaPostRequest {
  platform: 'instagram' | 'facebook' | 'twitter' | 'pinterest';
  topic: string;
  crystalName?: string;
  includeHashtags?: boolean;
  tone?: 'engaging' | 'informative' | 'inspirational';
}

export interface GeneratedBlog {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  metaDescription: string;
}

export interface GeneratedSocialPost {
  content: string;
  hashtags?: string[];
  platform: string;
}

export class GeminiAIService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Generate blog post about crystals
  static async generateBlogPost(request: BlogGenerationRequest): Promise<GeneratedBlog> {
    try {
      const prompt = this.createBlogPrompt(request);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseBlogResponse(text);
    } catch (error) {
      console.error('Error generating blog post:', error);
      throw new Error('Failed to generate blog post');
    }
  }

  // Generate social media post
  static async generateSocialMediaPost(request: SocialMediaPostRequest): Promise<GeneratedSocialPost> {
    try {
      const prompt = this.createSocialMediaPrompt(request);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseSocialMediaResponse(text, request.platform);
    } catch (error) {
      console.error('Error generating social media post:', error);
      throw new Error('Failed to generate social media post');
    }
  }

  // Generate product descriptions
  static async generateProductDescription(crystalName: string, properties: string[]): Promise<string> {
    try {
      const prompt = `
        Write a compelling product description for a ${crystalName} crystal bracelet for an e-commerce website.
        
        Crystal properties to highlight: ${properties.join(', ')}
        
        Requirements:
        - 150-200 words
        - Focus on healing properties and benefits
        - Include emotional and spiritual aspects
        - Mention quality and authenticity
        - Use engaging, mystical tone
        - Include care instructions
        
        Format as clean HTML with proper paragraphs.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating product description:', error);
      throw new Error('Failed to generate product description');
    }
  }

  // Create blog prompt
  private static createBlogPrompt(request: BlogGenerationRequest): string {
    const lengthGuide = {
      short: '800-1000 words',
      medium: '1200-1500 words',
      long: '1800-2200 words'
    };

    const toneGuide = {
      professional: 'professional and authoritative',
      casual: 'friendly and conversational',
      spiritual: 'mystical and spiritual',
      educational: 'informative and educational'
    };

    return `
      Write a comprehensive blog post about ${request.topic}${request.crystalName ? ` focusing on ${request.crystalName}` : ''}.
      
      Requirements:
      - Length: ${lengthGuide[request.length || 'medium']}
      - Tone: ${toneGuide[request.tone || 'spiritual']}
      - Target audience: People interested in crystals, healing, and spirituality
      - Include SEO-friendly content
      ${request.keywords ? `- Include these keywords naturally: ${request.keywords.join(', ')}` : ''}
      
      Structure:
      1. Engaging title (H1)
      2. Brief introduction/excerpt (2-3 sentences)
      3. Main content with subheadings (H2, H3)
      4. Practical tips or how-to section
      5. Conclusion with call-to-action
      6. 5-8 relevant tags
      7. Meta description (150-160 characters)
      
      Content should cover:
      - Crystal properties and benefits
      - Historical or cultural significance
      - How to use the crystal
      - Care and cleansing instructions
      - Personal experiences or testimonials style content
      
      Format the response as JSON with these fields:
      {
        "title": "Blog post title",
        "content": "Full blog content in HTML format",
        "excerpt": "Brief excerpt for preview",
        "tags": ["tag1", "tag2", "tag3"],
        "metaDescription": "SEO meta description"
      }
    `;
  }

  // Create social media prompt
  private static createSocialMediaPrompt(request: SocialMediaPostRequest): string {
    const platformGuides = {
      instagram: 'Instagram post (2200 characters max, visual-focused, use emojis)',
      facebook: 'Facebook post (engaging, can be longer, community-focused)',
      twitter: 'Twitter/X post (280 characters max, concise and impactful)',
      pinterest: 'Pinterest description (500 characters max, keyword-rich, actionable)'
    };

    return `
      Create a ${platformGuides[request.platform]} about ${request.topic}${request.crystalName ? ` featuring ${request.crystalName}` : ''}.
      
      Requirements:
      - Platform: ${request.platform}
      - Tone: ${request.tone || 'engaging'}
      - Include crystal healing benefits
      - Make it shareable and engaging
      - Target audience: Crystal enthusiasts, spiritual seekers
      ${request.includeHashtags ? '- Include relevant hashtags' : ''}
      
      Content should:
      - Hook the reader immediately
      - Provide value or inspiration
      - Include a subtle call-to-action
      - Use appropriate emojis for the platform
      - Be authentic and relatable
      
      Format as JSON:
      {
        "content": "The main post content",
        "hashtags": ["hashtag1", "hashtag2"] // if requested
      }
    `;
  }

  // Parse blog response
  private static parseBlogResponse(text: string): GeneratedBlog {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(text);
      return {
        title: parsed.title || 'Generated Blog Post',
        content: parsed.content || text,
        excerpt: parsed.excerpt || text.substring(0, 200) + '...',
        tags: parsed.tags || ['crystals', 'healing', 'spirituality'],
        metaDescription: parsed.metaDescription || text.substring(0, 160) + '...'
      };
    } catch (error) {
      // Fallback if not JSON
      const lines = text.split('\n').filter(line => line.trim());
      return {
        title: lines[0] || 'Generated Blog Post',
        content: text,
        excerpt: text.substring(0, 200) + '...',
        tags: ['crystals', 'healing', 'spirituality'],
        metaDescription: text.substring(0, 160) + '...'
      };
    }
  }

  // Parse social media response
  private static parseSocialMediaResponse(text: string, platform: string): GeneratedSocialPost {
    try {
      const parsed = JSON.parse(text);
      return {
        content: parsed.content || text,
        hashtags: parsed.hashtags || [],
        platform
      };
    } catch (error) {
      // Fallback if not JSON
      return {
        content: text,
        hashtags: [],
        platform
      };
    }
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Say "Hello from Gemini AI!"');
      const response = await result.response;
      const text = response.text();
      return text.includes('Hello');
    } catch (error) {
      console.error('Gemini AI connection test failed:', error);
      return false;
    }
  }
}

export default GeminiAIService;
