import { Rect } from "@shopify/react-native-skia";
import { memo } from "react";

export const Wall = memo(
  (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
  }) => {
    const { x, y, width, height, color } = props;

    return <Rect x={x} y={y} width={width} height={height} color={color} />;
  }
);
