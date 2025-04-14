import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase/supabase";

export default function EditPetModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [species, setSpecies] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleUpdatePet = async () => {
    if (!id) return;

    setLoading(true);

    const { error } = await supabase
      .from("pets")
      .update({
        name,
        breed,
        species,
        birthdate,
      })
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating pet:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Failed to update pet!",
        isError: true,
      });
    } else {
      console.log("✅ Pet updated successfully!");

      setSnackbar({
        visible: true,
        message: "✅ Pet updated successfully!",
        isError: false,
      });

      setTimeout(() => {
        router.replace(`/pets/${id}`); // Navigate back to Pet Details after toast
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Edit Pet
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Species"
        value={species}
        onChangeText={setSpecies}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Breed"
        value={breed}
        onChangeText={setBreed}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Birthdate (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
        style={{ marginBottom: 12 }}
      />

      <Button
        mode="contained"
        onPress={handleUpdatePet}
        loading={loading}
        disabled={loading}
        style={{ marginVertical: 8 }}
      >
        Save Changes
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.push(`/pets/${id}`)}
        disabled={loading}
        style={{ marginVertical: 8 }}
      >
        Cancel
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
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
