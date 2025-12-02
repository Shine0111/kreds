import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { OperatorType } from "../utils/operatorConfig";

interface OperatorButtonsProps {
  onOperatorPress: (operator: OperatorType) => void;
}

const operatorImages: Record<OperatorType, any> = {
  yas: require("../../assets/images/yas.png"),
  orange: require("../../assets/images/orange.png"),
  airtel: require("../../assets/images/airtel.png"),
};

const operators: OperatorType[] = ["yas", "orange", "airtel"];

export function OperatorButtons({ onOperatorPress }: OperatorButtonsProps) {
  return (
    <View style={styles.buttonsContainer}>
      {operators.map((operator) => (
        <TouchableOpacity
          key={operator}
          onPress={() => onOperatorPress(operator)}
        >
          <Image
            source={operatorImages[operator]}
            style={[
              styles.operatorImage,
              operator === "airtel" && styles.airtelImage,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 16,
    marginBottom: "40%",
  },
  operatorImage: {
    width: 90,
    height: 50,
    resizeMode: "contain",
  },
  airtelImage: {
    resizeMode: "contain",
  },
});
