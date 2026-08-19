import { TextStyles } from "@/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface RouteHeadingProps {
  children: string;
  style?: StyleProp<ViewStyle>;
}

const RouteHeading: React.FC<RouteHeadingProps> = ({ children, style }) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 15,
    color: TextStyles.routeHeading.color,
    fontFamily: TextStyles.routeHeading.fontFamily,
    fontSize: TextStyles.routeHeading.fontSize,
  },
});

export default RouteHeading;
