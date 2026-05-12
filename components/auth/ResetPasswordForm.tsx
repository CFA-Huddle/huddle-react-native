import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { Apercu, Colors } from "@/constants/theme";
import { useResetPassword } from "@/hooks/useAuth";
import { isValidEmail } from "@/utils/string";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";

type ResetPasswordFormValues = {
  email: string;
};

const NewPasswordLoginForm = () => {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();
  const [error, setError] = useState("");

  const { email: prefilledEmail } = useLocalSearchParams<{
    email: string;
  }>();

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: isValidEmail(prefilledEmail) ? prefilledEmail : "",
    },
    reValidateMode: "onSubmit",
  });

  const onSubmit = ({ email }: ResetPasswordFormValues) => {
    Keyboard.dismiss();
    resetPassword(email, {
      onSuccess: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.replace({
          pathname: "/confirm-reset-password",
          params: {
            email,
          },
        });
      },
      onError: (error: Error) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        switch (error.name) {
          case "UserNotFoundException":
            setFieldError("email", {
              message: "Could not find an account with this email",
            });
            break;

          case "NotAuthorizedException":
            setFieldError("email", {
              message: "This account has not been activated yet.",
            });
            break;

          case "LimitExceededException":
            setFieldError("email", {
              message: error.message,
            });
            break;

          default:
            setError(error.name);
            console.log(error);
        }
      },
    });
  };

  const handleGoBack = () => {
    router.replace("/(auth)");
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
        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Please enter your email and we’ll send you a code to reset your
          password.
        </Text>
        <View>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              validate: (v) =>
                isValidEmail(v) || "Please enter a valid email address",
            }}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Email Address"
                placeholder="Enter your email"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  if (errors.email) {
                    clearErrors("email");
                  }
                }}
                error={errors.email?.message}
                textContentType="emailAddress"
                autoCorrect={false}
                autoComplete="email"
              />
            )}
          />
        </View>
        <View style={styles.buttonGroup}>
          <Button
            text="Send recovery code"
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

export default NewPasswordLoginForm;
