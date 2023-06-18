import { DeviceMotion } from "expo-sensors";
import { useEffect } from "react";

/**
 * A hook to listen to the device's orientation changes and convert them to a vectorized gravity.
 */
export function useGravity(
  onUpdate: (gravity: { x: number; y: number }) => void
) {
  const update = () => {
    DeviceMotion.setUpdateInterval(77);
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
