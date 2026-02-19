import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { calculateEmotionStreaks } from "../src/ai/streaks";
import { Colors } from "../src/constants/colors";
import { getEmotionColor } from "../src/constants/emotionColors";
import { getAllEntries, MoodEntry } from "../src/services/storage";

const MOODS = ["😞", "😕", "🙂", "😊", "🤍"];

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [streaks, setStreaks] = useState<{
    currentPositive: number;
    longestPositive: number;
  } | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getAllEntries();
    setEntries(data);
    setStreaks(calculateEmotionStreaks(data));
  };

  return (
    <View style={styles.root}>
      <Text style={styles.heading}>Your Journey 🌷</Text>

      {/* 🌱 Streak summary */}
      {streaks && (
        <View style={styles.streakCard}>
          <Text style={styles.streakText}>
            {streaks.currentPositive > 0
              ? `${streaks.currentPositive} calm day${
                  streaks.currentPositive > 1 ? "s" : ""
                } in a row 🌱`
              : "No calm streak right now — and that’s okay 🤍"}
          </Text>

          <Text style={styles.streakSub}>
            Longest positive streak: {streaks.longestPositive} day
            {streaks.longestPositive !== 1 ? "s" : ""} 🏆
          </Text>
        </View>
      )}

      {/* 🎨 Emotion color legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>Emotion colors</Text>
        <View style={styles.legendRow}>
          <Text>😞 Low</Text>
          <Text>🙂 Neutral</Text>
          <Text>🤍 Positive</Text>
        </View>
      </View>

      {/* 🕰️ Timeline */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          const emotionColor = getEmotionColor(item.mood, item.energy);

          return (
            <View style={styles.row}>
              {/* timeline */}
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: emotionColor }]} />
                <View style={styles.line} />
              </View>

              {/* card */}
              <View style={[styles.card, { backgroundColor: emotionColor }]}>
                <Text style={styles.emoji}>{MOODS[item.mood - 1]}</Text>

                <Text style={styles.text}>Energy: {item.energy}/5</Text>

                {item.note && <Text style={styles.note}>{item.note}</Text>}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
    padding: 24,
  },
  heading: {
    fontSize: 28,
    marginBottom: 16,
    color: Colors.text,
    textAlign: "center",
  },

  /* 🌱 streaks */
  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  streakText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },
  streakSub: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
  },

  /* 🎨 legend */
  legend: {
    alignItems: "center",
    marginBottom: 20,
  },
  legendText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  legendRow: {
    flexDirection: "row",
    gap: 16,
  },

  /* 🕰️ timeline */
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  timeline: {
    width: 30,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.primary,
    marginTop: 4,
    opacity: 0.3,
  },

  /* 📦 card */
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    marginLeft: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  emoji: {
    fontSize: 28,
  },
  text: {
    color: "#444",
    marginTop: 4,
  },
  note: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#555",
  },
});
