import LogoutButton from "@/components/auth/LogoutButton";
import ProfileCard from "@/components/settings/ProfileCard";
import LocationHeader from "@/components/shared/LocationHeader";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationUser } from "@/hooks/useLocationUsers";
import { RoleLabels } from "@/types/Membership";
import { getHighestRole } from "@/utils/roles";
import { StyleSheet, View } from "react-native";

const SettingsScreen = () => {
  const { user: authUser } = useAuthContext();
  
  const { user, membership, isLoading } = useLocationUser(
    authUser?.sub,
  );
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;
  const topRole = getHighestRole(membership?.roles ?? []);

  return (
    <>
      <LocationHeader />
      <View style={styles.container}>
        <ProfileCard
          name={fullName}
          role={topRole ? RoleLabels[topRole] : ""}
          isLoading={isLoading}
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
    marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  footer: {
    padding: 20,
    flexDirection: "row",
  },
});

export default SettingsScreen;
