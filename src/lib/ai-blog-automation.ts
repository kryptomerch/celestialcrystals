import { prisma } from './prisma'
import { crystalDatabase } from '@/data/crystals'

// AI Blog Automation Service
export class AIBlogAutomationService {

  // Blog post templates for different types
  private static blogTemplates = {
    crystalGuide: {
      title: "The Complete Guide to {crystal} Crystal: Healing Properties & Benefits",
      keywords: ["{crystal} crystal", "healing properties", "{crystal} benefits", "crystal healing", "spiritual stones"],
      sections: [
        "Introduction to {crystal}",
        "Healing Properties of {crystal}",
        "How to Use {crystal} for {benefit}",
        "Chakra Connection: {crystal} and the {chakra} Chakra",
        "Caring for Your {crystal} Crystal",
        "Where to Buy Authentic {crystal} Crystals"
      ]
    },

    chakraGuide: {
      title: "Best Crystals for {chakra} Chakra Healing: Complete Guide 2025",
      keywords: ["{chakra} chakra", "chakra healing", "chakra crystals", "spiritual healing", "energy healing"],
      sections: [
        "Understanding the {chakra} Chakra",
        "Signs of {chakra} Chakra Imbalance",
        "Top 5 Crystals for {chakra} Chakra Healing",
        "How to Use {chakra} Chakra Crystals",
        "Meditation Techniques with {chakra} Crystals",
        "Shop {chakra} Chakra Crystal Bracelets"
      ]
    },

    birthstoneGuide: {
      title: "{month} Birthstone Guide: Perfect Crystals for {zodiac} Season",
      keywords: ["{month} birthstone", "{zodiac} crystals", "birthstone jewelry", "zodiac healing", "astrological crystals"],
      sections: [
        "{month} Birthstone Overview",
        "Traditional vs Modern {month} Birthstones",
        "Healing Properties for {zodiac} Signs",
        "How to Choose Your Perfect {month} Crystal",
        "Styling {month} Birthstone Jewelry",
        "Shop {month} Birthstone Collection"
      ]
    },

    howToGuide: {
      title: "How to {action} with Crystals: Beginner's Guide to Crystal Healing",
      keywords: ["crystal healing", "how to use crystals", "{action} crystals", "crystal meditation", "spiritual healing"],
      sections: [
        "Getting Started with Crystal {action}",
        "Best Crystals for {action}",
        "Step-by-Step {action} Process",
        "Common Mistakes to Avoid",
        "Advanced {action} Techniques",
        "Recommended Crystal Sets for {action}"
      ]
    },

    seasonalGuide: {
      title: "{season} Crystal Rituals: Seasonal Healing & Energy Alignment",
      keywords: ["{season} crystals", "seasonal healing", "{season} rituals", "crystal energy", "seasonal wellness"],
      sections: [
        "Understanding {season} Energy",
        "Best Crystals for {season} Season",
        "{season} Crystal Cleansing Rituals",
        "Creating Your {season} Crystal Altar",
        "{season} Meditation Practices",
        "Shop {season} Crystal Collections"
      ]
    }
  }

  // Generate AI blog content using OpenAI/Claude
  static async generateBlogPost(template: string, variables: Record<string, string>): Promise<{
    title: string;
    content: string;
    excerpt: string;
    keywords: string[];
    metaDescription: string;
    slug: string;
  }> {
    const templateData = this.blogTemplates[template as keyof typeof this.blogTemplates];
    if (!templateData) {
      throw new Error(`Template ${template} not found`);
    }

    // Replace variables in template
    const title = this.replaceVariables(templateData.title, variables);
    const keywords = templateData.keywords.map(k => this.replaceVariables(k, variables));
    const sections = templateData.sections.map(s => this.replaceVariables(s, variables));

    // Generate content using AI (placeholder for now - integrate with OpenAI/Claude)
    const content = await this.generateAIContent(title, sections, variables);

    return {
      title,
      content,
      excerpt: this.generateExcerpt(content),
      keywords,
      metaDescription: this.generateMetaDescription(title, variables),
      slug: this.generateSlug(title)
    };
  }

  // Generate weekly crystal education posts
  static async generateWeeklyCrystalPost(): Promise<void> {
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    const crystal = crystalDatabase[weekNumber % crystalDatabase.length];

    const variables = {
      crystal: crystal.name,
      benefit: crystal.properties[0] || 'healing',
      chakra: crystal.chakra,
      color: crystal.colors[0] || 'natural'
    };

    const blogPost = await this.generateBlogPost('crystalGuide', variables);

    // Save to database
    await this.saveBlogPost({
      ...blogPost,
      category: 'Crystal Guides',
      featuredImage: crystal.image || '/blog/crystal-default.jpg',
      publishDate: new Date(),
      status: 'draft', // Save as draft for review
      author: 'CELESTIAL Team',
      tags: ['crystal healing', crystal.name.toLowerCase(), crystal.category.toLowerCase()]
    });

    console.log(`Generated weekly crystal post: ${blogPost.title}`);
  }

