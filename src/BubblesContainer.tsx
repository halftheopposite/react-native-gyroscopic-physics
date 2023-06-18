import {
  Canvas,
  Fill,
  SweepGradient,
  useTouchHandler,
  vec,
} from "@shopify/react-native-skia";
import { Body, Composite, Engine, Query } from "matter-js";
import { memo, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { GradientButton } from "./GradientButton";
import { Bubble } from "./bodies";
import { Wall } from "./bodies/Wall";
import { useGravity } from "./hooks/useGravity";

const SCREEN = Dimensions.get("window");
const UPDATE_DELTA = 1000 / 60;
const WALL_WIDTH = 100;
const BUBBLE_RADIUS = 30;
const INITIAL_BUBBLE_COUNT = 10;

export function BubblesContainer() {
  const [bubblesCount, setBubblesCount] = useState(INITIAL_BUBBLE_COUNT);

  return (
    <View style={styles.container}>
      <BubblesBackground
        bubblesCount={bubblesCount}
        placeholders={[
          {
            x: 100,
            y: SCREEN.height - 150,
            width: SCREEN.width - 200,
            height: 50,
          },
        ]}
      />

      {/* UI layout */}
      <View style={styles.contentContainer} pointerEvents="box-none">
        <GradientButton
          title="More bubbles!"
          style={styles.button}
          onPress={() => setBubblesCount((prev) => prev + 1)}
        />
      </View>
    </View>
  );
}

function BubblesBackground(props: {
  bubblesCount: number;
  placeholders?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}) {
  const { bubblesCount, placeholders = [] } = props;

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

  // Handle touch events to move bodies
  const [draggingBody, setDraggingBody] = useState<Body | null>(null);

  const touchHandler = useTouchHandler(
    {
      onStart: ({ x, y }) => {
        if (draggingBody) {
          return;
        }

        const bodies = Query.point(Composite.allBodies(engine.world), {
          x,
          y,
        });

        if (!bodies || bodies.length === 0) {
          return;
        }

        const firstBody = bodies[0];
        if (firstBody.isStatic) {
          return;
        }

        setDraggingBody(bodies[0]);
      },
      onActive: (info) => {
        if (!draggingBody) {
          return;
        }

        draggingBody.isStatic = true;

        Body.setPosition(draggingBody, {
          x: info.x,
          y: info.y,
        });
      },
      onEnd: (info) => {
        if (!draggingBody) {
          return;
        }

        draggingBody.isStatic = false;

        Body.applyForce(
          draggingBody,
          { x: info.x, y: info.y },
          { x: info.velocityX / 10000, y: info.velocityY / 10000 }
        );

        setDraggingBody(null);
      },
    },
    [draggingBody]
  );

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} onTouch={touchHandler}>
        <Fill>
          <SweepGradient
            c={vec(-45, 0)}
            colors={["#FF8787", "#F8C4B4", "#E5EBB2", "#BCE29E"]}
            start={0}
            end={100}
          />
        </Fill>

        {/* Top wall */}
        <Wall
          engine={engine}
          x={0}
          y={-300}
          width={SCREEN.width}
          height={WALL_WIDTH}
          isStatic
        />

        {/* Left wall */}
        <Wall
          engine={engine}
          x={-WALL_WIDTH}
          y={-300}
          width={WALL_WIDTH}
          height={SCREEN.height + 300}
          isStatic
        />

        {/* Right wall */}
        <Wall
          engine={engine}
          x={SCREEN.width}
          y={-300}
          width={WALL_WIDTH}
          height={SCREEN.height + 300}
          isStatic
        />

        {/* Bottom wall */}
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
            color="transparent"
            isStatic
          />
        ))}

        {/* Bubbles */}
        <Bubbles
          engine={engine}
          count={bubblesCount}
          spawnPoint={{
            x: SCREEN.width / 2 - BUBBLE_RADIUS,
            y: -150,
          }}
        />
      </Canvas>
    </View>
  );
}

const Bubbles = memo(
  (props: {
    engine: Engine;
    spawnPoint: { x: number; y: number };
    count: number;
  }) => {
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
);

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
    top: SCREEN.height - 150,
    left: 100,
    right: 100,
  },
});
