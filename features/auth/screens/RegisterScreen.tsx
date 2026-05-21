import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet } from "react-native";

export default function RegisterScreen() {
  return <ThemedView style={styles.contentContainer}></ThemedView>;
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 24,
  },
});
