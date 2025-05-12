import { useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { Text, Button, useTheme, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase/supabase";

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { date, petId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleSubmit = async () => {
  if (!petId || !title.trim() || !date) {
    setSnackbar({
      visible: true,
      message: "Title and date are required.",
      isError: true,
    });
    return;
  }

  setSaving(true);

  const { error } = await supabase.from("daily_logs").insert([
    {
      pet_id: petId,
      title: title.trim(),
      description: description.trim() || null, 
      date: date,
    },
  ]);

  setSaving(false);

  if (error) {
    setSnackbar({
      visible: true,
      message: "Failed to add task.",
      isError: true,
    });
  } else {
    setSnackbar({
      visible: true,
      message: "Task added successfully!",
      isError: false,
    });
    setTimeout(() => {
      router.back();
    }, 1000);
  }
};


  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Add Task for {date}
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

      <Button mode="contained" onPress={handleSubmit} loading={saving} disabled={saving}>
        Save Task
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
