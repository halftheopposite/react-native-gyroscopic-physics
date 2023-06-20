import {
  Canvas,
  Fill,
  SweepGradient,
  useTouchHandler,
  vec,
} from "@shopify/react-native-skia";
import { Bodies, Body, Composite, Engine, Query } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { GradientButton } from "./GradientButton";
import { Bubble } from "./bodies";
import { WallBody } from "./bodies/WallBody";
import { useGravity } from "./hooks/useGravity";

const SCREEN = Dimensions.get("window");

const UI_TIMESTEP = 1000 / 50;
const PHYSICS_TIMESTEP = 1000 / 60;

const WALL_WIDTH = 100;

const BUBBLE_RADIUS = 30;
const BUBBLES_COUNT = 30;

const SPAWN_X = SCREEN.width / 2 - BUBBLE_RADIUS;
const SPAWN_Y = -150;

export function BubblesContainer() {
  return (
    <View style={styles.container}>
      <BubblesBackground
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
          onPress={() => console.log("TODO")}
        />
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

  const [walls, setWalls] = useState<Body[]>([]);
  const [bubbles, setBubbles] = useState<Body[]>([]);
  const [tick, setTick] = useState([]);

  //
  // Initialize engine and update loop
  //
  const engine = useRef(
    Engine.create({
      gravity: {
        scale: 0.0015,
      },
    })
  ).current;

  useEffect(() => {
    // Create bubbles
    const bubbleBodies = createBubbles();
    setBubbles(bubbleBodies);

    // Add all bodies into the world
    Composite.add(engine.world, [...bubbleBodies]);

    // Launch physics update loop
    const update = () => {
      Engine.update(engine, PHYSICS_TIMESTEP);
      requestAnimationFrame(update);
    };

    update();

    // Launch UI refresh loop
    setInterval(() => {
      setTick([]);
    }, UI_TIMESTEP);
  }, []);

  //
  // Listen to mobile orientation changes and update
  // the artifical gravity of the simulation
  //
  useGravity((gravity) => {
    engine.gravity.x = gravity.x;
    engine.gravity.y = gravity.y;
  });

  //
  // Handle touch events to move bubbles arounds
  //
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
        <WallBody
          engine={engine}
          x={0}
          y={-300}
          width={SCREEN.width}
          height={WALL_WIDTH}
          isStatic
        />

        {/* Left wall */}
        <WallBody
          engine={engine}
          x={-WALL_WIDTH}
          y={-300}
          width={WALL_WIDTH}
          height={SCREEN.height + 300}
          isStatic
        />

        {/* Right wall */}
        <WallBody
          engine={engine}
          x={SCREEN.width}
          y={-300}
          width={WALL_WIDTH}
          height={SCREEN.height + 300}
          isStatic
        />

        {/* Bottom wall */}
        <WallBody
          engine={engine}
          x={0}
          y={SCREEN.height}
          width={SCREEN.width}
          height={WALL_WIDTH}
          isStatic
        />

        {/* Placeholders */}
        {placeholders.map((placeholder, index) => (
          <WallBody
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
        {bubbles.map((body) => (
          <Bubble
            key={body.id}
            x={body.position.x}
            y={body.position.y}
            radius={body.circleRadius}
            angle={body.angle}
          />
        ))}
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

//
// Utils
//

function createBubbles(): Body[] {
  let bodies: Body[] = [];

  for (let i = 0; i < BUBBLES_COUNT; i++) {
    bodies.push(
      Bodies.circle(SPAWN_X, SPAWN_Y, BUBBLE_RADIUS, {
        isStatic: false,
        restitution: 0.6,
      })
    );
  }

  return bodies;
}
