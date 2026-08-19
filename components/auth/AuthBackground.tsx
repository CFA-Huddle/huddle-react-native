import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";

const waffleFryPattern = require("@/assets/images/waffle-fry-pattern.jpg");

type AuthBackgroundProps = {
  children: React.ReactNode;
};

const AuthBackground = ({ children }: AuthBackgroundProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={waffleFryPattern}
        style={styles.image}
        contentFit="cover"
        pointerEvents="none"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
});

export default AuthBackground;
