import { PermissionsAndroid, Platform } from "react-native";
import Ussd, { ussdEventEmitter } from "react-native-ussd";

type UssdResponse = {
  success: boolean;
  message: string;
};

/**
 * Dial a USSD code and return the response.
 */
export async function dialUSSD(code: string): Promise<UssdResponse> {
  if (Platform.OS !== "android") {
    return { success: false, message: "USSD not supported on this platform." };
  }

  // Ask for CALL_PHONE permission
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

  return new Promise(async (resolve, reject) => {
    // Listen for reply
    const successListener = ussdEventEmitter.addListener(
      "ussdEvent",
      (event) => {
        successListener.remove();
        errorListener.remove();
        resolve({ success: true, message: event.ussdReply });
      }
    );

    const errorListener = ussdEventEmitter.addListener(
      "ussdErrorEvent",
      (event) => {
        successListener.remove();
        errorListener.remove();
        resolve({ success: false, message: event.error });
      }
    );

    try {
      await Ussd.dial(code);
    } catch (err: any) {
      successListener.remove();
      errorListener.remove();
      reject({ success: false, message: err.message || "Dial failed" });
    }
  });
}
