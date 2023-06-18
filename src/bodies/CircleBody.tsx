import { Circle, Group, Image, useImage } from "@shopify/react-native-skia";
import { Bodies, Composite, Engine } from "matter-js";
import { useEffect, useRef } from "react";
import assets from "../../assets";

export function CircleBody(props: {
  engine: Engine;
  x: number;
  y: number;
  radius: number;
  color: string;
  isStatic?: boolean;
}) {
  const { engine, x, y, radius, color, isStatic = false } = props;

  const image = useImage(assets.bubble);

  const body = useRef(
    Bodies.circle(x + radius, y + radius, radius, {
      isStatic,
    })
  ).current;

  useEffect(() => {
    Composite.add(engine.world, [body]);
  }, []);

  return (
    <Circle
      cx={body.position.x}
      cy={body.position.y}
      r={radius}
      color={color}
    />
  );
}
