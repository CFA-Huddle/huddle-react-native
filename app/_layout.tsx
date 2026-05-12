import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import "react-native-reanimated";

import { CustomFonts } from "@/constants/theme";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { asyncStoragePersister, queryClient } from "@/queryClient";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Amplify } from "aws-amplify";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Spinner from "@/components/ui/Spinner";
import { LocationProvider } from "@/context/LocationContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID as string,
      userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID as string,
    },
  },
});

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
  const [fontsLoaded] = useFonts(CustomFonts);
  const { isCheckingAuth, isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (fontsLoaded && !isCheckingAuth) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isCheckingAuth]);

  if (!fontsLoaded || isCheckingAuth) {
    return <Spinner isVisible={true} />;
  }

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(user)/[id]" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider persistOptions={{ persister: asyncStoragePersister }} client={queryClient}>
        <AuthProvider>
          <BottomSheetModalProvider>
            <LocationProvider>
              <KeyboardProvider>
                <SafeAreaProvider>
                  <InitialLayout />
                </SafeAreaProvider>
              </KeyboardProvider>
            </LocationProvider>
          </BottomSheetModalProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
