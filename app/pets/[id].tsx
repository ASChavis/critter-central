import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data } = useData();

  const pet = data.pets.find((p) => p.id === id);
  if (!pet) return <Text>Pet not found.</Text>;

  return (
    <View>
      <Text>🐾 {pet.name}</Text>
      <Text>Species: {pet.species}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Age: {pet.age} years</Text>
      <Text>Medical Records:</Text>
      {pet.medicalRecords.length === 0 ? (
        <Text>No records available</Text>
      ) : (
        pet.medicalRecords.map((recordId) => {
          const record = data.medicalRecords.find((r) => r.id === recordId);
          return <Text key={recordId}>📋 {record?.description} - {record?.date}</Text>;
        })
      )}
    </View>
  );
}

