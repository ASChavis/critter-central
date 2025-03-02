import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { globalStyles } from "../../styles/globalStyles";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Welcome, {user?.email}!</Text>
      <Text>User ID: {id}</Text>

      <TouchableOpacity style={globalStyles.button} onPress={handleLogout}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

