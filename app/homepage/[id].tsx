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
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import LoadingScreen from "../loadingScreen";
import { usePathname } from "expo-router";

interface Household {
  id: string;
  name: string;
  address: string;
  pets: string[];
  owner_id: string;
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { households } = useData();
  const { colors } = useTheme();

  const [userHouseholds, setUserHouseholds] = useState<Household[]>([]);

  useEffect(() => {
    if (user && households) {
      const filteredHouseholds = households.filter(
        (h) => h.owner_id === user.id
      );
      setUserHouseholds(filteredHouseholds);
    }
  }, [user, households]);

  if (user === undefined || households === undefined) {
    return <LoadingScreen />;
  }

  if (!user && pathname !== "/login" && pathname !== "/signup") {
    router.replace("/login");
    return null;
  }

  if (!households) {
    return <Text>Loading households...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Welcome back!</Text>

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
        ListEmptyComponent={<Text>No households found. Add one!</Text>}
      />

      <Button
        mode="contained"
        onPress={() => router.push("/modals/add-household")}
        style={{ marginTop: 16 }}
      >
        ➕ Add Household
      </Button>

      <Button
        mode="text"
        onPress={() => router.push("/users/1")} // Update to real user info page later
        style={{ marginTop: 8 }}
      >
        View Your Account Info
      </Button>
    </View>
  );
}
