import { useState } from "react";
import { View, Alert, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/backgroundImg.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>
        <Card style={styles.card}>
          <Card.Content>
            {/* Email Input */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              theme={{
                colors: {
                  background: "white",
                  placeholder: "rgba(212, 163, 206, 0.7)",
                },
              }}
            />

            {/* Password Input */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              theme={{
                colors: {
                  background: "white",
                  placeholder: "rgba(212, 163, 206, 0.7)",
                },
              }}
            />

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
            >
              Login
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  card: {
    width: "100%",
    padding: 20,
    backgroundColor: "white", // fixes weird bar issue
    borderRadius: 12,
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
