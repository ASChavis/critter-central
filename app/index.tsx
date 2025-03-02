import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Pressable, FlatList } from 'react-native'; 
import { Button, List, Text } from "react-native-paper";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth(); // ✅ Get logged-in user
  const [households, setHouseholds] = useState([
    { id: "1", name: "Smith Household", owner: "user1" },
    { id: "2", name: "Johnson Household", owner: "user2" },
  ]);

  const userHouseholds = households.filter((h) => h.owner === user?.id);

  return (
    <View style={{ flex: 1, padding: 20 }}>
    <Text variant="headlineMedium">Welcome, {user?.email}!</Text>
    
    <Button mode="contained" onPress={() => router.push("/modals/add-household")}>
      Add Household
    </Button>

    <FlatList
      data={userHouseholds}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          onPress={() => router.push(`/households/${item.id}`)}
          left={(props) => <List.Icon {...props} icon="home" />}
        />
      )}
    />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Edit your Account Information</Text> 
       <Pressable onPress={() => router.push("/users/1")}>
        <Text>Link to User Info</Text>
        </Pressable>.
    </View>
  );
}