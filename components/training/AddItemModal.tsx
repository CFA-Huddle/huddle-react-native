import BottomModal from "@/components/ui/BottomModal";
import TextField from "@/components/ui/TextField";
import { isValidUrl } from "@/utils/string";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";

interface AddItemModalProps {
  ref: React.RefObject<BottomSheetModal>;
  isSubmitting?: boolean;
  onSubmit: (item: { name: string; link_url?: string }) => void;
}

interface FormValues {
  name: string;
  link_url: string;
}
export default function AddItemModal({
  ref,
  isSubmitting = false,
  onSubmit,
}: AddItemModalProps) {
  const { control, handleSubmit, reset, clearErrors } = useForm<FormValues>({
    defaultValues: {
      name: "",
      link_url: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleSave = (data: FormValues) => {
    if (isSubmitting) return;

    Keyboard.dismiss();
    const trimmedName = data.name.trim();
    const trimmedUrl = data.link_url.trim();

    onSubmit({
      name: trimmedName,
      ...(trimmedUrl ? { link_url: trimmedUrl } : {}),
    });
  };

  const handleClose = () => {
    reset();
  };

  return (
    <Controller
      control={control}
      name="name"
      render={({ field: { value: currentName } }) => (
        <BottomModal
          ref={ref}
          headerText="Add Item"
          closeButtonText="Submit"
          onSave={handleSubmit(handleSave)}
          onClose={handleClose}
          dismissOnSave={false}
          saveDisabled={!currentName?.trim() || isSubmitting}
          handleSheetChanges={(index) => {
            if (index === -1) {
              handleClose();
            }
          }}
        >
          <View style={styles.content}>
            <Controller
              control={control}
              name="name"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  inBottomSheet
                  multiline
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (error) clearErrors("name");
                  }}
                  placeholder="Type something..."
                  textAlignVertical="top"
                  inputContainerStyle={styles.inputContainer}
                  style={styles.input}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="link_url"
              rules={{
                validate: (value) => {
                  if (!value || !value.trim()) return true;
                  return (
                    isValidUrl(value.trim()) || "Please enter a valid URL."
                  );
                },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  inBottomSheet
                  label="External Resource Link (Optional)"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (error) clearErrors("link_url");
                  }}
                  placeholder="Enter a URL..."
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  containerStyle={styles.field}
                  error={error?.message}
                />
              )}
            />
          </View>
        </BottomModal>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignSelf: "stretch",
  },
  field: {
    marginBottom: 0,
  },
  inputContainer: {
    height: 139,
    alignItems: "flex-start",
  },
  input: {
    height: "100%",
    paddingTop: 20,
  },
});
