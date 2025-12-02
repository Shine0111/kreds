import * as Linking from "expo-linking";
import { PermissionsAndroid, Platform } from "react-native";

type UssdResponse = {
  success: boolean;
  message: string;
};

/**
 * Dial a USSD code using the phone dialer.
 * Since react-native-ussd is deprecated, we use the system dialer instead.
 */
export async function dialUSSD(code: string): Promise<UssdResponse> {
  try {
    // Ask for CALL_PHONE permission on Android
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CALL_PHONE,
        {
          title: "Call Permission",
          message: "This app needs permission to make USSD calls.",
          buttonPositive: "OK",
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return { success: false, message: "CALL_PHONE permission denied." };
      }
    }

    // Use tel: scheme to open the dialer with the code
    await Linking.openURL(`tel:${code}`);
    return { success: true, message: "Dialer opened with code." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to open dialer",
    };
  }
}
