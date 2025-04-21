import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { supabase } from "../../lib/supabase/supabase";
import { useTheme, Button, Snackbar } from "react-native-paper";
import * as WebBrowser from "expo-web-browser";

interface MedicalRecord {
  id: string;
  pet_id: string;
  date_of_record: string;
  description: string;
  vet?: string;
  file_url?: string;
}

export default function RecordDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const recordId = String(id);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("medical_records")
        .select("*")
        .eq("id", recordId)
        .single();

      if (error) {
        console.error("❌ Error fetching medical record:", error.message);
        setRecord(null);
      } else {
        setRecord(data);
      }

      setLoading(false);
    };

    fetchRecord();
  }, [recordId]);

  const handleViewFile = () => {
    if (!record?.file_url) return;
    if (record.file_url.endsWith(".pdf")) {
      WebBrowser.openBrowserAsync(record.file_url);
    }
  };

  const handleDelete = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this record?"
      );
      if (confirmed) {
        deleteRecord();
      }
    } else {
      Alert.alert(
        "Delete Record",
        "Are you sure you want to delete this medical record?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: deleteRecord },
        ],
        { cancelable: true }
      );
    }
  };

  const deleteRecord = async () => {
    const { error } = await supabase
      .from("medical_records")
      .delete()
      .eq("id", recordId);

    if (error) {
      console.error("❌ Error deleting record:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Failed to delete record.",
        isError: true,
      });
    } else {
      console.log("✅ Record deleted successfully.");
      setSnackbar({
        visible: true,
        message: "✅ Record deleted successfully.",
        isError: false,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  if (!record) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 18 }}>❌ Record not found!</Text>
        <Button onPress={() => router.back()}>Go Back</Button>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {record.description}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 5 }}>
        📅 Date: {record.date_of_record}
      </Text>

      {record.vet && (
        <Text style={{ fontSize: 18, marginBottom: 5 }}>
          👨‍⚕️ Vet: {record.vet}
        </Text>
      )}

      {record.file_url ? (
        record.file_url.endsWith(".jpg") ||
        record.file_url.endsWith(".jpeg") ||
        record.file_url.endsWith(".png") ? (
          <Image
            source={{ uri: record.file_url }}
            style={{
              width: "100%",
              height: 300,
              marginTop: 10,
              borderRadius: 5,
            }}
            resizeMode="contain"
          />
        ) : (
          <Pressable onPress={handleViewFile} style={{ marginTop: 10 }}>
            <Text style={{ color: "blue", fontSize: 16 }}>
              📄 View PDF File
            </Text>
          </Pressable>
        )
      ) : (
        <Text style={{ color: "gray", marginTop: 10 }}>No File Attached</Text>
      )}

      <Button onPress={() => router.back()} style={{ marginTop: 20 }}>
        Go Back
      </Button>

      <Button
        mode="contained"
        onPress={() =>
          router.push(`/medicalRecords/modals/edit?id=${record.id}`)
        }
        style={{ marginTop: 10 }}
      >
        ✏️ Edit Record
      </Button>

      <Button
        mode="outlined"
        onPress={handleDelete}
        style={{ marginTop: 10 }}
        textColor="red"
      >
        🗑️ Delete Record
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({ visible: false, message: "", isError: false })
        }
        duration={2000}
        style={{
          backgroundColor: snackbar.isError ? "red" : "green",
          margin: 16,
        }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}
