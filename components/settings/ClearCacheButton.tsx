import TouchableCard from "@/components/ui/TouchableCard";
import { TextStyles } from "@/constants/theme";
import { useClearCache } from "@/hooks/useClearCache";
import React from "react";
import { Alert, StyleSheet, Text } from "react-native";

const ClearCacheButton = () => {
  const { mutate: clearCache, isPending } = useClearCache();

  const handlePress = () => {
    if (isPending) {
      return;
    }

    Alert.alert(
      "Clear Cache",
      "This removes cached app data and downloaded images. Content may need to reload.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => clearCache() },
      ],
    );
  };

  return (
    <TouchableCard onPress={handlePress} activeOpacity={0.6}>
      <Text style={styles.buttonText}>Clear Cache</Text>
    </TouchableCard>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
  },
});

export default ClearCacheButton;
