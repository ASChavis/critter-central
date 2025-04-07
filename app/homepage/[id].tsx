import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Button,
  List,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { supabase } from "../../lib/supabase/supabase";

interface Household {
  id: string;
  name: string;
  address: string;
  pets: string[];
  owner_id: string;
}

export default function HomePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();

  const [userHouseholds, setUserHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouseholds = async () => {
      const { data, error } = await supabase
        .from("households")
        .select("*")
        .eq("owner_id", id);

      if (error) {
        console.error("❌ Error fetching households:", error.message);
      } else {
        setUserHouseholds(data || []);
      }
      setLoading(false);
    };

    if (id) {
      fetchHouseholds();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Welcome back!</Text>

      {userHouseholds.length === 0 ? (
        <Text>No households found. Add one!</Text>
      ) : (
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
          ListFooterComponent={<View style={{ marginBottom: 20 }} />}
        />
      )}

      <Button
        mode="contained"
        onPress={() => router.push("/modals/add-household")}
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
    </View>
  );
}
