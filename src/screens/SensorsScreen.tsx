import {
  Canvas,
  useImage,
  useTiming,
  useTouchHandler,
  useValue,
  useValueEffect,
} from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { GradientButton } from "../components";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../config";
import { useNormalizedGravity } from "../hooks";
import { SensorsProps } from "../navigation";
import { ParallaxImage } from "../drawing";
import { roundDigitsLength } from "../utils";
import { useEffect } from "react";

const BACKGROUND_PATH = require("../assets/background.png");
const BACKGROUND_PADDING = 100;

const TREE_1_PATH = require("../assets/tree1.png");
const TREE_2_PATH = require("../assets/tree2.png");
const TREE_3_PATH = require("../assets/tree3.png");

export function SensorsScreen(props: SensorsProps) {
  const { navigation } = props;
  const ratioX = useValue(0.5);
  const ratioY = useValue(0.5);

  const gravity = { x: 0.5, y: 0.5 };
  // const gravity = useNormalizedGravity();

  const touchHandler = useTouchHandler({
    onActive: ({ x, y }) => {
      // ratioX.current = roundDigitsLength(x / SCREEN_WIDTH, 2);
      // ratioY.current = roundDigitsLength(y / SCREEN_HEIGHT, 2);
      // console.log(`x: ${ratioX.current} y: ${ratioY.current}`);
    },
  });

  console.log(gravity);

  useEffect(() => {
    ratioX.current = gravity.x;
    ratioY.current = gravity.y;
  }, [gravity.x, gravity.y]);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} onTouch={touchHandler}>
        <ParallaxImage
          x={-BACKGROUND_PADDING / 2}
          y={-BACKGROUND_PADDING / 2}
          width={SCREEN_WIDTH + BACKGROUND_PADDING}
          height={SCREEN_HEIGHT + BACKGROUND_PADDING}
          ratioX={ratioX}
          ratioY={ratioY}
          amplitude={[-10, 10]}
          fit="cover"
          source={BACKGROUND_PATH}
        />

        <ParallaxImage
          x={100}
          y={250}
          width={100}
          height={200}
          ratioX={ratioX}
          ratioY={ratioY}
          amplitude={[-12, 12]}
          source={TREE_3_PATH}
        />

        <ParallaxImage
          x={200}
          y={200}
          width={150}
          height={300}
          ratioX={ratioX}
          ratioY={ratioY}
          amplitude={[-13, 13]}
          source={TREE_1_PATH}
        />

        <ParallaxImage
          x={-100}
          y={350}
          width={250}
          height={500}
          ratioX={ratioX}
          ratioY={ratioY}
          amplitude={[-50, 50]}
          source={TREE_2_PATH}
        />

        <ParallaxImage
          x={200}
          y={400}
          width={350}
          height={700}
          ratioX={ratioX}
          ratioY={ratioY}
          amplitude={[-70, 70]}
          source={TREE_1_PATH}
        />
      </Canvas>

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
  canvas: {
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
