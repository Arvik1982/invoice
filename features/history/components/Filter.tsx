import { Fonts } from "@/shared/config/fonts";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { memo } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

const Filter = ({ filter, setFilter }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "all" && styles.filterButtonActive,
        ]}
        onPress={() => setFilter("all")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === "all" && styles.filterButtonTextActive,
          ]}
        >
          Все
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "today" && styles.filterButtonActive,
        ]}
        onPress={() => setFilter("today")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === "today" && styles.filterButtonTextActive,
          ]}
        >
          Сегодня
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "week" && styles.filterButtonActive,
        ]}
        onPress={() => setFilter("week")}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.filterButtonText,
            filter === "week" && styles.filterButtonTextActive,
          ]}
        >
          Неделя
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default memo(Filter);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: Platform.OS === "ios" ? 60 : 40,
      paddingBottom: 20,
    },
    headerMain: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: Colors.text,
      fontFamily: Fonts.bold.fontFamily,
    },
    filterContainer: {
      flexDirection: "row",
      backgroundColor: Colors.backgroundItem,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    filterButtonActive: {
      backgroundColor: Colors.tint,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#666666",
      fontFamily: Fonts.semiBold.fontFamily,
    },
    filterButtonTextActive: {
      color: Colors.background,
    },
    invoiceCard: {
      backgroundColor: Colors.backgroundItem,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#1A1A1A",
      minHeight: 120,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    avatarContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.tint + "20",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    avatarText: {
      fontSize: 14,
      fontWeight: "700",
      color: Colors.tint,
      fontFamily: Fonts.bold.fontFamily,
    },
    clientInfo: {
      flex: 1,
    },
    clientName: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 4,
      fontFamily: Fonts.bold.fontFamily,
    },
    invoiceMeta: {
      flexDirection: "row",
      alignItems: "center",
    },
    invoiceNumber: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.tint,
      fontFamily: Fonts.semiBold.fontFamily,
    },
    invoiceDate: {
      fontSize: 12,
      color: "#666666",
      marginLeft: 8,
      fontFamily: Fonts.regular.fontFamily,
    },
    separator: {
      width: 1,
      height: 12,
      backgroundColor: "#333333",
      marginHorizontal: 8,
    },
    cardBody: {
      marginBottom: 12,
    },
    servicesText: {
      fontSize: 14,
      color: "#CCCCCC",
      marginBottom: 4,
      fontFamily: Fonts.regular.fontFamily,
    },
    totalAmount: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.tint,
      fontFamily: Fonts.bold.fontFamily,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#333333",
    },
    sertPreview: {
      width: 40,
      height: 40,
      backgroundColor: Colors.background,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#333333",
    },
    actionButtons: {
      flexDirection: "row",
      gap: 8,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#1A1A1A",
      alignItems: "center",
      justifyContent: "center",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingTop: 100,
    },
    emptyIcon: {
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
      textAlign: "center",
      marginBottom: 12,
      fontFamily: Fonts.bold.fontFamily,
    },
    emptyText: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      marginBottom: 24,
      fontFamily: Fonts.regular.fontFamily,
    },
    goToInvoiceButton: {
      backgroundColor: Colors.tint,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    goToInvoiceButtonText: {
      color: Colors.background,
      fontSize: 16,
      fontWeight: "600",
      fontFamily: Fonts.semiBold.fontFamily,
    },
    premiumFooter: {
      marginHorizontal: 16,
      marginBottom: 20,
      backgroundColor: "#1A1A1A",
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: "#333333",
      alignItems: "center",
    },
    premiumWarning: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    premiumWarningText: {
      fontSize: 14,
      color: "#FFD700",
      marginLeft: 8,
      fontFamily: Fonts.regular.fontFamily,
    },
    premiumFeatures: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    premiumFeature: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 8,
    },
    premiumFeatureText: {
      fontSize: 12,
      color: "#666666",
      marginLeft: 4,
      fontFamily: Fonts.regular.fontFamily,
    },
    premiumPrice: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.tint,
      marginBottom: 16,
      fontFamily: Fonts.bold.fontFamily,
    },
    buyPremiumButton: {
      backgroundColor: Colors.backgroundButton,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      width: "100%",
      alignItems: "center",
    },
    buyPremiumButtonText: {
      color: Colors.background,
      fontSize: 16,
      fontWeight: "700",
      fontFamily: Fonts.bold.fontFamily,
    },
    fab: {
      position: "absolute",
      bottom: 100,
      right: 20,
      backgroundColor: Colors.tint,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    bottomSpacer: {
      height: 160,
    },
  });
};
