import { MD3LightTheme as DefaultTheme, MD3Theme } from "react-native-paper";

export const appTheme: MD3Theme = {
  ...DefaultTheme, // Base Paper theme
  colors: {
    ...DefaultTheme.colors,
    primary: "#7469B6", // Main brand color
    background: "#E1AFD1", // App background
    surface: "#FFE6E6", // Card and input backgrounds
    onSurface: "#7469B6", // Text color
    onPrimary: "#FFFFFF", // Text color for buttons
  },
};

// ✅ Add a default export for Expo Router compatibility
export default appTheme;
