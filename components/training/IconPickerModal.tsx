import IconPicker from "@/components/training/IconPicker";
import Button from "@/components/ui/Button";
import CloseButton from "@/components/ui/CloseButton";
import { getModuleIconLabel } from "@/constants/moduleIcons";
import { Apercu, Colors } from "@/constants/theme";
import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Modal, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WIDE_WINDOW_BREAKPOINT = 600;

interface IconPickerModalProps {
  visible: boolean;
  selectedIcon?: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

export default function IconPickerModal({
  visible,
  selectedIcon,
  onSelect,
  onClose,
}: IconPickerModalProps) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const pendingWidthRef = useRef(0);
  const isShownRef = useRef(false);
  const [draft, setDraft] = useState(selectedIcon ?? "");
  const [sheetWidth, setSheetWidth] = useState(0);
  const isWideWindow = windowWidth > WIDE_WINDOW_BREAKPOINT;

  const commitWidth = (width: number) => {
    if (width <= 0) return;
    setSheetWidth((current) => (current === width ? current : width));
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth <= 0) return;

    pendingWidthRef.current = nextWidth;

    // Wide page sheets (macOS) layout at window width before settling.
    // Wait until the modal has finished presenting so the first paint
    // uses the real sheet width.
    if (isWideWindow && !isShownRef.current) {
      return;
    }

    commitWidth(nextWidth);
  };

  const handleShow = () => {
    isShownRef.current = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const width = pendingWidthRef.current;
        const looksLikeWindow =
          isWideWindow && Math.abs(width - windowWidth) < 1;

        // Keep a previously settled width if this is still the transient
        // full-window measurement. The real sheet onLayout will follow.
        if (looksLikeWindow && sheetWidth > 0) {
          return;
        }

        commitWidth(width);
      });
    });
  };

  useEffect(() => {
    if (!visible) {
      isShownRef.current = false;
    }
  }, [visible]);

  const handleContinue = () => {
    if (!draft) return;
    onSelect(draft);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      allowSwipeDismissal
      onShow={handleShow}
      onRequestClose={onClose}
    >
      <View style={styles.container} onLayout={handleLayout}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Select Icon</Text>
          <CloseButton style={styles.closeButton} onPress={onClose} />
        </View>
        <IconPicker width={sheetWidth} selectedIcon={draft} onSelect={setDraft} />
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button
            text={draft ? `Select "${getModuleIconLabel(draft)}"` : "Select Icon"}
            onPress={handleContinue}
            disabled={!draft}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.card,
  },
  header: {
    width: "100%",
    height: 66,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: Apercu.bold,
    fontSize: 16,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  footer: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
});
