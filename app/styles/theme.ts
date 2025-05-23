import { MD3LightTheme as DefaultTheme, MD3Theme } from "react-native-paper";

export const appTheme: MD3Theme = {
  ...DefaultTheme, // Base Paper theme
  colors: {
    ...DefaultTheme.colors,
    primary: "#AA60C8", // Main brand color
    background: "#CAEDFF", // App background
    surface: "#EABDE6", // Card and input backgrounds
    onSurface: "rgb(170, 96, 200)", // Text color
    onPrimary: "#FFFFFF", // Text color for buttons
  },
};

export default appTheme;
