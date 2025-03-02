import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { lightTheme, darkTheme } from "./styles/theme";
import { useColorScheme } from "react-native";

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
  const systemTheme = useColorScheme();
    return (
      <PaperProvider theme={systemTheme === "dark" ? darkTheme : lightTheme}>
        <AuthProvider>
            <AuthGuard>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{
                         headerShown: false,
                         }}/>
                </Stack>
            </AuthGuard>
        </AuthProvider>
      </PaperProvider>
    );
};

export default RootLayout;