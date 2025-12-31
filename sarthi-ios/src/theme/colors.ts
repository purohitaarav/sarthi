// Modern, Interfaith, Neutral Theme (Notion/Linear Inspired)
export const colors = {
  // Primary Action (Green - Trustworthy, Calm, Growth)
  primary: {
    50: '#F2FCF5',  // Very subtle green background
    100: '#E3F9E9', // Lighter green
    200: '#C1F0D0', // Soft green accent
    300: '#14532D',
    400: '#14532D',
    500: '#14532D', // Standard Success/Growth Green
    600: '#14532D',
    700: '#14532D', // Primary Action Button (Accessible Green)
    800: '#14532D', // Darker Green for text
    900: '#14532D',
  },

  // Neutrals (Warm Stone Grays for Text & UI)
  gray: {
    50: '#FAFAF9',  // Primary App Background (Warm Off-White)
    100: '#F5F5F4', // Secondary Background / Cards
    200: '#E7E5E4', // Borders
    300: '#D6D3D1', // Disabled states
    400: '#A8A29E', // Icons / Placeholder text
    500: '#78716C', // Tertiary Text
    600: '#57534E', // Secondary Text
    700: '#44403C', // Primary Text (Softer than black)
    800: '#292524', // Headings
    900: '#1C1917', // Stark Text
  },

  // Semantic mappings to maintain backward compatibility with 'spiritual' naming
  // while enforcing the new aesthetic.
  spiritual: {
    blue: {
      light: '#E3F9E9', // Maps to Primary 100
      DEFAULT: '#041e0eff', // Maps to Primary 700 (Main Action)
      dark: '#092c17ff',    // Maps to Primary 900
    },
    gold: {
      light: '#F5F5F4', // Maps to Gray 100
      DEFAULT: '#57534E', // Maps to Gray 600 (Neutral Icon)
      dark: '#292524',    // Maps to Gray 800
    },
    lotus: {
      pink: '#E7E5E4',   // Neutral
      purple: '#D6D3D1', // Neutral
    },
    sacred: {
      saffron: '#F2FCF5', // Very light green
      cream: '#FAFAF9',   // Off-white background
    }
  },

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Gradients removed in favor of solid, clean backgrounds
export const gradients = {
  spiritual: ['#FAFAF9', '#FAFAF9'],
  serene: ['#FAFAF9', '#FAFAF9'],
  divine: ['#FAFAF9', '#FAFAF9'],
};

