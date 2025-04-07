import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase/supabase";

export default function AddHouseholdModal() {
  const router = useRouter();
  const { refreshData } = useData(); // use refreshData after insert
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address) {
      setSnackbarVisible(true);
      return;
    }

    if (!user) {
      console.log("❌ ERROR: No user found!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("households").insert([
      {
        name,
        address,
        owner_id: user.id,
        pets: [],
      },
    ]);

    if (error) {
      console.error("❌ Error adding household:", error);
      setLoading(false);
      return;
    }

    await refreshData();

    console.log("✅ Household added successfully!");

    setLoading(false);
    router.back();
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Create a New Household
      </Text>

      <TextInput
        label="Household Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 12 }}
      />
      <TextInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        style={{ marginBottom: 12 }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={{ marginVertical: 8 }}
      >
        Add Household
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={{ marginVertical: 8 }}
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
