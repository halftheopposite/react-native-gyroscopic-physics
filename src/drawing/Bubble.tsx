import { Image, useImage } from "@shopify/react-native-skia";
import { memo } from "react";

const BUBBLE_IMAGE_PATH = require("../../assets/bubble.png");
const BUBBLE_PADDING = 5;

export const Bubble = memo(
  (props: { x: number; y: number; radius: number; angle: number }) => {
    const { x, y, radius, angle } = props;

    const image = useImage(BUBBLE_IMAGE_PATH);
    if (!image) {
      return null;
    }

    const size = radius * 2 + BUBBLE_PADDING;

    return (
      <Image
        image={image}
        x={x - radius - BUBBLE_PADDING / 2}
        y={y - radius - BUBBLE_PADDING / 2}
        width={size}
        height={size}
        origin={{ x, y }}
        transform={[{ rotate: angle }]}
      />
    );
  }
);
