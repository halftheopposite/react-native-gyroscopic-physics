import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import {
  BubblesContainer,
  GradientButton,
  Logo,
  Placeholder,
} from "./src/components";
import { SCREEN_HEIGHT } from "./src/config";

export default function App() {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);

  const handleOnLayout = (id: number, layout: LayoutRectangle) => {
    setPlaceholders((previous) => {
      const updated = [...previous];

      const index = updated.findIndex((placeholder) => placeholder.id === id);
      if (index === -1) {
        updated.push({
          id,
          ...layout,
        });
      } else {
        updated[index] = {
          ...placeholders[index],
          ...layout,
        };
      }

      return updated;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <BubblesContainer placeholders={placeholders}>
        <Logo
          style={styles.logo}
          onLayout={(layout) => handleOnLayout(123, layout)}
        />
        <GradientButton
          title="More bubbles!"
          style={styles.button}
          onLayout={(layout) => handleOnLayout(456, layout)}
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
  logo: {
    position: "absolute",
    height: 50,
    top: 120,
    left: 100,
    right: 100,
  },
  button: {
    position: "absolute",
    height: 50,
    top: SCREEN_HEIGHT - 150,
    left: 100,
    right: 100,
  },
});
