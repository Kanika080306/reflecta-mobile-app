import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function GradientBackground({ children }: any) {
  return (
    <LinearGradient
      colors={[Colors.lavender, Colors.sky, Colors.pink]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
