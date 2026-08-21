import EyeOffIcon from "@/assets/icons/eye-off-outline.svg";
import EyeIcon from "@/assets/icons/eye-outline.svg";
import { Apercu, Colors } from "@/constants/theme";
import { useShake } from "@/hooks/useShake";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  inputContainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  textFieldStyle?: TextStyle;
  inBottomSheet?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  containerStyle,
  inputContainerStyle,
  style,
  secureTextEntry,
  inBottomSheet = false,
  ...rest
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);
  const Input = inBottomSheet ? BottomSheetTextInput : TextInput;

  const togglePasswordVisibility = () => {
    setPasswordHidden((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const { shake, animatedStyle } = useShake();

  useEffect(() => {
    if (error) shake();
  }, [error, shake]);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Animated.View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : null,
          inputContainerStyle,
          animatedStyle,
        ]}
      >
        <Input
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry ? passwordHidden : false}
          clearTextOnFocus={false}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.hidePasswordButton}
            onPress={togglePasswordVisibility}
          >
            {passwordHidden ? (
              <EyeIcon width={24} height={24} color={Colors.muted} />
            ) : (
              <EyeOffIcon width={24} height={24} fill={Colors.muted} />
            )}
          </Pressable>
        )}
      </Animated.View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: Apercu.regular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerError: {
    borderColor: Colors.primary,
  },
  errorText: {
    color: Colors.primary,
    fontFamily: Apercu.medium,
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    padding: 20,
    fontSize: 16,
    fontFamily: Apercu.regular,
    color: Colors.textPrimary,
    flex: 1,
  },
  hidePasswordButton: {
    padding: 15,
  },
});

export default TextField;
