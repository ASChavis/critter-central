import { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  Card,
  Snackbar,
  Text,
  TextInput,
  useTheme,
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.overlay}>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <SvgIcon icon="logo" width={250} height={250} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: "100%" }}
        >
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
                loading={loading}
              >
                Login
              </Button>

              {/* Navigate to Signup */}
              <Button
                mode="text"
                onPress={() => router.push("/signup")}
                style={{ marginTop: 12 }}
              >
                Don't have an account? Sign Up
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </View>

      {/* Snackbar Toast */}
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
    </View>
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
    backgroundColor: "white",
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
