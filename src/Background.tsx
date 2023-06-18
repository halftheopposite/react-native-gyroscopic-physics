import { Canvas } from "@shopify/react-native-skia";
import { Engine } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { CircleBody } from "./bodies";
import { RectangleBody } from "./bodies/RectangleBody";
import { useGravity } from "./hooks/useGravity";

const SCREEN = Dimensions.get("window");
const UPDATE_DELTA = 1000 / 60;
const WALL_WIDTH = 100;

export function Background() {
  const [tick, setTick] = useState([]);

  // Initialize physics engine
  const engine = useRef(
    Engine.create({
      enableSleeping: false,
    })
  ).current;

  // Apply gravity whenever it changes
  useGravity((gravity) => {
    engine.gravity.x = gravity.x;
    engine.gravity.y = gravity.y;
  });

  // Initialize update loop
  useEffect(() => {
    const update = () => {
      Engine.update(engine, UPDATE_DELTA);
      setTick([]);
      requestAnimationFrame(update);
    };

    update();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Canvas style={styles.canvas}>
        {/* Left */}
        <RectangleBody
          engine={engine}
          x={0}
          y={-WALL_WIDTH}
          width={SCREEN.width}
          height={WALL_WIDTH}
          color={"red"}
          isStatic
        />

        {/* Left */}
        <RectangleBody
          engine={engine}
          x={-WALL_WIDTH}
          y={0}
          width={WALL_WIDTH}
          height={SCREEN.height}
          color={"red"}
          isStatic
        />

        {/* Right */}
        <RectangleBody
          engine={engine}
          x={SCREEN.width}
          y={0}
          width={WALL_WIDTH}
          height={SCREEN.height}
          color={"red"}
          isStatic
        />

        {/* Bottom */}
        <RectangleBody
          engine={engine}
          x={0}
          y={SCREEN.height}
          width={SCREEN.width}
          height={WALL_WIDTH}
          color={"red"}
          isStatic
        />

        {/* Button placeholder */}
        <RectangleBody
          engine={engine}
          x={100}
          y={SCREEN.height - WALL_WIDTH}
          width={SCREEN.width - WALL_WIDTH * 2}
          height={50}
          color={"green"}
          isStatic
        />

        {/* Bubbles */}
        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />

        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />

        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />

        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />
        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />
        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />
        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />
        <CircleBody
          engine={engine}
          x={SCREEN.width / 2}
          y={100}
          radius={25}
          color={"yellow"}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
