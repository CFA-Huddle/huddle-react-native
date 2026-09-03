import BottomModal from "@/components/ui/BottomModal";
import TextField from "@/components/ui/TextField";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";

interface AddItemModalProps {
  ref: React.RefObject<BottomSheetModal>;
  isSubmitting?: boolean;
  onSubmit: (item: { name: string; link_url?: string }) => void;
}

export default function AddItemModal({
  ref,
  isSubmitting = false,
  onSubmit,
}: AddItemModalProps) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const handleSave = () => {
    const name = text.trim();
    if (!name || isSubmitting) return;
    Keyboard.dismiss();
    const trimmedUrl = url.trim();
    onSubmit({ name, ...(trimmedUrl ? { link_url: trimmedUrl } : {}) });
  };

  const reset = () => {
    setText("");
    setUrl("");
  };

  return (
    <BottomModal
      ref={ref}
      headerText="Add Item"
      closeButtonText="Submit"
      onSave={handleSave}
      onClose={reset}
      dismissOnSave={false}
      saveDisabled={!text.trim() || isSubmitting}
      handleSheetChanges={(index) => {
        if (index === -1) {
          reset();
        }
      }}
    >
      <View style={styles.content}>
        <TextField
          inBottomSheet
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Type something..."
          textAlignVertical="top"
          inputContainerStyle={styles.inputContainer}
          style={styles.input}
        />
        <TextField
          inBottomSheet
          label="Pathway Link (optional)"
          value={url}
          onChangeText={setUrl}
          placeholder="Enter a Pathway URL..."
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.field}
        />
      </View>
    </BottomModal>
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