  // Generate monthly chakra guides
  static async generateMonthlyChakraPost(): Promise<void> {
    const chakras = ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'];
    const monthIndex = new Date().getMonth();
    const chakra = chakras[monthIndex % chakras.length];

    const variables = {
      chakra: chakra,
      color: this.getChakraColor(chakra),
      element: this.getChakraElement(chakra)
    };

    const blogPost = await this.generateBlogPost('chakraGuide', variables);

    await this.saveBlogPost({
      ...blogPost,
      category: 'Chakra Healing',
      featuredImage: `/blog/chakra-${chakra.toLowerCase().replace(' ', '-')}.jpg`,
      publishDate: new Date(),
      status: 'draft', // Save as draft for review
      author: 'CELESTIAL Team',
      tags: ['chakra healing', chakra.toLowerCase(), 'energy healing']
    });

    console.log(`Generated monthly chakra post: ${blogPost.title}`);
  }

  // Generate seasonal content
  static async generateSeasonalPost(): Promise<void> {
    const month = new Date().getMonth();
    const seasons = {
      'Spring': [2, 3, 4], // Mar, Apr, May
      'Summer': [5, 6, 7], // Jun, Jul, Aug
      'Fall': [8, 9, 10],  // Sep, Oct, Nov
      'Winter': [11, 0, 1] // Dec, Jan, Feb
    };

    const currentSeason = Object.keys(seasons).find(season =>
      seasons[season as keyof typeof seasons].includes(month)
    ) || 'Spring';

    const variables = {
      season: currentSeason,
      month: new Date().toLocaleString('default', { month: 'long' }),
      energy: this.getSeasonalEnergy(currentSeason)
    };

    const blogPost = await this.generateBlogPost('seasonalGuide', variables);

    await this.saveBlogPost({
      ...blogPost,
      category: 'Seasonal Healing',
      featuredImage: `/blog/season-${currentSeason.toLowerCase()}.jpg`,
      publishDate: new Date(),
      status: 'draft', // Save as draft for review
      author: 'CELESTIAL Team',
      tags: ['seasonal healing', currentSeason.toLowerCase(), 'crystal rituals']
    });

    console.log(`Generated seasonal post: ${blogPost.title}`);
  }

