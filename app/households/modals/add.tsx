import { useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase/supabase";

export default function AddHouseholdModal() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const [shouldCloseAfterToast, setShouldCloseAfterToast] = useState(false);

  const handleSubmit = async () => {
    if (!name || !address) {
      setSnackbar({
        visible: true,
        message: "❌ Please fill all fields!",
        isError: true,
      });
      return;
    }

    if (!user) {
      console.log("❌ ERROR: No user found!");
      setSnackbar({
        visible: true,
        message: "❌ No user found!",
        isError: true,
      });
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
      setSnackbar({
        visible: true,
        message: `❌ ${error.message || "Failed to add household!"}`,
        isError: true,
      });
      setLoading(false);
      return;
    }

    console.log("✅ Household added successfully!");

    setSnackbar({
      visible: true,
      message: "✅ Household added successfully!",
      isError: false,
    });

    setShouldCloseAfterToast(true);

    // Clear fields after successful add
    setName("");
    setAddress("");

    setLoading(false);
  };

  const handleSnackbarDismiss = () => {
    setSnackbar({ ...snackbar, visible: false });

    if (shouldCloseAfterToast) {
      router.back(); // Close modal AFTER toast
    }
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
        disabled={loading}
        style={{ marginVertical: 8 }}
      >
        Add Household
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
