import { Stack } from "expo-router";

export default function HouseholdsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "Your Households" }} />
      <Stack.Screen
        name="[id]"
        options={{ headerTitle: "Household Details" }}
      />

      {/* Modals */}
      <Stack.Screen
        name="modals/add"
        options={{ presentation: "modal", headerTitle: "Add Household" }}
      />
      <Stack.Screen
        name="modals/edit"
        options={{ presentation: "modal", headerTitle: "Edit Household" }}
      />
    </Stack>
  );
}
