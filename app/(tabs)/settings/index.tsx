import LogoutButton from "@/components/auth/LogoutButton";
import ClearCacheButton from "@/components/settings/ClearCacheButton";
import ProfileCard from "@/components/settings/ProfileCard";
import Heading from "@/components/shared/Heading";
import SubHeading from "@/components/shared/SubHeading";
import TouchableCard from "@/components/ui/TouchableCard";
import { TextStyles } from "@/constants/theme";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationUser } from "@/hooks/useLocationUsers";
import { AuthorizedRoles, Role, RoleLabels } from "@/types/Membership";
import { getHighestRole } from "@/utils/roles";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { roles: userRoles, locationIds } = useLocationUser("30023", user?.sub);

  const fullName = `${user?.given_name ?? ""} ${user?.family_name ?? ""}`;
  const topRole = getHighestRole(userRoles ?? []);
  const isAuthorized = AuthorizedRoles.includes(topRole ?? Role.TEAM_MEMBER);

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Heading>Your Profile</Heading>
        <TouchableOpacity
          onPress={() => router.navigate("/settings/account-information")}
          activeOpacity={0.6}
        >
          <ProfileCard
            name={fullName}
            role={topRole ? RoleLabels[topRole] : ""}
            locations={locationIds}
            avatarUrl={user?.picture}
          />
        </TouchableOpacity>

        <SubHeading>Settings</SubHeading>
        <View style={styles.settingsButtonsContainer}>
          <TouchableCard onPress={() => router.navigate("/settings/account-information")} activeOpacity={0.6}>
            <Text style={styles.buttonText}>Account Information</Text>
          </TouchableCard>
          <ClearCacheButton />
        </View>
        {isAuthorized && (
          <>
            <SubHeading>Location</SubHeading>
            <View style={styles.settingsButtonsContainer}>
              <TouchableCard onPress={() => router.navigate("/settings/team-management")} activeOpacity={0.6}>
                <Text style={styles.buttonText}>Team Members</Text>
              </TouchableCard>
            </View>
          </>
        )}

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
