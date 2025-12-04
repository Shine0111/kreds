// app/constants/Colors.ts

export type ThemeMode = "light" | "dark";

export interface ColorScheme {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  card: string;

  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;

  // UI Elements
  primary: string;
  border: string;
  divider: string;

  // Specific elements
  tabBar: string;
  bottomTabBar: string;
  tabBarActive: string;
  expandedContent: string;
  optionButton: string;
  optionButtonBorder: string;
}

export const Colors: Record<ThemeMode, ColorScheme> = {
  light: {
    // Backgrounds
    background: "#646668ff",
    backgroundSecondary: "#f5f5f5",
    card: "#ffffff",

    // Text
    text: "#25292E",
    textSecondary: "#555555",
    textTertiary: "#888888",

    // UI Elements
    primary: "#ffd33d",
    border: "#e0e0e0",
    divider: "#eeeeee",

    // Specific elements
    tabBar: "#646668ff",
    bottomTabBar: "#484949ff",
    tabBarActive: "#ffd33d",
    expandedContent: "#f8f8f8",
    optionButton: "#ffffff",
    optionButtonBorder: "#e0e0e0",
  },
  dark: {
    // Backgrounds
    background: "#121212",
    backgroundSecondary: "#1e1e1e",
    card: "#2c2c2c",

    // Text
    text: "#ffffff",
    textSecondary: "#b0b0b0",
    textTertiary: "#888888",

    // UI Elements
    primary: "#ffd33d",
    border: "#404040",
    divider: "#333333",

    // Specific elements
    tabBar: "#121212",
    bottomTabBar: "#252525",
    tabBarActive: "#ffd33d",
    expandedContent: "#242424",
    optionButton: "#333333",
    optionButtonBorder: "#404040",
  },
};
