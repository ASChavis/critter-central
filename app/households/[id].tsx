import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, FlatList } from "react-native";
import {
  Text,
  List,
  ActivityIndicator,
  Button,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import LoadingScreen from "../loadingScreen";

export default function HouseholdDetailsScreen() {
  const { colors } = useTheme();
  const { households, pets } = useData();
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  if (user === undefined || households === undefined || pets === undefined) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; // already redirecting
  }

  const householdId = String(id);
  const household = households.find((h) => h.id === householdId);

  if (!household) {
    console.log(`❌ Household not found for ID: ${householdId}`);
    return <Text>Household not found.</Text>;
  }

  // Pets for this household
  const householdPets = pets.filter((p) => p.household_id === household.id);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>
        🏡 {household.name}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>
        📍 {household.address}
      </Text>

      <Text style={{ fontSize: 18, marginBottom: 8 }}>Pets:</Text>

      <FlatList
        data={householdPets}
        keyExtractor={(pet) => pet.id}
        renderItem={({ item: pet }) => (
          <List.Item
            title={pet.name}
            description={`${pet.species} - ${pet.breed}`}
            onPress={() => router.push(`/pets/${pet.id}`)}
            left={(props) => <List.Icon {...props} icon="paw" />}
          />
        )}
        ListEmptyComponent={<Text>No pets found for this household.</Text>}
      />

      <Button
        mode="contained"
        onPress={() =>
          router.push(`/modals/add-pet?householdId=${household.id}`)
        }
        style={{ marginVertical: 16 }}
      >
        ➕ Add Pet
      </Button>
    </View>
  );
}
