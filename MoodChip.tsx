import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../constants/colors";

type Props = {
  emoji: string;
  selected: boolean;
  onPress: () => void;
};

export default function MoodChip({ emoji, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <Text style={styles.text}>{emoji}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: Colors.cream,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 28,
  },
});
