import { useEffect, useState, useCallback } from "react";
import { View, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Button,
  List,
  Text,
  ActivityIndicator,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { supabase } from "../../lib/supabase/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

interface Household {
  id: string;
  name: string;
  address: string;
  pets: string[];
  owner_id: string;
}

export default function HouseholdsPage() {
  // ✅ Renamed
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const fetchHouseholds = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("households")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.error("❌ Error fetching households:", error.message);
    } else {
      setHouseholds(data || []);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await fetchHouseholds();
        setLoading(false);
      };

      load();
    }, [user?.id])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHouseholds();
    setRefreshing(false);
  };

  const handleDeleteHousehold = (householdId: string) => {
    Alert.alert(
      "Delete Household",
      "Are you sure you want to delete this household? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("households")
              .delete()
              .eq("id", householdId);

            if (error) {
              console.error("❌ Error deleting household:", error.message);
              setSnackbar({
                visible: true,
                message: "❌ Failed to delete household!",
                isError: true,
              });
            } else {
              console.log("✅ Household deleted successfully!");
              setSnackbar({
                visible: true,
                message: "✅ Household deleted successfully!",
                isError: false,
              });
              await fetchHouseholds(); // Refresh the list after deletion
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Your Households</Text>

      {households.length === 0 ? (
        <Text>No households found. Add one!</Text>
      ) : (
        <FlatList
          data={households}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.address}
              onPress={() => router.push(`/households/${item.id}`)}
              left={(props) => <List.Icon {...props} icon="home" />}
              right={() => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button
                    compact
                    mode="text"
                    onPress={() =>
                      router.push(`/modals/edit-household?id=${item.id}`)
                    }
                  >
                    ✏️
                  </Button>
                  <Button
                    compact
                    mode="text"
                    onPress={() => handleDeleteHousehold(item.id)}
                  >
                    🗑️
                  </Button>
                </View>
              )}
              style={{ marginBottom: 8 }}
            />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={<View style={{ marginBottom: 20 }} />}
        />
      )}

      <Button
        mode="contained"
        onPress={() => router.push("/modals/add")}
        style={{ marginTop: 16 }}
      >
        ➕ Add Household
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/users/1")}
        style={{ marginTop: 8 }}
      >
        View Your Account Info
      </Button>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({ visible: false, message: "", isError: false })
        }
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
