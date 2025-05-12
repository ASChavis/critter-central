import { useEffect, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Text, Button, useTheme, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase/supabase";

export default function EditTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id, petId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const fetchTask = async () => {
    const { data, error } = await supabase.from("daily_logs").select("*").eq("id", id).single();
    if (error) {
      setSnackbar({ visible: true, message: "Error loading task", isError: true });
    } else if (data) {
      setTitle(data.title);
      setDescription(data.description || "");
      setDate(data.date);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      setSnackbar({ visible: true, message: "Title is required.", isError: true });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("daily_logs")
      .update({ title: title.trim(), description: description.trim() })
      .eq("id", id);

    setSaving(false);

    if (error) {
      setSnackbar({ visible: true, message: "Failed to update task.", isError: true });
    } else {
      setSnackbar({ visible: true, message: "Task updated!", isError: false });
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Edit Task for {date}
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 6 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 12, borderRadius: 6, minHeight: 60 }}
      />

      <Button mode="contained" onPress={handleUpdate} loading={saving} disabled={saving}>
        Update Task
      </Button>

      <Button mode="outlined" onPress={() => router.back()} disabled={saving} style={{ marginTop: 12 }}>
        Cancel
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
        style={{ backgroundColor: snackbar.isError ? "red" : "green" }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}
