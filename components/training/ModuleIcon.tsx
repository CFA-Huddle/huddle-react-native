import {
  MODULE_ICON_COMPONENTS,
  TrainingModuleIcon,
} from "@/constants/moduleIcons";
import { Image } from "expo-image";
import { View } from "react-native";

interface ModuleIconProps {
  icon: string;
  size?: number;
}

export default function ModuleIcon({ icon, size = 40 }: ModuleIconProps) {
  const Icon = MODULE_ICON_COMPONENTS[icon as TrainingModuleIcon];

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
