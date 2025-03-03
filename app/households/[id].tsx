import { View, FlatList, StyleSheet } from "react-native";
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

  console.log("🏡 Household ID:", householdId);
  console.log("🐾 Household Pets:", household.pets);
  console.log("📋 All Pets Data:", data.pets);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        🏡 {household.name}
      </Text>
      <Text>📍 {household.address}</Text>
      <Text variant="titleMedium" style={styles.petsHeader}>
        Pets:
      </Text>

      <FlatList
        data={household.pets}
        keyExtractor={(petId) => String(petId)}
        renderItem={({ item: petId }) => {
          console.log(`🔍 Looking for pet ID: ${petId}`);
          if (!data.pets) {
            console.log("⚠️ ERROR: data.pets is undefined!");
            return (
              <Text style={styles.errorText}>⚠️ Pets data is missing!</Text>
            );
          }

          const pet = data.pets.find((p) => p.id === String(petId));

          return pet ? (
            <List.Item
              title={pet.name}
              description={`${pet.species} - ${pet.breed}`}
              onPress={() => router.push(`/pets/${String(pet.id)}`)}
              left={(props) => <List.Icon {...props} icon="paw" />}
              style={styles.petItem}
            />
          ) : (
            <Text key={String(petId)} style={styles.errorText}>
              ❌ Pet not found for ID: {petId}
            </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  petsHeader: {
    marginTop: 15,
    fontWeight: "bold",
  },
  petItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginVertical: 5,
    paddingVertical: 5,
  },
  errorText: {
    color: "red",
    marginVertical: 5,
  },
});
