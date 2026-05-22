import { ThemedView } from "@/shared/ui/ThemedView";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { handleGoToCreateInvoice } from "../utils/handlers";
import * as LucideIcons from "lucide-react-native";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import React, { memo } from "react";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { Invoice } from "@/types/main";
import { FilterType } from "../types";
import { filteredInvoices } from "../utils/functions";

type Props = {
  filter: FilterType;
  invoices: Invoice[];
};

const EmptyInvicesList = ({ filter, invoices }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  if (filteredInvoices(filter, invoices).length !== 0) {
    return null;
  }
  return (
    <ThemedView style={styles.emptyContainer}>
      <ThemedView style={styles.emptyIcon}>
        <LucideIcons.FileText size={80} color="#666666" />
      </ThemedView>
      <Text style={styles.emptyTitle}>Счетов пока нет</Text>
      <Text style={styles.emptyText}>Сгенерируйте первый счёт</Text>
      <TouchableOpacity
        style={styles.goToInvoiceButton}
        onPress={handleGoToCreateInvoice}
        activeOpacity={0.8}
      >
        <Text style={styles.goToInvoiceButtonText}>
          Перейти к созданию счёта
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default memo(EmptyInvicesList);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingTop: 100,
      marginBottom: 25,
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
  });
};
