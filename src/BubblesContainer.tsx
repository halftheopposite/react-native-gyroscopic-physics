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
import { Bubble, Wall } from "./bodies";
import { useGravity } from "./hooks/useGravity";

const SCREEN = Dimensions.get("window");

const UI_TIMESTEP = 1000 / 50;
const PHYSICS_TIMESTEP = 1000 / 60;

const WALL_WIDTH = 100;

const BUBBLE_RADIUS = 30;
const BUBBLES_COUNT = 30;

const SPAWN_X = SCREEN.width / 2 - BUBBLE_RADIUS;
const SPAWN_Y = -150;

type Placeholder = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function BubblesContainer() {
  return (
    <View style={styles.container}>
      <BubblesBackground
        placeholders={[
          {
            id: 123,
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

function BubblesBackground(props: { placeholders?: Placeholder[] }) {
  const { placeholders } = props;

  const [wallBodies, setWallBodies] = useState<Body[]>([]);
  const [bubbleBodies, setBubbleBodies] = useState<Body[]>([]);
  const [placeholderBodies, setPlaceholdersBodies] = useState<Body[]>([]);

  const [, setTick] = useState([]);

  //
  // Initialize engine and update loop
  //
  const engine = useRef(
    Engine.create({
      positionIterations: 2,
      gravity: {
        scale: 0.002,
      },
    })
  ).current;

  useEffect(() => {
    // Create walls
    const wallBodies = createWalls();
    setWallBodies(wallBodies);

    // Create bubbles
    const bubbleBodies = createBubbles();
    setBubbleBodies(bubbleBodies);

    // Add all bodies into the world
    Composite.add(engine.world, [...wallBodies, ...bubbleBodies]);

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
  // Listen to placeholder changes
  //
  useEffect(() => {
    if (!placeholders || placeholders.length === 0) {
      return;
    }

    const bodies: Body[] = [];

    placeholders.forEach((placeholder) => {
      const existingBody = Composite.allBodies(engine.world).find(
        (body) => body.id === placeholder.id
      );

      // If body already exist we do not add it to the list
      if (!!existingBody) {
        return;
      }

      bodies.push(
        createWall(
          placeholder.x,
          placeholder.y,
          placeholder.width,
          placeholder.height,
          placeholder.id
        )
      );
    });

    Composite.add(engine.world, bodies);
  }, [placeholders]);

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

        Body.setStatic(firstBody, true);

        setDraggingBody(firstBody);
      },
      onActive: (info) => {
        if (!draggingBody) {
          return;
        }

        Body.setPosition(draggingBody, {
          x: info.x,
          y: info.y,
        });
      },
      onEnd: (info) => {
        if (!draggingBody) {
          return;
        }

        Body.setStatic(draggingBody, false);

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

        {/* Walls */}
        {wallBodies.map((body) => (
          <Wall
            key={`${body.id}`}
            x={body.bounds.min.x}
            y={body.bounds.min.y}
            width={Math.floor(body.bounds.max.x - body.bounds.min.x)}
            height={Math.floor(body.bounds.max.y - body.bounds.min.y)}
          />
        ))}

        {/* Bubbles */}
        {bubbleBodies.map((body) => (
          <Bubble
            key={`${body.id}`}
            x={body.position.x}
            y={body.position.y}
            radius={body.circleRadius}
            angle={body.angle}
          />
        ))}

        {/* Placeholders */}
        {placeholderBodies.map((body) => (
          <Wall
            key={`${body.id}`}
            x={body.bounds.min.x}
            y={body.bounds.min.y}
            width={Math.floor(body.bounds.max.x - body.bounds.min.x)}
            height={Math.floor(body.bounds.max.y - body.bounds.min.y)}
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
function createWalls(): Body[] {
  const topOffset = 300;
  const totalWidth = SCREEN.width;
  const totalHeight = SCREEN.height + topOffset;

  const topWall = createWall(0, -topOffset, totalWidth, WALL_WIDTH);
  const leftWall = createWall(-WALL_WIDTH, -topOffset, WALL_WIDTH, totalHeight);
  const rightWall = createWall(totalWidth, -topOffset, WALL_WIDTH, totalHeight);
  const bottomWall = createWall(0, SCREEN.height, totalWidth, WALL_WIDTH);

  return [topWall, leftWall, rightWall, bottomWall];
}

function createWall(
  x: number,
  y: number,
  width: number,
  height: number,
  id?: number
): Body {
  return Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
    isStatic: true,
    ...(!!id ? { id } : {}),
  });
}

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
