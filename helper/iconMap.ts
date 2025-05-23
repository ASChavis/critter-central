import Logo from "../assets/Logo.svg";
import Mochi from "../assets/Mochi.svg";

const LogoPng = require("../assets/Logo.png");
const MochiPng = require("../assets/Mochi.png");

export const ICONS = {
  logo: {
    native: Logo,
    web: LogoPng,
  },
  mochi: {
    native: Mochi,
    web: MochiPng,
  },

  // Add more here as needed
  // myIcon: {
  //   native: require('../assets/MyIcon.svg').default,
  //   web: require('../assets/MyIcon.svg'),
  // }
};

export type IconKey = keyof typeof ICONS;
