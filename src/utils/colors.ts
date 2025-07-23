// Utility functions for color mapping

export const getColorHex = (colorName: string): string => {
  const color = colorName.toLowerCase();
  
  switch (color) {
    case 'red':
    case 'crimson':
    case 'ruby':
      return '#ef4444';
      
    case 'blue':
    case 'sapphire':
    case 'navy':
      return '#3b82f6';
      
    case 'green':
    case 'emerald':
    case 'jade':
      return '#22c55e';
      
    case 'purple':
    case 'violet':
    case 'amethyst':
    case 'lavender':
      return '#9333ea';
      
    case 'yellow':
    case 'golden':
    case 'gold':
    case 'citrine':
      return '#eab308';
      
    case 'orange':
    case 'amber':
    case 'coral':
      return '#f97316';
      
    case 'pink':
    case 'rose':
    case 'magenta':
      return '#ec4899';
      
    case 'turquoise':
    case 'aqua':
    case 'cyan':
    case 'light blue':
      return '#06b6d4';
      
    case 'white':
    case 'clear':
    case 'crystal':
      return '#ffffff';
      
    case 'black':
    case 'obsidian':
    case 'onyx':
      return '#1f2937';
      
    case 'gray':
    case 'grey':
    case 'silver':
    case 'metallic gray':
      return '#6b7280';
      
    case 'brown':
    case 'bronze':
    case 'copper':
      return '#92400e';
      
    case 'mint':
    case 'seafoam':
      return '#10b981';
      
    case 'indigo':
      return '#4f46e5';
      
    case 'teal':
      return '#14b8a6';
      
    case 'lime':
      return '#84cc16';
      
    case 'sky':
    case 'sky blue':
      return '#0ea5e9';
      
    case 'slate':
      return '#475569';
      
    case 'stone':
      return '#78716c';
      
    case 'neutral':
      return '#737373';
      
    case 'zinc':
      return '#71717a';
      
    default:
      return '#9333ea'; // Default purple
  }
};
