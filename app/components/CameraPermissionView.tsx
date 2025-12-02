import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

interface CameraPermissionViewProps {
  onRequestPermission: () => void;
}

export function CameraPermissionView({
  onRequestPermission,
}: CameraPermissionViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        Camera permission is required to use this feature.
      </Text>
      <Button onPress={onRequestPermission} title="Grant Permission" />
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
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "#fff",
  },
});
