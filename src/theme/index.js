/**
 * Theme configuration for the e-commerce application
 * This file centralizes colors and UI values for consistent styling
 */

export const theme = {
  colors: {
    // Primary brand color - Modern Purple/Violet
    primary: {
      50: "#F5F3FF",
      100: "#EDE9FE",
      200: "#DDD6FE",
      300: "#C4B5FD",
      400: "#A78BFA",
      500: "#8B5CF6", // Main violet color
      600: "#7C3AED", // Default button color
      700: "#6D28D9", // Hover state
      800: "#5B21B6",
      900: "#4C1D95",
    },
    // Secondary brand color - Teal accent
    secondary: {
      50: "#EFFDFB",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6", // Main teal color
      600: "#0D9488",
      700: "#0F766E",
      800: "#115E59",
      900: "#134E4A",
    },
    // Gray scale - Neutral sophisticated gray
    gray: {
      50: "#FAFAFA", // Background color
      100: "#F4F4F5", // Light background
      200: "#E4E4E7", // Borders
      300: "#D4D4D8", // Dividers
      400: "#A1A1AA", // Disabled text
      500: "#71717A", // Secondary text
      600: "#52525B", // Body text
      700: "#3F3F46",
      800: "#27272A", // Heading text
      900: "#18181B", // Footer background
    },
    // Status colors
    emerald: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      500: "#10B981", // Success
      600: "#059669",
      700: "#047857",
    },
    rose: {
      50: "#FFF1F2",
      100: "#FFE4E6",
      500: "#F43F5E", // Error
      600: "#E11D48",
      700: "#BE123C",
    },
    amber: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      500: "#F59E0B", // Warning
      600: "#D97706",
      700: "#B45309",
    },
  },
  shadows: {
    sm: "0 2px 4px 0 rgba(0, 0, 0, 0.03)",
    md: "0 6px 12px -2px rgba(0, 0, 0, 0.08), 0 3px 7px -3px rgba(0, 0, 0, 0.04)",
    lg: "0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 6px 12px -6px rgba(0, 0, 0, 0.04)",
    xl: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 12px 24px -8px rgba(0, 0, 0, 0.06)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    color: "0 10px 25px -5px rgba(139, 92, 246, 0.15)",
  },
  borderRadius: {
    xs: "0.125rem", // 2px
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    full: "9999px", // Fully rounded (for circles, pills)
  },

  // Typography settings
  typography: {
    fonts: {
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      heading:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SF Mono', 'Roboto Mono', Menlo, monospace",
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacings: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
};

// Animation variants for common use
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { duration: 0.2 },
  },
  // For staggered children animations
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
};

export default theme;
