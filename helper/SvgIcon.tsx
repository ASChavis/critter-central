import React from "react";
import { Platform, Image, ImageStyle, StyleProp } from "react-native";
import type { SvgProps } from "react-native-svg";
import { ICONS, IconKey } from "./iconMap";

interface SvgIconProps extends SvgProps {
  icon: IconKey;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

const SvgIcon: React.FC<SvgIconProps> = ({
  icon,
  width = 24,
  height = 24,
  style,
  ...rest
}) => {
  const iconData = ICONS[icon];

  if (!iconData) {
    console.warn(`SvgIcon: Unknown icon "${icon}"`);
    return null;
  }

  if (Platform.OS === "web") {
    console.log(`[SvgIcon] iconData.web for "${icon}":`, iconData.web);

    return (
      <Image
        source={iconData.web}
        style={[{ width, height }, style]}
        alt={`${icon}-icon`}
      />
    );
  }

  const SvgComponent = iconData.native;
  return <SvgComponent width={width} height={height} {...rest} />;
};

export default SvgIcon;
