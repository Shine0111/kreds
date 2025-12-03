import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.appName}>Kreds</Text>
          <Text style={styles.purpose}>Easily add your credits.</Text>
          <View style={styles.divider} />
          <Text style={styles.label}>Developed & maintained by</Text>
          <Text style={styles.owner}>Shine Randriamialison</Text>
          <View style={styles.divider} />
          <Text style={styles.version}>Version 1.0.5</Text>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL("mailto:ranshine9@gmail.com")}
          >
            <Text style={styles.emailText}>Contact: ranshine9@gmail.com</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.copyrightContainer}>
        <Text style={styles.label}>
          © 2025 Shine Randriamialison. Tous droits réservés.{"\n"} La
          reproduction, la distribution ou la modification non autorisée de
          cette application ou de l’un de ses contenus est strictement
          interdite.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292E",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#25292E",
    marginBottom: 6,
    letterSpacing: 1,
  },
  purpose: {
    fontSize: 16,
    color: "#555",
    marginBottom: 18,
    textAlign: "center",
  },
  divider: {
    width: "80%",
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 14,
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  owner: {
    fontSize: 18,
    fontWeight: "600",
    color: "#25292E",
    marginBottom: 2,
  },
  version: {
    fontSize: 14,
    color: "#888",
    marginBottom: 18,
  },
  emailButton: {
    backgroundColor: "#ffd33d",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 6,
  },
  emailText: {
    color: "#25292E",
    fontWeight: "bold",
    fontSize: 15,
  },
  copyrightContainer: {
    backgroundColor: "#25292E",
    padding: 16,
    alignItems: "center",
  },
});
