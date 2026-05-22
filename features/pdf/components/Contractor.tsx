import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
type Props = {
  params: Invoice;
};
const Contractor = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionLabel}>ИСПОЛНИТЕЛЬ</ThemedText>
      <ThemedText style={styles.companyName}>
        {params.contractorDetails?.name}
      </ThemedText>
      <ThemedText style={styles.companyDetails}>
        Инн: {params.contractorDetails?.inn}
      </ThemedText>
      <ThemedText style={styles.companyDetails}>
        Бик: {params.contractorDetails?.bik}
      </ThemedText>
    </ThemedView>
  );
};
export default memo(Contractor);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
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
    companyName: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 6,
    },
    companyDetails: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.7,
      lineHeight: 20,
    },
    clientName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 8,
    },
    clientDetails: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.7,
      lineHeight: 20,
      marginBottom: 4,
    },
    servicesTable: {
      marginTop: 8,
    },
    tableHeader: {
      flexDirection: "row",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
    },
    tableHeaderText: {
      flex: 1,
      fontSize: 12,
      fontWeight: "600",
      color: Colors.text,
      opacity: 0.6,
      textTransform: "uppercase",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
      opacity: 0.9,
    },
    tableCell: {
      flex: 2,
      fontSize: 14,
      color: Colors.text,
    },
    tableCellCenter: {
      flex: 1,
      fontSize: 14,
      color: Colors.text,
      textAlign: "center",
    },
    tableCellRight: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: Colors.tint,
      textAlign: "right",
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
