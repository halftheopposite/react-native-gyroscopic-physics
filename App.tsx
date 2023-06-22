import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { BubblesContainer, GradientButton } from "./src/components";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./src/config";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <BubblesContainer
        placeholders={[
          {
            id: 123,
            x: 100,
            y: SCREEN_HEIGHT - 150,
            width: SCREEN_WIDTH - 200,
            height: 50,
          },
        ]}
      >
        <GradientButton
          title="More bubbles!"
          style={styles.button}
          onPress={() => console.log("TODO")}
        />
      </BubblesContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    height: 50,
    top: SCREEN_HEIGHT - 150,
    left: 100,
    right: 100,
  },
});
