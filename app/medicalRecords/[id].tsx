import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Button, ScrollView, Image, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useData } from "../context/DataContext";
import { useTheme } from "react-native-paper";

export default function RecordDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data } = useData();

  const record = data.medicalRecords.find((r) => r.id === id);
  const { colors } = useTheme();

  if (!record) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 18 }}>❌ Record not found!</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }
  const handleViewFile = () => {
    if (!record.fileUri) return;
    if (record.fileUri.endsWith(".pdf")) {
      WebBrowser.openBrowserAsync(record.fileUri);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {record.description}
      </Text>

      <Text style={{ fontSize: 18, marginTop: 10 }}>
        📅 Date: {record.date}
      </Text>
      {record.vet && <Text style={{ fontSize: 18 }}>👨‍⚕️ Vet: {record.vet}</Text>}

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
            <Text style={{ color: "blue", fontSize: 16 }}>📄 View File</Text>
          </Pressable>
        )
      ) : (
        <Text style={{ color: "gray", marginTop: 10 }}>No File Attached</Text>
      )}

      <Button title="Go Back" onPress={() => router.back()} />

      <Button
        title="Edit Record"
        onPress={() => router.push(`/medicalRecords/edit/${record.id}`)}
      />
    </ScrollView>
  );
}
