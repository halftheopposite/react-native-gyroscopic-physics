import { Rect } from "@shopify/react-native-skia";
import { Bodies, Composite, Engine } from "matter-js";
import { useEffect, useRef } from "react";

/**
 * A rectangle body that you can color.
 */
export function Wall(props: {
  engine: Engine;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  isStatic?: boolean;
}) {
  const { engine, x, y, width, height, color, isStatic = false } = props;

  const body = useRef(
    Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
      isStatic,
    })
  ).current;

  useEffect(() => {
    Composite.add(engine.world, [body]);
  }, []);

  return (
    <Rect
      x={body.bounds.min.x}
      y={body.bounds.min.y}
      width={width}
      height={height}
      color={color}
    />
  );
}
