import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="account-information"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="team-membership"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="invite"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
