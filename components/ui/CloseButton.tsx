import CloseOutlineIcon from "@/assets/icons/close-outline.svg";
import { Apercu, Colors } from "@/constants/theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native";


interface ButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  style,
  contentStyle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <CloseOutlineIcon width={34} height={34} color={Colors.textPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 46,
    overflow: "hidden",
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontFamily: Apercu.bold,
    fontSize: 14,
  },
});

export default Button;
