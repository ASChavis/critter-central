import { useState } from "react";
import { View, Image, ScrollView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  useTheme,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../../lib/supabase/supabase";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function AddMedicalRecordModal() {
  const router = useRouter();
  const { petId } = useLocalSearchParams();
  const { colors } = useTheme();

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
      });

      if (!result.canceled && result.assets.length > 0) {
        setFileUri(result.assets[0].uri);
        console.log("📄 Uploaded File:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("❌ Error selecting document:", error);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera access is required to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFileUri(result.assets[0].uri);
      console.log("📸 Captured Image:", result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!description || !date) {
      setSnackbar({
        visible: true,
        message: "❌ Please fill all fields!",
        isError: true,
      });
      return;
    }

    const petIdString = Array.isArray(petId) ? petId[0] : String(petId);

    setLoading(true);

    const { error } = await supabase.from("medical_records").insert([
      {
        pet_id: petIdString,
        description,
        date,
        fileUri: fileUri || null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("❌ Error adding record:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Failed to add record. Please try again.",
        isError: true,
      });
      return;
    }

    setSnackbar({
      visible: true,
      message: "✅ Medical record added successfully!",
      isError: false,
    });

    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const handleSnackbarDismiss = () => {
    setSnackbar({ ...snackbar, visible: false });
  };

  return (
    <ScrollView
      style={{ flex: 1, padding: 16, backgroundColor: colors.background }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Add Medical Record
      </Text>

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 12 }}
      />
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={{ marginBottom: 12 }}
      >
        {date ? `📅 Selected: ${date}` : "📅 Pick Date"}
      </Button>
      {Platform.OS === "web" ? (
        // Web version: use TextInput
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          placeholder="e.g., 2024-04-16"
          style={{ marginBottom: 12 }}
        />
      ) : (
        <>
          {/* Mobile version: Pick date from calendar */}
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={{ marginBottom: 12 }}
          >
            {date ? `📅 Selected: ${date}` : "📅 Pick Date"}
          </Button>

          {showDatePicker && (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(
                    2,
                    "0"
                  );
                  const day = String(selectedDate.getDate()).padStart(2, "0");
                  setDate(`${year}-${month}-${day}`);
                }
              }}
            />
          )}
        </>
      )}

      <Button
        mode="outlined"
        onPress={handleFileUpload}
        style={{ marginBottom: 8 }}
      >
        📄 Upload PDF
      </Button>

      <Button
        mode="outlined"
        onPress={handleTakePhoto}
        style={{ marginBottom: 8 }}
      >
        📸 Take a Picture
      </Button>

      {fileUri ? (
        <Image
          source={{ uri: fileUri }}
          style={{ width: "100%", height: 200, marginBottom: 16 }}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ textAlign: "center", marginBottom: 16 }}>
          No file selected
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        ✅ Save Record
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        disabled={loading}
        style={{ marginBottom: 12 }}
      >
        ❌ Cancel
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={handleSnackbarDismiss}
        duration={2000}
        style={{
          backgroundColor: snackbar.isError ? "red" : "green",
        }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}
