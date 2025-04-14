import { Stack } from "expo-router";

export default function MedicalRecordsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      {/* 📄 View Medical Record */}
      <Stack.Screen name="[id]" options={{ headerTitle: "View Record" }} />

      {/* ➕ Add Record Modal */}
      <Stack.Screen
        name="modals/add"
        options={{ presentation: "modal", headerTitle: "Add Medical Record" }}
      />

      {/* ✏️ Edit Record Modal */}
      <Stack.Screen
        name="modals/edit"
        options={{ presentation: "modal", headerTitle: "Edit Medical Record" }}
      />
    </Stack>
  );
}
