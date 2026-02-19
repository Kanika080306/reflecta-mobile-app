import { StyleSheet, Text, View } from "react-native";

export default function EventCard({ title, date, location }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>
        {date} • {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  meta: {
    color: "#94a3b8",
    marginTop: 4,
  },
});
