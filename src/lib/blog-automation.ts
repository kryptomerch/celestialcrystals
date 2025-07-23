import { crystalDatabase } from '@/data/crystals';
import { prisma } from '@/lib/prisma';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  category: string;
  readingTime: number;
  isAIGenerated: boolean;
  featuredImage?: string;
  images?: string[];
  crystalId?: string;
}

// Blog post templates for different crystal topics
const blogTemplates = {
  properties: {
    title: "{crystal} Properties and Healing Benefits",
    sections: [
      "Introduction to {crystal}",
      "Physical Properties and Appearance",
      "Metaphysical Properties",
      "Healing Benefits",
      "How to Use {crystal}",
      "Chakra Connections",
      "Zodiac Associations",
      "Care and Cleansing",
      "Conclusion"
    ]
  },
  guide: {
    title: "Complete Guide to {crystal} Crystal",
    sections: [
      "What is {crystal}?",
      "History and Origins",
      "Physical Characteristics",
      "Spiritual Significance",
      "Healing Properties",
      "Meditation with {crystal}",
      "Jewelry and Wearing {crystal}",
      "Caring for Your {crystal}",
      "Final Thoughts"
    ]
  },
  chakra: {
    title: "{crystal} and {chakra} Chakra Healing",
    sections: [
      "Understanding the {chakra} Chakra",
      "How {crystal} Connects to {chakra}",
      "Signs of {chakra} Imbalance",
      "Using {crystal} for {chakra} Healing",
      "Meditation Techniques",
      "Affirmations with {crystal}",
      "Combining with Other Crystals",
      "Daily Practice Tips"
    ]
  }
};

// Generate content for each section based on crystal data
function generateSectionContent(crystal: any, section: string, template: string): string {
  const crystalName = crystal.name.replace(' Bracelet', '');

  switch (section.toLowerCase()) {
    case `introduction to ${crystalName.toLowerCase()}`:
    case `what is ${crystalName.toLowerCase()}?`:
      return `${crystalName} is a remarkable crystal known for its ${crystal.properties.join(', ').toLowerCase()} properties. This beautiful ${crystal.colors.join(' and ').toLowerCase()} stone has been cherished for centuries for its powerful healing abilities and spiritual significance. With a hardness of ${crystal.hardness} on the Mohs scale, ${crystalName} originates from ${crystal.origin} and belongs to the ${crystal.category.toLowerCase()} category of healing crystals.`;

    case 'physical properties and appearance':
    case 'physical characteristics':
      return `${crystalName} displays stunning ${crystal.colors.join(', ').toLowerCase()} colors that make it instantly recognizable. This ${crystal.rarity.toLowerCase()} crystal has a hardness rating of ${crystal.hardness}, making it ${crystal.hardness.includes('7') || crystal.hardness.includes('8') ? 'durable and suitable for daily wear' : 'relatively soft and requiring gentle care'}. The crystal's natural beauty is enhanced by its ${crystal.element.toLowerCase()} elemental energy, which contributes to its unique vibrational frequency.`;

    case 'metaphysical properties':
    case 'spiritual significance':
      return `From a metaphysical perspective, ${crystalName} is renowned for its ability to enhance ${crystal.properties.slice(0, 3).join(', ').toLowerCase()}. This powerful stone resonates with the ${crystal.chakra} chakra, making it an excellent choice for energy work and spiritual development. The crystal's connection to the ${crystal.element.toLowerCase()} element amplifies its natural healing properties and makes it particularly effective for those seeking ${crystal.properties[0].toLowerCase()}.`;

    case 'healing benefits':
    case 'healing properties':
      return `${crystalName} offers numerous healing benefits for both physical and emotional well-being. Its primary properties include ${crystal.properties.join(', ').toLowerCase()}, making it an versatile healing tool. Regular use of ${crystalName} can help promote ${crystal.properties.slice(0, 2).join(' and ').toLowerCase()}, while also supporting overall energetic balance. Many practitioners find this crystal particularly helpful for ${crystal.category.toLowerCase()} work.`;

    case `how to use ${crystalName.toLowerCase()}`:
    case 'meditation techniques':
      return `There are many ways to incorporate ${crystalName} into your daily spiritual practice. Wearing it as jewelry, particularly as a bracelet, allows for continuous energy contact throughout the day. During meditation, hold the crystal in your dominant hand or place it on your ${crystal.chakra.toLowerCase()} chakra area. You can also create a crystal grid with ${crystalName} as the center stone to amplify its ${crystal.properties[0].toLowerCase()} properties.`;

    case 'chakra connections':
    case `understanding the ${crystal.chakra.toLowerCase()} chakra`:
      return `${crystalName} has a strong connection to the ${crystal.chakra} chakra, which governs ${crystal.chakra === 'Root' ? 'grounding, stability, and survival instincts' : crystal.chakra === 'Heart' ? 'love, compassion, and emotional healing' : crystal.chakra === 'Throat' ? 'communication, truth, and self-expression' : crystal.chakra === 'Third Eye' ? 'intuition, wisdom, and spiritual insight' : crystal.chakra === 'Crown' ? 'spiritual connection and higher consciousness' : 'energy balance and vitality'}. When this chakra is balanced, you experience ${crystal.properties.slice(0, 2).join(' and ').toLowerCase()}. ${crystalName} helps to activate and align this energy center, promoting overall well-being.`;

    case 'zodiac associations':
      return `Astrologically, ${crystalName} is particularly beneficial for ${crystal.zodiacSigns.join(', ')} signs. Those born under these signs may find that ${crystalName} resonates strongly with their natural energy patterns. The crystal's influence is especially powerful during the months of ${crystal.birthMonths.map((m: number) => new Date(2024, m - 1).toLocaleString('default', { month: 'long' })).join(', ')}, making it an ideal birthstone alternative for those seeking ${crystal.properties[0].toLowerCase()}.`;

    case 'care and cleansing':
    case `caring for your ${crystalName.toLowerCase()}`:
      return `Proper care ensures your ${crystalName} maintains its energetic potency. ${crystal.hardness.includes('7') || crystal.hardness.includes('8') ? 'Due to its durability, this crystal can be cleansed with water, though' : 'Given its softer nature,'} it's best to use gentle methods like moonlight, sage smoke, or sound cleansing. Avoid harsh chemicals and extreme temperatures. Store your ${crystalName} separately from other crystals to prevent scratching, and recharge it regularly under the full moon.`;

    case 'conclusion':
    case 'final thoughts':
      return `${crystalName} is truly a remarkable crystal that offers powerful support for ${crystal.properties.slice(0, 3).join(', ').toLowerCase()}. Whether you're drawn to its beautiful ${crystal.colors[0].toLowerCase()} appearance or its potent healing properties, this crystal can be a valuable addition to your spiritual toolkit. Remember that working with crystals is a personal journey, and the most important aspect is your intention and connection with the stone.`;

    default:
      return `${crystalName} continues to be one of the most sought-after crystals for ${crystal.category.toLowerCase()} work. Its unique combination of ${crystal.properties.slice(0, 2).join(' and ').toLowerCase()} makes it an excellent choice for both beginners and experienced crystal practitioners.`;
  }
}

