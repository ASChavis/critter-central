import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export default function LoadingScreen() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "colors.background",
  },
});
