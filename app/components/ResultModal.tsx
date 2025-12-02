import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ResultModalProps {
  visible: boolean;
  isProcessing: boolean;
  dialCode: string;
  isCopied: boolean;
  onClose: () => void;
  onOpenDialer: () => void;
}

export function ResultModal({
  visible,
  isProcessing,
  dialCode,
  isCopied,
  onClose,
  onOpenDialer,
}: ResultModalProps) {
  const handleCopyCode = async () => {
    if (dialCode) {
      await Clipboard.setStringAsync(dialCode);
    }
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalModernContent}>
          {isProcessing ? (
            <Text style={[styles.text, styles.processingText]}>
              Processing...
            </Text>
          ) : (
            <>
              <View style={styles.dialCodeRow}>
                <Text style={styles.dialCodeText}>{dialCode}</Text>
                {dialCode && (
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyCode}
                    accessibilityLabel="Copy dial code"
                  >
                    <Ionicons name="copy-outline" size={24} color="#25292E" />
                  </TouchableOpacity>
                )}
              </View>
              {isCopied && (
                <Text
                  style={dialCode ? styles.copiedText : styles.textError}
                >
                  {!dialCode
                    ? "No code was found"
                    : "Dial code copied to clipboard!"}
                </Text>
              )}
              <View style={styles.modalButtonRow}>
                {dialCode && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onOpenDialer}
                    accessibilityLabel="Open Dialer"
                  >
                    <Ionicons
                      name="call"
                      size={20}
                      color="#fff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.actionButtonText}>Open Dialer</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#eee" }]}
                  onPress={onClose}
                  accessibilityLabel="OK"
                >
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#25292E"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.actionButtonText, { color: "#25292E" }]}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalModernContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "90%",
    marginLeft: "1.5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    position: "relative",
  },
  dialCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    gap: 10,
  },
  dialCodeText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#25292E",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  copyButton: {
    backgroundColor: "#ffd33d",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  copiedText: {
    color: "#4caf50",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  textError: {
    color: "#f44336",
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25292E",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 4,
    gap: 6,
    marginTop: 8,
    elevation: 2,
    minWidth: 120,
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  processingText: {
    fontSize: 16,
    color: "#25292E",
    fontWeight: "600",
    marginVertical: 24,
    textAlign: "center",
  },
  text: {
    color: "black",
  },
});
