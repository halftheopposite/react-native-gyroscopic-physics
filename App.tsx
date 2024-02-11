import { NavigationContainer } from "@react-navigation/native";
import { RootStack } from "./src/navigation";
import { PhysicsScreen, SensorsScreen } from "./src/screens";

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Sensors"
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="Physics" component={PhysicsScreen} />
        <RootStack.Screen name="Sensors" component={SensorsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
