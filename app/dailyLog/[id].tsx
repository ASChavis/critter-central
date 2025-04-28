import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  ToastAndroid,
} from "react-native";
import {
  Text,
  ActivityIndicator,
  Button,
  useTheme,
  TextInput,
  Menu,
  Snackbar,
} from "react-native-paper";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { supabase } from "../../lib/supabase/supabase";
import DateTimePicker from "@react-native-community/datetimepicker";

const CATEGORY_OPTIONS = [
  "vaccinations",
  "medications",
  "grooming",
  "general",
] as const;

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

interface Reminder {
  id: string;
  pet_id: string;
  name: string;
  due_date: string;
  category: "vaccinations" | "medications" | "grooming" | "general";
}

function MenuDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (val: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setVisible(true)}
            style={{ justifyContent: "flex-start" }}
          >
            {value || `Select ${label}`}
          </Button>
        }
      >
        {options.map((option, idx) => (
          <Menu.Item
            key={idx}
            onPress={() => {
              onChange(option);
              setVisible(false);
            }}
            title={option}
          />
        ))}
      </Menu>
    </View>
  );
}

export default function PetDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [pet, setPet] = useState<Pet | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftReminders, setDraftReminders] = useState<
    Record<string, Partial<Reminder>>
  >({});
  const [showDatePickerId, setShowDatePickerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const petId = String(id);

  useEffect(() => {
    const fetchPetAndRecords = async () => {
      setLoading(true);

      const { data: petData, error: petError } = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("pet_id", petId);

      const { data: remindersData, error: remindersError } = await supabase
        .from("reminders")
        .select("*")
        .eq("pet_id", petId)
        .order("due_date", { ascending: true });

      if (petError || recordsError || remindersError) {
        console.error(
          "❌ Fetch error:",
          petError || recordsError || remindersError
        );
        setLoading(false);
        return;
      }

      setPet(petData);
      setMedicalRecords(recordsData || []);
      setReminders(remindersData || []);
      setLoading(false);
    };

    fetchPetAndRecords();
  }, [petId]);

  const addReminder = async () => {
    const newReminder = {
      pet_id: petId,
      name: "New Reminder",
      due_date: new Date().toISOString().split("T")[0],
      category: "general" as const,
    };

    const { data, error } = await supabase
      .from("reminders")
      .insert([newReminder])
      .select()
      .single();

    if (!error && data) setReminders((prev) => [...prev, data]);
  };

  const saveReminder = async (id: string) => {
    const draft = draftReminders[id];
    const original = reminders.find((r) => r.id === id);
    if (!draft || !original) return;

    if (!draft.name || !draft.due_date || !draft.category) {
      setSnackbar("All fields are required.");
      return;
    }

    const isUnchanged =
      draft.name === original.name &&
      draft.due_date === original.due_date &&
      draft.category === original.category;

    if (isUnchanged) {
      setEditingId(null);
      setDraftReminders((prev) => {
        const newDraft = { ...prev };
        delete newDraft[id];
        return newDraft;
      });
      setSnackbar("No changes to save.");
      return;
    }

    const { data, error } = await supabase
      .from("reminders")
      .update(draft)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setReminders((prev) => prev.map((r) => (r.id === id ? data : r)));
      setEditingId(null);
      setDraftReminders((prev) => {
        const newDraft = { ...prev };
        delete newDraft[id];
        return newDraft;
      });
      setSnackbar("Reminder updated successfully.");
    }
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (!error) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      setSnackbar("Reminder deleted.");
    }
  };

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear();
  };

  if (loading) return <ActivityIndicator animating={true} size="large" />;
  if (!pet) return <Text style={{ color: "red" }}>❌ Pet not found.</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>🐾 {pet.name}</Text>
        <Text>Species: {pet.species}</Text>
        <Text>Breed: {pet.breed}</Text>
        <Text>Approximate Age: {calculateAge(pet.birthdate)} years</Text>

        <Text style={{ marginTop: 32, fontSize: 20 }}>Reminders:</Text>

        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const isEditing = editingId === item.id;
            const draft = draftReminders[item.id] || item;
            const showDatePicker = showDatePickerId === item.id;
            const parsedDate = draft.due_date
              ? new Date(draft.due_date)
              : new Date();

            return (
              <View
                style={{
                  backgroundColor: "#f1f3f5",
                  padding: 16,
                  marginVertical: 8,
                  borderRadius: 12,
                }}
              >
                {isEditing ? (
                  <>
                    <View style={{ marginBottom: 12 }}>
                      <TextInput
                        label="Name"
                        value={draft.name}
                        onChangeText={(text) =>
                          setDraftReminders((prev) => ({
                            ...prev,
                            [item.id]: { ...draft, name: text },
                          }))
                        }
                        mode="outlined"
                      />
                    </View>

                    <Button
                      mode="outlined"
                      onPress={() => setShowDatePickerId(item.id)}
                      style={{ marginBottom: 12 }}
                    >
                      {draft.due_date
                        ? `📅 ${draft.due_date}`
                        : "Pick a Due Date"}
                    </Button>

                    {showDatePicker && (
                      <DateTimePicker
                        value={parsedDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowDatePickerId(null);
                          if (selectedDate) {
                            const formatted = selectedDate
                              .toISOString()
                              .split("T")[0];
                            setDraftReminders((prev) => ({
                              ...prev,
                              [item.id]: { ...draft, due_date: formatted },
                            }));
                          }
                        }}
                      />
                    )}

                    <MenuDropdown
                      label="Category"
                      value={draft.category}
                      options={CATEGORY_OPTIONS}
                      onChange={(selected) =>
                        setDraftReminders((prev) => ({
                          ...prev,
                          [item.id]: {
                            ...draft,
                            category: selected as Reminder["category"],
                          },
                        }))
                      }
                    />

                    <View
                      style={{ flexDirection: "row", marginTop: 12, gap: 12 }}
                    >
                      <Button
                        mode="contained"
                        onPress={() => saveReminder(item.id)}
                      >
                        Done
                      </Button>
                      <Button
                        mode="outlined"
                        textColor="red"
                        onPress={() => deleteReminder(item.id)}
                      >
                        Delete
                      </Button>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                      {item.name}
                    </Text>
                    <Text>📅 Due: {item.due_date}</Text>
                    <Text>📌 Category: {item.category}</Text>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setEditingId(item.id);
                        setDraftReminders((prev) => ({
                          ...prev,
                          [item.id]: { ...item },
                        }));
                      }}
                      style={{ marginTop: 6 }}
                    >
                      Edit
                    </Button>
                  </>
                )}
              </View>
            );
          }}
          ListEmptyComponent={<Text>No reminders yet.</Text>}
        />

        <Button
          mode="contained"
          onPress={addReminder}
          style={{ marginTop: 16 }}
        >
          ➕ Add Reminder
        </Button>

        <Text style={{ marginTop: 16, fontSize: 20 }}>Medical Records:</Text>

        <FlatList
          data={medicalRecords}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
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
            router.push(`/dailyLog/modals/view?petId=${pet?.id}`)
          }
          style={{ marginTop: 16 }}
        >
          📅 Daily Log
        </Button>        

        <Button
          mode="contained"
          onPress={() =>
            router.push(`/medicalRecords/modals/add?petId=${pet?.id}`)
          }
          style={{ marginTop: 16 }}
        >
          ➕ Add Medical Record
        </Button>
      </View>
      <Snackbar
        visible={!!snackbar}
        onDismiss={() => setSnackbar(null)}
        duration={3000}
      >
        {snackbar}
      </Snackbar>
    </ScrollView>
  );
}
