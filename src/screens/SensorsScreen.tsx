import { StyleSheet, View } from "react-native";
import { GradientButton } from "../components";
import { SCREEN_HEIGHT } from "../config";
import { SensorsProps } from "../navigation";

export function SensorsScreen(props: SensorsProps) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <GradientButton
        title="To physics screen"
        style={styles.button}
        onPress={() => navigation.navigate("Physics")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    position: "absolute",
    height: 50,
    top: SCREEN_HEIGHT - 150,
    left: 100,
    right: 100,
  },
});
