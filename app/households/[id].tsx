import { View, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useData } from "../context/DataContext";
import { Text, List, ActivityIndicator, Button } from "react-native-paper";

export default function HouseholdDetailsScreen() {
  const params = useLocalSearchParams();
  const { data } = useData();
  const router = useRouter();

  if (!data) return <ActivityIndicator animating={true} size="large" />;
  if (!data.households || !data.pets)
    return <Text>No household or pet data found.</Text>;

  const householdId = String(params.id);
  const household = data.households.find((h) => h.id === householdId);

  if (!household) {
    console.log(`❌ Household not found for ID: ${householdId}`);
    return <Text>Household not found.</Text>;
  }

  return (
    <View>
      <Text>🏡 {household.name}</Text>
      <Text>📍 {household.address}</Text>
      <Text>Pets:</Text>

      <FlatList
        data={household.pets}
        keyExtractor={(petId) => String(petId)}
        renderItem={({ item: petId }) => {
          console.log(`🔍 Looking for pet ID: ${petId}`);
          if (!data.pets) {
            console.log("⚠️ ERROR: data.pets is undefined!");
            return <Text>⚠️ Pets data is missing!</Text>;
          }

          const pet = data.pets.find((p) => p.id === String(petId));

          return pet ? (
            <List.Item
              title={pet.name}
              description={`${pet.species} - ${pet.breed}`}
              onPress={() => router.push(`/pets/${String(pet.id)}`)}
              left={(props) => <List.Icon {...props} icon="paw" />}
            />
          ) : (
            <Text key={String(petId)}>❌ Pet not found for ID: {petId}</Text>
          );
        }}
        ListEmptyComponent={<Text>No pets found.</Text>}
      />
      <Button
        mode="contained"
        onPress={() =>
          router.push(`/modals/add-pet?householdId=${householdId}`)
        }
        style={{ marginVertical: 10 }}
      >
        ➕ Add Pet
      </Button>
    </View>
  );
}
