import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deepseekAI } from '@/lib/deepseek-ai';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { topic, type, customPrompt } = await request.json();

    let generatedContent;

    try {
      if (customPrompt) {
        // Generate custom content based on user prompt
        generatedContent = await deepseekAI.generateCustomContent(customPrompt, type || 'blog');
      } else {
        // Generate crystal blog post
        generatedContent = await deepseekAI.generateCrystalBlogPost(topic);
      }
    } catch (aiError) {
      console.error('AI Generation Error:', aiError);

      // Fallback to mock data if AI fails
      const crystalTopics = [
        {
          title: 'Black Tourmaline: Your Ultimate Protection Crystal',
          content: `Black Tourmaline stands as one of the most powerful protective stones in the crystal kingdom. This remarkable mineral, with its deep black color and strong grounding energy, has been used for centuries to ward off negative energies and create energetic boundaries.

## The Science Behind Black Tourmaline

Black Tourmaline is a complex borosilicate mineral that forms in the trigonal crystal system. Its unique structure allows it to generate electrical charges when heated or compressed, making it naturally piezoelectric and pyroelectric. This scientific property contributes to its reputation as an energy-transforming stone.

## Protective Properties

**Energetic Protection:**
- Shields against electromagnetic fields (EMF)
- Blocks negative energy from people and environments
- Creates a protective barrier around the aura
- Transmutes negative energy into positive energy
- Protects during psychic work and meditation

**Grounding Benefits:**
- Connects you to Earth's stabilizing energy
- Helps with anxiety and panic attacks
- Promotes mental clarity and focus
- Supports emotional stability
- Enhances physical vitality

**Spiritual Protection:**
- Guards against psychic attacks
- Protects during astral travel
- Cleanses the aura of negative attachments
- Strengthens your energetic boundaries
- Promotes spiritual grounding

## How to Use Black Tourmaline

**For EMF Protection:**
Place Black Tourmaline near electronic devices like computers, phones, and WiFi routers to neutralize electromagnetic radiation.

**For Home Protection:**
Position Black Tourmaline at the four corners of your property or in each room to create a protective grid.

**For Personal Protection:**
Carry a piece of Black Tourmaline in your pocket or wear it as jewelry when entering challenging environments.

**For Grounding:**
Hold Black Tourmaline during meditation or place it at your feet to enhance your connection to Earth energy.

## Working with Black Tourmaline

1. **Morning Protection Ritual**: Hold your Black Tourmaline and visualize a protective black light surrounding you for the day.

2. **Evening Cleansing**: Use Black Tourmaline to sweep your aura from head to toe, releasing any negative energy collected during the day.

3. **Workspace Clearing**: Keep Black Tourmaline on your desk to maintain a clear, focused work environment.

4. **Sleep Protection**: Place Black Tourmaline under your bed or pillow to protect against nightmares and negative dreams.

## Cleansing and Charging

Black Tourmaline is self-cleansing but benefits from regular energy clearing:
- Bury in earth overnight to recharge its grounding properties
- Use sound healing with singing bowls or bells
- Smudge with sage or palo santo
- Place on a bed of sea salt for deep cleansing

## Combining with Other Crystals

Black Tourmaline works beautifully with:
- **Clear Quartz**: Amplifies protective properties
- **Hematite**: Enhances grounding and stability
- **Smoky Quartz**: Adds transmutation and clearing energy
- **Selenite**: Provides high-vibrational protection

Black Tourmaline is an essential crystal for anyone seeking protection, grounding, and energetic clarity. Its powerful energy creates a safe space for spiritual growth while keeping you firmly rooted in the physical world.`,
          excerpt: 'Learn how Black Tourmaline, the ultimate protection crystal, shields against negative energy, EMF radiation, and psychic attacks while providing powerful grounding energy.',
          tags: ['black tourmaline', 'protection crystals', 'grounding', 'EMF protection', 'negative energy']
        },
        {
          title: 'Citrine: Manifesting Abundance and Joy',
          content: `Citrine, with its warm golden energy and sunny disposition, is known as the "Merchant's Stone" and the "Stone of Abundance." This radiant crystal carries the power of the sun, bringing joy, prosperity, and manifestation energy into your life.

## The Golden Energy of Success

Citrine's beautiful yellow to golden-brown color comes from trace amounts of iron within the quartz structure. This natural coloring process creates a crystal that vibrates with the energy of success, abundance, and personal power.

## Manifestation Properties

**Abundance and Prosperity:**
- Attracts wealth and financial success
- Enhances business and career opportunities
- Promotes generous and wise spending
- Increases confidence in financial decisions
- Supports entrepreneurial ventures

**Personal Power:**
- Boosts self-confidence and self-esteem
- Enhances creativity and imagination
- Promotes leadership qualities
- Increases motivation and drive
- Supports goal achievement

**Joy and Positivity:**
- Dispels negative thoughts and emotions
- Promotes optimism and happiness
- Enhances mental clarity and focus
- Supports emotional balance
- Brings warmth and light to dark situations

## Solar Plexus Chakra Connection

Citrine primarily resonates with the Solar Plexus Chakra, the center of personal power and will. When this chakra is balanced with Citrine's energy:
- You feel confident and empowered
- Decision-making becomes clearer
- Personal boundaries are strengthened
- Self-worth and self-respect increase
- You attract success naturally

## Manifestation Techniques with Citrine

**The Citrine Abundance Grid:**
1. Place a large Citrine point in the center
2. Surround with 8 smaller Citrine stones
3. Set clear intentions for what you want to manifest
4. Activate the grid with focused visualization

**Daily Abundance Affirmation:**
Hold Citrine each morning and affirm: "I am a magnet for abundance, success, and joy. Opportunities flow to me easily and effortlessly."

**Prosperity Meditation:**
Meditate with Citrine on your solar plexus while visualizing golden light filling your entire being with abundance energy.

## Business and Career Success

Citrine is particularly powerful for:
- Attracting new customers and clients
- Increasing sales and profits
- Enhancing negotiation skills
- Promoting fair and honest business practices
- Creating win-win situations

Place Citrine in your:
- Cash register or money drawer
- Office or workspace
- Business entrance
- Meeting rooms
- Computer area

## Natural vs. Heat-Treated Citrine

**Natural Citrine:**
- Pale yellow to smoky golden color
- More subtle, refined energy
- Rare and more expensive
- Gentle, sustained manifestation power

**Heat-Treated Citrine (Heated Amethyst):**
- Bright orange to deep amber color
- More intense, immediate energy
- More readily available
- Powerful for quick manifestation

Both types are effective; choose based on your personal preference and energy needs.

## Caring for Your Citrine

Citrine is one of the few crystals that never needs cleansing as it doesn't hold negative energy. However, you can:
- Charge it in sunlight to enhance its solar energy
- Use sound healing to amplify its vibration
- Program it with specific abundance intentions
- Combine with other manifestation stones

## Daily Practice with Citrine

1. **Morning Intention**: Hold Citrine and set your abundance intentions for the day
2. **Midday Boost**: Touch your Citrine when you need confidence or motivation
3. **Evening Gratitude**: Thank Citrine for the abundance it helped bring into your day

Citrine reminds us that abundance is our natural state and that we have the power to create the life we desire. By working with this joyful crystal, we align ourselves with the energy of success and open ourselves to receive all the good that life has to offer.`,
          excerpt: 'Discover how Citrine, the Merchant\'s Stone, can help you manifest abundance, boost confidence, and attract success in all areas of your life.',
          tags: ['citrine', 'abundance', 'manifestation', 'merchants stone', 'solar plexus chakra']
        },
        {
          title: 'Selenite: The Divine Light Crystal for Spiritual Cleansing',
          content: `Selenite, named after the Greek goddess of the moon Selene, is one of the most powerful cleansing and high-vibrational crystals available. This ethereal white crystal connects us directly to divine light and angelic realms, making it essential for spiritual practice and energy work.

## The Purity of Divine Light

Selenite is a form of gypsum that forms in perfect, translucent crystals. Its pure white color and ability to transmit light make it a natural conduit for high-frequency spiritual energy. Unlike most crystals, Selenite vibrates at such a high frequency that it never needs cleansing.

## Spiritual Properties

**Divine Connection:**
- Opens channels to angelic guidance
- Enhances connection to higher self
- Facilitates communication with spirit guides
- Promotes divine wisdom and insight
- Creates sacred space for spiritual work

**Energy Cleansing:**
- Clears negative energy from people, spaces, and objects
- Purifies and charges other crystals
- Removes energetic blockages
- Cleanses the aura and chakras
- Transmutes lower vibrations to higher ones

**Mental Clarity:**
- Enhances mental clarity and focus
- Promotes clear thinking and decision-making
- Reduces mental confusion and overwhelm
- Supports meditation and contemplation
- Increases psychic abilities

## Crown Chakra Activation

Selenite primarily works with the Crown Chakra, facilitating:
- Connection to universal consciousness
- Spiritual awakening and enlightenment
- Access to higher wisdom and knowledge
- Divine protection and guidance
- Transcendence of ego limitations

## Working with Selenite

**For Space Clearing:**
Place Selenite towers or wands in the corners of rooms to create a high-vibrational energy grid that continuously cleanses the space.

**For Crystal Cleansing:**
Place other crystals on or near Selenite overnight to cleanse and recharge their energy. Selenite can cleanse multiple crystals simultaneously.

**For Meditation:**
Hold a Selenite wand or sphere during meditation to enhance your connection to divine guidance and higher consciousness.

**For Aura Cleansing:**
Use a Selenite wand to sweep your aura from head to toe, removing any negative energy or attachments.

## Selenite Varieties and Forms

**Selenite Towers:**
- Perfect for space clearing and energy direction
- Create powerful energy columns
- Excellent for meditation altars

**Selenite Wands:**
- Ideal for energy healing and aura cleansing
- Can be used to direct energy precisely
- Perfect for chakra balancing

**Selenite Spheres:**
- Radiate energy in all directions
- Create harmonious energy fields
- Beautiful for meditation and display

**Selenite Charging Plates:**
- Perfect for cleansing and charging other crystals
- Create sacred space for crystal collections
- Maintain high vibrations continuously

## Angelic Communication

Selenite is particularly powerful for connecting with angelic beings:

1. **Angel Meditation**: Hold Selenite and ask for angelic guidance on specific questions
2. **Dream Work**: Place Selenite under your pillow to receive angelic messages in dreams
3. **Protection Ritual**: Create a Selenite grid around your bed for angelic protection during sleep
4. **Channeling**: Use Selenite to enhance your ability to channel divine messages

## Creating Sacred Space

Use Selenite to create powerful sacred spaces:
- Place four Selenite towers at the corners of your meditation area
- Create a Selenite grid around your altar or sacred objects
- Use Selenite wands to cast circles for ritual work
- Position Selenite spheres in areas where you do spiritual practice

## Care and Handling

**Important Notes:**
- Selenite is water-soluble - never cleanse with water
- It's relatively soft and can be scratched easily
- Keep away from humidity and moisture
- Handle gently to prevent chipping or breaking

**Maintenance:**
- Selenite is self-cleansing and never needs energy clearing
- Dust gently with a soft, dry cloth
- Recharge in moonlight to enhance lunar connection
- Store in a dry place away from other crystals that might scratch it

## Daily Spiritual Practice

1. **Morning Blessing**: Hold Selenite and ask for divine guidance for the day
2. **Midday Clearing**: Use Selenite to clear any negative energy you've encountered
3. **Evening Gratitude**: Thank the divine for the blessings received and ask for peaceful sleep

Selenite serves as a bridge between the earthly and divine realms, reminding us of our spiritual nature and our connection to the infinite. By working with this luminous crystal, we invite divine light into our lives and create space for miracles to unfold.`,
          excerpt: 'Explore the divine power of Selenite, the ultimate cleansing crystal that connects you to angelic realms and purifies energy on all levels.',
          tags: ['selenite', 'divine light', 'spiritual cleansing', 'angelic connection', 'crown chakra']
        }
      ];

      // Randomly select a fallback topic
      const selectedTopic = crystalTopics[Math.floor(Math.random() * crystalTopics.length)];

      generatedContent = {
        title: selectedTopic.title,
        content: selectedTopic.content,
        excerpt: selectedTopic.excerpt,
        tags: selectedTopic.tags
      };
    }

    // Create the new post object
    const newPost = {
      id: Date.now().toString(),
      title: generatedContent.title,
      content: generatedContent.content,
      excerpt: generatedContent.excerpt,
      tags: generatedContent.tags,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      isAIGenerated: true
    };

    return NextResponse.json({
      success: true,
      post: newPost,
      message: 'AI blog post generated successfully!'
    });

  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI content' },
      { status: 500 }
    );
  }
}
