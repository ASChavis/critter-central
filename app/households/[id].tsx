import { useEffect, useState } from "react";
import { View, FlatList, Alert, Platform } from "react-native";
import {
  Text,
  List,
  ActivityIndicator,
  Button,
  Snackbar,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase/supabase";

interface Pet {
  id: string;
  name: string;
  breed: string;
  birthdate: string;
}

export default function HouseholdDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const fetchPets = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("household_id", id);

    if (error) {
      console.error("❌ Error fetching pets:", error.message);
    } else {
      setPets(data || []);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchPets();
      setLoading(false);
    };

    load();
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPets();
    setRefreshing(false);
  };

  const handleDeletePet = (petId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this pet? This action cannot be undone."
      );
      if (confirmed) {
        deletePet(petId);
      }
    } else {
      Alert.alert(
        "Delete Pet",
        "Are you sure you want to delete this pet? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deletePet(petId),
          },
        ],
        { cancelable: true }
      );
    }
  };

  const deletePet = async (petId: string) => {
    const { error } = await supabase.from("pets").delete().eq("id", petId);

    if (error) {
      console.error("❌ Error deleting pet:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Failed to delete pet!",
        isError: true,
      });
    } else {
      console.log("✅ Pet deleted successfully!");
      setSnackbar({
        visible: true,
        message: "✅ Pet deleted successfully!",
        isError: false,
      });
      await fetchPets(); // Refresh the pets list
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Household Details
      </Text>

      {pets.length === 0 ? (
        <Text>No pets found for this household.</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Breed: ${item.breed}\nBirthdate: ${item.birthdate}`}
              onPress={() => router.push(`/pets/${item.id}`)}
              left={(props) => <List.Icon {...props} icon="paw" />}
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button
                    compact
                    mode="text"
                    onPress={() =>
                      router.push(`/pets/modals/edit?id=${item.id}`)
                    }
                  >
                    ✏️
                  </Button>
                  <Button
                    compact
                    mode="text"
                    onPress={() => handleDeletePet(item.id)}
                  >
                    🗑️
                  </Button>
                </View>
              )}
              style={{ marginBottom: 8 }}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={<View style={{ marginBottom: 20 }} />}
        />
      )}

      <Button
        mode="contained"
        onPress={() => router.push(`/pets/modals/add?householdId=${id}`)}
        style={{ marginTop: 16 }}
      >
        ➕ Add Pet
      </Button>

      {/* Snackbar Toast */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({ visible: false, message: "", isError: false })
        }
        duration={2000}
        style={{
          backgroundColor: snackbar.isError ? "red" : "green",
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
