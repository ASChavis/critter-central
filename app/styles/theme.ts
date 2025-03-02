import { MD3LightTheme as DefaultTheme, MD3DarkTheme, MD3Theme } from "react-native-paper";
import { colors } from "./colors";

export const lightTheme: MD3Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.text, // Use onSurface for text
    onPrimary: "#FFFFFF", // Text color for buttons with primary background
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.primary,
    background: "#121212",
    surface: "#1E1E1E",
    onSurface: "#E0E0E0", // Light text on dark background
    onPrimary: "#FFFFFF",
  },
};


