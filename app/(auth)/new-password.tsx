import AuthBackground from "@/components/auth/AuthBackground";
import NewPasswordLoginForm from "@/components/auth/NewPasswordLoginForm";
import React from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

const NewPasswordScreen = () => {
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 20 : 20 };

  return (
    <AuthBackground>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardStickyView offset={offset} style={styles.footerContainer}>
          <View style={styles.formContainer}>
            <NewPasswordLoginForm />
          </View>
        </KeyboardStickyView>
      </TouchableWithoutFeedback>
    </AuthBackground>
  );
};

const styles = StyleSheet.create({
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

export default NewPasswordScreen;
