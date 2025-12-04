// app/services/analyticsService.ts

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { OperatorType } from "../utils/operatorConfig";

/**
 * Log an event to Firestore analytics collection
 */
async function logEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
) {
  try {
    if (!db) {
      console.warn("Firestore not initialized");
      return;
    }

    await addDoc(collection(db, "analytics_events"), {
      event_name: eventName,
      ...eventParams,
      timestamp: serverTimestamp(),
      platform: "android",
    });

    console.log(`Analytics event logged: ${eventName}`);
  } catch (error) {
    console.error(`Error logging event ${eventName}:`, error);
  }
}

/**
 * Track when the app is opened
 */
export function trackAppOpen() {
  logEvent("app_open");
}

/**
 * Track when an ad is displayed (impression)
 */
export function trackAdImpression(adId: string, advertiserName?: string) {
  logEvent("ad_impression", {
    ad_id: adId,
    ad_unit_name: "home_banner",
    advertiser: advertiserName || "unknown",
  });
}

/**
 * Track when an ad is clicked
 */
export function trackAdClick(
  adId: string,
  destinationUrl: string,
  advertiserName?: string
) {
  logEvent("ad_click", {
    ad_id: adId,
    ad_unit_name: "home_banner",
    advertiser: advertiserName || "unknown",
    destination_url: destinationUrl,
  });
}

/**
 * Track when user starts a scan
 */
export function trackScanStart(operator: OperatorType) {
  logEvent("scan_start", {
    operator: operator,
  });
}

/**
 * Track successful scan and code processing
 */
export function trackScanSuccess(operator: OperatorType) {
  logEvent("scan_success", {
    operator: operator,
  });
}

/**
 * Track failed scan
 */
export function trackScanFailure(operator: OperatorType, errorReason: string) {
  logEvent("scan_failure", {
    operator: operator,
    error_reason: errorReason,
  });
}

/**
 * Track when user opens the dialer with code
 */
export function trackDialerOpen(operator: OperatorType, dialCode: string) {
  logEvent("dialer_open", {
    operator: operator,
    code_length: dialCode.length,
  });
}

/**
 * Track when user copies code to clipboard
 */
export function trackCodeCopy(operator: OperatorType) {
  logEvent("code_copy", {
    operator: operator,
  });
}

/**
 * Track screen views
 */
export function trackScreenView(screenName: string) {
  logEvent("screen_view", {
    screen_name: screenName,
  });
}

/**
 * Track settings changes
 */
export function trackSettingsChange(settingName: string, value: string) {
  logEvent("settings_change", {
    setting_name: settingName,
    value: value,
  });
}

/**
 * Track errors
 */
export function trackError(errorType: string, errorMessage: string) {
  logEvent("app_error", {
    error_type: errorType,
    error_message: errorMessage,
  });
}
