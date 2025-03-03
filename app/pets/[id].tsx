import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";

export default function PetDetailsScreen() {
  const params = useLocalSearchParams();
  const { data } = useData();

  console.log("🔵 Params from useLocalSearchParams:", params);
  console.log("📦 Full Data Object:", data);

  if (!data) {
    console.log("❌ ERROR: data is undefined!");
    return <ActivityIndicator animating={true} size="large" />;
  }

  if (!data.pets) {
    console.log("❌ ERROR: data.pets is undefined!");
    return <Text style={{ color: "red" }}>⚠️ Pet data is missing!</Text>;
  }

  const petId = String(params.id);
  const pet = data.pets.find((p) => p.id === petId);

  console.log(`🔍 Looking for pet ID: ${petId}`);
  console.log("🎯 Found Pet:", pet);

  if (!pet) return <Text style={{ color: "red" }}>❌ Pet not found: {petId}</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium">🐾 {pet.name}</Text>
      <Text>Species: {pet.species}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Age: {pet.age} years</Text>

      <Text variant="titleMedium">Medical Records:</Text>
      {pet.medicalRecords.length === 0 ? (
        <Text>No records available</Text>
      ) : (
        pet.medicalRecords.map((recordId) => {
          const record = data.medicalRecords?.find((r) => r.id === recordId);
          return <Text key={recordId}>📋 {record?.description} - {record?.date}</Text>;
        })
      )}
    </View>
  );
}




