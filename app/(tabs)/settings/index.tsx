import LogoutButton from "@/components/auth/LogoutButton";
import ClearCacheButton from "@/components/settings/ClearCacheButton";
import ProfileCard from "@/components/settings/ProfileCard";
import LocationHeader from "@/components/shared/LocationHeader";
import SubHeading from "@/components/shared/SubHeading";
import TouchableCard from "@/components/ui/TouchableCard";
import { TextStyles } from "@/constants/theme";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationUser } from "@/hooks/useLocationUsers";
import { RoleLabels } from "@/types/Membership";
import { getHighestRole } from "@/utils/roles";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      <View style={[styles.container, { marginTop: 20 }]}>
        <TouchableOpacity
          onPress={() => router.navigate(`/(user)/${user?.id}`)}
          activeOpacity={0.6}
        >
          <ProfileCard
            name={fullName}
            role={topRole ? RoleLabels[topRole] : ""}
            isLoading={isLoading}
            avatarUrl={user?.avatar_url ?? ""}
          />
        </TouchableOpacity>

        <SubHeading>Settings</SubHeading>
        <View style={styles.settingsButtonsContainer}>
          <TouchableCard onPress={() => router.navigate("/settings/account-information")} activeOpacity={0.6}>
            <Text style={styles.buttonText}>Account Information</Text>
          </TouchableCard>
          <ClearCacheButton />
        </View>
        <SubHeading>Location</SubHeading>
        <View style={styles.settingsButtonsContainer}>
          <TouchableCard onPress={() => router.navigate("/settings/team-membership")} activeOpacity={0.6}>
            <Text style={styles.buttonText}>Team Membership</Text>
          </TouchableCard>
        </View>
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
  settingsButtonsContainer: {
    gap: 10,
    marginBottom: 20
  },
  footer: {
    padding: 20,
    flexDirection: "row",
  },
  buttonText: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
  },
});

export default SettingsScreen;
