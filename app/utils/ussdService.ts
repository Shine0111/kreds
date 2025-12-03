import * as Linking from "expo-linking";
import { PermissionsAndroid, Platform } from "react-native";

type UssdResponse = {
  success: boolean;
  message: string;
};

/**
 * Request CALL_PHONE permission on Android
 * This should be called once during app initialization or with camera permission
 */
export async function requestCallPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: "Call Permission",
          message:
            "This app needs permission to make USSD calls for adding credits.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error("Error requesting call permission:", error);
      return false;
    }
  }
  // iOS doesn't require explicit permission for tel: URLs
  return true;
}

/**
 * Check if CALL_PHONE permission is granted
 */
export async function hasCallPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    try {
      return await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE
      );
    } catch (error) {
      console.error("Error checking call permission:", error);
      return false;
    }
  }
  return true;
}

/**
 * Dial a USSD code using the phone dialer.
 * Assumes permission has already been granted.
 */
export async function dialUSSD(code: string): Promise<UssdResponse> {
  try {
    // Check if permission is granted (but don't request it here)
    const hasPermission = await hasCallPermission();

    if (!hasPermission) {
      return {
        success: false,
        message:
          "CALL_PHONE permission not granted. Please enable it in app settings.",
      };
    }

    // Use tel: scheme to open the dialer with the code
    await Linking.openURL(`tel:${encodeURIComponent(code)}`);
    return { success: true, message: "Dialer opened with code." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to open dialer",
    };
  }
}
