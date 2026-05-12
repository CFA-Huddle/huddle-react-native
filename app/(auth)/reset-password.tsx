import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import React from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

const ResetPasswordScreen = () => {
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 20 : 20 };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardStickyView offset={offset} style={styles.footerContainer}>
        <View style={styles.formContainer}>
          <ResetPasswordForm />
        </View>
      </KeyboardStickyView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  footerContainer: {
    position: "absolute",
    width: "100%",
    bottom: Platform.OS === "ios" ? 0 : 100,
  },
});

export default ResetPasswordScreen;