  // AI Content Generation using DeepSeek API
  private static async generateAIContent(title: string, sections: string[], variables: Record<string, string>): Promise<string> {
    try {
      // Import DeepSeek AI service
      const { deepseekAI } = await import('./deepseek-ai');

      // Create a detailed, specific prompt based on the content type
      let detailedPrompt = '';

      if (title.includes('Chakra')) {
        detailedPrompt = this.createChakraGuidePrompt(title, variables);
      } else if (title.includes('Seasonal') || title.includes('Spring') || title.includes('Summer') || title.includes('Fall') || title.includes('Winter')) {
        detailedPrompt = this.createSeasonalPrompt(title, variables);
      } else if (title.includes('Birthstone')) {
        detailedPrompt = this.createBirthstonePrompt(title, variables);
      } else {
        detailedPrompt = this.createCrystalGuidePrompt(title, variables);
      }

      // Generate content using AI
      const result = await deepseekAI.generateCustomContent(detailedPrompt, 'blog');

      // Quality gate: reject generic/low-info outputs
      const tooGeneric = /lorem ipsum|insert|generic|as an ai|\bcrystal crystal\b|\bin conclusion\b/i;
      const tooShort = (result.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length < 900; // ~> 1800 words usually ~1200 tokens; we enforce 900+ words
      if (!result.content || tooShort || tooGeneric.test(result.content)) {
        console.warn('AI content below quality threshold, regenerating with stricter prompt');
        const strictPrompt = detailedPrompt + '\n\nSTRICT REQUIREMENTS:\n- Minimum 1800 words\n- Include 3+ specific rituals with steps\n- Include 5+ specific crystal names with reasons\n- Include a 7-day practice plan with time breakdown\n- No generic fluff or vague statements\n- NEVER use placeholders like "Crystal" as a name; use specific stones (e.g., Black Tourmaline, Amethyst).';
        const retry = await deepseekAI.generateCustomContent(strictPrompt, 'guide');
        const retryTooShort = (retry.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length < 900;
        if (!retry.content || retryTooShort || tooGeneric.test(retry.content)) {
          // Final safety: curated fallbacks for chakra/seasonal/crystal
          if (title.includes('Chakra')) return this.generateChakraFallbackContent(this.normalizeChakraName(variables.chakra || 'Root'));
          if (title.includes('Season')) return this.generateSeasonalFallbackContent(this.getCurrentSeason());
          return this.generateTemplateContent(title, sections, variables);
        }
        return retry.content;
      }

      return result.content;

    } catch (error) {
      console.error('AI content generation failed, using fallback:', error);
      return this.generateTemplateContent(title, sections, variables);
    }
  }

  // Template content generator (fallback)
  private static generateTemplateContent(title: string, sections: string[], variables: Record<string, string>): string {
    // Chakra-aware fallback first
    const detectedChakra = variables.chakra || (title.match(/Root|Sacral|Solar Plexus|Heart|Throat|Third Eye|Crown/i)?.[0] ?? '');
    if (detectedChakra) {
      return this.generateChakraFallbackContent(this.normalizeChakraName(detectedChakra));
    }

    const crystal = variables.crystal || 'Crystal';
    const benefit = variables.benefit || 'healing';

    // Find the specific crystal in our database for detailed information
    const crystalData = crystalDatabase.find(c =>
      c.name.toLowerCase().includes(crystal.toLowerCase()) ||
      crystal.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
    );

    // Special handling for Lava 7 Chakra bracelet
    if (crystal.toLowerCase().includes('lava') && crystal.toLowerCase().includes('chakra')) {
      return this.generateLava7ChakraContent(title, crystalData);
    }

    // Generate content based on crystal data if available
    if (crystalData) {
      return this.generateSpecificCrystalContent(title, crystalData, benefit);
    }

    // Fallback to generic content
    return `
    <h1>${title}</h1>

    <p>Welcome to your complete guide to ${crystal} crystal healing. In this comprehensive article, we'll explore the powerful healing properties of ${crystal} and how it can enhance your spiritual journey across North America.</p>

    <h2>What is ${crystal} Crystal?</h2>
    <p>${crystal} is a powerful healing stone known for its ${benefit} properties. This beautiful crystal has been used for centuries by healers and spiritual practitioners to promote wellness and positive energy.</p>

    <h2>Healing Properties of ${crystal}</h2>
    <ul>
      <li>Promotes ${benefit} and emotional balance</li>
      <li>Enhances spiritual connection and intuition</li>
      <li>Supports physical wellness and vitality</li>
      <li>Provides protection from negative energies</li>
    </ul>

    <h2>How to Use ${crystal} Crystal</h2>
    <p>There are many ways to incorporate ${crystal} into your daily wellness routine:</p>
    <ol>
      <li><strong>Wear as Jewelry:</strong> ${crystal} bracelets and necklaces keep the healing energy close to your body</li>
      <li><strong>Meditation:</strong> Hold ${crystal} during meditation to enhance spiritual connection</li>
      <li><strong>Home Placement:</strong> Place ${crystal} in your living space to create positive energy</li>
      <li><strong>Crystal Grids:</strong> Use ${crystal} in crystal grids for amplified healing</li>
    </ol>

    <h2>Caring for Your ${crystal} Crystal</h2>
    <p>To maintain the healing properties of your ${crystal}, regular cleansing and charging is essential. Here are the best methods:</p>

    <h3>Cleansing Methods:</h3>
    <ul>
      <li>Moonlight cleansing under the full moon</li>
      <li>Sage or palo santo smoke cleansing</li>
      <li>Sound cleansing with singing bowls</li>
      <li>Running water cleansing (if safe for the crystal)</li>
    </ul>

    <h2>Shop Authentic ${crystal} Crystals</h2>
    <p>Ready to experience the healing power of ${crystal}? Browse our collection of authentic ${crystal} crystal bracelets, carefully sourced and energetically cleansed for maximum healing potential.</p>

    <p><strong>Free shipping across North America on orders over $50!</strong></p>

    <p><em>Disclaimer: Crystal healing is a complementary practice and should not replace professional medical advice. Always consult healthcare providers for medical concerns.</em></p>
    `;
  }

  private static normalizeChakraName(ch: string): string {
    const m = ch.toLowerCase();
    const map: Record<string, string> = {
      'root': 'Root',
      'sacral': 'Sacral',
      'solar plexus': 'Solar Plexus',
      'heart': 'Heart',
      'throat': 'Throat',
      'third eye': 'Third Eye',
      'crown': 'Crown'
    };
    return map[m] || (Object.values(map).find(v => v.toLowerCase() === m) || 'Root');
  }

  private static chakraTopCrystals: Record<string, string[]> = {
    'Root': ['Red Jasper', 'Black Tourmaline', 'Hematite', 'Smoky Quartz', 'Garnet'],
    'Sacral': ['Carnelian', 'Sunstone', 'Orange Calcite', "Tiger's Eye", 'Amber'],
    'Solar Plexus': ['Citrine', "Tiger's Eye", 'Yellow Jasper', 'Pyrite', 'Amber'],
    'Heart': ['Rose Quartz', 'Green Aventurine', 'Malachite', 'Rhodonite', 'Jade'],
    'Throat': ['Aquamarine', 'Blue Lace Agate', 'Sodalite', 'Lapis Lazuli', 'Amazonite'],
    'Third Eye': ['Amethyst', 'Lapis Lazuli', 'Sodalite', 'Fluorite', 'Labradorite'],
    'Crown': ['Clear Quartz', 'Amethyst', 'Selenite', 'Lepidolite', 'Howlite']
  };

  private static generateChakraFallbackContent(chakra: string): string {
    const crystals = this.chakraTopCrystals[chakra] || [];
    const month = new Date().toLocaleString('default', { month: 'long' });
    return `
    <h1>Best Crystals for ${chakra} Chakra Healing: ${month} Guide</h1>

    <p>This practical ${chakra} Chakra guide is tailored for ${month}. Learn clear signs of imbalance, the exact crystals to use, and a 7-day practice plan that actually works.</p>

    <h2>Understanding the ${chakra} Chakra</h2>
    <p>The ${chakra} Chakra governs specific aspects of your energy system. When balanced, you experience stability, clarity, and flow appropriate to this center.</p>

    <h2>Signs of ${chakra} Chakra Imbalance</h2>
    <ul>
      <li>Physical and emotional cues that this center needs attention</li>
      <li>Behavioral patterns common with ${chakra.toLowerCase()} chakra blocks</li>
      <li>What balance feels like for this chakra</li>
    </ul>

    <h2>Top Crystals for ${chakra} Chakra</h2>
    <ol>
      ${crystals.map(c => `<li><strong>${c}:</strong> Why practitioners use ${c} for ${chakra.toLowerCase()} chakra work, with one practical example (bracelet, palm stone, or grid).</li>`).join('\n')}
    </ol>

    <h2>How to Use ${chakra} Chakra Crystals</h2>
    <ol>
      <li><strong>Bracelet Method:</strong> Wear on the left wrist to receive energy; right wrist to project. Reaffirm intention hourly.</li>
      <li><strong>Meditation:</strong> 10–15 minutes placing the stone on the ${chakra.toLowerCase()} center while breathing in its color.</li>
      <li><strong>Home Placement:</strong> Create a focused altar with 3 stones and a written affirmation.</li>
    </ol>

    <h2>7-Day Practice Plan (${month})</h2>
    <ul>
      <li><strong>Day 1–2:</strong> Grounding breath + 10 min crystal meditation</li>
      <li><strong>Day 3–4:</strong> Add journaling prompt and affirmation</li>
      <li><strong>Day 5–6:</strong> Introduce short movement or yoga flow</li>
      <li><strong>Day 7:</strong> Reflection and re-setting intention</li>
    </ul>

    <h2>Affirmations</h2>
    <p>Use 3 precise affirmations tailored to the ${chakra.toLowerCase()} chakra, repeated morning and night.</p>

    <h2>Care & Charging</h2>
    <ul>
      <li>Safe cleansing for these stones (avoid water for soft minerals)</li>
      <li>Charging options: moonlight, selenite plate, or sunlight (if safe)</li>
    </ul>

    <h2>Shop ${chakra} Chakra Bracelets</h2>
    <p>Explore authentic bracelets and stones aligned with the ${chakra} Chakra. Ethically sourced, ready for practice.</p>
    `;
  }

  // Helper methods
  private static replaceVariables(template: string, variables: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => variables[key] || match);
  }

  private static generateExcerpt(content: string): string {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.substring(0, 160) + '...';
  }

  private static generateMetaDescription(title: string, variables: Record<string, string>): string {
    const crystal = variables.crystal || 'crystals';
    return `Discover the healing properties of ${crystal} crystal. Complete guide to crystal healing, benefits, and usage. Shop authentic crystal bracelets with free shipping across North America.`;
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private static async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let suffix = 2;
    // Check for existing slug and append -2, -3 ... if necessary
    // Limit loop to avoid infinite in worst case
    while (suffix < 100) {
      const exists = await prisma.blogPost.findUnique({ where: { slug } }).catch(() => null);
      if (!exists) return slug;
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return `${baseSlug}-${Date.now()}`;
  }

  private static getChakraColor(chakra: string): string {
    const colors: Record<string, string> = {
      'Root': 'red',
      'Sacral': 'orange',
      'Solar Plexus': 'yellow',
      'Heart': 'green',
      'Throat': 'blue',
      'Third Eye': 'indigo',
      'Crown': 'violet'
    };
    return colors[chakra] || 'white';
  }

  private static getChakraElement(chakra: string): string {
    const elements: Record<string, string> = {
      'Root': 'earth',
      'Sacral': 'water',
      'Solar Plexus': 'fire',
      'Heart': 'air',
      'Throat': 'sound',
      'Third Eye': 'light',
      'Crown': 'thought'
    };
    return elements[chakra] || 'universal';
  }

  private static getSeasonalEnergy(season: string): string {
    const energies: Record<string, string> = {
      'Spring': 'renewal and growth',
      'Summer': 'abundance and vitality',
      'Fall': 'harvest and gratitude',
      'Winter': 'reflection and rest'
    };
    return energies[season] || 'balance';
  }

  private static seasonalTopCrystals: Record<string, string[]> = {
    'Spring': ['Green Aventurine', 'Moss Agate', 'Rose Quartz', 'Amazonite', 'Clear Quartz'],
    'Summer': ['Citrine', 'Carnelian', 'Sunstone', 'Aquamarine', 'Turquoise'],
    'Fall': ['Smoky Quartz', 'Tiger\'s Eye', 'Red Jasper', 'Obsidian', 'Garnet'],
    'Winter': ['Amethyst', 'Selenite', 'Labradorite', 'Black Tourmaline', 'Clear Quartz']
  };

  private static generateSeasonalFallbackContent(season: string): string {
    const s = this.getCurrentSeason();
    const month = new Date().toLocaleString('default', { month: 'long' });
    const crystals = this.seasonalTopCrystals[s] || [];
    return `
    <h1>${s} Crystal Rituals: ${month} Seasonal Guide</h1>

    <p>This is a practical ${s} guide tailored for ${month}. You’ll get specific stones, rituals with steps, and a simple 7-day plan.</p>

    <h2>Top ${s} Crystals</h2>
    <ol>
      ${crystals.map(c => `<li><strong>${c}:</strong> A precise use-case for ${s.toLowerCase()} season (bracelet stack, altar grid, meditation).</li>`).join('\n')}
    </ol>

    <h2>${s} Rituals</h2>
    <ol>
      <li><strong>Morning Practice (10 min):</strong> Breath + stone hold; set a ${s.toLowerCase()} intention.</li>
      <li><strong>Evening Wind-down (8 min):</strong> Journal + gentle meditation with your primary stone.</li>
      <li><strong>Weekly Reset (20 min):</strong> Cleanse, recharge, and refresh your altar grid.</li>
    </ol>

    <h2>7-Day Plan (${month})</h2>
    <ul>
      <li><strong>Day 1–2:</strong> Primary stone focus with intention setting</li>
      <li><strong>Day 3–4:</strong> Add bracelet stack for daytime, meditation at night</li>
      <li><strong>Day 5–6:</strong> Introduce grid or home placement</li>
      <li><strong>Day 7:</strong> Review, refine, and recharge</li>
    </ul>

    <h2>Care & Charging</h2>
    <ul>
      <li>Safe cleansing for the stones above</li>
      <li>Charging options: moonlight, sunlight (if safe), selenite</li>
    </ul>

    <h2>Shop ${s} Collections</h2>
    <p>Explore curated bracelets and stones aligned with ${s} energy.</p>
    `;
  }

  // Save blog post to database
  static async saveBlogPost(postData: {
    title: string;
    content: string;
    excerpt: string;
    keywords: string[];
    metaDescription: string;
    slug: string;
    category: string;
    featuredImage: string;
    publishDate: Date;
    status: string;
    author: string;
    tags: string[];
  }): Promise<void> {
    try {
      console.log('Saving blog post:', postData.title);

      // Ensure unique slug
      const baseSlug = postData.slug;
      const slug = await this.ensureUniqueSlug(baseSlug);

      // Save to database using Prisma
      await prisma.blogPost.create({
        data: {
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          slug,
          category: postData.category,
          featuredImage: postData.featuredImage,
          publishedAt: postData.status === 'published' ? postData.publishDate : null,
          status: postData.status,
          author: postData.author,
          tags: postData.tags,
          isAIGenerated: true,
          readingTime: Math.ceil(postData.content.split(/\s+/).length / 200) // Estimate reading time
        }
      });

      console.log(`✅ Blog post saved successfully: "${postData.title}" with status: ${postData.status}`);

      console.log('✅ Blog post saved successfully:', postData.title);

    } catch (error) {
      console.error('❌ Failed to save blog post:', error);
      throw error;
    }
  }

  // Generate specific content for Lava 7 Chakra bracelet
  private static generateLava7ChakraContent(title: string, crystalData: any): string {
    const chakraStones = crystalData?.chakraStones || {};
    const lavaProps = crystalData?.lavaStoneProperties || {};

    let chakraContent = '';
    Object.entries(chakraStones).forEach(([chakra, data]: [string, any]) => {
      chakraContent += `
      <h3>${chakra} - ${data.stone}</h3>
      <p><strong>Color:</strong> ${data.color}</p>
      <p><strong>Properties:</strong> ${data.properties.join(', ')}</p>
      <p>${data.benefits}</p>
      `;
    });

    return `
    <h1>${title}</h1>

    <p>The Lava 7 Chakra Bracelet is a powerful combination of volcanic lava stone and seven carefully selected chakra stones. This unique piece brings together the grounding energy of lava rock with the balancing properties of chakra healing crystals, creating a comprehensive tool for spiritual wellness and energy alignment.</p>

    <h2>What Makes Lava 7 Chakra Bracelets Special?</h2>
    <p>Lava stone, formed from cooled volcanic rock, carries the raw power of the Earth's core. When combined with the seven chakra stones, it creates a perfect balance between grounding energy and spiritual elevation. Each bead in this bracelet serves a specific purpose in your healing journey.</p>

    <h2>The Power of Lava Stone</h2>
    <p><strong>Origin:</strong> ${lavaProps.origin || 'Volcanic rock formed from cooled lava'}</p>
    <p><strong>Properties:</strong> ${lavaProps.properties?.join(', ') || 'Grounding, Strength, Courage'}</p>
    <p>${lavaProps.benefits || 'Lava stone provides incredible grounding energy and emotional strength.'}</p>

    ${lavaProps.aromatherapy ? `<p><strong>Aromatherapy Bonus:</strong> ${lavaProps.aromatherapy}</p>` : ''}

    <h2>The Seven Chakra Stones Explained</h2>
    <p>Each chakra stone in your Lava 7 Chakra bracelet corresponds to one of the seven main energy centers in your body:</p>

    ${chakraContent}

    <h2>How to Use Your Lava 7 Chakra Bracelet</h2>
    <ol>
      <li><strong>Daily Wear:</strong> Wear your bracelet on your left wrist to receive energy, or right wrist to project energy</li>
      <li><strong>Meditation:</strong> Hold the bracelet during meditation, focusing on each chakra stone individually</li>
      <li><strong>Aromatherapy:</strong> Add 1-2 drops of essential oil to the lava stones for aromatherapy benefits</li>
      <li><strong>Intention Setting:</strong> Hold the bracelet while setting daily intentions for balance and healing</li>
      <li><strong>Chakra Balancing:</strong> Focus on each colored stone while visualizing the corresponding chakra opening and balancing</li>
    </ol>

    <h2>Benefits of Wearing Lava 7 Chakra Bracelets</h2>
    <ul>
      <li><strong>Complete Chakra Alignment:</strong> Balances all seven energy centers simultaneously</li>
      <li><strong>Grounding Energy:</strong> Lava stone keeps you connected to Earth's stabilizing energy</li>
      <li><strong>Emotional Strength:</strong> Provides courage and resilience during challenging times</li>
      <li><strong>Spiritual Growth:</strong> Supports your journey of spiritual development and self-discovery</li>
      <li><strong>Energy Protection:</strong> Creates a protective shield against negative energies</li>
      <li><strong>Aromatherapy Benefits:</strong> Porous lava stones hold essential oils for extended aromatherapy</li>
    </ul>

    <h2>Caring for Your Lava 7 Chakra Bracelet</h2>
    <p>To maintain the energy and appearance of your bracelet:</p>
    <ul>
      <li>Cleanse monthly under running water or with sage smoke</li>
      <li>Charge under moonlight or with selenite</li>
      <li>Store in a soft pouch when not wearing</li>
      <li>Avoid harsh chemicals and excessive moisture</li>
      <li>Reapply essential oils to lava stones as needed</li>
    </ul>

    <h2>Who Should Wear Lava 7 Chakra Bracelets?</h2>
    <p>This powerful bracelet is perfect for:</p>
    <ul>
      <li>Anyone seeking complete chakra balance and alignment</li>
      <li>People going through major life transitions</li>
      <li>Those who need grounding and emotional stability</li>
      <li>Spiritual practitioners and energy healers</li>
      <li>Anyone interested in aromatherapy benefits</li>
      <li>Individuals looking to enhance their meditation practice</li>
    </ul>

    <h2>Shop Authentic Lava 7 Chakra Bracelets</h2>
    <p>Experience the powerful combination of volcanic energy and chakra healing with our authentic Lava 7 Chakra bracelets. Each bracelet is carefully crafted with genuine lava stone and high-quality chakra stones to ensure maximum healing benefits.</p>

    <p><strong>Ready to balance your chakras and ground your energy?</strong> Explore our collection of Lava 7 Chakra bracelets and find the perfect piece for your spiritual journey.</p>
    `;
  }

  // Generate specific content for individual crystals
  private static generateSpecificCrystalContent(title: string, crystalData: any, benefit: string): string {
    const properties = crystalData.properties?.join(', ') || 'healing and wellness';
    const colors = crystalData.colors?.join(', ') || 'natural';
    const chakra = crystalData.chakra || 'energy centers';
    const origin = crystalData.origin || 'various locations worldwide';
    const element = crystalData.element || 'Earth';

    return `
    <h1>${title}</h1>

    <p>Welcome to your comprehensive guide to ${crystalData.name} healing. This powerful crystal has been treasured for centuries for its remarkable ${benefit} properties and spiritual significance. Whether you're new to crystal healing or an experienced practitioner, this guide will help you understand and harness the full potential of ${crystalData.name}.</p>

    <h2>What is ${crystalData.name}?</h2>
    <p>${crystalData.description}</p>
    <p><strong>Colors:</strong> ${colors}</p>
    <p><strong>Origin:</strong> ${origin}</p>
    <p><strong>Element:</strong> ${element}</p>
    <p><strong>Chakra Connection:</strong> ${chakra}</p>

    <h2>Healing Properties of ${crystalData.name}</h2>
    <p>${crystalData.name} is renowned for its powerful healing properties:</p>
    <ul>
      ${crystalData.properties?.map((prop: string) => `<li><strong>${prop}:</strong> Enhances ${prop.toLowerCase()} and promotes overall well-being</li>`).join('') || '<li>Promotes healing and positive energy</li>'}
    </ul>

    <h2>How to Use ${crystalData.name}</h2>
    <p>There are many effective ways to incorporate ${crystalData.name} into your daily wellness routine:</p>
    <ol>
      <li><strong>Wear as Jewelry:</strong> ${crystalData.name} bracelets and necklaces keep the healing energy close to your body throughout the day</li>
      <li><strong>Meditation Practice:</strong> Hold ${crystalData.name} during meditation to enhance spiritual connection and deepen your practice</li>
      <li><strong>Home & Office:</strong> Place ${crystalData.name} in your living or working space to create positive energy and protection</li>
      <li><strong>Sleep Support:</strong> Keep ${crystalData.name} near your bed to promote restful sleep and peaceful dreams</li>
      <li><strong>Chakra Work:</strong> Use ${crystalData.name} during chakra balancing sessions to align your ${chakra}</li>
    </ol>

    <h2>${crystalData.name} and Chakra Healing</h2>
    <p>${crystalData.name} has a special connection to the ${chakra}. When this energy center is balanced, you experience:</p>
    <ul>
      <li>Enhanced ${benefit} and emotional stability</li>
      <li>Improved spiritual connection and intuition</li>
      <li>Greater sense of purpose and direction</li>
      <li>Increased energy and vitality</li>
    </ul>

    <h2>Caring for Your ${crystalData.name}</h2>
    <p>To maintain the energy and beauty of your ${crystalData.name}:</p>
    <ul>
      <li><strong>Cleansing:</strong> Cleanse monthly with running water, sage, or moonlight</li>
      <li><strong>Charging:</strong> Charge under full moon or with other crystals like selenite</li>
      <li><strong>Storage:</strong> Store in a soft cloth or pouch to prevent scratches</li>
      <li><strong>Programming:</strong> Set clear intentions when first using your crystal</li>
    </ul>

    <h2>Shop Authentic ${crystalData.name} Crystals</h2>
    <p>Experience the transformative power of genuine ${crystalData.name} crystals. Our collection features high-quality, ethically sourced stones perfect for healing, meditation, and spiritual growth.</p>

    <p><strong>Ready to enhance your spiritual journey with ${crystalData.name}?</strong> Browse our selection of ${crystalData.name} bracelets, stones, and jewelry to find the perfect piece for your needs.</p>
    `;
  }

  // Create detailed chakra guide prompt
  private static createChakraGuidePrompt(title: string, variables: Record<string, string>): string {
    const chakra = variables.chakra || 'Root';
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return `Write a comprehensive, expert-level guide about ${chakra} Chakra healing for ${currentMonth}. This should be a detailed, practical guide that crystal enthusiasts in North America will find valuable.

TITLE: ${title}

REQUIREMENTS:
- 1800-2200 words of high-quality, original content
- Include specific crystal recommendations for ${chakra} Chakra
- Provide detailed meditation techniques and practices
- Include seasonal relevance for ${currentMonth}
- Add practical daily exercises and affirmations
- Mention specific crystal bracelets and jewelry
- Include scientific backing where appropriate
- Use a warm, knowledgeable, spiritual tone

STRUCTURE:
1. Introduction to ${chakra} Chakra and its importance in ${currentMonth}
2. Signs of ${chakra} Chakra imbalance and how to recognize them
3. Best crystals for ${chakra} Chakra healing (at least 5 specific stones)
4. Detailed meditation techniques for ${chakra} Chakra activation
5. Daily practices and affirmations for ${currentMonth}
6. How to use crystal bracelets for ${chakra} Chakra healing
7. Seasonal considerations for ${currentMonth} chakra work
8. Advanced techniques for experienced practitioners
9. Common mistakes to avoid
10. Conclusion with actionable next steps

KEYWORDS TO INCLUDE: ${chakra.toLowerCase()} chakra, chakra healing, crystal bracelets, meditation, spiritual wellness, energy healing, ${currentMonth.toLowerCase()} healing

Make this guide practical, detailed, and genuinely helpful for someone wanting to work with their ${chakra} Chakra this month.`;
  }

  // Create detailed seasonal content prompt
  private static createSeasonalPrompt(title: string, variables: Record<string, string>): string {
    const currentSeason = this.getCurrentSeason();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return `Write an in-depth seasonal crystal guide for ${currentSeason} ${currentMonth}. This should be a comprehensive resource for crystal enthusiasts in North America.

TITLE: ${title}

REQUIREMENTS:
- 1600-2000 words of original, detailed content
- Focus on crystals that align with ${currentSeason} energy
- Include specific seasonal rituals and practices
- Provide practical advice for ${currentMonth} crystal work
- Include information about crystal bracelets for the season
- Add seasonal meditation techniques
- Include moon phase considerations for ${currentMonth}
- Use an inspiring, knowledgeable tone

STRUCTURE:
1. Introduction to ${currentSeason} crystal energy and ${currentMonth} significance
2. Top 7 crystals for ${currentSeason} (detailed descriptions)
3. Seasonal crystal rituals and ceremonies
4. ${currentMonth} moon phase crystal work
5. Creating a ${currentSeason} crystal altar
6. Seasonal crystal bracelet combinations
7. Weather-specific crystal care for ${currentSeason}
8. ${currentSeason} manifestation techniques with crystals
9. Seasonal cleansing and charging methods
10. Planning ahead for the next season

KEYWORDS: ${currentSeason.toLowerCase()} crystals, seasonal healing, crystal bracelets, ${currentMonth.toLowerCase()} rituals, seasonal energy, crystal altar

Make this guide specific to ${currentSeason} ${currentMonth} with practical, actionable advice that readers can implement immediately.`;
  }

  // Create detailed birthstone guide prompt
  private static createBirthstonePrompt(title: string, variables: Record<string, string>): string {
    const month = variables.month || new Date().toLocaleString('default', { month: 'long' });
    const zodiac = variables.zodiac || 'Aquarius';

    return `Write a comprehensive birthstone guide for ${month} focusing on ${zodiac} energy and crystal healing. This should be an authoritative resource for North American crystal enthusiasts.

TITLE: ${title}

REQUIREMENTS:
- 1700-2100 words of expert-level content
- Cover both traditional and modern ${month} birthstones
- Include detailed ${zodiac} zodiac connections
- Provide specific healing properties and uses
- Include crystal bracelet and jewelry recommendations
- Add meditation and ritual practices
- Include gift-giving suggestions for ${month} birthdays
- Use an authoritative yet accessible tone

STRUCTURE:
1. Introduction to ${month} birthstones and ${zodiac} energy
2. Traditional vs. modern ${month} birthstones (detailed comparison)
3. Healing properties of each ${month} birthstone
4. ${zodiac} zodiac connections and personality traits
5. How to choose the right ${month} birthstone for you
6. ${month} birthstone jewelry and crystal bracelets
7. Meditation practices with ${month} birthstones
8. ${month} birthday rituals and celebrations
9. Caring for your ${month} birthstones
10. Gift guide: ${month} birthstone presents
11. Conclusion and ${month} affirmations

KEYWORDS: ${month.toLowerCase()} birthstone, ${zodiac.toLowerCase()} crystals, birthstone jewelry, crystal bracelets, zodiac healing, ${month.toLowerCase()} birthday

Create a definitive guide that someone born in ${month} or interested in ${zodiac} energy would bookmark and reference regularly.`;
  }

  // Create detailed crystal guide prompt
  private static createCrystalGuidePrompt(title: string, variables: Record<string, string>): string {
    const crystal = variables.crystal || variables.name || 'Amethyst';

    return `Write an expert-level comprehensive guide about ${crystal} crystal. This should be the definitive resource for ${crystal} that crystal enthusiasts in North America will find invaluable.

TITLE: ${title}

REQUIREMENTS:
- 1800-2200 words of detailed, original content
- Include geological and metaphysical properties
- Provide specific healing applications and techniques
- Include historical and cultural significance
- Add practical usage instructions
- Include crystal bracelet and jewelry information
- Provide care and maintenance instructions
- Use an expert, trustworthy tone

STRUCTURE:
1. Introduction to ${crystal} and why it's special
2. Geological formation and physical properties of ${crystal}
3. Historical significance and cultural uses
4. Metaphysical properties and energy signature
5. Specific healing benefits (physical, emotional, spiritual)
6. Chakra connections and energy work with ${crystal}
7. How to use ${crystal} in meditation and daily practice
8. ${crystal} jewelry and crystal bracelets
9. Cleansing, charging, and caring for ${crystal}
10. ${crystal} combinations with other stones
11. Common myths and misconceptions about ${crystal}
12. Where to buy authentic ${crystal} and what to look for
13. Conclusion and ${crystal} affirmations

KEYWORDS: ${crystal.toLowerCase()} crystal, ${crystal.toLowerCase()} healing, crystal bracelets, ${crystal.toLowerCase()} properties, crystal healing, spiritual wellness

Make this the most comprehensive ${crystal} guide available, with practical advice that both beginners and experienced practitioners will find valuable.`;
  }

  // Get current season
  private static getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  }
}
