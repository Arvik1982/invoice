import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatCurrency } from "@/shared/lib/utils/formaters";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";

import React, { memo } from "react";
import { StyleSheet } from "react-native";

type Props = {
  params: Invoice;
};

const Total = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.totalSection}>
      <ThemedText style={styles.totalLabel}>ИТОГО К ОПЛАТЕ:</ThemedText>
      <ThemedText style={styles.totalAmount}>
        {formatCurrency(params.invoiceDetails?.totalSumm)}
      </ThemedText>
    </ThemedView>
  );
};
export default memo(Total);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 140,
    },
    previewCard: {
      backgroundColor: Colors.background,
      borderRadius: 12,
      overflow: "hidden",
    },

    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
    },
    sectionLast: {
      padding: 20,
      borderBottomWidth: 0,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors.text,
      opacity: 0.6,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    totalSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      backgroundColor: Colors.backgroundItemSecond,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: "800",
      color: Colors.tint,
    },
    detailsSection: {
      padding: 20,
    },
    detailsText: {
      fontSize: 13,
      color: Colors.text,
      opacity: 0.7,
      lineHeight: 18,
      marginBottom: 6,
    },
    detailsNote: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.6,
      fontStyle: "italic",
      marginTop: 12,
      marginBottom: 16,
    },
    signature: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      marginTop: 16,
    },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: Colors.backgroundItemSecond,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    copyButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.tint,
      marginLeft: 8,
    },
  });
};
