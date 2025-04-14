import { useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase/supabase";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        console.error("❌ Error exchanging code for session:", error.message);
      }

      // After success or failure, route somewhere appropriate
      router.replace("/");
    };

    handleAuthCallback();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
