import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme, ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user]);

  if (!user) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.welcomeText}>Welcome back!</Text>
      <Text style={styles.emailText}>{user.email}</Text>

      <Button
        mode="contained"
        onPress={() => router.push("/households")}
        style={styles.button}
      >
        🏡 View Your Households
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.push(`/users/${user.id}`)}
        style={styles.button}
      >
        👤 View Account Info
      </Button>

      {/* Optional: Add Logout Button */}
      {/* 
      <Button
        mode="text"
        onPress={() => logout()}
        style={[styles.button, { marginTop: 20 }]}
      >
        🚪 Logout
      </Button>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 32,
    color: "gray",
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
