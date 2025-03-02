import { View, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button, Text, List } from "react-native-paper";
import { useState } from "react";

export default function HouseholdScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pets, setPets] = useState([{ id: "101", name: "Buddy" }]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button mode="contained" onPress={() => router.push("/modals/add-pet")}>
        Add Pet
      </Button>

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.name}
            onPress={() => router.push(`/pets/${item.id}`)}
            left={(props) => <List.Icon {...props} icon="dog" />}
          />
        )}
      />
    </View>
  );
}
