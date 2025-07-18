import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { crystalDatabase } from '@/data/crystals';
import CrystalDetailPage from '@/components/CrystalDetailPage';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const crystal = crystalDatabase.find(c => c.id === params.id);
  
  if (!crystal) {
    return {
      title: 'Crystal Not Found',
      description: 'The requested crystal could not be found.',
    };
  }

  const title = `${crystal.name} - ${crystal.category} Crystal | CELESTIAL`;
  const description = `${crystal.description} Perfect for ${crystal.properties.slice(0, 3).join(', ')}. ${crystal.chakra} chakra stone. Price: $${crystal.price}. Free shipping over $50.`;

  return {
    title,
    description,
    keywords: [
      crystal.name.toLowerCase(),
      ...crystal.properties.map(p => p.toLowerCase()),
      crystal.category.toLowerCase(),
      crystal.chakra.toLowerCase() + ' chakra',
      ...crystal.colors.map(c => c.toLowerCase()),
      'crystal bracelet',
      'healing crystal',
      'gemstone jewelry'
    ],
    openGraph: {
      title,
      description,
      type: 'product',
      url: `https://celestialcrystals.com/crystals/${crystal.id}`,
      images: [
        {
          url: crystal.image || '/crystal-placeholder.jpg',
          width: 800,
          height: 600,
          alt: crystal.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [crystal.image || '/crystal-placeholder.jpg'],
    },
    alternates: {
      canonical: `/crystals/${crystal.id}`,
    },
  };
}

export async function generateStaticParams() {
  return crystalDatabase.map((crystal) => ({
    id: crystal.id,
  }));
}

export default function CrystalPage({ params }: Props) {
  const crystal = crystalDatabase.find(c => c.id === params.id);
  
  if (!crystal) {
    notFound();
  }

  return <CrystalDetailPage crystal={crystal} />;
}
