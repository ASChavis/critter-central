import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { appTheme } from "./styles/theme"; // Import single theme
import { View } from "react-native";

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const segments = useSegments();
  
    useEffect(() => {
      if (!user && segments[0] !== "login") {
        router.replace("/login");
      }
    }, [user, segments]);
  
    return <>{children}</>;
  }

  const RootLayout = () => {
    const segments = useSegments();
    const isHiddenScreen = segments.includes("login"); // Check if on login page
    return (
      <PaperProvider theme={appTheme}>
        <AuthProvider>
          <AuthGuard>
            <View style={{ flex: 1 }}>
              <Stack
               screenOptions={{
                headerShown: !isHiddenScreen, // Hide header on login screen
                headerStyle: { backgroundColor: appTheme.colors.primary },
                headerTintColor: appTheme.colors.onPrimary,
              }}
              >

                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerTitle: "Households" }} />
                <Stack.Screen name="households/[id]" options={{ headerTitle: "Pets in Household" }} />
                <Stack.Screen name="pets/[id]" options={{ headerTitle: "Pet Details" }} />
                {/* Modals */}
                <Stack.Screen name="modals/add-household" options={{ presentation: "modal", headerTitle: "Add Household" }} />
                <Stack.Screen name="modals/add-pet" options={{ presentation: "modal", headerTitle: "Add Pet" }} />
              </Stack>
             </View> 
          </AuthGuard>
        </AuthProvider>
      </PaperProvider>
    );
  };

export default RootLayout;