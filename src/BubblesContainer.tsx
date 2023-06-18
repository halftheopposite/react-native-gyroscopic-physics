import {
  Canvas,
  Fill,
  Rect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { Engine } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Bubble } from "./bodies";
import { Wall } from "./bodies/Wall";
import { useGravity } from "./hooks/useGravity";
import { GradientButton } from "./GradientButton";

const SCREEN = Dimensions.get("window");
const UPDATE_DELTA = 1000 / 60;
const WALL_WIDTH = 100;
const BUBBLE_RADIUS = 30;

export function BubblesContainer() {
  return (
    <View style={styles.container}>
      <BubblesBackground
        placeholders={[
          {
            x: 100,
            y: SCREEN.height - 200,
            width: SCREEN.width - 200,
            height: 50,
          },
        ]}
      />

      {/* UI layout */}
      <View style={styles.contentContainer}>
        <GradientButton style={styles.button} />
      </View>
    </View>
  );
}

function BubblesBackground(props: {
  placeholders?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}) {
  const { placeholders = [] } = props;

  // This state is used only to refresh the component and its children
  const [tick, setTick] = useState([]);

  // Initialize physics engine
  const engine = useRef(
    Engine.create({
      enableSleeping: false,
      positionIterations: 2,
      gravity: {
        scale: 0.0015,
      },
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
        <Fill>
          <SweepGradient
            c={vec(-45, 0)}
            colors={["#FF8787", "#F8C4B4", "#E5EBB2", "#BCE29E"]}
            start={0}
            end={100}
          />
        </Fill>

        {/* Left */}
        <Wall
          engine={engine}
          x={0}
          y={-WALL_WIDTH}
          width={SCREEN.width}
          height={WALL_WIDTH}
          isStatic
        />

        {/* Left */}
        <Wall
          engine={engine}
          x={-WALL_WIDTH}
          y={0}
          width={WALL_WIDTH}
          height={SCREEN.height}
          isStatic
        />

        {/* Right */}
        <Wall
          engine={engine}
          x={SCREEN.width}
          y={0}
          width={WALL_WIDTH}
          height={SCREEN.height}
          isStatic
        />

        {/* Bottom */}
        <Wall
          engine={engine}
          x={0}
          y={SCREEN.height}
          width={SCREEN.width}
          height={WALL_WIDTH}
          isStatic
        />

        {/* Placeholders */}
        {placeholders.map((placeholder, index) => (
          <Wall
            key={`placeholder-${index}`}
            engine={engine}
            x={placeholder.x}
            y={placeholder.y}
            width={placeholder.width}
            height={placeholder.height}
            isStatic
          />
        ))}

        {/* Bubbles */}
        <Bubbles
          engine={engine}
          count={20}
          spawnPoint={{
            x: SCREEN.width / 2,
            y: 200,
          }}
        />
      </Canvas>
    </View>
  );
}

function Bubbles(props: {
  engine: Engine;
  spawnPoint: { x: number; y: number };
  count: number;
}) {
  const { engine, spawnPoint, count } = props;
  const array = [...Array(count).keys()];

  return (
    <>
      {array.map((value, index) => (
        <Bubble
          key={`bubble-${index}`}
          engine={engine}
          x={spawnPoint.x}
          y={spawnPoint.y}
          radius={BUBBLE_RADIUS}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  contentContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: "absolute",
    height: 50,
    top: SCREEN.height - 200,
    left: 100,
    right: 100,
  },
});
