import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import TrashOutline from "@/assets/icons/trash-outline.svg";
import ErrorModal from "@/components/shared/ErrorModal";
import IconPickerModal from "@/components/training/IconPickerModal";
import ModuleIcon from "@/components/training/ModuleIcon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Combobox from "@/components/ui/Combobox";
import Spinner from "@/components/ui/Spinner";
import TextField from "@/components/ui/TextField";
import { getModuleIconLabel } from "@/constants/moduleIcons";
import { Apercu, Colors, TextStyles } from "@/constants/theme";
import { useCreateModule } from "@/hooks/useCreateModule";
import { useDeleteModule } from "@/hooks/useDeleteModule";
import { useModule, useModules } from "@/hooks/useModules";
import { useShake } from "@/hooks/useShake";
import { useUpdateModule } from "@/hooks/useUpdateModule";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ActionModal from "../shared/ActionModal";

type Props = {
  moduleId?: string;
  mode: "create" | "edit";
};

type FormValues = {
  name: string;
  group_name: string;
  icon: string;
};

const ModuleForm: React.FC<Props> = ({ moduleId, mode }) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);
  const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
  const isEditing = mode === "edit";

  const create = useCreateModule();
  const update = useUpdateModule();
  const deleteMutation = useDeleteModule();

  const { data: modules } = useModules();
  const { data: module } = useModule(moduleId);

  const error = isEditing
    ? (update.error ?? deleteMutation.error)
    : create.error;

  const isError = isEditing
    ? update.isError || deleteMutation.isError
    : create.isError;

  const isPending = isEditing
    ? update.isPending || deleteMutation.isPending
    : create.isPending;

  const resetMutation = () => {
    if (update.isError) update.reset();
    if (create.isError) create.reset();
    if (deleteMutation.isError) deleteMutation.reset();
  };

  const {
    control,
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    watch,
    formState: { isValid, errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      group_name: "",
      icon: "",
    },
    mode: "onSubmit",
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dismissedError, setDismissedError] = useState<Error | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!error) {
      setShowErrorModal(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowErrorModal(true);
    }, 300);

    return () => clearTimeout(timeout);
  }, [error]);

  const icon = watch("icon");
  const iconError = errors.icon?.message;
  const { shake, animatedStyle } = useShake();

  const groups = useMemo(
    () => [
      ...new Set([
        ...(modules ?? []).map((item) => item.group_name).filter(Boolean),
      ]),
    ],
    [modules],
  );

  useEffect(() => {
    if (isEditing && module) {
      reset({
        name: module.name,
        group_name: module.group_name,
        icon: module.icon,
      });
    }
  }, [module, isEditing, reset]);

  useEffect(() => {
    if (iconError) {
      shake();
    }
  }, [iconError, shake]);

  const onSubmit = (data: FormValues) => {
    Keyboard.dismiss();

    const payload = {
      name: data.name.trim(),
      group_name: data.group_name.trim(),
      icon: data.icon,
    };

    if (isEditing && moduleId) {
      update.mutate(
        {
          moduleId,
          payload,
        },
        {
          onSuccess: () => router.back(),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => router.back(),
      });
    }
  };

  const handleBackButton = () => {
    router.back();
  };

  const handleChooseIcon = () => {
    Keyboard.dismiss();
    setIsIconPickerVisible(true);
  };

  const handleDelete = () => {
    if (!moduleId) return;
    setIsDeleteModalVisible(false);
    deleteMutation.mutate(moduleId, {
      onSuccess: () => {
        router.dismissTo("/training/module-editor");
      },
    });
  };

  return (
    <>
      <Spinner isVisible={isPending} />

      <ActionModal
        title="Delete Module?"
        subtitle="Are you sure that you would like to delete this module? This cannot be undone."
        visible={isDeleteModalVisible}
        actionLabel="Delete Module"
        onAction={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
      />

      <ErrorModal
        errorCode={error?.message ?? ""}
        visible={showErrorModal && error !== dismissedError}
        onClose={() => {
          setShowErrorModal(false);
          setDismissedError(error);
        }}
        subtitle="An unexpected error has occurred. Please try again later."
      />

      <IconPickerModal
        visible={isIconPickerVisible}
        selectedIcon={icon}
        onSelect={(nextIcon) => {
          setValue("icon", nextIcon, {
            shouldDirty: true,
            shouldValidate: true,
          });
          clearErrors("icon");
        }}
        onClose={() => setIsIconPickerVisible(false)}
      />

      <KeyboardAwareScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, { paddingTop: insets.top }]}
      >
        <View style={styles.headerButtons}>
          <Button
            text="Back"
            onPress={handleBackButton}
            style={styles.backButton}
            contentStyle={styles.backButtonContent}
            variant="transparent"
            iconLeft={ChevronLeftIcon}
          />
          {isEditing && (
            <Button
              text="Delete"
              onPress={() => setIsDeleteModalVisible(true)}
              style={styles.backButton}
              variant="secondary"
              iconLeft={TrashOutline}
            />
          )}
        </View>
        <Text style={styles.title}>
          {isEditing ? "Edit Module" : "Create New Module"}
        </Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: "Module name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextField
              label="Module Name"
              value={value}
              placeholder="Enter name..."
              onChangeText={(text) => {
                onChange(text);
                clearErrors("name");
              }}
              error={errors.name?.message}
            />
          )}
        />

        <View style={styles.groupField}>
          <Text style={styles.groupLabel}>Group</Text>
          <Controller
            control={control}
            name="group_name"
            rules={{ required: "Group is required" }}
            render={({ field: { onChange, value } }) => (
              <Combobox
                options={groups}
                value={value}
                onChange={(next) => {
                  onChange(next);
                  clearErrors("group_name");
                }}
                placeholder="Enter group name..."
              />
            )}
          />
          {errors.group_name?.message && (
            <Text style={styles.errorText}>{errors.group_name.message}</Text>
          )}
        </View>

        <Controller
          control={control}
          name="icon"
          rules={{ required: "Icon is required" }}
          render={({ field: { value } }) => (
            <View style={styles.iconFieldContainer}>
              <Text style={[TextStyles.body, styles.label]}>Icon</Text>
              <Animated.View
                style={[iconError ? styles.iconCardError : null, animatedStyle]}
              >
                <Card style={styles.iconCard}>
                  <View style={styles.iconDetails}>
                    {value ? <ModuleIcon icon={value} size={40} /> : null}
                    <Text
                      style={[
                        styles.textField,
                        !value && styles.iconPlaceholder,
                      ]}
                      numberOfLines={1}
                    >
                      {value ? getModuleIconLabel(value) : "Select an icon"}
                    </Text>
                  </View>
                  <Button
                    text="Choose icon"
                    onPress={handleChooseIcon}
                    style={styles.changeButton}
                    variant="outlined"
                  />
                </Card>
              </Animated.View>
              {iconError && <Text style={styles.errorText}>{iconError}</Text>}
            </View>
          )}
        />

        <Button
          text={isEditing ? "Save Changes" : "Create Module"}
          onPress={handleSubmit(onSubmit)}
          disabled={!isDirty || !isValid || isPending}
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
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  groupField: {
    marginBottom: 16,
    width: "100%",
    zIndex: 1,
  },
  groupLabel: {
    fontSize: 16,
    fontFamily: Apercu.regular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  label: {
    color: Colors.secondary,
    marginBottom: 4,
  },
  iconFieldContainer: {
    marginBottom: 16,
    width: "100%",
  },
  iconCard: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    minWidth: 0,
    marginRight: 9,
  },
  textField: {
    flex: 1,
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
  },
  iconPlaceholder: {
    color: Colors.textMuted,
  },
  changeButton: {
    alignSelf: "flex-end",
  },
  iconCardError: {
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

export default ModuleForm;
