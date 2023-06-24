import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

type RootStackParamList = {
  Physics: undefined;
  Sensors: undefined;
};

export type PhysicsProps = NativeStackScreenProps<
  RootStackParamList,
  "Physics"
>;
export type SensorsProps = NativeStackScreenProps<
  RootStackParamList,
  "Sensors"
>;

export const RootStack = createNativeStackNavigator<RootStackParamList>();
