import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Card from "./Card";

interface TouchableCardProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  activeOpacity: number;
}

const TouchableCard: React.FC<TouchableCardProps> = ({ children, style, onPress, activeOpacity }) => {
  return (
    <>
        <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
            <Card style={[styles.touchableCard, style]}>{children}</Card>
        </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  touchableCard: {
    padding: 20,
  }
});

export default TouchableCard;
