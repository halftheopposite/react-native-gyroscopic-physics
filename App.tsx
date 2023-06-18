import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Background } from "./src/Background";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Animated canvas + physics engine */}
      <Background />

      {/* Button */}
      <TouchableOpacity
        style={{
          height: 50,
          position: "absolute",
          bottom: 50,
          left: 100,
          right: 100,
          backgroundColor: "#efefef",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Press me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
