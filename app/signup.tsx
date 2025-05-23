import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme, Surface } from "react-native-paper";
import { supabase } from "../lib/supabase/supabase";
import { router } from "expo-router";
import SvgIcon from "../helper/SvgIcon";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { colors } = useTheme();

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else if (data.user?.id) {
      // In some cases signup + session is ready immediately
      console.log("✅ Signup complete, user ID:", data.user.id);
      router.replace("/households/[id]"); // Go to home
    } else {
      // No immediate session; Supabase sent a confirmation email
      console.log("✅ Signup email sent. Waiting for confirmation.");
      setSuccessMsg(
        "Signup successful! Please check your email to confirm your account."
      );
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
        <Text style={[styles.title, { color: colors.onSurface }]}>
          Create Account
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {errorMsg ? (
          <Text style={[styles.message, { color: colors.error }]}>
            {errorMsg}
          </Text>
        ) : null}

        {successMsg ? (
          <Text style={[styles.message, { color: colors.primary }]}>
            {successMsg}
          </Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSignUp}
          loading={loading}
          style={styles.button}
          labelStyle={{ color: colors.onPrimary }}
        >
          Sign Up
        </Button>
      </Surface>
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
    padding: 24,
    borderRadius: 16,
    elevation: 3,
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
  message: {
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
});
