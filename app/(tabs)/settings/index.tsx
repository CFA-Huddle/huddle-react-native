import LogoutButton from "@/components/auth/LogoutButton";
import ProfileCard from "@/components/settings/ProfileCard";
import Heading from "@/components/shared/Heading";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationContext } from "@/context/LocationContext";
import { useLocationUser } from "@/hooks/useLocationUsers";
import { RoleLabels } from "@/types/Membership";
import { getHighestRole } from "@/utils/roles";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { selectedLocation } = useLocationContext();
  if (!selectedLocation) return null;
  
  const { roles: userRoles, locationIds } = useLocationUser(selectedLocation, user?.sub);

  const fullName = `${user?.given_name ?? ""} ${user?.family_name ?? ""}`;
  const topRole = getHighestRole(userRoles);

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Heading>Your Profile</Heading>
        <ProfileCard
          name={fullName}
          role={topRole ? RoleLabels[topRole] : ""}
          locations={locationIds}
        />
      </View>
      <View style={styles.footer}>
        <LogoutButton />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  footer: {
    padding: 20,
    flexDirection: "row",
  },
});

export default SettingsScreen;
