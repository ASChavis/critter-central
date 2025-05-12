import { View, ScrollView } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { supabase } from "../../../lib/supabase/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { TouchableOpacity } from "react-native";


export default function ViewCalendarTaskModal() {
  const router = useRouter();
  const { colors } = useTheme();
  const { petId } = useLocalSearchParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

useFocusEffect(
  useCallback(() => {
    fetchAllTasks();
  }, [])
);

  const fetchAllTasks = async () => {
   const { data, error } = await supabase
  .from("daily_logs")
  .select("*")
  .eq("pet_id", petId)
  .order("date", { ascending: true }); 
    if (error) {
      console.warn("⚠️ Error loading tasks:", error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const handleDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    if (petId) {
      router.push(`/dailyLog/modals/add?date=${day.dateString}&petId=${petId}`);
    } else {
      console.warn("No petId found");
    }
  };

  const markedDates = tasks.reduce((acc, task) => {
    if (task.date) {
      acc[task.date] = {
        ...acc[task.date],
        marked: true,
        dotColor: colors.primary,
      };
    }
    return acc;
  }, {} as Record<string, any>);

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
    };
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        📅 Calendar Tasks
      </Text>

      <Calendar
        markedDates={markedDates}
        onDayPress={handleDateChange}
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <View style={{ marginTop: 24 }}>
        <Text variant="titleMedium" style={{ marginBottom: 12 }}>
          📋 All Tasks
        </Text>

        {loading ? (
          <Text>Loading tasks...</Text>
        ) : tasks.length === 0 ? (
          <Text>No tasks found.</Text>
        ) : (
          tasks.map((task) => (
<TouchableOpacity onPress={() => router.push(`/dailyLog/modals/edit?id=${task.id}&petId=${petId}`)}>
  <View
    key={task.id}
    style={{
      padding: 12,
      borderBottomWidth: 1,
      borderColor: "#ddd",
      backgroundColor: "#f8f9fa",
      marginBottom: 8,
      borderRadius: 6,
    }}
  >
    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{task.title}</Text>
    <Text style={{ color: "gray", marginTop: 4 }}>📅 {task.date}</Text>
    {task.description ? (
      <Text style={{ marginTop: 4 }}>{task.description}</Text>
    ) : null}
  </View>
</TouchableOpacity>
          ))
        )}
      </View>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={{ marginTop: 24 }}
      >
        Close
      </Button>
    </ScrollView>
  );
}
