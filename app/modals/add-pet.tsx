import { useState } from "react";
import { View } from "react-native";
import {
  Text,
  TextInput,
  Button,
  Snackbar,
  RadioButton,
  Menu,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useData } from "../../context/DataContext";
import { subYears, subMonths } from "date-fns"; // Helper for date math

const speciesOptions = ["Dog", "Cat", "Rabbit", "Bird", "Reptile", "Other"];

export default function AddPetModal() {
  const router = useRouter();
  const { addPet, refreshData } = useData();
  const { householdId } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [speciesMenuVisible, setSpeciesMenuVisible] = useState(false);
  const [customSpeciesMode, setCustomSpeciesMode] = useState(false);

  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [birthdateInput, setBirthdateInput] = useState("");
  const [birthdateMode, setBirthdateMode] = useState<"age" | "birthdate">(
    "age"
  );
  const [ageUnit, setAgeUnit] = useState<"years" | "months">("years");

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const [shouldCloseAfterToast, setShouldCloseAfterToast] = useState(false);

  const calculateBirthdate = (age: number, unit: "years" | "months") => {
    const today = new Date();
    if (unit === "years") {
      return subYears(today, age).toISOString().split("T")[0];
    } else {
      return subMonths(today, age).toISOString().split("T")[0];
    }
  };

  const isValidDateFormat = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateStr);
  };

  const isRealDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);

    const date = new Date(year, month - 1, day); // month is 0-indexed
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const autoFormatDate = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 4) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(
        6,
        8
      )}`;
    }
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !species ||
      !breed ||
      (birthdateMode === "age" ? !age : !birthdateInput)
    ) {
      setSnackbar({
        visible: true,
        message: "❌ Please fill all required fields!",
        isError: true,
      });
      return;
    }

    if (!householdId) {
      console.log("❌ ERROR: No household ID provided!");
      setSnackbar({
        visible: true,
        message: "❌ No household ID provided!",
        isError: true,
      });
      return;
    }

    if (birthdateMode === "birthdate") {
      if (!isValidDateFormat(birthdateInput)) {
        setSnackbar({
          visible: true,
          message: "❌ Birthdate must be in YYYY-MM-DD format!",
          isError: true,
        });
        return;
      }

      if (!isRealDate(birthdateInput)) {
        setSnackbar({
          visible: true,
          message: "❌ Birthdate must be a valid calendar date!",
          isError: true,
        });
        return;
      }
    }

    setLoading(true);

    let birthdate = "";

    if (birthdateMode === "age") {
      birthdate = calculateBirthdate(Number(age), ageUnit);
    } else {
      birthdate = birthdateInput;
    }

    try {
      await addPet({
        name,
        species,
        breed,
        birthdate,
        household_id: String(householdId),
      });

      await refreshData();

      setSnackbar({
        visible: true,
        message: "✅ Pet added successfully!",
        isError: false,
      });

      // Clear form after success
      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setBirthdateInput("");
      setAgeUnit("years");
      setBirthdateMode("age");
      setCustomSpeciesMode(false);

      setShouldCloseAfterToast(true);
    } catch (error) {
      console.error("❌ Error adding pet:", error);
      setSnackbar({
        visible: true,
        message: "❌ Failed to add pet!",
        isError: true,
      });
    }

    setLoading(false);
  };

  const handleSnackbarDismiss = () => {
    setSnackbar({ ...snackbar, visible: false });

    if (shouldCloseAfterToast) {
      router.back();
    }
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

      {/* Species Dropdown */}
      <View style={{ marginBottom: 12 }}>
        <Menu
          visible={speciesMenuVisible}
          onDismiss={() => setSpeciesMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setSpeciesMenuVisible(true)}
              style={{ justifyContent: "flex-start" }}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              {species || "Select Species"}
            </Button>
          }
        >
          {speciesOptions.map((option) => (
            <Menu.Item
              key={option}
              onPress={() => {
                if (option === "Other") {
                  setSpecies("");
                  setCustomSpeciesMode(true);
                } else {
                  setSpecies(option);
                  setCustomSpeciesMode(false);
                }
                setSpeciesMenuVisible(false);
              }}
              title={option}
            />
          ))}
        </Menu>
      </View>

      {/* Custom species input if "Other" selected */}
      {customSpeciesMode && (
        <TextInput
          label="Enter Custom Species"
          value={species}
          onChangeText={setSpecies}
          style={{ marginBottom: 12 }}
        />
      )}

      <TextInput
        label="Breed"
        value={breed}
        onChangeText={setBreed}
        style={{ marginBottom: 12 }}
      />

      {/* Toggle between Age and Birthdate */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Button
          mode={birthdateMode === "age" ? "contained" : "outlined"}
          onPress={() => setBirthdateMode("age")}
          style={{ marginHorizontal: 4 }}
        >
          Enter Age
        </Button>
        <Button
          mode={birthdateMode === "birthdate" ? "contained" : "outlined"}
          onPress={() => setBirthdateMode("birthdate")}
          style={{ marginHorizontal: 4 }}
        >
          Enter Birthdate
        </Button>
      </View>

      {/* Age Entry */}
      {birthdateMode === "age" && (
        <>
          <TextInput
            label="Approximate Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={{ marginBottom: 12 }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
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
        </>
      )}

      {/* Birthdate Entry */}
      {birthdateMode === "birthdate" && (
        <TextInput
          label="Exact Birthdate (YYYY-MM-DD)"
          value={birthdateInput}
          onChangeText={(text) => setBirthdateInput(autoFormatDate(text))}
          placeholder="e.g., 2024-04-15"
          style={{ marginBottom: 12 }}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={{ marginVertical: 8 }}
      >
        Add Pet
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        disabled={loading}
        style={{ marginVertical: 8 }}
      >
        Cancel
      </Button>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={handleSnackbarDismiss}
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
