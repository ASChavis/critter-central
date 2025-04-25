import { View, Image, ScrollView } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { supabase } from "../../../lib/supabase/supabase";

export default function ViewCalendarTaskModal() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams(); // e.g. /view-task?taskId=123
  const { colors } = useTheme();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("calendar_tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        console.warn("⚠️ Task not found or error:", error.message);
      }

      setTask(data || {}); // fallback to empty object
      setLoading(false);
    };

    fetchTask();
  }, [taskId]);

  const handleDateChange = async (day: { dateString: string }) => {
    if (!task || !task.id) return;
    setUpdating(true);

    const { error } = await supabase
      .from("calendar_tasks")
      .update({ due_date: day.dateString })
      .eq("id", task.id);

    if (error) {
      console.error("❌ Error updating due date:", error.message);
    } else {
      setTask({ ...task, due_date: day.dateString });
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading task...</Text>
      </View>
    );
  }

  const formattedDueDate = task.due_date?.split("T")[0] || task.due_date;

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        📅 Task Details
      </Text>

      <Calendar
        markedDates={
          formattedDueDate
            ? {
                [formattedDueDate]: {
                  marked: true,
                  selected: true,
                  selectedColor: colors.primary,
                },
              }
            : {}
        }
        onDayPress={handleDateChange}
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      {task?.id ? (
        <>
          <Text variant="titleMedium">📝 Title</Text>
          <Text style={{ marginBottom: 12 }}>{task.title}</Text>

          <Text variant="titleMedium">📄 Description</Text>
          <Text style={{ marginBottom: 12 }}>{task.description}</Text>

          <Text variant="titleMedium">⏰ Due Date</Text>
          <Text style={{ marginBottom: 12 }}>{formattedDueDate}</Text>

          {task.priority && (
            <>
              <Text variant="titleMedium">🔥 Priority</Text>
              <Text style={{ marginBottom: 12 }}>{task.priority}</Text>
            </>
          )}

          {task.image_url ? (
            <>
              <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                🖼️ Attachment
              </Text>
              <Image
                source={{ uri: task.image_url }}
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 16,
                  resizeMode: "contain",
                }}
              />
            </>
          ) : (
            <Text style={{ marginBottom: 16 }}>No image attached.</Text>
          )}
        </>
      ) : (
        <Text style={{ marginBottom: 16 }}>⚠️ Task not found — you can still select a date above.</Text>
      )}

      <Button
        mode="outlined"
        onPress={() => router.back()}
        disabled={updating}
        loading={updating}
      >
        Close
      </Button>
    </ScrollView>
  );
}
