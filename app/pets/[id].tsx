import { useEffect, useState } from "react";
import { View, FlatList, Pressable } from "react-native";
import { Text, ActivityIndicator, Button, useTheme } from "react-native-paper";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { supabase } from "../../lib/supabase/supabase";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthdate: string;
  household_id: string;
}

interface MedicalRecord {
  id: string;
  pet_id: string;
  date: string;
  description: string;
}

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [pet, setPet] = useState<Pet | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const petId = String(id);

  useEffect(() => {
    const fetchPetAndRecords = async () => {
      setLoading(true);

      const { data: petData, error: petError } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();

      if (petError) {
        console.error("❌ Error fetching pet:", petError.message);
        setLoading(false);
        return;
      }

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("pet_id", petId);

      if (recordsError) {
        console.error("❌ Error fetching records:", recordsError.message);
        setLoading(false);
        return;
      }

      setPet(petData);
      setMedicalRecords(recordsData || []);
      setLoading(false);
    };

    fetchPetAndRecords();
  }, [petId]);

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  if (!pet) {
    return <Text style={{ color: "red" }}>❌ Pet not found.</Text>;
  }

  // Calculate age from birthdate (optional fancy improvement)
  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    return age;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>🐾 {pet.name}</Text>
      <Text>Species: {pet.species}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Approximate Age: {calculateAge(pet.birthdate)} years</Text>

      <Text style={{ marginTop: 16, fontSize: 20 }}>Medical Records:</Text>

      <FlatList
        data={medicalRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/medicalRecords/${item.id}`} asChild>
            <Pressable
              style={{
                padding: 15,
                borderBottomWidth: 1,
                borderColor: "#ddd",
                backgroundColor: "#f8f9fa",
                marginBottom: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.description}
              </Text>
              <Text style={{ color: "gray" }}>📅 {item.date}</Text>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={<Text>No medical records found.</Text>}
      />

      <Button
        mode="contained"
        onPress={() =>
          router.push(`/medicalRecords/modals/add?petId=${pet.id}`)
        }
        style={{ marginTop: 16 }}
      >
        ➕ Add Medical Record
      </Button>
    </View>
  );
}
