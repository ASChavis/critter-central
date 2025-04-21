import { View, Image, ScrollView } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/supabase";

export default function ViewCalendarTaskModal() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams(); // e.g. /view-task?taskId=123
  const { colors } = useTheme();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("calendar_tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        console.error("❌ Error fetching task:", error.message);
      } else {
        setTask(data);
      }

      setLoading(false);
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading task...</Text>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Task not found.</Text>
        <Button onPress={() => router.back()}>Close</Button>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        📅 Task Details
      </Text>

      <Text variant="titleMedium">📝 Title</Text>
      <Text style={{ marginBottom: 12 }}>{task.title}</Text>

      <Text variant="titleMedium">📄 Description</Text>
      <Text style={{ marginBottom: 12 }}>{task.description}</Text>

      <Text variant="titleMedium">⏰ Due Date</Text>
      <Text style={{ marginBottom: 12 }}>{task.due_date}</Text>

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

      <Button mode="outlined" onPress={() => router.back()}>
        Close
      </Button>
    </ScrollView>
  );
}
