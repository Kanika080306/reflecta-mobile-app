import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors } from "../constants/colors";

export default function BubbleBackground({ children }: any) {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;
  const float3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, {
          toValue: -15,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(float1, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, {
          toValue: 12,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(float2, {
          toValue: 0,
          duration: 7000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(float3, {
          toValue: -10,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(float3, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.bubble1, { transform: [{ translateY: float1 }] }]}
      />
      <Animated.View
        style={[styles.bubble2, { transform: [{ translateY: float2 }] }]}
      />
      <Animated.View
        style={[styles.bubble3, { transform: [{ translateY: float3 }] }]}
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
  bubble1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.lavender,
    top: -60,
    left: -40,
    opacity: 0.6,
  },
  bubble2: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.sky,
    top: 140,
    right: -60,
    opacity: 0.6,
  },
  bubble3: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.pink,
    bottom: -100,
    left: -40,
    opacity: 0.5,
  },
});
