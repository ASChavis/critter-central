import { useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  RadioButton,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../../context/DataContext";
import { subYears, subMonths } from "date-fns"; // 🆕 Helper for date math

export default function AddPetModal() {
  const router = useRouter();
  const { addPet, refreshData } = useData();
  const { householdId } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years"); // 🆕 default to years
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const calculateBirthdate = (age: number, unit: "years" | "months") => {
    const today = new Date();
    if (unit === "years") {
      return subYears(today, age).toISOString().split("T")[0];
    } else {
      return subMonths(today, age).toISOString().split("T")[0];
    }
  };

  const handleSubmit = async () => {
    if (!name || !species || !breed || !age) {
      setSnackbarVisible(true);
      return;
    }

    if (!householdId) {
      console.log("❌ ERROR: No household ID provided!");
      return;
    }

    setLoading(true);

    const birthdate = calculateBirthdate(Number(age), ageUnit);

    await addPet({
      name,
      species,
      breed,
      birthdate,
      household_id: String(householdId),
    });

    await refreshData();

    console.log("✅ Pet added successfully!");

    setLoading(false);
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Add a New Pet
      </Text>

      <TextInput
        label="Pet Name"
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
        label="Approximate Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{ marginBottom: 12 }}
      />

      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <RadioButton.Group
          onValueChange={(newValue) =>
            setAgeUnit(newValue as "years" | "months")
          }
          value={ageUnit}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="years" />
            <Text>Years</Text>
            <RadioButton value="months" />
            <Text>Months</Text>
          </View>
        </RadioButton.Group>
      </View>

      <Button mode="contained" onPress={handleSubmit} loading={loading}>
        Add Pet
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={{ marginTop: 12 }}
      >
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
