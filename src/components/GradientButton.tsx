import {
  Canvas,
  LinearGradient,
  RoundedRect,
  Shadow,
  vec,
} from "@shopify/react-native-skia";
import { useRef, useState } from "react";
import {
  Animated,
  LayoutRectangle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const AnimatedTouchable = Animated.createAnimatedComponent(Pressable);

export function GradientButton(props: {
  title: string;
  style?: StyleProp<ViewStyle>;
  onLayout: (layout: LayoutRectangle) => void;
  onPress: () => void;
}) {
  const { title, style, onLayout, onPress } = props;
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const scaleValue = useRef(new Animated.Value(1)).current;

  const pressInAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const pressOutAnimation = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        style,
        {
          transform: [
            {
              scale: scaleValue,
            },
          ],
        },
      ]}
      onLayout={(event) => {
        onLayout(event.nativeEvent.layout);
        setDimensions({
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        });
      }}
      onPressIn={pressInAnimation}
      onPressOut={pressOutAnimation}
      onPress={onPress}
    >
      <>
        {/* Background */}
        <Canvas style={styles.canvas}>
          <RoundedRect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            r={12}
            strokeWidth={2}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(dimensions.width, dimensions.height)}
              colors={["rgba(250, 0, 80, 1)", "rgba(255, 41, 187, 1)"]}
            />
            <Shadow
              dx={0}
              dy={-6}
              blur={10}
              color="rgba(255, 174, 237, 0.7)"
              inner
            />
          </RoundedRect>
        </Canvas>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>
      </>
    </AnimatedTouchable>
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
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
