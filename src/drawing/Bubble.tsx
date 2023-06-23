import { Image, SkImage } from "@shopify/react-native-skia";
import { memo } from "react";

/** The padding used to create some overlap between bubbles. */
const BUBBLE_PADDING = 5;

export const Bubble = memo(
  (props: {
    x: number;
    y: number;
    radius: number;
    angle: number;
    image: SkImage;
  }) => {
    const { x, y, radius, angle, image } = props;

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
