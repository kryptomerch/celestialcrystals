import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // For now, return mock AI-generated posts
    const mockAIPosts = [
      {
        id: '1',
        title: 'The Healing Power of Clear Quartz: A Complete Guide',
        content: `Clear Quartz, often called the "Master Healer," is one of the most versatile and powerful crystals in the mineral kingdom. This remarkable stone has been revered for centuries for its ability to amplify energy, enhance clarity, and promote healing on all levels.

## What Makes Clear Quartz Special?

Clear Quartz is composed of silicon dioxide and forms in the hexagonal crystal system. Its perfect clarity and brilliant shine make it instantly recognizable, but its true power lies in its unique energetic properties.

## Healing Properties

**Physical Healing:**
- Boosts immune system function
- Enhances overall vitality and energy
- Supports the nervous system
- Aids in pain relief and inflammation reduction

**Emotional Healing:**
- Clears mental fog and confusion
- Enhances focus and concentration
- Promotes emotional balance
- Helps release negative thought patterns

**Spiritual Healing:**
- Amplifies meditation practices
- Enhances psychic abilities
- Connects you to higher consciousness
- Cleanses and aligns all chakras

## How to Use Clear Quartz

1. **Meditation**: Hold a Clear Quartz point during meditation to enhance focus and spiritual connection.

2. **Energy Amplification**: Place Clear Quartz near other crystals to amplify their healing properties.

3. **Space Clearing**: Position Clear Quartz points in the corners of a room to create a protective energy grid.

4. **Programming**: Clear Quartz can be programmed with specific intentions through focused meditation.

## Caring for Your Clear Quartz

To maintain its powerful energy, cleanse your Clear Quartz regularly using:
- Moonlight (especially full moon)
- Running water
- Sage or palo santo smoke
- Sound healing with singing bowls

Clear Quartz is truly a gift from the Earth, offering endless possibilities for healing, growth, and spiritual development. Whether you're new to crystals or an experienced practitioner, Clear Quartz deserves a place in your collection.`,
        excerpt: 'Discover the incredible healing properties of Clear Quartz, the Master Healer crystal that amplifies energy and promotes healing on all levels.',
        tags: ['clear quartz', 'healing crystals', 'master healer', 'crystal guide', 'energy amplification'],
        status: 'draft',
        createdAt: new Date().toISOString(),
        isAIGenerated: true
      },
      {
        id: '2',
        title: 'Amethyst: Your Gateway to Spiritual Awakening',
        content: `Amethyst, with its stunning purple hues and powerful spiritual energy, has been treasured throughout history as a stone of wisdom, protection, and spiritual growth. This beautiful variety of quartz offers profound healing benefits for mind, body, and spirit.

## The Spiritual Significance of Amethyst

Known as the "Stone of Spiritual Wisdom," Amethyst has been used by spiritual seekers for thousands of years. Ancient Greeks believed it could prevent intoxication, while medieval soldiers wore it for protection in battle.

## Healing Properties of Amethyst

**Mental & Emotional Benefits:**
- Calms anxiety and stress
- Enhances intuition and psychic abilities
- Promotes restful sleep and vivid dreams
- Helps overcome addictive behaviors
- Increases self-awareness and spiritual insight

**Physical Healing:**
- Supports the nervous system
- Aids in hormone regulation
- Boosts immune system function
- Helps with headaches and migraines
- Supports detoxification processes

**Chakra Connection:**
Amethyst primarily resonates with the Crown Chakra, facilitating:
- Connection to higher consciousness
- Enhanced meditation experiences
- Spiritual protection and purification
- Access to divine wisdom and guidance

## Working with Amethyst

**For Meditation:**
Hold an Amethyst cluster or point during meditation to deepen your practice and enhance spiritual connection.

**For Sleep:**
Place Amethyst under your pillow or on your nightstand to promote restful sleep and meaningful dreams.

**For Protection:**
Wear Amethyst jewelry or carry a small piece to create a protective energy field around you.

**For Space Clearing:**
Place Amethyst geodes or clusters in your home to maintain high vibrational energy and spiritual protection.

## Choosing Your Amethyst

Amethyst comes in various forms:
- **Light Lavender**: Gentle, soothing energy perfect for beginners
- **Deep Purple**: Powerful spiritual energy for advanced practitioners
- **Chevron Amethyst**: Enhanced focus and clarity
- **Ametrine**: Combines Amethyst and Citrine energies

## Care and Cleansing

Keep your Amethyst energetically clear by:
- Placing it in moonlight overnight
- Using sage or incense smoke
- Burying it in sea salt for 24 hours
- Rinsing with spring water

Amethyst is truly a gateway to higher consciousness, offering protection, wisdom, and spiritual growth to all who work with its energy. Whether you're seeking peace, protection, or spiritual awakening, Amethyst is a powerful ally on your journey.`,
        excerpt: 'Explore the spiritual power of Amethyst, the stone of wisdom that enhances intuition, promotes peaceful sleep, and opens doorways to higher consciousness.',
        tags: ['amethyst', 'spiritual awakening', 'crown chakra', 'meditation', 'crystal healing'],
        status: 'review',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isAIGenerated: true
      },
      {
        id: '3',
        title: 'Rose Quartz: The Ultimate Stone of Unconditional Love',
        content: `Rose Quartz, with its gentle pink energy and heart-opening properties, is perhaps the most beloved crystal for matters of love, compassion, and emotional healing. Known as the "Stone of Unconditional Love," this beautiful crystal teaches us the true essence of love in all its forms.

## The Energy of Love

Rose Quartz carries the soft, nurturing energy of the Divine Feminine, offering comfort, healing, and emotional support. Its gentle vibration makes it perfect for those new to crystal healing, while its profound effects continue to benefit experienced practitioners.

## Healing Properties

**Emotional Healing:**
- Opens and heals the heart chakra
- Promotes self-love and self-acceptance
- Attracts love in all forms
- Heals emotional wounds and trauma
- Reduces stress and anxiety
- Encourages forgiveness and compassion

**Relationship Benefits:**
- Strengthens existing relationships
- Attracts new romantic partnerships
- Improves family dynamics
- Enhances friendships
- Promotes understanding and empathy

**Physical Healing:**
- Supports heart and circulatory system
- Aids in fertility and reproductive health
- Helps with skin conditions
- Promotes youthful appearance
- Supports overall vitality

## Working with Rose Quartz

**For Self-Love:**
Hold Rose Quartz over your heart during meditation and affirm: "I am worthy of love and I love myself completely."

**For Relationships:**
Place Rose Quartz in the relationship corner of your bedroom (far right corner from the entrance) to attract or strengthen love.

**For Healing:**
Create a Rose Quartz elixir by placing the crystal in water overnight (use indirect method for safety) and drink to promote inner healing.

**For Children:**
Rose Quartz is perfect for children's rooms, promoting peaceful sleep and emotional security.

## Rose Quartz Varieties

- **Pale Pink**: Gentle, nurturing energy
- **Deep Rose**: Passionate, intense love energy
- **Star Rose Quartz**: Enhanced spiritual love and connection
- **Rose Quartz with Inclusions**: Grounding love energy

## Daily Practice with Rose Quartz

1. **Morning Affirmation**: Hold Rose Quartz and set loving intentions for the day
2. **Heart Chakra Meditation**: Place on heart center for 10-15 minutes
3. **Bedtime Gratitude**: Thank Rose Quartz for the love it brought into your day

## Cleansing and Care

Rose Quartz is sensitive to sunlight, which can fade its color. Cleanse using:
- Moonlight (especially new moon for new beginnings)
- Sound healing
- Gentle spring water
- Rose or lavender incense

Rose Quartz reminds us that love is the most powerful force in the universe. By working with this gentle yet profound crystal, we open ourselves to giving and receiving love in its purest form, creating a life filled with compassion, joy, and deep connection.`,
        excerpt: 'Discover how Rose Quartz, the stone of unconditional love, can open your heart, heal emotional wounds, and attract love in all its beautiful forms.',
        tags: ['rose quartz', 'unconditional love', 'heart chakra', 'self-love', 'relationships'],
        status: 'published',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        isAIGenerated: true
      }
    ];

    return NextResponse.json({
      success: true,
      posts: mockAIPosts
    });

  } catch (error) {
    console.error('Error fetching AI content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI content' },
      { status: 500 }
    );
  }
}
