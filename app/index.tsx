import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <Text style={styles.title}>Welcome to Critter Central</Text>
      <Text style={styles.subtitle}>
        Your go-to solution for managing pet records with ease.
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.infoText}>
            Manage your pet's health records in one place. Secure, fast, and
            easy to use.
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.push("/login")}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => router.push("/contact")}
        style={styles.button}
      >
        Contact Us
      </Button>
    </View>
  );
};

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
    marginBottom: 10,
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    padding: 15,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  infoText: {
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginBottom: 10,
  },
});

export default Index;
