import Button from "@/components/ui/Button";
import CloseButton from "@/components/ui/CloseButton";
import { Apercu, Colors } from "@/constants/theme";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Text } from "react-native";

interface BottomModalProps {
  ref: React.RefObject<BottomSheetModal>;
  handleSheetChanges?: (index: number) => void;
  onClose?: () => void;
  onSave?: () => void;
  children: React.ReactNode;
  closeButtonText?: string;
  headerText?: string;
  saveDisabled?: boolean;
  dismissOnSave?: boolean;
}

export default function BottomModal({
  ref,
  handleSheetChanges,
  onClose,
  onSave,
  children,
  closeButtonText = "Done",
  headerText,
  saveDisabled = false,
  dismissOnSave = true,
}: BottomModalProps) {
  const handleClose = () => {
    ref.current?.dismiss();
    onClose?.();
  };

  const handleSave = () => {
    if (dismissOnSave) {
      ref.current?.dismiss();
    }
    onSave?.();
  };
  return (
    <BottomSheetModal
      ref={ref}
      onChange={handleSheetChanges ?? (() => {})}
      enableDynamicSizing={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableBlurKeyboardOnGesture
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.modal}
    >
      <BottomSheetView style={styles.container}>
        <CloseButton style={styles.closeButton} onPress={handleClose} />
        <Text style={styles.headerText}>{headerText}</Text>
        {children}
        <Button
          text={closeButtonText}
          onPress={handleSave}
          variant="primary"
          style={styles.button}
          disabled={saveDisabled}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  handleIndicator: {
    width: 24,
    height: 4,
    borderRadius: 2.5,
    backgroundColor: Colors.secondary,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 20,
  },
  headerText: {
    fontFamily: Apercu.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 32,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    overflow: "visible",
  },
});
