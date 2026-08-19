import { Apercu, Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";

interface VariantConfig {
  contentColor: string;
  containerStyle: ViewStyle;
  useGradient: boolean;
  activeOpacity: number;
  disabledStyle: ViewStyle;
}

const VARIANT_CONFIG = {
  primary: {
    contentColor: Colors.textInverse,
    containerStyle: {},
    useGradient: true,
    activeOpacity: 0.75,
    disabledStyle: {
      backgroundColor: Colors.disabled,
    },
  },
  secondary: {
    contentColor: Colors.primary,
    containerStyle: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    useGradient: false,
    activeOpacity: 0.6,
    disabledStyle: {},
  },
  outlined: {
    contentColor: Colors.secondary,
    containerStyle: {
      backgroundColor: "#ffffff",
      borderWidth: 1,
      borderColor: Colors.border,
    },
    useGradient: false,
    activeOpacity: 0.6,
    disabledStyle: {},
  },
  transparent: {
    contentColor: Colors.primary,
    containerStyle: {},
    useGradient: false,
    activeOpacity: 0.6,
    disabledStyle: {},
  },
} satisfies Record<string, VariantConfig>;

interface ButtonProps {
  text: string;
  variant?: keyof typeof VARIANT_CONFIG;
  disabled?: boolean;
  iconSize?: number;
  iconLeft?: React.FC<SvgProps>;
  iconRight?: React.FC<SvgProps>;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const GradientWrapper: React.FC<{
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ style, children }) => (
  <LinearGradient
    colors={[Colors.gradientStart, Colors.gradientEnd]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={style}
  >
    {children}
  </LinearGradient>
);

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  disabled = false,
  iconSize = 16,
  iconLeft: IconLeft,
  iconRight: IconRight,
  onPress,
  style,
  contentStyle,
}) => {
  const {
    contentColor,
    containerStyle,
    useGradient,
    activeOpacity,
    disabledStyle,
  } = VARIANT_CONFIG[variant];
  const ContentWrapper = useGradient && !disabled ? GradientWrapper : View;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        disabled ? disabledStyle : containerStyle,
        style,
      ]}
    >
      <ContentWrapper style={[styles.content, contentStyle]}>
        {IconLeft && <IconLeft color={contentColor} width={iconSize} height={iconSize} />}
        <Text style={[styles.text, { color: contentColor }]}>{text}</Text>
        {IconRight && <IconRight color={contentColor} width={iconSize} height={iconSize} />}
      </ContentWrapper>
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
