import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useData } from "../context/DataContext";

export default function HouseholdDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { data } = useData();
  const router = useRouter();

  const household = data.households.find((h) => h.id === id);
  if (!household) return <Text>Household not found.</Text>;

  return (
    <View>
      <Text>🏡 {household.name}</Text>
      <Text>Address: {household.address}</Text>
      <Text>Pets:</Text>
      {household.pets.map((petId) => {
        const pet = data.pets.find((p) => p.id === petId);
        return (
          <TouchableOpacity key={petId} onPress={() => router.push(`/pets/${petId}`)}>
            <Text>🐾 {pet?.name} ({pet?.species})</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

