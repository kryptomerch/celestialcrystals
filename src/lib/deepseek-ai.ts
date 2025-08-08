interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
}

export class DeepSeekAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.together.xyz/v1/chat/completions';

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
  }

  private validateApiKey() {
    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }
  }

  async generateCrystalBlogPost(topic?: string): Promise<BlogPostData> {
    this.validateApiKey();
    const crystalTopics = [
      'Clear Quartz - The Master Healer',
      'Amethyst - Stone of Spiritual Wisdom',
      'Rose Quartz - The Love Stone',
      'Black Tourmaline - Ultimate Protection',
      'Citrine - Abundance and Manifestation',
      'Selenite - Divine Light and Cleansing',
      'Labradorite - Stone of Transformation',
      'Moonstone - Feminine Energy and Intuition',
      'Hematite - Grounding and Strength',
      'Green Aventurine - Heart Healing and Luck',
      'Fluorite - Mental Clarity and Focus',
      'Carnelian - Creativity and Courage',
      'Sodalite - Truth and Communication',
      'Tiger\'s Eye - Confidence and Protection',
      'Malachite - Transformation and Healing'
    ];

    const selectedTopic = topic || crystalTopics[Math.floor(Math.random() * crystalTopics.length)];

    const prompt = `Write a comprehensive, educational blog post about ${selectedTopic} for a crystal healing website. The post should be informative, engaging, and suitable for both beginners and experienced crystal enthusiasts.

Structure the post with:
1. An engaging introduction
2. The crystal's properties and characteristics
3. Healing benefits (physical, emotional, spiritual)
4. How to use the crystal (practical applications)
5. Chakra connections if applicable
6. Care and cleansing instructions
7. A meaningful conclusion

Make it approximately 1000-1500 words, written in a warm, knowledgeable tone. Include specific details about the crystal's formation, color, and metaphysical properties. Avoid making medical claims but focus on traditional uses and spiritual beliefs.

Format the response as JSON with the following structure:
{
  "title": "Engaging blog post title",
  "content": "Full blog post content with markdown formatting",
  "excerpt": "Brief 2-3 sentence summary for preview",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: 'You are an expert crystal healer and spiritual teacher with deep knowledge of gemstones, their properties, and their uses in healing and spiritual practice. Write educational, informative content that is both scientifically grounded and spiritually meaningful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('DeepSeek API Error:', response.status, errorData);
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      try {
        const parsedContent = JSON.parse(content);

        // Validate the response structure
        if (!parsedContent.title || !parsedContent.content || !parsedContent.excerpt || !parsedContent.tags) {
          throw new Error('Invalid response structure from DeepSeek API');
        }

        return {
          title: parsedContent.title,
          content: parsedContent.content,
          excerpt: parsedContent.excerpt,
          tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : []
        };
      } catch (parseError) {
        console.error('Error parsing DeepSeek response:', parseError);
        console.error('Raw content:', content);

        // Fallback: try to extract content manually
        return this.fallbackContentExtraction(content, selectedTopic);
      }

    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw new Error('Failed to generate content with DeepSeek AI');
    }
  }

  private fallbackContentExtraction(content: string, topic: string): BlogPostData {
    // If JSON parsing fails, create a structured response
    const lines = content.split('\n').filter(line => line.trim());

    return {
      title: `${topic}: A Complete Guide to This Powerful Crystal`,
      content: content.replace(/```json|```/g, '').trim(),
      excerpt: `Discover the amazing properties and healing benefits of ${topic.split(' - ')[0]}, including how to use it for spiritual growth and wellness.`,
      tags: [
        topic.split(' - ')[0].toLowerCase().replace(/'/g, '').replace(/\s+/g, '-'),
        'crystal-healing',
        'spiritual-growth',
        'energy-healing',
        'gemstone-guide'
      ]
    };
  }

  async generateCustomContent(prompt: string, type: 'blog' | 'guide' | 'meditation' = 'blog'): Promise<BlogPostData> {
    this.validateApiKey();
    const systemPrompts = {
      blog: `You are a world-renowned crystal healing expert and spiritual teacher with 20+ years of experience. You write for North American crystal enthusiasts who are seeking authentic, practical guidance.

WRITING STYLE:
- Expert yet accessible tone
- Include specific, actionable advice
- Reference real crystal properties and uses
- Include practical meditation techniques
- Mention crystal bracelets and jewelry naturally
- Use scientific backing where appropriate
- Write 1500-2200 words of comprehensive content
- Include proper HTML formatting with headings
- Add specific crystal recommendations with reasons
- Include seasonal and astrological connections when relevant

CONTENT REQUIREMENTS:
- Start with an engaging introduction that hooks the reader
- Provide detailed, practical information
- Include step-by-step instructions where applicable
- Add personal insights and professional tips
- Include care and maintenance instructions
- End with actionable next steps
- Naturally incorporate keywords: crystal healing, crystal bracelets, spiritual wellness, meditation, chakra healing`,

      guide: `You are a master crystal healing practitioner and teacher. Create comprehensive, authoritative guides that serve as definitive resources for crystal enthusiasts in North America.

GUIDE REQUIREMENTS:
- 1800-2500 words of expert-level content
- Include historical and cultural context
- Provide detailed step-by-step instructions
- Add troubleshooting and common mistakes sections
- Include advanced techniques for experienced practitioners
- Reference specific crystal types and their unique properties
- Include seasonal and lunar considerations
- Add meditation and ritual practices
- Provide care and maintenance instructions
- Include shopping and authenticity guidance`,

      meditation: `You are a certified meditation teacher and crystal healing master. Create transformative meditation guides that combine ancient wisdom with modern crystal healing practices.

MEDITATION GUIDE REQUIREMENTS:
- Include detailed preparation instructions
- Provide step-by-step meditation techniques
- Specify crystal placement and handling
- Include breathing techniques and visualizations
- Add grounding and closing practices
- Provide variations for different experience levels
- Include timing and frequency recommendations
- Add troubleshooting for common challenges
- Include integration practices for daily life`
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: systemPrompts[type]
            },
            {
              role: 'user',
              content: `${prompt}\n\nFormat the response as JSON with: {"title": "...", "content": "...", "excerpt": "...", "tags": [...]}`
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      const parsedContent = JSON.parse(content);

      return {
        title: parsedContent.title || 'Generated Content',
        content: parsedContent.content || content,
        excerpt: parsedContent.excerpt || 'AI-generated content for your crystal website.',
        tags: Array.isArray(parsedContent.tags) ? parsedContent.tags : ['ai-generated', 'crystal-healing']
      };

    } catch (error) {
      console.error('Error generating custom content:', error);
      throw new Error('Failed to generate custom content');
    }
  }

  // Add simple chat method for direct responses
  async generateSimpleResponse(prompt: string): Promise<string> {
    this.validateApiKey();

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'system',
              content: 'You are an expert crystal healer and spiritual guide. Provide helpful, informative responses about crystals, healing, and spiritual practices. Keep responses conversational and helpful.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API Error:', response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const data: DeepSeekResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI API');
      }

      return content;

    } catch (error) {
      console.error('Error generating simple response:', error);
      throw new Error('Failed to generate response');
    }
  }
}

// Lazy initialization to avoid build-time errors
let deepseekAIInstance: DeepSeekAI | null = null;

export const deepseekAI = {
  generateCrystalBlogPost: (topic?: string) => {
    if (!deepseekAIInstance) {
      deepseekAIInstance = new DeepSeekAI();
    }
    return deepseekAIInstance.generateCrystalBlogPost(topic);
  },
  generateCustomContent: (prompt: string, type: 'blog' | 'guide' | 'meditation' = 'blog') => {
    if (!deepseekAIInstance) {
      deepseekAIInstance = new DeepSeekAI();
    }
    return deepseekAIInstance.generateCustomContent(prompt, type);
  },
  generateSimpleResponse: (prompt: string) => {
    if (!deepseekAIInstance) {
      deepseekAIInstance = new DeepSeekAI();
    }
    return deepseekAIInstance.generateSimpleResponse(prompt);
  }
};
