import { Vector, clamp } from "@shopify/react-native-skia";
import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";
import { roundDigitsLength } from "../utils";

/**
 * A hook to listen to the device's orientation changes and convert them to a vectorized gravity.
 */
export function useGravity(
  onUpdate: (gravity: { x: number; y: number }) => void
) {
  console.log("useGravity");
  const update = () => {
    DeviceMotion.setUpdateInterval(200);
  };

  const subscribe = () => {
    DeviceMotion.addListener((devicemotionData) => {
      onUpdate({
        x: devicemotionData.rotation.gamma,
        y: devicemotionData.rotation.beta,
      });
    });

    update();
  };

  const unsubscribe = () => {
    DeviceMotion.removeAllListeners();
  };

  useEffect(() => {
    subscribe();

    return () => {
      unsubscribe();
    };
  }, []);
}

const GRAVITY_DISTANCE = 3;

/** A hook returning gravity as a normalized vector. */
export function useNormalizedGravity(): Vector {
  const [value, setValue] = useState<Vector>({ x: 0, y: 0 });

  useGravity((updated) => {
    // Make the value fit between 0 and 3
    const clampedX = clamp(
      updated.x + GRAVITY_DISTANCE / 2,
      0,
      GRAVITY_DISTANCE
    );

    const clampedY = clamp(
      updated.y + GRAVITY_DISTANCE / 2,
      0,
      GRAVITY_DISTANCE
    );

    // Normalize the value between 0 and 1
    const normalizedX = roundDigitsLength(clampedX / GRAVITY_DISTANCE, 2);
    const normalizedY = roundDigitsLength(clampedY / GRAVITY_DISTANCE, 2);

    if (value.x !== normalizedX || value.y !== normalizedY) {
      setValue({ x: normalizedX, y: normalizedY });
    }
  });

  return value;
}
