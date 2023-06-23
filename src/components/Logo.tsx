import {
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  LayoutRectangle,
} from "react-native";

export function Logo(props: {
  style?: StyleProp<ViewStyle>;
  onLayout: (layout: LayoutRectangle) => void;
}) {
  const { style, onLayout } = props;

  return (
    <Text
      style={[styles.text, style]}
      onLayout={(event) => onLayout(event.nativeEvent.layout)}
    >
      Physics
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    lineHeight: 40,
    textAlign: "center",
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
  },
});
