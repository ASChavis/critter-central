import { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Button, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      // ✅ No need to manually route, it's handled in AuthContext
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <View>
      <Text>Login</Text>

      {/* Email Input */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
      />

      {/* Login Button */}
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
    </View>
  );
}
