import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { View } from "react-native";
import { DataProvider } from "../context/DataContext";
import appTheme from "./styles/theme";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthScreens = segments[0] === "login" || segments[0] === "signup";

    if (!user && !inAuthScreens) {
      router.replace("/login");
    }
  }, [user, segments]);

  return <>{children}</>;
}

const RootLayout = () => {
  const segments = useSegments();
  const isHiddenScreen = segments.includes("login");

  return (
    <PaperProvider theme={appTheme}>
      <AuthProvider>
        {/* AuthContext wraps the entire app */}
        <DataProvider>
          {/* DataProvider inside AuthProvider */}
          <AuthGuard>
            {/*  Ensures authentication before showing app */}
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: appTheme.colors.primary },
                  headerTintColor: appTheme.colors.onPrimary,
                  headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
                  headerShadowVisible: false,
                }}
              >
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="homepage/index"
                  options={{ headerTitle: "Dashboard" }}
                />
                <Stack.Screen
                  name="homepage/[id]"
                  options={{ headerTitle: "Households" }}
                />
                <Stack.Screen
                  name="signup"
                  options={{ headerTitle: "Create an Account" }}
                />
                <Stack.Screen name="households" />
                <Stack.Screen name="pets" />
                <Stack.Screen name="medicalRecords" />
                <Stack.Screen name="users" />
                {/* <Stack.Screen
                  name="households/[id]"
                  options={{ headerTitle: "Pets in Household" }}
                /> */}
                <Stack.Screen
                  name="pets/[id]"
                  options={{ headerTitle: "Pet Details" }}
                />
                <Stack.Screen
                  name="medicalRecords/[id]"
                  options={{
                    headerTitle: "View Records",
                  }}
                />
                {/* <Stack.Screen
                  name="households/modals/add"
                  options={{
                    presentation: "modal",
                    headerTitle: "Add Household",
                  }}
                /> */}
                <Stack.Screen
                  name="pets/modals/add"
                  options={{ presentation: "modal", headerTitle: "Add Pet" }}
                />
                <Stack.Screen
                  name="medicalRecords/modals/add"
                  options={{
                    presentation: "modal",
                    headerTitle: "Add Medical Record",
                  }}
                />
                <Stack.Screen
                  name="medicalRecords/modals/edit"
                  options={{
                    presentation: "modal",
                    headerTitle: "Edit Medical Record",
                  }}
                />
              </Stack>
            </View>
          </AuthGuard>
        </DataProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default RootLayout;
