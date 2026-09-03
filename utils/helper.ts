import { Linking } from "react-native";

export function openSafeUrl(url: string) {
  const hasProtocol = /^https?:\/\//i.test(url);
  const finalUrl = hasProtocol ? url : `https://${url}`;

  Linking.openURL(finalUrl).catch((err) =>
    console.error("Failed to open URL:", err),
  );
}
