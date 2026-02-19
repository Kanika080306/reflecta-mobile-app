import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors } from "../constants/colors";

export default function FloatingBlobs({ children }: any) {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: -15,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ]),
      ).start();

    animate(float1, 6000);
    animate(float2, 8000);
    animate(float3, 7000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.blob1, { transform: [{ translateY: float1 }] }]}
      />
      <Animated.View
        style={[styles.blob2, { transform: [{ translateY: float2 }] }]}
      />
      <Animated.View
        style={[styles.blob3, { transform: [{ translateY: float3 }] }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  blob1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.lavender,
    top: -80,
    left: -60,
    opacity: 0.6,
  },
  blob2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.sky,
    top: 140,
    right: -80,
    opacity: 0.6,
  },
  blob3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.pink,
    bottom: -120,
    left: -80,
    opacity: 0.5,
  },
});
