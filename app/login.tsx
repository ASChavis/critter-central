import { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Card,
  Snackbar,
  Text,
  TextInput,
  useTheme,
  Surface,
} from "react-native-paper";
import SvgIcon from "../helper/SvgIcon";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/homepage");
    } catch (error: any) {
      console.error("❌ Login Failed:", error.message);
      setSnackbar({
        visible: true,
        message: "❌ Login failed. Please check your email and password.",
        isError: true,
      });
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <SvgIcon icon="logo" width={250} height={250} style={styles.mascot} />
      </View>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.onSurface }]}>Login</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[styles.input]}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input]}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          labelStyle={{ color: colors.onPrimary }}
        >
          Login
        </Button>

        <Button
          mode="text"
          onPress={() => router.push("/signup")}
          style={{ marginTop: 12 }}
        >
          Don’t have an account? Sign Up
        </Button>
      </Surface>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() =>
          setSnackbar({ visible: false, message: "", isError: false })
        }
        duration={2000}
        style={{ backgroundColor: snackbar.isError ? "red" : "green" }}
      >
        {snackbar.message}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  mascot: {
    alignSelf: "center",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
});
