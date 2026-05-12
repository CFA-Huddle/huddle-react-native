import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

const transparentTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

export default function AuthLayout() {
  return (
    <ImageBackground
      source={require("@/assets/images/waffle-fry-pattern.jpg")}
      resizeMode="cover"
      style={styles.image}
    >
      <ThemeProvider value={transparentTheme}>
        <Stack
          screenOptions={{
            gestureEnabled: false,
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animationTypeForReplace: "pop",
            animation: "fade_from_bottom",
            animationDuration: 200,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="new-password" />
          <Stack.Screen name="reset-password" />
        </Stack>
      </ThemeProvider>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: { flex: 1 },
});
