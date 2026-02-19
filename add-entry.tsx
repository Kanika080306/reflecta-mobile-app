import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import GradientBackground from "../src/components/GradientBackground";
import MoodChip from "../src/components/MoodChip";
import { Colors } from "../src/constants/colors";
import { saveEntry } from "../src/services/storage";

const MOODS = ["😞", "😕", "🙂", "😊", "🤍"];

export default function AddEntryScreen() {
  const router = useRouter();
  const [mood, setMood] = useState<number | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const save = async () => {
    if (!mood || !energy) return;

    await saveEntry({
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood,
      energy,
      note,
    });

    router.back();
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.heading}>Your mood today</Text>

        <View style={styles.row}>
          {MOODS.map((emoji, i) => (
            <MoodChip
              key={i}
              emoji={emoji}
              selected={mood === i + 1}
              onPress={() => setMood(i + 1)}
            />
          ))}
        </View>

        <Text style={styles.heading}>Energy level</Text>

        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map((v) => (
            <Pressable
              key={v}
              style={[styles.energy, energy === v && styles.selected]}
              onPress={() => setEnergy(v)}
            >
              <Text style={styles.energyText}>{v}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Anything on your mind?"
          placeholderTextColor="#777"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <Pressable style={styles.save} onPress={save}>
          <Text style={styles.saveText}>Save ✨</Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 20,
    color: Colors.text,
    textAlign: "center",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  energy: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cream,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  energyText: {
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 20,
    minHeight: 80,
    color: Colors.text,
  },
  save: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  saveText: {
    color: Colors.white,
    fontSize: 16,
  },
});
