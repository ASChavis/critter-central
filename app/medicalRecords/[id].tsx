import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../../lib/supabase/supabase";
import { useTheme, Button } from "react-native-paper";

interface MedicalRecord {
  id: string;
  pet_id: string;
  date: string;
  description: string;
  vet?: string;
  fileUri?: string;
}

export default function RecordDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);

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
    if (!record?.fileUri) return;
    if (record.fileUri.endsWith(".pdf")) {
      WebBrowser.openBrowserAsync(record.fileUri);
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
        📅 Date: {record.date}
      </Text>

      {record.vet && (
        <Text style={{ fontSize: 18, marginBottom: 5 }}>
          👨‍⚕️ Vet: {record.vet}
        </Text>
      )}

      {record.fileUri ? (
        record.fileUri.endsWith(".jpg") ||
        record.fileUri.endsWith(".jpeg") ||
        record.fileUri.endsWith(".png") ? (
          <Image
            source={{ uri: record.fileUri }}
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
        onPress={() =>
          router.push(`/medicalRecords/modals/edit?id=${record.id}`)
        }
        style={{ marginTop: 10 }}
      >
        Edit Record
      </Button>
    </ScrollView>
  );
}
