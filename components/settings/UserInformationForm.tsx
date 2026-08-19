import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
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
import { Keyboard, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
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
                <View style={{ paddingTop: insets.top }}>
                    <Button
                        text="Back"
                        onPress={handleBackButton}
                        style={styles.backButton}
                        contentStyle={styles.backButtonContent}
                        variant="transparent"
                        iconLeft={ChevronLeftIcon}
                    />
                    <RouteHeading>Account Information</RouteHeading>
                    <Text style={[TextStyles.largeLabel, styles.label]}>First Name</Text>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={{ required: "First name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextField
                                    style={styles.textFieldContainer}
                                    value={value}
                                    onChangeText={(text) => onChange(text)}
                                    error={errors.firstName?.message}
                                />
                            </>
                        )}
                    />
                    <Text style={[TextStyles.largeLabel, styles.label]}>Last Name</Text>
                    <Controller
                        control={control}
                        name="lastName"
                        rules={{ required: "Last name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextField
                                    style={styles.textFieldContainer}
                                    value={value}
                                    onChangeText={(text) => onChange(text)}
                                    error={errors.lastName?.message}
                                />
                            </>
                        )}
                    />
                    <Text style={[TextStyles.largeLabel, styles.label]}>Email</Text>
                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: "Email is required", validate: (v) => isValidEmail(v) || "Please enter a valid email address" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextField
                                    style={styles.textFieldContainer}
                                    value={value}
                                    onChangeText={(text) => onChange(text)}
                                    error={errors.email?.message}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                />
                            </>
                        )}
                    />
                    <Text style={[TextStyles.largeLabel, styles.label]}>Profile Picture</Text>
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
                    {!isOwner && (
                        <>
                            <Text style={[TextStyles.largeLabel, styles.label]}>Role</Text>
                            <Controller
                                control={control}
                                name="role"
                                render={() => (
                                    <View style={styles.roleFieldContainer}>
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
                        </>
                    )}
                </View>
                <Button
                    variant="primary"
                    text="Update Profile"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.updateProfileButton}
                    disabled={!isDirty}
                />
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    updateProfileButton: {
        marginVertical: 20,
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
        marginBottom: 10,
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