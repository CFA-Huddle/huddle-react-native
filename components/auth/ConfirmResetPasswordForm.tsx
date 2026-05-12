import { LoginFormValues } from "@/components/auth/LoginForm";
import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { Apercu, Colors } from "@/constants/theme";
import { useConfirmResetPassword, useLogin } from "@/hooks/useAuth";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";

type ConfirmResetPasswordFormValues = {
  confirmationCode: string;
  newPassword: string;
  repeatedNewPassword: string;
};

const ConfirmResetPasswordForm = () => {
  const router = useRouter();
  const { mutate: confirmResetPassword, isPending: isPendingResetPassword } =
    useConfirmResetPassword();
  const { mutate: login, isPending: isPendingLogin } = useLogin();
  const [error, setError] = useState("");

  const isPending = isPendingResetPassword || isPendingLogin;

  const { email } = useLocalSearchParams<{
    email: string;
  }>();

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    getValues,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<ConfirmResetPasswordFormValues>({
    defaultValues: {
      confirmationCode: "",
      newPassword: "",
      repeatedNewPassword: "",
    },
    reValidateMode: "onSubmit",
  });

  const onSubmit = ({
    confirmationCode,
    newPassword,
  }: ConfirmResetPasswordFormValues) => {
    Keyboard.dismiss();
    confirmResetPassword(
      { confirmationCode, newPassword, email },
      {
        onSuccess: () => {
          loginUser({ email, password: newPassword });
        },
        onError: (error: Error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          switch (error.name) {
            case "CodeMismatchException":
              setFieldError("confirmationCode", {
                message: error.message,
              });
              break;
            case "InvalidPasswordException":
              setFieldError("newPassword", {
                message: error.message.replace(
                  "Password does not conform to policy: ",
                  "",
                ),
              });
              break;

            default:
              setError(error.name);
              console.log(error);
          }
        },
      },
    );
  };

  const loginUser = ({ email, password }: LoginFormValues) => {
    login(
      { email, password },
      {
        onSuccess: ({ nextStep }) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (
            nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
          ) {
            router.navigate("/new-password");
          }
        },
        onError: (error: Error) => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setError(error.name);
          console.log(error);
        },
      },
    );
  };

  const handleGoBack = () => {
    router.replace("/(auth)/reset-password");
  };

  return (
    <>
      <Spinner isVisible={isPending} />
      <ErrorModal
        errorCode={error}
        visible={!!error}
        onClose={() => setError("")}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a recovery code to your email address. Enter the code below to
          reset your password.
        </Text>
        <View>
          <Controller
            control={control}
            name="confirmationCode"
            rules={{
              required: "Confirmation code is required",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Verification Code"
                placeholder="Enter your 6-digit verification code"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (errors.confirmationCode) {
                    clearErrors("confirmationCode");
                  }
                }}
                error={errors.confirmationCode?.message}
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
              />
            )}
          />
          <Controller
            control={control}
            name="newPassword"
            rules={{ required: "Password is required" }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="New Password"
                placeholder="Enter a new password"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (errors.newPassword) {
                    clearErrors("newPassword");
                  }
                }}
                error={errors.newPassword?.message}
                textContentType="password"
                autoComplete="password"
                secureTextEntry={true}
              />
            )}
          />
          <Controller
            control={control}
            name="repeatedNewPassword"
            rules={{
              required: "New Password",
              validate: (value) =>
                value === getValues("newPassword") || "Passwords do not match",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Confirm New Password"
                placeholder="Re-enter your new password"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (errors.repeatedNewPassword) {
                    clearErrors("repeatedNewPassword");
                  }
                }}
                error={errors.newPassword?.message}
                textContentType="password"
                autoComplete="password-new"
                secureTextEntry={true}
              />
            )}
          />
        </View>
        <View style={styles.buttonGroup}>
          <Button
            text="Reset Password"
            disabled={isPending || !isValid}
            onPress={handleSubmit(onSubmit)}
          />
          <Button text="Go Back" variant="secondary" onPress={handleGoBack} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: Apercu.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Apercu.medium,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  buttonGroup: {
    gap: 10,
  },
});

export default ConfirmResetPasswordForm;
