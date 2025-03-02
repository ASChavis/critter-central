import { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { globalStyles } from "./styles/globalStyles";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const theme = useTheme(); // Use theme for colors

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      Alert.alert("Success", "Login successful!");
      router.replace(`/users/${user.token}`);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <View style={[globalStyles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={[globalStyles.title, { color: theme.colors.onSurface }]}>
        Login
      </Text>

      {/* Email Input */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={globalStyles.input}
      />

      {/* Password Input */}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={globalStyles.input}
      />

      {/* Login Button */}
      <Button mode="contained" onPress={handleLogin} style={globalStyles.button}>
        Login
      </Button>
    </View>
  );
}

