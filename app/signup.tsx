import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { supabase } from "../lib/supabase/supabase";
import { router } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
    <View style={{ padding: 20, flex: 1, justifyContent: "center" }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Create Account
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 16 }}
      />

      {errorMsg ? (
        <Text style={{ color: "red", marginBottom: 16 }}>{errorMsg}</Text>
      ) : null}

      {successMsg ? (
        <Text style={{ color: "green", marginBottom: 16 }}>{successMsg}</Text>
      ) : null}

      <Button mode="contained" onPress={handleSignUp} loading={loading}>
        Sign Up
      </Button>
    </View>
  );
}
