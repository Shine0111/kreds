import { Ionicons } from "@expo/vector-icons";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { useRef, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
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
  const [dialCodes, setDialCodes] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  const takePicture = async () => {
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
        setDialCodes([
          `#321*${codeTrimmed}#`,
          `202${codeTrimmed}`,
          `*888*${codeTrimmed}#`,
        ]);
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

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Text style={styles.text}>Flip CAM</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View>
        <Pressable
          onPress={takePicture}
          style={styles.captureButton}
        ></Pressable>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {isProcessing && <Text style={styles.text}>Processing...</Text>}
            {!isProcessing && (
              <>
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  {dialCodes.map((dialCode, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginVertical: 4,
                      }}
                    >
                      <Text
                        style={[styles.text, { fontSize: 20, marginRight: 8 }]}
                      >
                        {dialCode}
                      </Text>
                      <TouchableOpacity
                        onPress={() => Clipboard.setStringAsync(dialCode)}
                      >
                        <Ionicons
                          name="copy-outline"
                          size={24}
                          color="#ffd33d"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Button title="Close" onPress={() => setModalVisible(false)} />
                <View style={{ height: 12 }} />
                <Button
                  title="Open Dialer"
                  onPress={() => Linking.openURL(`tel:`)}
                />
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  flipButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  captureButton: {
    backgroundColor: "white",
    width: 75,
    height: 75,
    borderRadius: "50%",
    borderWidth: 5,
    borderColor: "#595a59",
  },
});
