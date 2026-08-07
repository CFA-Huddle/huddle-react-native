import { userService } from "@/api/services/userService";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import EditIcon from "@/assets/icons/edit.svg";
import RolesModal from "@/components/settings/RolesModal";
import ActionModal from "@/components/shared/ActionModal";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { Colors, TextStyles } from "@/constants/theme";
import { useAuthContext } from "@/context/AuthContext";
import { useDeleteMembership } from "@/hooks/useDeleteMembership";
import { locationUsersKey, useLocationUser } from "@/hooks/useLocationUsers";
import { queryClient } from "@/queryClient";
import { Role, RoleLabels } from "@/types/Membership";
import { LocationUser } from "@/types/User";
import { getHighestRole } from "@/utils/roles";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";


const ProfileDetailsScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user: authUser } = useAuthContext();
    const { mutate: deleteMembership, isPending: isDeletingMembership } = useDeleteMembership();
    const isOwner = authUser?.sub === id;
    const user: LocationUser = useLocationUser("30023", id);
    const insets = useSafeAreaInsets();
    const styles = createStyles(insets);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>(Role.TEAM_MEMBER);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        if (!user.membership) return;
        setSelectedRole(getHighestRole(user.membership.roles) as Role);
    }, [user]);

    const roleBottomSheetRef = useRef<BottomSheetModal>(null);
    const handleBackButton = () => {
        router.back();
    };

    const handleEditProfile = () => {
        router.navigate(`/(user)/${id}/edit`);
    };

    const handleSetRole = () => {
        roleBottomSheetRef.current?.present();
    };
    const handleDeleteUser = () => {
        setIsDeleteModalOpen(false);
        deleteMembership({ userId: user.userId ?? "", location_id: "30023" }, {
            onSuccess: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                router.back();
            },
            onError: (error: Error) => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setError(error.message);
            },
        });
    };

    const saveRole = async () => {
        try {
            setLoading(true);
            await userService.updateUserRole(user.userId ?? "", "30023", { roles: [selectedRole] });
            queryClient.invalidateQueries({ queryKey: locationUsersKey("30023") });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError(error as string);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Spinner isVisible={loading || isDeletingMembership} />
            <ErrorModal
                errorCode={error}
                visible={!!error}
                onClose={() => setError("")}
            />
            <RolesModal
                ref={roleBottomSheetRef as React.RefObject<BottomSheetModal>}
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                onSave={saveRole}
            />
            <ActionModal
                title="Remove from Team?"
                subtitle="Are you sure that you would like to remove this member from the team?"
                visible={isDeleteModalOpen}
                actionLabel="Remove"
                onAction={handleDeleteUser}
                onCancel={() => setIsDeleteModalOpen(false)}
            ></ActionModal>
            <ErrorModal
                errorCode={error}
                visible={!!error}
                onClose={() => setError("")}
            />
            <View style={[styles.main]}>
                <Button
                    text="Back"
                    onPress={handleBackButton}
                    style={styles.backButton}
                    contentStyle={styles.backButtonContent}
                    variant="transparent"
                    iconLeft={ChevronLeftIcon}
                />
                <View style={styles.contentContainer}>
                    <View style={styles.userInfoContainer}>
                        <Avatar avatarUrl={user.user?.avatar_url ?? undefined} size={128} />
                        <View style={styles.userInfoTextContainer}>
                            <Text style={styles.userName}>{user.fullName}</Text>
                        </View>
                        <Text style={styles.userRole}> {user.roles?.map((role) => RoleLabels[role] ?? role).join(", ")}</Text>
                        <TouchableOpacity style={styles.userEmailContainer} 
                            onPress={() => Linking.openURL(`mailto:${user.user?.email}`)} 
                            onLongPress={() => {}}
                            activeOpacity={0.8}
                        >
                            <Text selectable={false} style={styles.userEmailLabel}>Email Address</Text>
                            <Text selectable={true} style={styles.userEmailText}>{user.user?.email}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <Button
                            variant="secondary"
                            text="Edit Account Information"
                            iconLeft={EditIcon}
                            onPress={handleEditProfile}
                        />
                        {!isOwner && (
                        <Button
                            variant="primary"
                            text="Delete Team Member"
                            onPress={() => setIsDeleteModalOpen(true)}
                        />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};

const createStyles = (insets: EdgeInsets) => StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
    },
    main: {
        flex: 1,
        paddingTop: insets.top,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    buttonsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    userEmailContainer: {
        gap: 2,
        marginTop: 16,
        backgroundColor: Colors.card,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        width: "100%",
    },
    userEmailLabel: {
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.label.fontSize,
        color: Colors.muted,
    },
    userEmailText: {
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.subTitle.fontSize,
        color: TextStyles.subTitle.color,
    },
    userInfoContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
    userInfoTextContainer: {
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    userRole: {
        fontFamily: TextStyles.subTitle.fontFamily,
        fontSize: TextStyles.subTitle.fontSize,
        color: TextStyles.subTitle.color,
    },
    userName: {
        fontFamily: TextStyles.heading.fontFamily,
        fontSize: TextStyles.heading.fontSize,
        color: TextStyles.heading.color,
    },
    backButton: {
        marginTop: 30,
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    backButtonContent: {
        paddingLeft: 0,
    },
});

export default ProfileDetailsScreen;