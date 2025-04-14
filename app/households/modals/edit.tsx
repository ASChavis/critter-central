import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase/supabase";

export default function EditHouseholdModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHousehold = async () => {
      const { data, error } = await supabase
        .from("households")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching household:", error.message);
      } else if (data) {
        setName(data.name);
        setAddress(data.address);
      }
    };

    if (id) {
      fetchHousehold();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!name || !address) {
      setSnackbar({
        visible: true,
        message: "❌ Please fill all fields!",
        isError: true,
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("households")
      .update({ name, address })
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating household:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Failed to update household!",
        isError: true,
      });
    } else {
      setSnackbar({
        visible: true,
        message: "✅ Household updated successfully!",
        isError: false,
      });

      setTimeout(() => {
        router.back(); // Go back to previous page
      }, 1000);
    }

    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Edit Household
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
        onPress={handleUpdate}
        loading={loading}
        style={{ marginVertical: 8 }}
      >
        Save Changes
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
        onDismiss={() =>
          setSnackbar({ visible: false, message: "", isError: false })
        }
        duration={2000}
        style={{ backgroundColor: snackbar.isError ? "red" : "green" }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}
