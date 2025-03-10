import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

export default function AddHouseholdModal() {
  const router = useRouter();
  const { data, setData } = useData(); // ✅ Use setData to update state
  const { user } = useAuth(); // ✅ Get the logged-in user

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSubmit = () => {
    if (!name || !address) {
      setSnackbarVisible(true);
      return;
    }

    if (!user) {
      console.log("❌ ERROR: No user found!");
      return;
    }

    // Create new household object
    const newHousehold = {
      id: `household_${Date.now()}`, // Generate unique ID
      name,
      address,
      pets: [],
    };

    // ✅ Update state properly
    setData((prevData) => ({
      ...prevData,
      households: [...prevData.households, newHousehold], // ✅ Add household correctly
    }));

    // ✅ Update the user’s households list
    user.households.push(newHousehold.id);

    console.log("✅ Household added:", newHousehold);
    console.log("🏡 Updated User Households:", user.households);

    router.back();
  };

  return (
    <View>
      <Text variant="headlineMedium">Create a New Household</Text>

      <TextInput label="Household Name" value={name} onChangeText={setName} />
      <TextInput label="Address" value={address} onChangeText={setAddress} />

      <Button mode="contained" onPress={handleSubmit}>
        Add Household
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
