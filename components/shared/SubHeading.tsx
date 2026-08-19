import { TextStyles } from "@/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface SubHeadingProps {
  children: string;
  style?: StyleProp<ViewStyle>;
}

const SubHeading: React.FC<SubHeadingProps> = ({ children, style }) => {
  return <Text style={styles.text}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 15,
    color: TextStyles.subHeading.color,
    fontFamily: TextStyles.subHeading.fontFamily,
    fontSize: TextStyles.subHeading.fontSize,
  },
});

export default SubHeading;
