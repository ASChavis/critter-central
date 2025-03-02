import { View, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Button, Text, useTheme } from "react-native-paper";
import { globalStyles } from "../styles/globalStyles";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, marginBottom: 20 }}>
        Welcome, {user?.email}!</Text>
      <Text>User ID: {id}</Text>

      <TouchableOpacity onPress={handleLogout} style={[globalStyles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={globalStyles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

