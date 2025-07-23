// Utility functions for crystal glow effects based on colors

export interface GlowEffect {
  boxShadow: string;
  borderColor: string;
  glowClass: string;
}

// Map crystal colors to glow effects
export const getGlowEffect = (colors: string[]): GlowEffect => {
  const primaryColor = colors[0]?.toLowerCase() || '';
  
  switch (primaryColor) {
    case 'blue':
    case 'turquoise':
    case 'aqua':
    case 'light blue':
      return {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        borderColor: 'rgb(59, 130, 246)',
        glowClass: 'crystal-glow-blue'
      };
      
    case 'purple':
    case 'violet':
    case 'amethyst':
    case 'lavender':
      return {
        boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
        borderColor: 'rgb(147, 51, 234)',
        glowClass: 'crystal-glow-purple'
      };
      
    case 'green':
    case 'emerald':
    case 'jade':
    case 'mint':
      return {
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)',
        borderColor: 'rgb(34, 197, 94)',
        glowClass: 'crystal-glow-green'
      };
      
    case 'pink':
    case 'rose':
    case 'magenta':
      return {
        boxShadow: '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
        borderColor: 'rgb(236, 72, 153)',
        glowClass: 'crystal-glow-pink'
      };
      
    case 'red':
    case 'crimson':
    case 'ruby':
      return {
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3)',
        borderColor: 'rgb(239, 68, 68)',
        glowClass: 'crystal-glow-red'
      };
      
    case 'orange':
    case 'amber':
    case 'coral':
      return {
        boxShadow: '0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(249, 115, 22, 0.3)',
        borderColor: 'rgb(249, 115, 22)',
        glowClass: 'crystal-glow-orange'
      };
      
    case 'yellow':
    case 'golden':
    case 'gold':
    case 'citrine':
      return {
        boxShadow: '0 0 20px rgba(234, 179, 8, 0.5), 0 0 40px rgba(234, 179, 8, 0.3)',
        borderColor: 'rgb(234, 179, 8)',
        glowClass: 'crystal-glow-yellow'
      };
      
    case 'white':
    case 'clear':
    case 'crystal':
      return {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)',
        borderColor: 'rgb(255, 255, 255)',
        glowClass: 'crystal-glow-white'
      };
      
    case 'black':
    case 'obsidian':
    case 'onyx':
      return {
        boxShadow: '0 0 20px rgba(75, 85, 99, 0.5), 0 0 40px rgba(75, 85, 99, 0.3)',
        borderColor: 'rgb(75, 85, 99)',
        glowClass: 'crystal-glow-black'
      };
      
    case 'gray':
    case 'grey':
    case 'silver':
    case 'metallic gray':
      return {
        boxShadow: '0 0 20px rgba(156, 163, 175, 0.5), 0 0 40px rgba(156, 163, 175, 0.3)',
        borderColor: 'rgb(156, 163, 175)',
        glowClass: 'crystal-glow-gray'
      };
      
    case 'brown':
    case 'bronze':
    case 'copper':
      return {
        boxShadow: '0 0 20px rgba(180, 83, 9, 0.5), 0 0 40px rgba(180, 83, 9, 0.3)',
        borderColor: 'rgb(180, 83, 9)',
        glowClass: 'crystal-glow-brown'
      };
      
    default:
      // Default subtle glow
      return {
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        borderColor: 'rgb(139, 92, 246)',
        glowClass: 'crystal-glow-default'
      };
  }
};

// Generate CSS class name for glow effect
export const getCrystalGlowClass = (colors: string[]): string => {
  const effect = getGlowEffect(colors);
  return effect.glowClass;
};

// Generate inline styles for glow effect
export const getCrystalGlowStyles = (colors: string[]): React.CSSProperties => {
  const effect = getGlowEffect(colors);
  return {
    boxShadow: effect.boxShadow,
    borderColor: effect.borderColor,
    borderWidth: '2px',
    borderStyle: 'solid'
  };
};
