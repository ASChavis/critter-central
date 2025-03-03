import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";

export default function PetScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Pet Details</Text>
      <Text>Pet ID: {id}</Text>
    </View>
  );
}
