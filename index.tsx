import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "../src/constants/colors";
import {
  getAllEntries,
  getTodayEntry,
  MoodEntry,
} from "../src/services/storage";

import { getEmotionWeather } from "../src/ai/emotionWeather";
import { getMoodForecast } from "../src/ai/moodForecast";

const { width, height } = Dimensions.get("window");

const MOOD_LABELS = ["😞 Low", "😕 Meh", "🙂 Okay", "😊 Calm", "🤍 Great"];
const ENERGY_LABELS = [
  "🪫 Very Low",
  "😴 Low",
  "🙂 Medium",
  "⚡ High",
  "🔥 Full",
];

export default function TodayScreen() {
  const router = useRouter();

  const [entry, setEntry] = useState<MoodEntry | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);

  /* corner blob animations */
  const cornerFloat1 = useRef(new Animated.Value(0)).current;
  const cornerFloat2 = useRef(new Animated.Value(0)).current;
  const cornerScale1 = useRef(new Animated.Value(1)).current;
  const cornerScale2 = useRef(new Animated.Value(1)).current;

  /* finger blob */
  const fingerX = useRef(new Animated.Value(width / 2 - 80)).current;
  const fingerY = useRef(new Animated.Value(height / 3)).current;

  useEffect(() => {
    loadData();

    // corner blob 1
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(cornerFloat1, {
            toValue: -20,
            duration: 10000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerFloat1, {
            toValue: 0,
            duration: 10000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(cornerScale1, {
            toValue: 1.08,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerScale1, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // corner blob 2
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(cornerFloat2, {
            toValue: 18,
            duration: 12000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerFloat2, {
            toValue: 0,
            duration: 12000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(cornerScale2, {
            toValue: 1.12,
            duration: 9000,
            useNativeDriver: true,
          }),
          Animated.timing(cornerScale2, {
            toValue: 1,
            duration: 9000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();
  }, []);

  const loadData = async () => {
    const today = await getTodayEntry();
    setEntry(today);

    const all = await getAllEntries();
    setWeather(getEmotionWeather(all));
    setForecast(getMoodForecast(all));
  };

  /* finger-follow responder */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        Animated.spring(fingerX, {
          toValue: g.moveX - 80,
          useNativeDriver: false,
          damping: 25,
          stiffness: 120,
        }).start();

        Animated.spring(fingerY, {
          toValue: g.moveY - 80,
          useNativeDriver: false,
          damping: 25,
          stiffness: 120,
        }).start();
      },
      onPanResponderRelease: () => {
        Animated.spring(fingerX, {
          toValue: width / 2 - 80,
          useNativeDriver: false,
          damping: 20,
        }).start();

        Animated.spring(fingerY, {
          toValue: height / 3,
          useNativeDriver: false,
          damping: 20,
        }).start();
      },
    }),
  ).current;

  return (
    <View style={styles.root} {...panResponder.panHandlers}>
      {/* corner blobs */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cornerBlob1,
          {
            transform: [{ translateY: cornerFloat1 }, { scale: cornerScale1 }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cornerBlob2,
          {
            transform: [{ translateY: cornerFloat2 }, { scale: cornerScale2 }],
          },
        ]}
      />

      {/* finger-follow blob */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fingerBlob,
          {
            transform: [{ translateX: fingerX }, { translateY: fingerY }],
          },
        ]}
      />

      <View style={styles.container}>
        <Text style={styles.heading}>Today’s reflection ✨</Text>

        {(weather || forecast) && (
          <View style={styles.emotionBlock}>
            {weather && (
              <>
                <Text style={styles.weatherIcon}>{weather.icon}</Text>
                <Text style={styles.weatherTitle}>
                  Today feels {weather.label.toLowerCase()}
                </Text>
                <Text style={styles.weatherDesc}>{weather.description}</Text>
              </>
            )}

            {forecast && (
              <View style={styles.forecast}>
                <Text style={styles.forecastIcon}>🔮</Text>
                <Text style={styles.forecastText}>{forecast.message}</Text>
              </View>
            )}
          </View>
        )}

        {entry && (
          <View style={styles.card}>
            <Text style={styles.text}>Mood: {MOOD_LABELS[entry.mood - 1]}</Text>
            <Text style={styles.text}>
              Energy: {ENERGY_LABELS[entry.energy - 1]}
            </Text>
            {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
          </View>
        )}

        <View style={styles.nav}>
          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/add-entry")}
          >
            <Text style={styles.navIcon}>＋</Text>
            <Text style={styles.navText}>Add</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/history")}
          >
            <Text style={styles.navIcon}>📖</Text>
            <Text style={styles.navText}>History</Text>
          </Pressable>

          <Pressable
            style={styles.navItem}
            onPress={() => router.push("/insights")}
          >
            <Text style={styles.navIcon}>✨</Text>
            <Text style={styles.navText}>Insights</Text>
          </Pressable>
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
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 30,
    color: Colors.text,
    marginBottom: 22,
  },

  emotionBlock: {
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 22,
    marginBottom: 26,
    width: "100%",
    alignItems: "center",
  },
  weatherIcon: {
    fontSize: 36,
  },
  weatherTitle: {
    fontSize: 17,
    marginTop: 4,
    color: Colors.text,
  },
  weatherDesc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },
  forecast: {
    marginTop: 14,
    alignItems: "center",
  },
  forecastIcon: {
    fontSize: 20,
  },
  forecastText: {
    fontSize: 14,
    color: Colors.text,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    width: "100%",
    marginBottom: 30,
  },
  text: {
    fontSize: 15,
    color: Colors.text,
  },
  note: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#666",
  },

  nav: {
    flexDirection: "row",
    gap: 14,
  },
  navItem: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  navIcon: {
    fontSize: 22,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: Colors.text,
  },

  cornerBlob1: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: Colors.lavender,
    top: -160,
    left: -140,
    opacity: 0.75,
  },
  cornerBlob2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.pink,
    bottom: -120,
    right: -120,
    opacity: 0.65,
  },
  fingerBlob: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.sky,
    opacity: 0.45,
  },
});
