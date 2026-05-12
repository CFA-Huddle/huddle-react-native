import LoginForm from "@/components/auth/LoginForm";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

const LoginScreen = () => {
  const offset = { closed: 0, opened: Platform.OS === "ios" ? 20 : 20 };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardStickyView offset={offset} style={styles.footerContainer}>
        <View style={styles.formContainer}>
          <LoginForm />
        </View>
      </KeyboardStickyView>
    </TouchableWithoutFeedback>
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
    bottom: 0,
  },
});

export default LoginScreen;
