import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ad, fetchActiveAd, listenToAd } from "../services/adService";
import { trackAdImpression } from "../services/analyticsService";

export function AdvertisementSection() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [impressionTracked, setImpressionTracked] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToAd("home_banner", (ad) => {
      setAd(ad);
      setLoading(false);
      setError(ad ? null : "Ad not found");
    });

    // Reset impression tracking when ad changes
    setImpressionTracked(false);

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  // Track ad impression when ad is loaded and visible
  useEffect(() => {
    if (ad && !impressionTracked) {
      // Track impression after a short delay to ensure it's actually visible
      const timer = setTimeout(() => {
        trackAdImpression(ad.id, "Advertiser Name"); // TODO: Get advertiser name from ad data
        setImpressionTracked(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [ad, impressionTracked]);

  const loadAd = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch the home_banner ad (you can make this dynamic later)
      const fetchedAd = await fetchActiveAd("home_banner");
      setAd(fetchedAd);
      console.log("Fetched ad:", fetchedAd);
    } catch (err) {
      console.error("Error loading ad:", err);
      setError("Failed to load advertisement");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.adContainer}>
        <ActivityIndicator size="large" color="#25292E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.adContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ad || !ad.cachePath) {
    return (
      <View style={styles.adContainer}>
        <Text style={styles.adText}>No Advertisement Available</Text>
      </View>
    );
  }

  const handleAdPress = () => {
    if (ad.link) {
      Linking.openURL(ad.link).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };
  // Render based on ad type
  if (ad.type === "image" || ad.type === "gif") {
    return (
      <Pressable style={styles.adContainer} onPress={handleAdPress}>
        {/*Use when Firebase storage caching issue is resolved*/}
        <Image
          source={{ uri: `file://${ad.cachePath}` }}
          style={styles.adImage}
          resizeMode="contain"
        />
      </Pressable>
    );
  }

  if (ad.type === "video") {
    return (
      <View style={styles.adContainer}>
        <WebView
          source={{ uri: `file://${ad.cachePath}` }}
          style={styles.adVideo}
          allowsFullscreenVideo
        />
      </View>
    );
  }

  return (
    <View style={styles.adContainer}>
      <Text style={styles.adText}>Advertisement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    width: "90%",
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  adImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  adVideo: {
    width: "100%",
    height: "100%",
  },
  adText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    fontWeight: "bold",
  },
});
