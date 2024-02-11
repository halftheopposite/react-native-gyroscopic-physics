import {
  DataSourceParam,
  Fit,
  Image,
  SkiaMutableValue,
  interpolate,
  useImage,
  useValue,
  useValueEffect,
} from "@shopify/react-native-skia";

export function ParallaxImage(props: {
  x: number;
  y: number;
  width: number;
  height: number;
  ratioX: SkiaMutableValue<number>;
  ratioY: SkiaMutableValue<number>;
  amplitude: [number, number];
  source: DataSourceParam;
  fit?: Fit;
}) {
  const { x, y, width, height, ratioX, ratioY, amplitude, source, fit } = props;

  const localX = useValue(x);
  const localY = useValue(y);

  useValueEffect(ratioX, () => {
    localX.current = interpolate(
      ratioX.current,
      [0, 1],
      [x + amplitude[0], x + amplitude[1]]
    );
  });

  useValueEffect(ratioY, () => {
    localY.current = interpolate(
      ratioY.current,
      [0, 1],
      [y + amplitude[0], y + amplitude[1]]
    );
  });

  const image = useImage(source);
  if (!image) {
    return null;
  }

  return (
    <Image
      x={localX}
      y={localY}
      width={width}
      height={height}
      image={image}
      fit={fit}
    />
  );
}
