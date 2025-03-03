import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useData } from "./context/DataContext";

export default function HouseholdsScreen() {
  const { data } = useData();
  const router = useRouter();

  return (
    <View>
      <Text>Your Households:</Text>
      {data.users[0].households.map((householdId) => {
        const household = data.households.find((h) => h.id === householdId);
        return (
          <TouchableOpacity
            key={householdId}
            onPress={() => router.push(`/households/${householdId}`)}
          >
            <Text>🏡 {household?.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
