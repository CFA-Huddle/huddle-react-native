import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { Apercu, Colors, TextStyles } from "@/constants/theme";
import pickProfilePicture from "@/hooks/useImagePicker";
import { useUpdateUser } from "@/hooks/useUpdateUser";
import { Role, RoleLabels } from "@/types/Membership";
import { User } from "@/types/User";
import { isValidEmail } from "@/utils/string";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Animated from "react-native-reanimated";

import { useAuthContext } from "@/context/AuthContext";
import { useLocationContext } from "@/context/LocationContext";
import { useShake } from "@/hooks/useShake";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RolesModal from "./RolesModal";

type UserInformationFormProps = {
    user: User;
};

type UserInformationFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: { base64: string; extension: string } | undefined;
    role: Role | undefined;
};

const UserInformationForm = ({ user }: UserInformationFormProps) => {
    const { user: currentUser } = useAuthContext();
    const { selectedLocation } = useLocationContext();
    const isOwner = currentUser?.sub === user.id;
    const insets = useSafeAreaInsets();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { mutate: updateUser, isPending } = useUpdateUser();
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | undefined>(undefined);
    const roleBottomSheetRef = useRef<BottomSheetModal>(null);
    const [selectedRole, setSelectedRole] = useState<Role>(user?.memberships?.find((membership) => membership.location_id === selectedLocation)?.roles?.[0] || Role.TEAM_MEMBER);

    const {
        control,
        handleSubmit,
        setError: setFieldError,
        clearErrors,
        setValue,
        formState: { errors, isDirty },
    } = useForm<UserInformationFormValues>({
        defaultValues: {
            firstName: user?.first_name || "",
            lastName: user?.last_name || "",
            email: user?.email || "",
            profilePicture: undefined,
            role: user?.memberships?.find((membership) => membership.location_id === selectedLocation)?.roles?.[0] || undefined
        },
        reValidateMode: "onSubmit",
    });

    const roleError = errors.role?.message;
    const { shake, animatedStyle } = useShake();

    useEffect(() => {
        if (roleError) {
            shake();
        }
    }, [roleError, shake]);

    const handleBackButton = () => {
        router.back();
    };

    const handleSetRole = () => {
        roleBottomSheetRef.current?.present();
    };

    const handleChangeProfilePicture = async () => {
        setLoading(true);
        const profilePicture = await pickProfilePicture();
        setLoading(false);
        if (!profilePicture) return;
        setValue("profilePicture", profilePicture, { shouldDirty: true });

        setProfilePicturePreview(profilePicture.base64);
    };

    const onSubmit = ({
        firstName,
        lastName,
        email,
        profilePicture,
        role,
    }: UserInformationFormValues) => {
        Keyboard.dismiss();

        if (!user?.id) {
            return;
        }
        updateUser(
            {
                isOwner,
                userId: user.id,
                firstName,
                lastName,
                email,
                profilePicture,
                role,
            },
            {
                onSuccess: (data) => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.back();
                },
                onError: (error: Error) => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    console.log(error);
                    switch (error.name) {
                        case "AliasExistsException":
                            setFieldError("email", {
                                message: error.message,
                            });
                            break;
                        default:
                            setError(error.name);
                    }
                },
            }
        )
    };

    const saveRole = () => {
        setValue("role", selectedRole, { shouldDirty: true });
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
                <Text style={styles.title}>Account Information</Text>

                <Controller
                    control={control}
                    name="firstName"
                    rules={{ required: "First name is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="First Name"
                            style={styles.textFieldContainer}
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors("firstName");
                            }}
                            error={errors.firstName?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="lastName"
                    rules={{ required: "Last name is required" }}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Last Name"
                            style={styles.textFieldContainer}
                            value={value}
                            onChangeText={(text) => {
                                onChange(text);
                                clearErrors("lastName");
                            }}
                            error={errors.lastName?.message}
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

                <View style={styles.roleFieldContainer}>
                    <Text style={styles.fieldLabel}>Profile Picture</Text>
                    <Card style={styles.emailCard}>
                        <Text style={styles.textField}>Change profile picture</Text>
                        {profilePicturePreview && (
                            <Avatar avatarUrl={{ uri: profilePicturePreview }} />
                        )}
                        <Button
                            text="Choose image"
                            onPress={handleChangeProfilePicture}
                            style={styles.changeButton}
                            variant="outlined"
                        />
                    </Card>
                </View>

                {!isOwner && (
                    <Controller
                        control={control}
                        name="role"
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
                                        <Text style={styles.textField}>{RoleLabels[selectedRole]}</Text>
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
                )}

                <Button
                    text="Update Profile"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isDirty}
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

export default UserInformationForm;
