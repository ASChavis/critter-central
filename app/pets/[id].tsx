import { View, FlatList, Pressable } from "react-native";
import {
  Text,
  ActivityIndicator,
  Button,
  List,
  useTheme,
} from "react-native-paper";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useData } from "../context/DataContext";

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data } = useData();
  const { colors } = useTheme();

  console.log("🔵 Params from useLocalSearchParams:", id);
  console.log("📦 Full Data Object:", data);

  if (!data) {
    console.log("❌ ERROR: data is undefined!");
    return <ActivityIndicator animating={true} size="large" />;
  }

  if (!data.pets) {
    console.log("❌ ERROR: data.pets is undefined!");
    return <Text style={{ color: "red" }}>⚠️ Pet data is missing!</Text>;
  }

  const petId = String(id);
  const pet = data.pets.find((p) => p.id === petId);

  console.log(`🔍 Looking for pet ID: ${petId}`);
  console.log("🎯 Found Pet:", pet);

  if (!pet)
    return <Text style={{ color: "red" }}>❌ Pet not found: {petId}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text>🐾 {pet.name}</Text>
      <Text>Species: {pet.species}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Age: {pet.age} years</Text>

      <Text>Medical Records:</Text>

      <FlatList
        data={pet.medicalRecords}
        keyExtractor={(recordId) => recordId}
        renderItem={({ item }) => {
          const record = data.medicalRecords.find((r) => r.id === item);
          return record ? (
            <Link href={`/medicalRecords/${record.id}`} asChild>
              <Pressable
                style={{
                  padding: 15,
                  borderBottomWidth: 1,
                  borderColor: "#ddd",
                  backgroundColor: "#f8f9fa",
                  marginBottom: 5,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {record.description}
                </Text>
                <Text style={{ color: "gray" }}>📅 {record.date}</Text>
              </Pressable>
            </Link>
          ) : (
            <Text style={{ color: "red" }}>❌ Record not found</Text>
          );
        }}
        ListEmptyComponent={<Text>No medical records found.</Text>}
      />

      <Button
        mode="contained"
        onPress={() =>
          router.push(`/modals/add-medical-record?petId=${pet.id}`)
        }
      >
        ➕ Add Medical Record
      </Button>
    </View>
  );
}
