import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatDate } from "@/shared/lib/utils/formaters";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

type Props = {
  params: Invoice;
};

const InvoiceHeader = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.invoiceHeader}>
      <ThemedText style={styles.invoiceTitle}>СЧЕТ НА ОПЛАТУ</ThemedText>
      <ThemedText style={styles.invoiceNumber}>
        №{params.invoiceNumber}
      </ThemedText>
      <ThemedText style={styles.invoiceDate}>
        от {formatDate(params.date)}
      </ThemedText>
    </ThemedView>
  );
};
export default memo(InvoiceHeader);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    invoiceHeader: {
      padding: 20,
      backgroundColor: Colors.backgroundItemSecond,
      alignItems: "center",
    },
    invoiceTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    invoiceNumber: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.tint,
      marginBottom: 4,
    },
    invoiceDate: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.6,
    },
  });
};
