// app/components/ResultModal.tsx

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

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
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [isManuallyCopied, setIsManuallyCopied] = useState(false);

  const handleCopyCode = async () => {
    if (dialCode) {
      await Clipboard.setStringAsync(dialCode);
      setIsManuallyCopied(true);
      setTimeout(() => setIsManuallyCopied(false), 3000);
    }
  };

  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} style={styles.modalBackground}>
        <View>
          <View
            style={[
              styles.modalModernContent,
              { backgroundColor: colors.card },
            ]}
          >
            {isProcessing ? (
              <Text style={[styles.processingText, { color: colors.text }]}>
                {t.common.processing}
              </Text>
            ) : (
              <>
                <View style={styles.dialCodeRow}>
                  <Text style={[styles.dialCodeText, { color: colors.text }]}>
                    {dialCode}
                  </Text>
                  {dialCode && (
                    <TouchableOpacity
                      style={[
                        styles.copyButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={handleCopyCode}
                      accessibilityLabel="Copy dial code"
                    >
                      <Ionicons
                        name={
                          isManuallyCopied ? "checkmark-done" : "copy-outline"
                        }
                        size={20}
                        color="#25292E"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {isCopied && (
                  <Text style={dialCode ? styles.copiedText : styles.textError}>
                    {!dialCode ? t.home.noCodeFound : t.home.dialCodeCopied}
                  </Text>
                )}
                <View style={styles.modalButtonRow}>
                  {dialCode && (
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: colors.text },
                      ]}
                      onPress={onOpenDialer}
                      accessibilityLabel="Open Dialer"
                    >
                      <Ionicons
                        name="call"
                        size={20}
                        color={colors.card}
                        style={{ marginRight: 6 }}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: colors.border },
                    ]}
                    onPress={onClose}
                    accessibilityLabel="OK"
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.text}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={[styles.actionButtonText, { color: colors.text }]}
                    >
                      {t.common.ok}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", // Changed from 'center' to 'flex-end'
    alignItems: "center",
    paddingBottom: 59, // Added padding to create space from the bottom
  },
  modalModernContent: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  dialCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    gap: 10,
  },
  dialCodeText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  copyButton: {
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  copiedText: {
    color: "#4caf50",
    fontWeight: "600",
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
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 4,
    gap: 6,
    marginTop: 8,
    elevation: 2,
    justifyContent: "center",
  },
  actionButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  processingText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 24,
    textAlign: "center",
  },
});
