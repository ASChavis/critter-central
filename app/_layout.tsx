import { Slot, useRouter, useSegments } from "expo-router";
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
  return (
    <PaperProvider theme={appTheme}>
      <AuthProvider>
        <DataProvider>
          <AuthGuard>
            <View style={{ flex: 1 }}>
              <Slot />
            </View>
          </AuthGuard>
        </DataProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default RootLayout;
