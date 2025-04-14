import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase/supabase";
import { ActivityIndicator } from "react-native-paper";

export default function EditPetModal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });
  const [shouldCloseAfterToast, setShouldCloseAfterToast] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching pet:", error.message);
        setSnackbar({
          visible: true,
          message: "❌ Failed to load pet data!",
          isError: true,
        });
      } else if (data) {
        setName(data.name);
        setBreed(data.breed);
        setBirthdate(data.birthdate);
      }

      setLoading(false);
    };

    fetchPet();
  }, [id]);

  const handleSubmit = async () => {
    if (!name || !breed || !birthdate) {
      setSnackbar({
        visible: true,
        message: "❌ Please fill all fields!",
        isError: true,
      });
      return;
    }

    const { error } = await supabase
      .from("pets")
      .update({
        name,
        breed,
        birthdate,
      })
      .eq("id", id);

    if (error) {
      console.error("❌ Error updating pet:", error.message);
      setSnackbar({
        visible: true,
        message: `❌ ${error.message || "Failed to update pet!"}`,
        isError: true,
      });
      return;
    }

    console.log("✅ Pet updated successfully!");

    setSnackbar({
      visible: true,
      message: "✅ Pet updated successfully!",
      isError: false,
    });

    setShouldCloseAfterToast(true);
  };

  const handleSnackbarDismiss = () => {
    setSnackbar({ ...snackbar, visible: false });

    if (shouldCloseAfterToast) {
      router.back(); // Close the modal after showing success
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Edit Pet
      </Text>

      <TextInput
        label="Pet Name"
        value={name}
        onChangeText={setName}
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
        onPress={handleSubmit}
        style={{ marginVertical: 8 }}
      >
        ✅ Save Changes
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        style={{ marginVertical: 8 }}
      >
        ❌ Cancel
      </Button>

      {/* Snackbar Toast */}
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
