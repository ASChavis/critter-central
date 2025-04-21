import { Stack } from "expo-router";

export default function dailyLogLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      {/* 📄 View Log Modal */}
      <Stack.Screen name="[id]" options={{ headerTitle: "View Log" }} />

      {/* ➕ Add Log Modal */}
      <Stack.Screen
        name="modals/add"
        options={{ presentation: "modal", headerTitle: "Add Log" }}
      />

      {/* ✏️ Edit Log Modal */}
      <Stack.Screen
        name="modals/edit"
        options={{ presentation: "modal", headerTitle: "Edit Log" }}
      />
    </Stack>
  );
}
