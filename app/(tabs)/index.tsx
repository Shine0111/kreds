import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { AdvertisementSection } from "../components/AdvertisementSection";
import { CameraPermissionView } from "../components/CameraPermissionView";
import { CameraViewComponent } from "../components/CameraView";
import { OperatorButtons } from "../components/OperatorButtons";
import { ResultModal } from "../components/ResultModal";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  trackAppOpen,
  trackDialerOpen,
  trackScanFailure,
  trackScanStart,
  trackScanSuccess,
  trackScreenView,
} from "../services/analyticsService";
import { extractUSSDCodeFromImage } from "../utils/codeRecognition";
import { OperatorType, processUSSDCode } from "../utils/operatorConfig";
import { dialUSSD, requestCallPermission } from "../utils/ussdService";

export default function Index() {
  const { colors } = useTheme();
  const { t } = useLanguage();
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

  // Track app open on mount
  useEffect(() => {
    trackAppOpen();
  }, []);

  useFocusEffect(() => {
    setIsFocus(true);
    trackScreenView("home");
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

    // Track dialer open - determine operator from dial code
    let operator: OperatorType = "orange";
    if (dialCode.includes("#321*")) operator = "yas";
    else if (dialCode.startsWith("202")) operator = "orange";
    else if (dialCode.includes("*888*")) operator = "airtel";

    trackDialerOpen(operator, dialCode);

    dialUSSD(dialCode);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDialCode("");
    setIsCopied(false);
  };

  const handleOperatorPress = async (operator: OperatorType) => {
    if (!cameraRef.current) return;

    // Track scan start
    trackScanStart(operator);

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
          setIsFlash(false);
          // Track successful scan
          trackScanSuccess(operator);
        } else {
          // Track failure
          trackScanFailure(
            operator,
            result.message || "Failed to process code"
          );
          Alert.alert(
            t.common.error,
            result.message || "Failed to process code"
          );
        }
      } else {
        setModalVisible(false);
        setIsFlash(false);
        // Track failure
        trackScanFailure(operator, "No code found in image");
        Alert.alert(
          "No Code Found",
          "Could not find a valid 14-digit code in the image."
        );
      }
    } catch (error) {
      console.error("Error during capture:", error);
      // Track failure
      trackScanFailure(
        operator,
        error instanceof Error ? error.message : "Unknown error"
      );
      Alert.alert("Error", "Failed to capture or process image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
});
