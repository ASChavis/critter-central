import Logo from "../assets/Logo.svg";

const LogoPng = require("../assets/Logo.png");

export const ICONS = {
  logo: {
    native: Logo,
    web: LogoPng,
  },
  // Add more here as needed
  // myIcon: {
  //   native: require('../assets/MyIcon.svg').default,
  //   web: require('../assets/MyIcon.svg'),
  // }
};

export type IconKey = keyof typeof ICONS;
