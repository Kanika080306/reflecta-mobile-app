import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

import { detectEmotionPattern } from "../src/ai/emotionPatterns";
import { calculateEmotionStreaks } from "../src/ai/streaks";
import { Colors } from "../src/constants/colors";
import { getAllEntries, MoodEntry } from "../src/services/storage";

export default function InsightsScreen() {
  const [pattern, setPattern] = useState<string | null>(null);
  const [avgMood, setAvgMood] = useState<number>(3);
  const [streak, setStreak] = useState<number>(0);

  // blob 1 (mood)
  const moodFloat = useRef(new Animated.Value(0)).current;
  const moodScale = useRef(new Animated.Value(1)).current;

  // blob 2 (streak)
  const streakFloat = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    animateMoodBlob();
    animateStreakBlob();
  }, [avgMood, streak]);

  const load = async () => {
    const entries = await getAllEntries();
    setPattern(detectEmotionPattern(entries));
    setAvgMood(calculateAverageMood(entries));
    setStreak(calculateEmotionStreaks(entries).currentPositive);
  };

  const calculateAverageMood = (entries: MoodEntry[]) => {
    if (!entries.length) return 3;
    return entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
  };

  const animateMoodBlob = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(moodFloat, {
            toValue: avgMood >= 4 ? -30 : avgMood <= 2 ? -8 : -18,
            duration: avgMood >= 4 ? 5000 : avgMood <= 2 ? 12000 : 8000,
            useNativeDriver: true,
          }),
          Animated.timing(moodFloat, {
            toValue: 0,
            duration: avgMood >= 4 ? 5000 : avgMood <= 2 ? 12000 : 8000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(moodScale, {
            toValue: avgMood >= 4 ? 1.12 : avgMood <= 2 ? 1.03 : 1.07,
            duration: 7000,
            useNativeDriver: true,
          }),
          Animated.timing(moodScale, {
            toValue: 1,
            duration: 7000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  const animateStreakBlob = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(streakFloat, {
            toValue: streak >= 4 ? 20 : streak >= 2 ? 12 : 4,
            duration: streak >= 4 ? 6000 : 9000,
            useNativeDriver: true,
          }),
          Animated.timing(streakFloat, {
            toValue: 0,
            duration: streak >= 4 ? 6000 : 9000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(streakScale, {
            toValue: streak >= 4 ? 1.15 : streak >= 2 ? 1.08 : 1.02,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(streakScale, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  };

  const moodColor =
    avgMood <= 2 ? Colors.lavender : avgMood < 4 ? Colors.sky : Colors.pink;

  const streakColor =
    streak >= 4 ? Colors.pink : streak >= 2 ? Colors.lavender : Colors.cream;

  return (
    <View style={styles.root}>
      {/* mood blob */}
      <Animated.View
        style={[
          styles.moodBlob,
          {
            backgroundColor: moodColor,
            transform: [{ translateY: moodFloat }, { scale: moodScale }],
          },
        ]}
      />

      {/* streak blob */}
      <Animated.View
        style={[
          styles.streakBlob,
          {
            backgroundColor: streakColor,
            transform: [{ translateY: streakFloat }, { scale: streakScale }],
          },
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.heading}>Gentle Reflections ✨</Text>

        <View style={styles.card}>
          <Text style={styles.icon}>💭</Text>
          <Text style={styles.text}>
            {pattern ?? "I’m quietly learning your emotional rhythms 🤍"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 28,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  icon: {
    fontSize: 28,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
  },

  /* blobs */
  moodBlob: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    top: -160,
    right: -160,
    opacity: 0.75,
  },
  streakBlob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    bottom: -120,
    left: -100,
    opacity: 0.6,
  },
});
