import { useState } from "react";
import { View, Image } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";
import { MedicalRecord } from "../types/types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

export default function AddMedicalRecordModal({
  record = null,
}: {
  record?: MedicalRecord | null;
}) {
  const router = useRouter();
  const { data, setData } = useData();
  const { petId } = useLocalSearchParams();

  const [description, setDescription] = useState(record?.description || "");
  const [date, setDate] = useState(record?.date || "");
  const [fileUri, setFileUri] = useState<string | null>(
    record?.fileUri || null
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled && result.assets.length > 0) {
        setFileUri(result.assets[0].uri || null);
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
      setFileUri(result.assets[0].uri || null);
      console.log("📸 Captured Image:", result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!description || !date) {
      setSnackbarVisible(true);
      return;
    }

    const petIdString = Array.isArray(petId) ? petId[0] : String(petId);
    console.log("🔍 Pet ID:", petIdString);
    console.log("📂 Existing Data:", data);

    const pet = data.pets.find((p) => p.id === petIdString);
    if (!pet) {
      console.log(`❌ Pet not found for ID: ${petIdString}`);
      return;
    }

    if (record) {
      const updatedRecords = data.medicalRecords.map((rec) =>
        rec.id === record?.id
          ? { ...rec, description, date, ...(fileUri ? { fileUri } : {}) }
          : rec
      );

      setData((prevData) => ({
        ...prevData,
        medicalRecords: updatedRecords,
      }));

      console.log("✅ Medical Record updated successfully.");
    } else {
      const newRecord: MedicalRecord = {
        id: `record_${Date.now()}`,
        petId: petIdString,
        description,
        date,
        ...(fileUri ? { fileUri } : {}),
      };

      pet.medicalRecords = [...(pet.medicalRecords || []), newRecord.id];

      setData((prevData) => ({
        ...prevData,
        medicalRecords: [
          ...prevData.medicalRecords,
          {
            ...newRecord,
            fileUri: newRecord.fileUri ?? "",
            vet: newRecord.vet ?? "",
          },
        ],
      }));

      console.log("✅ Medical Record added successfully.");
    }

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
