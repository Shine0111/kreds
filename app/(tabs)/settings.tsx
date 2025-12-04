// app/(tabs)/about.tsx (or settings.tsx)

import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Language } from "../constants/translations";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { trackScreenView } from "../services/analyticsService";

// App constants
const APP_INFO = {
  name: "Kreds",
  version: "1.0.5",
  developer: "Shine Randriamialison",
  email: "ranshine9@gmail.com",
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
  const { colors } = useTheme();

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
          <Ionicons name={iconName} size={24} color={colors.text} />
          <Text style={[styles.settingsItemText, { color: colors.text }]}>
            {title}
          </Text>
        </View>
        <Ionicons name={chevronIcon} size={20} color={colors.textTertiary} />
      </TouchableOpacity>

      {isExpanded && children && (
        <View
          style={[
            styles.expandedContent,
            { backgroundColor: colors.expandedContent },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const { theme, colors, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Track screen view on mount
  useEffect(() => {
    trackScreenView("settings");
  }, []);

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
          t.errors.emailFailed,
          t.errors.cannotOpenEmail + " " + APP_INFO.email
        );
      }
    } catch (error) {
      console.error("Error opening email:", error);
      Alert.alert(t.errors.emailFailed, t.errors.emailFailedMessage);
    }
  };

  const renderThemeOption = (themeMode: "light" | "dark", label: string) => {
    const isSelected = theme === themeMode;
    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          {
            backgroundColor: isSelected ? colors.primary : colors.optionButton,
            borderColor: colors.optionButtonBorder,
          },
        ]}
        onPress={() => setTheme(themeMode)}
      >
        <Text
          style={[
            styles.optionButtonText,
            { color: isSelected ? "#25292E" : colors.text },
          ]}
        >
          {label}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#25292E"
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderLanguageOption = (lang: Language, label: string) => {
    const isSelected = language === lang;
    return (
      <TouchableOpacity
        style={[
          styles.optionButton,
          {
            backgroundColor: isSelected ? colors.primary : colors.optionButton,
            borderColor: colors.optionButtonBorder,
          },
        ]}
        onPress={() => setLanguage(lang)}
      >
        <Text
          style={[
            styles.optionButtonText,
            { color: isSelected ? "#25292E" : colors.text },
          ]}
        >
          {label}
        </Text>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#25292E"
            style={styles.checkIcon}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: colors.primary }]}>
            {APP_INFO.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text }]}>
            {t.settings.title}
          </Text>
        </View>

        {/* Settings Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Theme */}
          <SettingsItem
            icon="color-palette-outline"
            title={t.settings.theme.title}
            isExpanded={expandedItem === "theme"}
            onPress={() => toggleItem("theme")}
          >
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              {t.settings.theme.description}
            </Text>
            {renderThemeOption("light", t.settings.theme.light)}
            {renderThemeOption("dark", t.settings.theme.dark)}
          </SettingsItem>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Language */}
          <SettingsItem
            icon="language-outline"
            title={t.settings.language.title}
            isExpanded={expandedItem === "language"}
            onPress={() => toggleItem("language")}
          >
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              {t.settings.language.description}
            </Text>
            {renderLanguageOption("mg", t.settings.language.malagasy)}
            {renderLanguageOption("en", t.settings.language.english)}
            {renderLanguageOption("fr", t.settings.language.french)}
          </SettingsItem>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Extra Features */}
          <SettingsItem
            icon="sparkles-outline"
            title={t.settings.features.title}
            isExpanded={expandedItem === "features"}
            onPress={() => toggleItem("features")}
          >
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              {t.settings.features.description}
            </Text>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.optionButton,
                  borderColor: colors.optionButtonBorder,
                },
              ]}
            >
              <Text style={[styles.optionButtonText, { color: colors.text }]}>
                {t.settings.features.autoDetect}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.optionButton,
                  borderColor: colors.optionButtonBorder,
                },
              ]}
            >
              <Text style={[styles.optionButtonText, { color: colors.text }]}>
                {t.settings.features.saveHistory}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                {
                  backgroundColor: colors.optionButton,
                  borderColor: colors.optionButtonBorder,
                },
              ]}
            >
              <Text style={[styles.optionButtonText, { color: colors.text }]}>
                {t.settings.features.quickAccess}
              </Text>
            </TouchableOpacity>
          </SettingsItem>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          {/* Contact Us */}
          <SettingsItem
            icon="mail-outline"
            title={t.settings.contact.title}
            isExpanded={expandedItem === "contact"}
            onPress={() => toggleItem("contact")}
          >
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              {t.settings.contact.description}
            </Text>
            <TouchableOpacity
              style={[
                styles.contactButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleContactPress}
            >
              <Ionicons name="mail" size={20} color="#25292E" />
              <Text style={styles.contactButtonText}>{APP_INFO.email}</Text>
            </TouchableOpacity>
            <View style={styles.developerInfo}>
              <Text
                style={[styles.developerLabel, { color: colors.textTertiary }]}
              >
                {t.settings.contact.developedBy}
              </Text>
              <Text style={[styles.developerName, { color: colors.text }]}>
                {APP_INFO.developer}
              </Text>
            </View>
          </SettingsItem>
        </View>

        {/* Version & Copyright */}
        <View style={styles.footerInfo}>
          <Text style={[styles.versionText, { color: colors.text }]}>
            {t.common.version} {APP_INFO.version}
          </Text>
          <Text style={[styles.copyrightText, { color: colors.text }]}>
            {t.common.allRightsReserved}
          </Text>
          <Text style={[styles.copyrightDetails, { color: colors.text }]}>
            {t.common.copyrightDetails}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  card: {
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
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
  },
  contentText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  checkIcon: {
    marginLeft: 8,
  },
  contactButton: {
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
    marginBottom: 4,
  },
  developerName: {
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  footerInfo: {
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  versionText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 8,
  },
  copyrightDetails: {
    fontSize: 11,
    opacity: 0.5,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
