import WarningIcon from "@/assets/icons/warning.svg";
import Button from "@/components/ui/Button";
import { Apercu, Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

interface ActionModalProps {
  title: string;
  subtitle: string;
  visible: boolean;
  actionLabel: string;
  cancelLabel?: string;
  onAction: () => void;
  onCancel: () => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  title,
  subtitle,
  visible,
  actionLabel,
  cancelLabel = "Cancel",
  onAction,
  onCancel,
}) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropTransitionInTiming={200}
      backdropTransitionOutTiming={0}
      backdropOpacity={0.4}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <WarningIcon width={60} height={60} fill={Colors.warning} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.buttons}>
          <Button
            variant="secondary"
            style={styles.button}
            text={cancelLabel}
            onPress={onCancel}
          />
          <Button style={styles.button} text={actionLabel} onPress={onAction} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    gap: 15,
    borderRadius: 8,
    padding: 25,
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontFamily: Apercu.medium,
    fontSize: 18,
    color: Colors.accent,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: Apercu.regular,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

export default ActionModal;
