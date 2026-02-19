import { FlatList, StyleSheet, Text, View } from "react-native";
import EventCard from "../components/EventCard";

const EVENTS = [
  {
    id: "1",
    title: "Tech Talk: AI & Future",
    date: "12 March",
    location: "Auditorium",
  },
  {
    id: "2",
    title: "Cultural Fest",
    date: "18 March",
    location: "Open Ground",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upcoming Events</Text>

      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            date={item.date}
            location={item.location}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
});
