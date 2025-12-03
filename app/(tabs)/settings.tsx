import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// App constants
const APP_INFO = {
  name: "Kreds",
  version: "1.0.5",
  developer: "Shine Randriamialison",
  email: "ranshine9@gmail.com",
  copyright: "© 2025 Shine Randriamialison. Tous droits réservés.",
  copyrightDetails:
    "La reproduction, la distribution ou la modification non autorisée de cette application ou de l'un de ses contenus est strictement interdite.",
};

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  showChevron?: boolean;
}

function SettingsItem({
  icon,
  title,
  onPress,
  showChevron = true,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={24} color="#25292E" />
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#888" />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleThemePress = () => {
    // TODO: Implement theme switching
    Alert.alert("Theme", "Theme settings coming soon!");
  };

  const handleExtraFeaturesPress = () => {
    // TODO: Navigate to extra features screen
    Alert.alert("Extra Features", "Extra features coming soon!");
  };

  const handleContactPress = async () => {
    try {
      const url = `mailto:${APP_INFO.email}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "Cannot open email client. Please contact us at: " + APP_INFO.email
        );
      }
    } catch (error) {
      console.error("Error opening email:", error);
      Alert.alert(
        "Error",
        "Failed to open email client. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>{APP_INFO.name}</Text>
          <Text style={styles.headerSubtitle}>Settings</Text>
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <SettingsItem
            icon="color-palette-outline"
            title="Theme"
            onPress={handleThemePress}
          />

          <View style={styles.divider} />

          <SettingsItem
            icon="sparkles-outline"
            title="Extra Features"
            onPress={handleExtraFeaturesPress}
          />

          <View style={styles.divider} />

          <SettingsItem
            icon="mail-outline"
            title="Contact Us"
            onPress={handleContactPress}
          />
        </View>

        {/* Version & Copyright */}
        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Version {APP_INFO.version}</Text>
          <Text style={styles.copyrightText}>{APP_INFO.copyright}</Text>
          <Text style={styles.copyrightDetails}>
            {APP_INFO.copyrightDetails}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffd33d",
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingsItemText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#25292E",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginHorizontal: 16,
  },
  footerInfo: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    marginBottom: 16,
  },
  copyrightText: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 8,
  },
  copyrightDetails: {
    fontSize: 11,
    color: "#fff",
    opacity: 0.5,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
