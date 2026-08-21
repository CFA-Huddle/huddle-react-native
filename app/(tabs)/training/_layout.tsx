import { Stack } from "expo-router";

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="team-training"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="module-editor"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="training-log"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
