import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import {
  Button,
  List,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useAuth } from "./context/AuthContext";
import { useData } from "./context/DataContext";

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
  const { colors } = useTheme();

  const [userHouseholds, setUserHouseholds] = useState<Household[]>([]);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    if (user && data) {
      if (!user || !data) return;
      if (!user.households || !Array.isArray(user.households)) {
        console.log(
          "❌ ERROR: user.households is undefined or not an array!",
          user
        );
        return;
      }
      const filteredHouseholds = data.households.filter((h) =>
        user.households.includes(h.id)
      );
      setUserHouseholds(filteredHouseholds);

      if (isMounted) {
        setUserHouseholds(filteredHouseholds);
      }
    }

    return () => setIsMounted(false);
  }, [user, data]);

  if (!user) return <ActivityIndicator animating={true} size="large" />;
  if (!data || !user) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text>Welcome, {user?.email}!</Text>
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
      <Text>Edit Your Account Information</Text>
      <Button mode="text" onPress={() => router.push("/users/1")}>
        View User Info
      </Button>{" "}
      <Button
        mode="contained"
        onPress={() => router.push("/modals/add-household")}
      >
        ➕ Add Household
      </Button>
    </View>
  );
}
