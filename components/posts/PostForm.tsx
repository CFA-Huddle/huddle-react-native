import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import ErrorModal from "@/components/shared/ErrorModal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { Apercu, Colors } from "@/constants/theme";
import { useLocationContext } from "@/context/LocationContext";
import { useCreatePost } from "@/hooks/useCreatePost";
import { usePost } from "@/hooks/usePost";
import { useUpdatePost } from "@/hooks/useUpdatePost";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  postId?: string;
  mode: "create" | "edit";
};

type FormValues = {
  title: string;
  message: string;
};

const PostForm: React.FC<Props> = ({ postId, mode }) => {

  const insets = useSafeAreaInsets();
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);
  const isEditing = mode === "edit";

  const create = useCreatePost();
  const update = useUpdatePost();

  const { data: post } = usePost(postId);

  const error = isEditing ? update.error : create.error;
  const isError = isEditing ? update.isError : create.isError;
  const isPending = isEditing ? update.isPending : create.isPending;
  const resetMutation = isEditing ? update.reset : create.reset;

  const { selectedLocation } = useLocationContext();
  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    formState: { isValid, errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      message: "",
    },
  });

  useEffect(() => {
    if (isEditing && post) {
      reset({
        title: post.title,
        message: post.content,
      });
    }
  }, [post, isEditing, reset]);

  const onSubmit = (data: FormValues) => {
    Keyboard.dismiss();

    if (isEditing && postId) {
      update.mutate(
        {
          postId,
          payload: {
            title: data.title,
            content: data.message,
          },
        },
        {
          onSuccess: () => router.back(),
        },
      );
    } else if (selectedLocation) {
      create.mutate(
        {
          location_id: selectedLocation,
          title: data.title,
          content: data.message,
        },
        {
          onSuccess: () => router.back(),
        },
      );
    }
  };

  const handleBackButton = () => {
    router.back();
  };

  return (
    <>
      <Spinner isVisible={isPending} />

      <ErrorModal
        visible={isError}
        errorCode={error instanceof Error ? error.message : "Unknown error"}
        onClose={resetMutation}
        subtitle="Something went wrong. Please try again."
      />

      <KeyboardAwareScrollView
        ref={scrollRef}
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
        <Text style={styles.title}>
          {isEditing ? "Edit Post" : "Create New Post"}
        </Text>

        <Controller
          control={control}
          name="title"
          rules={{ required: "Title is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Title"
              value={value}
              placeholder="Enter the post title"
              onChangeText={(text) => {
                onChange(text);
                clearErrors("title");
              }}
              style={styles.textFieldContainer}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="message"
          rules={{ required: "Message is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Message"
              placeholder="Type something..."
              value={value}
              onChangeText={(text) => {
                onChange(text);
                clearErrors("message");
              }}
              multiline
              style={[styles.textFieldContainer, styles.message]}
              error={errors.message?.message}
              onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
            />
          )}
        />

        <Button
          text={isEditing ? "Save Changes" : "Create Post"}
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty || !isValid || isPending}
        />
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 12,
  },
  backButton: { marginTop: 30, alignSelf: "flex-start", marginBottom: 10 },
  backButtonContent: { paddingLeft: 0 },
  title: {
    fontFamily: Apercu.bold,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  textFieldContainer: {
    padding: 16,
  },
  message: {
    height: 200,
  },
});

export default PostForm;
