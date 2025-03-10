import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";

export default function AddPetModal() {
  const router = useRouter();
  const { data } = useData();
  const { householdId } = useLocalSearchParams(); // ✅ Get household ID

  // Pet form state
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSubmit = () => {
    if (!name || !species || !breed || !age) {
      setSnackbarVisible(true);
      return;
    }

    // Find the household to add the pet to
    const household = data.households.find((h) => h.id === householdId);
    if (!household) {
      console.log(`❌ Household not found for ID: ${householdId}`);
      return;
    }

    // Create new pet object
    const newPet = {
      id: `pet_${Date.now()}`, // Generate unique ID
      name,
      species,
      breed,
      age: Number(age),
      medicalRecords: [],
    };

    // ✅ Add the pet to the global pet list
    data.pets.push(newPet);

    // ✅ Link the pet to the correct household
    household.pets.push(newPet.id);

    console.log("✅ Pet added:", newPet);
    console.log("🏠 Updated Household:", household);

    // Navigate back
    router.back();
  };

  return (
    <View>
      <Text>Add a New Pet</Text>

      <TextInput label="Pet Name" value={name} onChangeText={setName} />
      <TextInput label="Species" value={species} onChangeText={setSpecies} />
      <TextInput label="Breed" value={breed} onChangeText={setBreed} />
      <TextInput
        label="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Button mode="contained" onPress={handleSubmit}>
        Add Pet
      </Button>

      <Button mode="outlined" onPress={() => router.back()}>
        Cancel
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        ❌ Please fill all fields!
      </Snackbar>
    </View>
  );
}
