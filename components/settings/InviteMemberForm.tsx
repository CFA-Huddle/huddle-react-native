import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { Apercu, Colors, TextStyles } from "@/constants/theme";
import { useLocationContext } from "@/context/LocationContext";
import { useInviteUser } from "@/hooks/useInviteUser";
import { useShake } from "@/hooks/useShake";
import { Role, RoleLabels } from "@/types/Membership";
import { InviteUserRequest } from "@/types/User";
import { isValidEmail } from "@/utils/string";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RolesModal from "./RolesModal";

const InviteMemberForm = () => {
    const insets = useSafeAreaInsets();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate: inviteUser, isPending } = useInviteUser();
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | undefined>(undefined);
    const roleBottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedRole, setSelectedRole] = useState<Role>(Role.TEAM_MEMBER);
    const { selectedLocation } = useLocationContext();
    const {
        control,
        handleSubmit,
        clearErrors,
        getValues,
        setValue,
        formState: { errors, isValid },
    } = useForm<InviteUserRequest>({
        defaultValues: { email: "", first_name: "", last_name: "", memberships: [{ roles: [selectedRole], location_id: selectedLocation ?? "" }] },
        reValidateMode: "onSubmit",
    });
    const roleError = errors.memberships?.message;
    const { shake, animatedStyle } = useShake();

    useEffect(() => {
        if (roleError) {
            shake();
        }
    }, [roleError, shake]);

    const handleBackButton = () => {
        router.back();
    };

    const onSubmit = (data: InviteUserRequest) => {
        Keyboard.dismiss();
        inviteUser(data, {
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

    const handleSetRole = () => {
        roleBottomSheetRef.current?.present();
    };

    const saveRole = () => {
        setValue("memberships", [{ roles: [selectedRole], location_id: selectedLocation ?? "" }]);
    };

    return (
        <>
            <Spinner isVisible={isPending || loading} />
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

            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
            >
                <Button
                    text="Back"
                    onPress={handleBackButton}
                    style={styles.backButton}
                    contentStyle={styles.backButtonContent}
                    variant="transparent"
                    iconLeft={ChevronLeftIcon}
                />
                <Text style={styles.title}>Invite Team Member</Text>

                <Controller
                    control={control}
                    name="first_name"
                    rules={{ required: "First name is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="First Name"
                            style={styles.textFieldContainer}
                            placeholder="Enter the first name"
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors("first_name");
                            }}
                            error={errors.first_name?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="last_name"
                    rules={{ required: "Last name is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Last Name"
                            style={styles.textFieldContainer}
                            placeholder="Enter the last name"
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors("last_name");
                            }}
                            error={errors.last_name?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    rules={{ required: "Email is required", validate: (v) => isValidEmail(v) || "Please enter a valid email address" }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Email"
                            style={styles.textFieldContainer}
                            placeholder="Enter the email address"
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors("email");
                            }}
                            error={errors.email?.message}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            textContentType="emailAddress"
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="memberships"
                    rules={{
                        validate: (value) =>
                            (Array.isArray(value) && value.length > 0) || "Role is required",
                    }}
                    render={() => (
                        <View style={styles.roleFieldContainer}>
                            <Text style={styles.fieldLabel}>Role</Text>
                            <Animated.View
                                style={[
                                    roleError ? styles.roleCardError : null,
                                    animatedStyle,
                                ]}
                            >
                                <Card style={styles.emailCard}>
                                    <Text style={styles.textField}>{getValues("memberships").length > 0 ? RoleLabels[selectedRole] : "Set membership role"}</Text>
                                    {profilePicturePreview && (
                                        <Avatar avatarUrl={{ uri: profilePicturePreview }} />
                                    )}
                                    <Button
                                        text="Set role"
                                        onPress={handleSetRole}
                                        style={styles.changeButton}
                                        variant="outlined"
                                    />
                                </Card>
                            </Animated.View>
                            {roleError && <Text style={styles.errorText}>{roleError}</Text>}
                        </View>
                    )}
                />

                <Button
                    text="Send Invitation"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                />
            </KeyboardAwareScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        gap: 12,
    },
    backButton: {
        marginTop: 30,
        alignSelf: "flex-start",
        marginBottom: 10,
    },
    backButtonContent: {
        paddingLeft: 0,
    },
    title: {
        fontFamily: Apercu.bold,
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    textFieldContainer: {
        padding: 16,
    },
    fieldLabel: {
        fontSize: 16,
        fontFamily: Apercu.regular,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    changeButton: {
        alignSelf: "flex-end",
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
    },
    roleFieldContainer: {
        marginBottom: 16,
        width: "100%",
    },
    roleCardError: {
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 8,
    },
    errorText: {
        color: Colors.primary,
        fontFamily: Apercu.medium,
        fontSize: 12,
        marginTop: 4,
    },
});

export default InviteMemberForm;
