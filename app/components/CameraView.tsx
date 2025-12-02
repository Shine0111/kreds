import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView as ExpoCameraView } from "expo-camera";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CameraViewProps {
  cameraRef: React.RefObject<ExpoCameraView | null>;
  facing: CameraType;
  isFlash: boolean;
  onToggleFacing: () => void;
  onToggleFlash: () => void;
  isFocus: boolean;
}

export function CameraViewComponent({
  cameraRef,
  facing,
  isFlash,
  onToggleFacing,
  onToggleFlash,
  isFocus,
}: CameraViewProps) {
  if (!isFocus) return null;

  return (
    <View style={styles.cameraContainer}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        enableTorch={isFlash}
      />
      <View style={styles.cameraOverlay}>
        <TouchableOpacity style={styles.overlayButton} onPress={onToggleFacing}>
          <Ionicons name="sync-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.overlayButton} onPress={onToggleFlash}>
          <Ionicons
            name={isFlash ? "flash" : "flash-off"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
