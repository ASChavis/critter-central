import { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";
import { MedicalRecord } from "../types/types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function AddMedicalRecordModal() {
  const router = useRouter();
  const { data, setData } = useData();
  const { petId } = useLocalSearchParams();

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [fileUri, setFileUri] = useState<string | null>(null); // ✅ Ensure fileUri is typed correctly
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
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

  const handleSubmit = () => {
    if (!description || !date || !fileUri) {
      setSnackbarVisible(true);
      return;
    }

    // ✅ Ensure petId is always a string
    const petIdString = Array.isArray(petId) ? petId[0] : String(petId);

    // ✅ Debugging: Log petId & data structure
    console.log("🔍 Pet ID:", petIdString);
    console.log("📂 Existing Data:", data);

    // ✅ Find the pet and ensure petId is valid
    const pet = data.pets.find((p) => p.id === petIdString);
    if (!pet) {
      console.log(`❌ Pet not found for ID: ${petIdString}`);
      return;
    }

    // ✅ Ensure `fileUri` is either a string or undefined (not null)
    const safeFileUri = fileUri || undefined;

    // ✅ Create a new medical record with correct structure
    const newRecord: MedicalRecord = {
      id: `record_${Date.now()}`,
      petId: petIdString,
      description,
      date,
      fileUri: safeFileUri, // ✅ Ensures fileUri is correctly typed
    };

    console.log("✅ New Record:", newRecord);

    // ✅ Ensure pet has a medicalRecords array and update it
    pet.medicalRecords = [...(pet.medicalRecords || []), newRecord.id];

    //   // ✅ Update `setData` with proper type safety
    //   setData((prevData) => ({
    //     ...prevData,
    //     pets: prevData.pets.map((p) =>
    //       p.id === petIdString ? { ...p, medicalRecords: pet.medicalRecords } : p
    //     ),
    //     medicalRecords: [...prevData.medicalRecords, newRecord], // ✅ Ensures correct structure
    //   }));

    console.log("✅ Medical Record added successfully.");
    router.back();
  };

  return (
    <View>
      <Text variant="headlineMedium">Add Medical Record</Text>

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Button mode="contained" onPress={handleFileUpload}>
        📄 Upload PDF
      </Button>

      <Button mode="contained" onPress={handleTakePhoto}>
        📸 Take a Picture
      </Button>

      {fileUri ? (
        <Image source={{ uri: fileUri }} />
      ) : (
        <Text>No file selected</Text>
      )}

      <Button mode="contained" onPress={handleSubmit}>
        ✅ Save Record
      </Button>

      <Button mode="outlined" onPress={() => router.back()}>
        ❌ Cancel
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        ❌ Please fill all fields!
      </Snackbar>
    </View>
  );
}
