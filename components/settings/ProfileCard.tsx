import { TextStyles } from "@/constants/theme";
import { useLocationContext } from "@/context/LocationContext";
import { LocationLabels } from "@/types/Location";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Avatar from "../shared/Avatar";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

interface ProfileCardProps {
  name: string;
  avatarUrl?: string;
  role: string;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ProfileCardSkeleton: React.FC = () => {
  return (
    <>
      <View style={styles.header}>
        <Skeleton width={28} height={28} borderRadius={14} />
        <Skeleton width={140} height={18} borderRadius={4} />
      </View>
      <View style={styles.footer}>
        <Skeleton width={80} height={18} borderRadius={4} />
        <Skeleton width={120} height={18} borderRadius={4} />
      </View>
    </>
  );
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  avatarUrl,
  role,
  isLoading = false,
  style,
}) => {
  const { selectedLocation } = useLocationContext();

  return (
    <Card style={[styles.card, style]}>
      {isLoading ? (
        <ProfileCardSkeleton />
      ) : (
        <>
          <View style={styles.header}>
            <Avatar avatarUrl={avatarUrl}></Avatar>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.role}>{role}</Text>
            <Text style={styles.locations}>
              {LocationLabels[selectedLocation ?? ""]} {selectedLocation ?? ""}
            </Text>
          </View>
        </>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
  },
  card: {
    padding: 15,
    gap: 9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  footer: {
    gap: 4,
  },
  name: {
    fontFamily: TextStyles.title.fontFamily,
    fontSize: TextStyles.title.fontSize,
    color: TextStyles.title.color,
  },
  role: {
    fontFamily: TextStyles.meta.fontFamily,
    fontSize: TextStyles.meta.fontSize,
    color: TextStyles.meta.color,
  },
  locations: {
    fontFamily: TextStyles.meta.fontFamily,
    fontSize: TextStyles.meta.fontSize,
    color: TextStyles.meta.color,
  },
});

export default ProfileCard;
