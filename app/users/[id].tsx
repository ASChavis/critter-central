import { View, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Text } from "react-native-paper";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View>
      <Text>Welcome, {user?.email}!</Text>
      <Text>User ID: {id}</Text>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
