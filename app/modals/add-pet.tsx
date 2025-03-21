import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../context/DataContext";

export default function AddPetModal() {
  const router = useRouter();
  const { setData, data } = useData(); // ✅ Use setData to update state
  const { householdId } = useLocalSearchParams();

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

    const household = data.households.find((h) => h.id === householdId);
    if (!household) {
      console.log(`❌ Household not found for ID: ${householdId}`);
      return;
    }

    const newPet = {
      id: `pet_${Date.now()}`,
      name,
      species,
      breed,
      age: Number(age),
      medicalRecords: [],
    };

    // ✅ Update state using setData
    setData((prevData) => ({
      ...prevData,
      pets: [...prevData.pets, newPet], // ✅ Add pet to pets array
      households: prevData.households.map((h) =>
        h.id === householdId
          ? { ...h, pets: [...h.pets, newPet.id] } // ✅ Link pet to household
          : h
      ),
    }));

    console.log("✅ Pet added:", newPet);
    console.log("🏠 Updated Household:", household);

    router.back(); // Go back after adding
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add a New Pet</Text>

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
