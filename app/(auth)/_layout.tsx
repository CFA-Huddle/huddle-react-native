import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        contentStyle: {
          backgroundColor: "transparent",
        },
        animation: "fade_from_bottom",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new-password" />
    </Stack>
  );
}
