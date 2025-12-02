import { StyleSheet, Text, View } from "react-native";

export function AdvertisementSection() {
  // You can replace this with an actual ad component or logic later
  return (
    <View style={styles.adContainer}>
      <Text style={styles.adText}>Advertisement</Text>
      {/* Place your ad banner or component here */}
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    width: "90%",
    minHeight: 200,
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
    elevation: 0,
  },
  adText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "bold",
  },
});
