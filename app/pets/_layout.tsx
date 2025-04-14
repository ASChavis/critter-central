import { Stack } from "expo-router";

export default function PetsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      {/* 🏡 Pet Details */}
      <Stack.Screen name="[id]" options={{ headerTitle: "Pet Details" }} />

      {/* ➕ Add Pet Modal */}
      <Stack.Screen
        name="modals/add"
        options={{
          presentation: "modal",
          headerTitle: "Add Pet",
        }}
      />

      {/* ✏️ Edit Pet Modal */}

      <Stack.Screen
        name="modals/edit"
        options={{
          presentation: "modal",
          headerTitle: "Edit Pet",
        }}
      />
    </Stack>
  );
}
