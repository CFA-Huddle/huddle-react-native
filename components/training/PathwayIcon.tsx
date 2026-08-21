import {
  getPathwayIconFilename,
  PATHWAY_ICON_COMPONENTS,
} from "@/constants/pathwayIcons";
import { Image } from "expo-image";
import { View } from "react-native";

interface PathwayIconProps {
  icon: string;
  size?: number;
}

export default function PathwayIcon({ icon, size = 40 }: PathwayIconProps) {
  const filename = getPathwayIconFilename(icon);

  const Icon = PATHWAY_ICON_COMPONENTS[filename];

  if (Icon) {
    return <Icon width={size} height={size} />;
  }

  if (icon.startsWith("http")) {
    return (
      <Image
        source={icon}
        style={{ width: size, height: size }}
        cachePolicy="memory-disk"
      />
    );
  }

  return <View style={{ width: size, height: size }} />;
}
