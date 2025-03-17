import { MD3LightTheme as DefaultTheme, MD3Theme } from "react-native-paper";

export const appTheme: MD3Theme = {
  ...DefaultTheme, // Base Paper theme
  colors: {
    ...DefaultTheme.colors,
    primary: "#AA60C8", // Main brand color
    background: "#FFDFEF", // App background
    surface: "#EABDE6", // Card and input backgrounds
    onSurface: "#D69ADE", // Text color
    onPrimary: "#FFFFFF", // Text color for buttons
  },
};

// ✅ Add a default export for Expo Router compatibility
export default appTheme;
