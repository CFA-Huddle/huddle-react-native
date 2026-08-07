import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import CloseIcon from "@/assets/icons/close-outline.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import SearchIcon from "@/assets/icons/search.svg";
import ProfileCardThin from "@/components/settings/ProfileCardThin";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
import SubHeading from "@/components/shared/SubHeading";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { Colors, TextStyles } from "@/constants/theme";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationUsers } from "@/hooks/useLocationUsers";
import { RoleLabels } from "@/types/Membership";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, RefreshControl, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TeamManagement = () => {
    const insets = useSafeAreaInsets();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: users, isLoading: isUsersLoading, refetch, isRefetching } = useLocationUsers("30023");
    const { user } = useAuthContext();
    const [search, setSearch] = useState("");
    const activeUsers = users?.filter((user) => user.is_active && user.is_confirmed) ?? [];
    const invitedUsers = users?.filter((user) => user.is_active && !user.is_confirmed) ?? [];
    const locationId = "30023";
    const handleBackButton = () => {
        router.back();
    };
    const handleInviteUser = () => {
        router.navigate("/settings/invite");
    };

    const filteredUsers = useMemo(() => {
        return activeUsers.filter((user) => user.first_name.toLowerCase().includes(search.toLowerCase()) || user.last_name.toLowerCase().includes(search.toLowerCase()));
    }, [activeUsers, search]);
    const filteredInvitedUsers = useMemo(() => {
        return invitedUsers.filter((user) => user.first_name.toLowerCase().includes(search.toLowerCase()) || user.last_name.toLowerCase().includes(search.toLowerCase()));
    }, [invitedUsers, search]);

    const sections = useMemo(() => {
        const arr = [];
        if (filteredUsers.length > 0) {
            arr.push({
                key: "active",
                title: `Members (${filteredUsers.length})`,
                data: filteredUsers,
            });
        }
        if (filteredInvitedUsers.length > 0) {
            arr.push({
                key: "invited",
                title: `Invited (${filteredInvitedUsers.length})`,
                data: filteredInvitedUsers,
            });
        }
        return arr;
   
    }, [filteredUsers, filteredInvitedUsers]);

    const listHeader = (
        <>
            <View style={styles.headerButtons}>
                <Button
                    text="Back"
                    onPress={handleBackButton}
                    style={styles.backButton}
                    contentStyle={styles.backButtonContent}
                    variant="transparent"
                    iconLeft={ChevronLeftIcon}
                />
            </View>
            <RouteHeading>Team Members</RouteHeading>
            <Button
                text="Invite Team Member"
                onPress={handleInviteUser}
                style={styles.inviteButton}
                variant="secondary"
                iconLeft={PlusIcon}
            />
            <View style={styles.searchBarContainer}>
                <SearchIcon width={20} height={20} color={Colors.secondary} />
                <TextInput
                    placeholderTextColor={Colors.secondary}
                    placeholder="Search all team members..."
                    style={styles.searchBar}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")} hitSlop={8}>
                        <CloseIcon width={20} height={20} color={Colors.secondary} />
                    </Pressable>
                )}
            </View>
        </>
    );

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Spinner isVisible={isUsersLoading || loading} />
            <ErrorModal
                errorCode={error}
                visible={!!error}
                onClose={() => setError("")}
            />
            <SectionList
                style={styles.list}
                contentContainerStyle={[
                    styles.listContent,
                    {
                        paddingTop: insets.top,
                        paddingBottom: 20,
                    },
                ]}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        progressViewOffset={insets.top}
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={[Colors.muted]}
                        tintColor={Colors.muted}
                    />
                }
                sections={sections}
                keyExtractor={(item, index) => item.id ?? `${item.first_name}-${item.last_name}-${index}-${item.avatar_url}`}
                ListEmptyComponent={
                    <View style={styles.noResultsContainer}>
                        <SearchIcon width={48} height={48} color={Colors.secondary} />
                        <Text style={styles.noResultsText}>{`No Result for "${search}"`}</Text>
                    </View>
                }
                ListHeaderComponent={listHeader}
                renderSectionHeader={({ section: { title } }) => (
                    <SubHeading>{title}</SubHeading>
                )}
                stickySectionHeadersEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => router.navigate(`/settings/${item.id}`)} activeOpacity={0.6}>
                        <ProfileCardThin
                            name={`${item.first_name} ${item.last_name}`}
                            isYourself={item.id === user?.sub}
                            avatarUrl={item.avatar_url ?? undefined}
                            locations={item.memberships.map((membership) => membership.location_id)}
                            role={
                                item.memberships
                                    .find((membership) => membership.location_id === locationId)
                                    ?.roles.map((role) => RoleLabels[role])
                                    .join(", ") ?? ""
                            }
                        />
                    </TouchableOpacity>
                )}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
        paddingHorizontal: 20,
    },
    listContent: {
        flexGrow: 1,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    noResultsText: {
        fontFamily: TextStyles.subHeading.fontFamily,
        fontSize: TextStyles.subHeading.fontSize,
        color: Colors.secondary,
        textAlign: "center",
    },
    inviteButton: {
        marginBottom: 20,
    },
    searchBarContainer: {
        marginBottom: 20,
        backgroundColor: Colors.darkBackground,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 20,
    },
    searchBar: {
        paddingVertical: 10,
        borderRadius: 8,
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
        color: Colors.secondary,
        flex: 1,
    },
    headerButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    updateProfileButton: {
        marginTop: 20
    },
    textFieldContainer: {
        padding: 16,
    },
    emailText: {
        maxWidth: "70%",
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
    changeButton: {
        alignSelf: "flex-end",
    },
    backButton: {
        marginTop: 30,
        alignSelf: "flex-start",
    },
    backButtonContent: {
        paddingLeft: 0,
    },
    label: {
        marginBottom: 6,
    },
    textField: {
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
        color: TextStyles.body.color,
    },
    emailCard: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
});

export default TeamManagement;