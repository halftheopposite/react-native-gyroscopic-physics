import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import {
  BubblesContainer,
  GradientButton,
  Logo,
  Placeholder,
} from "../components";
import { SCREEN_HEIGHT } from "../config";
import { PhysicsProps } from "../navigation";

export function PhysicsScreen(props: PhysicsProps) {
  const { navigation } = props;

  // States
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);

  // Hanlders
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
      <StatusBar />

      <BubblesContainer placeholders={placeholders}>
        <Logo
          style={styles.logo}
          onLayout={(layout) => handleOnLayout(123, layout)}
        />
        <GradientButton
          title="To sensors screen"
          style={styles.button}
          onLayout={(layout) => handleOnLayout(456, layout)}
          onPress={() => navigation.navigate("Sensors")}
        />
      </BubblesContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
