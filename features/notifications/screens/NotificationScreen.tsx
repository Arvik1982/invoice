import notifications from "@/shared/constants/mockData/notifications.json";
import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet } from "react-native";
import InvoiceListFilter from "../../history/components/InvoiceListFilter";
import Notificationslist from "../components/Notificationslist";

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.contentContainer}>
      <ThemedView style={styles.notificationsBox}>
        {/* <InvoiceListFilter /> */}
        <Notificationslist notifications={notifications} />
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 24,
  },
  notificationsBox: { flex: 1, paddingHorizontal: 10, gap: 15 },
});
