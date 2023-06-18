import { Image, useImage } from "@shopify/react-native-skia";
import { Bodies, Composite, Engine } from "matter-js";
import { useEffect, useRef } from "react";

const BUBBLE_IMAGE_PATH = require("../../assets/bubble.png");
const BUBBLE_PADDING = 5;

/**
 * A circle body displaying a bubble image.
 */
export function Bubble(props: {
  engine: Engine;
  x: number;
  y: number;
  radius: number;
  isStatic?: boolean;
}) {
  const { engine, x, y, radius, isStatic = false } = props;

  const body = useRef(
    Bodies.circle(x + radius, y + radius, radius, {
      isStatic,
      restitution: 0.6,
    })
  ).current;

  useEffect(() => {
    Composite.add(engine.world, [body]);
  }, []);

  const image = useImage(BUBBLE_IMAGE_PATH);
  if (!image) {
    return null;
  }

  return (
    <Image
      image={image}
      x={body.position.x - radius - BUBBLE_PADDING / 2}
      y={body.position.y - radius - BUBBLE_PADDING / 2}
      width={radius * 2 + BUBBLE_PADDING}
      height={radius * 2 + BUBBLE_PADDING}
      origin={{ x: body.position.x, y: body.position.y }}
      transform={[{ rotate: body.angle }]}
    />
  );
}
