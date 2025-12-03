import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Linking from "expo-linking";
import { useFocusEffect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AdvertisementSection } from "../components/AdvertisementSection";
import { CameraPermissionView } from "../components/CameraPermissionView";
import { CameraViewComponent } from "../components/CameraView";
import { OperatorButtons } from "../components/OperatorButtons";
import { ResultModal } from "../components/ResultModal";
import { extractUSSDCodeFromImage } from "../utils/codeRecognition";
import { OperatorType, processUSSDCode } from "../utils/operatorConfig";
import { requestCallPermission } from "../utils/ussdService";

export default function Index() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialCode, setDialCode] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [callPermissionRequested, setCallPermissionRequested] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useFocusEffect(() => {
    setIsFocus(true);
    return () => {
      setIsFocus(false);
    };
  });

  // Request call permission after camera permission is granted
  useEffect(() => {
    const requestCallPerm = async () => {
      if (permission?.granted && !callPermissionRequested) {
        await requestCallPermission();
        setCallPermissionRequested(true);
      }
    };

    requestCallPerm();
  }, [permission?.granted, callPermissionRequested]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return <CameraPermissionView onRequestPermission={requestPermission} />;
  }

  const handleToggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleOpenDialer = () => {
    setIsFlash(false);
    Linking.openURL("tel:");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDialCode("");
    setIsCopied(false);
  };

  const handleOperatorPress = async (operator: OperatorType) => {
    if (!cameraRef.current) return;

    setIsProcessing(true);
    setModalVisible(true);

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const extractedCode = await extractUSSDCodeFromImage(photo.uri);

      if (extractedCode) {
        const result = await processUSSDCode(operator, extractedCode);
        if (result.success) {
          setDialCode(result.dialCode);
          setIsCopied(true);
        } else {
          Alert.alert("Error", result.message || "Failed to process code");
        }
      } else {
        setModalVisible(false);
        Alert.alert(
          "No Code Found",
          "Could not find a valid 14-digit code in the image."
        );
      }
    } catch (error) {
      console.error("Error during capture:", error);
      Alert.alert("Error", "Failed to capture or process image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraViewComponent
        cameraRef={cameraRef}
        facing={facing}
        isFlash={isFlash}
        onToggleFacing={handleToggleCameraFacing}
        onToggleFlash={() => setIsFlash(!isFlash)}
        isFocus={isFocus}
      />

      <AdvertisementSection />

      <OperatorButtons onOperatorPress={handleOperatorPress} />

      <ResultModal
        visible={modalVisible}
        isProcessing={isProcessing}
        dialCode={dialCode}
        isCopied={isCopied}
        onClose={handleCloseModal}
        onOpenDialer={handleOpenDialer}
      />
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
});
