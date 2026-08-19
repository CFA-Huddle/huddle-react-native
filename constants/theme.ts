/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  background: "#F7F7F7",
  darkBackground: "#e3e3e3",
  primary: "#DD0033",
  gradientStart: "#FF033B",
  gradientEnd: "#CA0F1A",
  secondary: "#586771",
  muted: "#9AA5AC",
  disabled: "#CCCCCC",
  accent: "#005174",
  border: "#E1E7EB",
  card: "#FFFFFF",
  success: "#00A166",
  warning: "#FFB123",
  error: "#A20025",
  info: "#00B4CB",
  textPrimary: "#2D2926",
  textSecondary: "#5B6871",
  textMuted: "#9AA5AC",
  textInverse: "#FFFFFF",
  headerBackground: "#FFFFFF",
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const CustomFonts = {
  "Apercu-Regular": require("@/assets/fonts/Apercu-Regular.otf"),
  "Apercu-Medium": require("@/assets/fonts/Apercu-Medium.otf"),
  "Apercu-Bold": require("@/assets/fonts/Apercu-Bold.otf"),
};

export const Apercu = {
  regular: "Apercu-Regular",
  medium: "Apercu-Medium",
  bold: "Apercu-Bold",
};

export const TextStyles = {
  heading: {
    fontFamily: Apercu.bold,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  routeHeading: {
    fontFamily: Apercu.bold,
    fontSize: 20,
    color: Colors.textPrimary,
  },
  subHeading: {
    fontFamily: Apercu.medium,
    fontSize: 20,
    color: Colors.textSecondary,
  },
  body: {
    fontFamily: Apercu.regular,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  largeLabel: {
    fontFamily: Apercu.medium,
    fontSize: 18,
    color: Colors.textSecondary,
  },
  label: {
    fontFamily: Apercu.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: Apercu.bold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  subTitle: {
    fontFamily: Apercu.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  meta: {
    fontFamily: Apercu.medium,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  hint: {
    fontFamily: Apercu.medium,
    fontSize: 14,
    color: Colors.textMuted,
  },
};
