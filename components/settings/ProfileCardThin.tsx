import Avatar from "@/components/shared/Avatar";
import Card from "@/components/ui/Card";
import { Colors, TextStyles } from "@/constants/theme";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface ProfileCardProps {
  name: string;
  isYourself: boolean;
  avatarUrl?: string;
  locations: string[];
  role: string;
  style?: StyleProp<ViewStyle>;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  isYourself,
  avatarUrl,
  locations,
  role,
  style,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <Avatar avatarUrl={avatarUrl} size={42}/>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
            {isYourself && <Text style={styles.yourself}> (You)</Text>}
          </Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
  },
  card: {
    marginBottom: 12,
    padding: 15,
    gap: 9,
  },
  nameContainer: {
    gap: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footer: {
    gap: 4,
  },
  yourself: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.title.fontSize,
    color: Colors.muted,
  },
  name: {
    fontFamily: TextStyles.title.fontFamily,
    fontSize: TextStyles.title.fontSize,
    color: TextStyles.title.color,
  },
  role: {
    fontFamily: TextStyles.subTitle.fontFamily,
    fontSize: TextStyles.subTitle.fontSize,
    color: TextStyles.subTitle.color,
  },
  locations: {
    fontFamily: TextStyles.meta.fontFamily,
    fontSize: TextStyles.meta.fontSize,
    color: TextStyles.meta.color,
  },
});

export default ProfileCard;
