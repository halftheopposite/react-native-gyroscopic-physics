import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export function GradientButton(props: { style?: StyleProp<ViewStyle> }) {
  const { style } = props;

  return (
    <TouchableOpacity style={[styles.container, style]}>
      <Text>Press me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
  },
});
