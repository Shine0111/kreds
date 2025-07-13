import { Ionicons } from "@expo/vector-icons";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>("");
  const [dialCode, setDialCode] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  useFocusEffect(() => {
    setIsFocus(true);
    return () => {
      setIsFocus(false);
    };
  });

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera permission is required to use this feature.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const takePicture = async (operator: string) => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    setIsProcessing(true);
    setModalVisible(true);

    try {
      const result = await TextRecognition.recognize(photo.uri);

      const code = result.blocks.find((block) =>
        block.text.replace(/\s/g, "").match(/^\d{14}$/)
      );
      if (code) {
        const codeTrimmed = code.text.replace(/\s+/g, "");
        if (operator === "yas") {
          setDialCode(`#321*${codeTrimmed}#`);
          if (await Clipboard.setStringAsync(`#321*${codeTrimmed}#`)) {
            setIsCopied(true);
          }
        } else if (operator === "orange") {
          setDialCode(`202${codeTrimmed}`);
          if (await Clipboard.setStringAsync(`202${codeTrimmed}`)) {
            setIsCopied(true);
            setIsFlash(false);
          }
          Linking.openURL(`tel:202${codeTrimmed}`);
        } else {
          setDialCode(`*888*${codeTrimmed}#`);
          if (await Clipboard.setStringAsync(`*888*${codeTrimmed}#`)) {
            setIsCopied(true);
          }
        }
        console.log("Dial code found:", codeTrimmed);
        //Linking.openURL(`tel:${dialCode}`);
      }
      console.log("Text recognition result:", result);
    } catch (error) {
      console.error("Error during text recognition:", error);
      alert("Failed to recognize text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openDailer = () => {
    setIsFlash(false);
    Linking.openURL(`tel:`);
  };
  return (
    <View style={styles.container}>
      {isFocus && (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            enableTorch={isFlash}
          />
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="sync-circle-outline" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => setIsFlash(!isFlash)}
            >
              <Ionicons
                name={isFlash ? "flash" : "flash-off"}
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => takePicture("yas")}>
          <Image
            source={require("../../assets/images/yas.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture("orange")}>
          <Image
            source={require("../../assets/images/orange.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => takePicture("airtel")}>
          <Image
            source={require("../../assets/images/airtel.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
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
                      onPress={() => Clipboard.setStringAsync(dialCode)}
                      accessibilityLabel="Copy dial code"
                    >
                      <Ionicons name="copy-outline" size={24} color="#25292E" />
                    </TouchableOpacity>
                  )}
                </View>
                {isCopied && (
                  <Text style={dialCode ? styles.copiedText : styles.textError}>
                    {!dialCode
                      ? "No code was found"
                      : "Dial code copied to clipboard!"}{" "}
                  </Text>
                )}
                <View style={styles.modalButtonRow}>
                  {dialCode && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={openDailer}
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
                    onPress={() => {
                      setModalVisible(false);
                      setDialCode("");
                    }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292E",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  cameraContainer: {
    width: "90%",
    height: "40%",
    marginLeft: "1.5%",
    position: "relative",
    backgroundColor: "#000",
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    gap: 16,
    zIndex: 2,
  },
  overlayButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: "40%",
  },
  captureButton: {
    backgroundColor: "yellow",
    width: 75,
    height: 75,
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#595a59",
  },
  captureButtonOrange: {
    backgroundColor: "orange",
    width: 75,
    height: 75,
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#595a59",
  },
  captureButtonAirtel: {
    backgroundColor: "red",
    width: 75,
    height: 75,
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#595a59",
  },
});
