import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { BubblesContainer } from "./src/BubblesContainer";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <BubblesContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
