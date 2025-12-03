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
  isExpanded: boolean;
  onPress: () => void;
  children?: React.ReactNode;
}

function SettingsItem({
  icon,
  title,
  isExpanded,
  onPress,
  children,
}: SettingsItemProps) {
  const iconName = isExpanded
    ? (icon.replace("-outline", "-sharp") as keyof typeof Ionicons.glyphMap)
    : icon;
  const chevronIcon = isExpanded ? "chevron-down" : "chevron-forward";

  return (
    <View>
      <TouchableOpacity
        style={styles.settingsItem}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.settingsItemLeft}>
          <Ionicons name={iconName} size={24} color="#25292E" />
          <Text style={styles.settingsItemText}>{title}</Text>
        </View>
        <Ionicons name={chevronIcon} size={20} color="#888" />
      </TouchableOpacity>

      {isExpanded && children && (
        <View style={styles.expandedContent}>{children}</View>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
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
            isExpanded={expandedItem === "theme"}
            onPress={() => toggleItem("theme")}
          >
            <Text style={styles.contentText}>
              Choose your preferred theme for the app.
            </Text>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Light Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Dark Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>System Default</Text>
            </TouchableOpacity>
          </SettingsItem>

          <View style={styles.divider} />

          <SettingsItem
            icon="sparkles-outline"
            title="Extra Features"
            isExpanded={expandedItem === "features"}
            onPress={() => toggleItem("features")}
          >
            <Text style={styles.contentText}>
              Unlock additional features and functionality.
            </Text>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Auto-detect operator</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>Save scan history</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionButtonText}>
                Quick access shortcuts
              </Text>
            </TouchableOpacity>
          </SettingsItem>

          <View style={styles.divider} />

          <SettingsItem
            icon="mail-outline"
            title="Contact Us"
            isExpanded={expandedItem === "contact"}
            onPress={() => toggleItem("contact")}
          >
            <Text style={styles.contentText}>
              Get in touch with us for support or feedback.
            </Text>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactPress}
            >
              <Ionicons name="mail" size={20} color="#25292E" />
              <Text style={styles.contactButtonText}>{APP_INFO.email}</Text>
            </TouchableOpacity>
            <View style={styles.developerInfo}>
              <Text style={styles.developerLabel}>Developed by</Text>
              <Text style={styles.developerName}>{APP_INFO.developer}</Text>
            </View>
          </SettingsItem>
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
  expandedContent: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
  },
  contentText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  optionButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  optionButtonText: {
    fontSize: 15,
    color: "#25292E",
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#ffd33d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 15,
    color: "#25292E",
    fontWeight: "bold",
  },
  developerInfo: {
    alignItems: "center",
    paddingTop: 8,
  },
  developerLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  developerName: {
    fontSize: 15,
    color: "#25292E",
    fontWeight: "600",
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
