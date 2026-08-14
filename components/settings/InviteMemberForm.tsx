import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
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
import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
        setError: setFieldError,
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
                    <RouteHeading>Invite Team Member</RouteHeading>
                    <Text style={[TextStyles.largeLabel, styles.label]}>First Name</Text>
                    <Controller
                        control={control}
                        name="first_name"
                        rules={{ required: "First name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextField
                                    style={styles.textFieldContainer}
                                    placeholder="Enter the first name"
                                    value={value}
                                    onChangeText={(text) => onChange(text)}
                                    error={errors.first_name?.message}
                                />
                            </>
                        )}
                    />
                    <Text style={[TextStyles.largeLabel, styles.label]}>Last Name</Text>
                    <Controller
                        control={control}
                        name="last_name"
                        rules={{ required: "Last name is required" }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextField
                                    style={styles.textFieldContainer}   
                                    placeholder="Enter the last name"
                                    value={value}
                                    onChangeText={(text) => onChange(text)}
                                    error={errors.last_name?.message}
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
                                    placeholder="Enter the email address"
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
                    <Text style={[TextStyles.largeLabel, styles.label]}>Role</Text>
                    <Controller
                        control={control}
                        name="memberships"
                        rules={{
                            validate: (value) =>
                                (Array.isArray(value) && value.length > 0) || "Role is required",
                        }}
                        render={() => (
                            <View style={styles.roleFieldContainer}>
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
                                            variant="secondaryMono"
                                        />
                                    </Card>
                                </Animated.View>
                                {roleError && <Text style={styles.errorText}>{roleError}</Text>}
                            </View>
                        )}
                    />
                </View>
                <Button
                    variant="primary"
                    text="Send Invitation"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.updateProfileButton}
                    disabled={!isValid}
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
        justifyContent: "space-between",
        flexDirection: "column",
    },
    updateProfileButton: {
        marginTop: 20,
        marginBottom: 20,
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