import { View, ScrollView, TextInput } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { supabase } from "../../../lib/supabase/supabase";

export default function ViewCalendarTaskModal() {
  const router = useRouter();
  const { colors } = useTheme();

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Form state
  const [formDate, setFormDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    const { data, error } = await supabase.from("calendar_tasks").select("*");
    if (error) {
      console.warn("⚠️ Error loading tasks:", error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const fetchTasksForDate = async (date: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("calendar_tasks")
      .select("*")
      .eq("due_date", date);
    if (error) {
      console.warn("⚠️ Error fetching tasks for date:", error.message);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const handleDateChange = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setFormDate(day.dateString); // sync form field
    fetchTasksForDate(day.dateString);
  };

  const handleCreateTask = async () => {
    if (!formDate || !newTitle) return;
    setCreating(true);

    const { error } = await supabase.from("calendar_tasks").insert([
      {
        due_date: formDate,
        title: newTitle,
        description: newDescription,
      },
    ]);

    if (error) {
      console.error("❌ Error creating task:", error.message);
    } else {
      setNewTitle("");
      setNewDescription("");
      fetchTasksForDate(formDate); // refresh with new task
    }

    setCreating(false);
  };

  const markedDates = tasks.reduce((acc, task) => {
    if (task.due_date) {
      acc[task.due_date] = {
        ...acc[task.due_date],
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

      {selectedDate && (
        <View style={{ marginBottom: 32 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            🗂 Tasks for {selectedDate}
          </Text>

          {loading ? (
            <Text>Loading tasks...</Text>
          ) : tasks.length === 0 ? (
            <Text>No tasks yet.</Text>
          ) : (
            tasks.map((task, index) => (
              <View key={task.id} style={{ marginBottom: 12 }}>
                <Text variant="titleSmall">{index + 1}. {task.title}</Text>
                {task.description ? <Text>{task.description}</Text> : null}
              </View>
            ))
          )}

          <View style={{ marginTop: 24 }}>
            <Text variant="titleMedium">➕ Add New Task</Text>

            <TextInput
              placeholder="Due Date (YYYY-MM-DD)"
              value={formDate}
              onChangeText={setFormDate}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                marginBottom: 8,
                borderRadius: 6,
              }}
            />
            <TextInput
              placeholder="Title"
              value={newTitle}
              onChangeText={setNewTitle}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                marginBottom: 8,
                borderRadius: 6,
              }}
            />
            <TextInput
              placeholder="Description (optional)"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 8,
                marginBottom: 12,
                borderRadius: 6,
                minHeight: 60,
              }}
            />
            <Button
              mode="contained"
              onPress={handleCreateTask}
              disabled={creating}
              loading={creating}
            >
              Add Task
            </Button>
          </View>
        </View>
      )}

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={{ marginTop: 8 }}
      >
        Close
      </Button>
    </ScrollView>
  );
}