// Save blog post to database
export async function saveBlogPost(blogPost: BlogPost) {
  try {
    const saved = await prisma.blogPost.create({
      data: {
        title: blogPost.title,
        slug: blogPost.slug,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        author: blogPost.author,
        status: 'draft',
        isAIGenerated: blogPost.isAIGenerated,
        tags: blogPost.tags,
        category: blogPost.category,
        readingTime: blogPost.readingTime,
        featuredImage: blogPost.featuredImage,
        images: blogPost.images,
        crystalId: blogPost.crystalId,
      }
    });

    return saved;
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
}

// Generate a complete blog post
export function generateBlogPost(crystalId?: string): BlogPost {
  // Select a random crystal if none specified
  const crystal = crystalId
    ? crystalDatabase.find(c => c.id === crystalId)
    : crystalDatabase[Math.floor(Math.random() * crystalDatabase.length)];

  if (!crystal) {
    throw new Error('Crystal not found');
  }

  // Select a random template
  const templateKeys = Object.keys(blogTemplates) as (keyof typeof blogTemplates)[];
  const templateKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
  const template = blogTemplates[templateKey];

  const crystalName = crystal.name.replace(' Bracelet', '');
  const title = template.title
    .replace('{crystal}', crystalName)
    .replace('{chakra}', crystal.chakra);

  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Get the crystal's images
  const crystalImages = crystal.images || (crystal.image ? [crystal.image] : []);
  const featuredImage = crystalImages.length > 0 ? crystalImages[0] : '/images/crystals/default-crystal.jpg';

  // Generate content for each section
  const sections = template.sections.map((section, index) => {
    const sectionTitle = section
      .replace('{crystal}', crystalName)
      .replace('{chakra}', crystal.chakra);

    const content = generateSectionContent(crystal, section, templateKey);

    // Add image to the first section if available
    let sectionContent = content;
    if (index === 0 && featuredImage) {
      sectionContent = `![${crystalName} Bracelet](${featuredImage})\n\n${content}`;
    }

    return `## ${sectionTitle}\n\n${sectionContent}`;
  });

  const fullContent = sections.join('\n\n');

  // Generate excerpt (first 150 characters of content)
  const excerpt = fullContent.replace(/##\s+[^\n]+\n\n/g, '').substring(0, 150) + '...';

  // Calculate reading time (average 200 words per minute)
  const wordCount = fullContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  const blogPost: BlogPost = {
    id: `ai-${Date.now()}`,
    title,
    slug,
    content: fullContent,
    excerpt,
    author: 'Crystal AI Assistant',
    publishedAt: new Date().toISOString(),
    tags: [
      crystalName,
      crystal.category,
      crystal.chakra,
      ...crystal.properties.slice(0, 3)
    ],
    category: crystal.category,
    readingTime,
    isAIGenerated: true,
    featuredImage,
    images: crystalImages,
    crystalId: crystal.id
  };

  return blogPost;
}

// Generate multiple blog posts
export function generateMultipleBlogPosts(count: number = 5): BlogPost[] {
  const posts: BlogPost[] = [];
  const usedCrystals = new Set<string>();

  for (let i = 0; i < count && usedCrystals.size < crystalDatabase.length; i++) {
    let crystal;
    do {
      crystal = crystalDatabase[Math.floor(Math.random() * crystalDatabase.length)];
    } while (usedCrystals.has(crystal.id));

    usedCrystals.add(crystal.id);
    posts.push(generateBlogPost(crystal.id));
  }

  return posts;
}

// Schedule blog post generation (this would typically be called by a cron job)
export async function scheduledBlogGeneration() {
  try {
    const newPost = generateBlogPost();

    // In a real implementation, you would save this to your database
    console.log('Generated new blog post:', newPost.title);

    // You could also send notifications, update analytics, etc.
    return newPost;
  } catch (error) {
    console.error('Error generating scheduled blog post:', error);
    throw error;
  }
}

// Get all blog posts from database
export async function getAllBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Get blog generation statistics
export async function getBlogStats() {
  try {
    const [totalPosts, aiPosts, lastPost] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isAIGenerated: true } }),
      prisma.blogPost.findFirst({
        where: { isAIGenerated: true },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      totalCrystals: crystalDatabase.length,
      availableTemplates: Object.keys(blogTemplates).length,
      possibleCombinations: crystalDatabase.length * Object.keys(blogTemplates).length,
      totalPosts,
      aiGeneratedPosts: aiPosts,
      lastGenerated: lastPost?.createdAt?.toISOString() || null
    };
  } catch (error) {
    console.error('Error getting blog stats:', error);
    return {
      totalCrystals: crystalDatabase.length,
      availableTemplates: Object.keys(blogTemplates).length,
      possibleCombinations: crystalDatabase.length * Object.keys(blogTemplates).length,
      totalPosts: 0,
      aiGeneratedPosts: 0,
      lastGenerated: null
    };
  }
}

// Generate and save a blog post
export async function generateAndSaveBlogPost(crystalId?: string) {
  try {
    const blogPost = generateBlogPost(crystalId);
    const saved = await saveBlogPost(blogPost);
    return saved;
  } catch (error) {
    console.error('Error generating and saving blog post:', error);
    throw error;
  }
}

// Test function to generate a blog post with a specific crystal
export function testBlogGeneration(crystalId?: string): BlogPost {
  console.log('🧪 Testing blog generation...');

  const crystal = crystalId
    ? crystalDatabase.find(c => c.id === crystalId)
    : crystalDatabase.find(c => c.images && c.images.length > 0);

  if (!crystal) {
    throw new Error('No suitable crystal found for testing');
  }

  console.log('📝 Generating blog post for:', crystal.name);
  console.log('🖼️ Crystal images:', crystal.images || [crystal.image]);

  const blogPost = generateBlogPost(crystal.id);

  console.log('✅ Blog post generated:');
  console.log('Title:', blogPost.title);
  console.log('Featured Image:', blogPost.featuredImage);
  console.log('All Images:', blogPost.images);
  console.log('Crystal ID:', blogPost.crystalId);

  return blogPost;
}
