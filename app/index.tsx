import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useAuth } from "./context/AuthContext";
import { useData } from "./context/DataContext";

// Define Household type
interface Household {
  id: string;
  name: string;
  address: string;
  pets: string[];
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data } = useData();

  const [userHouseholds, setUserHouseholds] = useState<Household[]>([]);
  const [isMounted, setIsMounted] = useState(true); // ✅ Track mount state

  useEffect(() => {
    setIsMounted(true); // ✅ Component is mounted

    if (user && data) {
      const filteredHouseholds: Household[] = data.households.filter((h) =>
        user?.households?.includes(h.id)
      );

      // ✅ Only update state if component is still mounted
      if (isMounted) {
        setUserHouseholds(filteredHouseholds);
      }
    }

    return () => setIsMounted(false); // ✅ Cleanup function to prevent state updates after unmount
  }, [user, data]);

  if (!data || !user) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Welcome, {user?.email}!
      </Text>

      <Button
        mode="contained"
        onPress={() => router.push("/modals/add-household")}
        style={styles.addButton}
      >
        Add Household
      </Button>

      <FlatList
        data={userHouseholds}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            description={item.address}
            onPress={() => router.push(`/households/${item.id}`)}
            left={(props) => <List.Icon {...props} icon="home" />}
          />
        )}
        ListEmptyComponent={<Text>No households found.</Text>}
      />

      <Text variant="titleMedium" style={styles.accountHeader}>
        Edit Your Account Information
      </Text>
      <Button mode="text" onPress={() => router.push("/users/1")}>
        View User Info
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    marginBottom: 15,
  },
  addButton: {
    marginBottom: 15,
  },
  accountHeader: {
    marginTop: 20,
    fontWeight: "bold",
  },
});
