import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatPhone } from "@/shared/lib/utils/formaters";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
type Props = {
  params: Invoice;
};

const Client = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  return (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionLabel}>Заказчик</ThemedText>
      <ThemedText style={styles.clientLabel}>Название организации:</ThemedText>
      <ThemedText style={styles.clientName}>
        {params.invoiceDetails?.client.clientName}
      </ThemedText>
      {params.invoiceDetails?.client.inn && (
        <>
          <ThemedText style={styles.clientLabel}>Инн:</ThemedText>

          <ThemedText style={styles.clientName}>
            {params.invoiceDetails?.client.inn}
          </ThemedText>
        </>
      )}
      {params.invoiceDetails?.client.phone && (
        <>
          <ThemedText style={styles.clientLabel}>Телефон:</ThemedText>
          <ThemedText style={styles.clientName}>
            {formatPhone(params.invoiceDetails?.client.phone)}
          </ThemedText>
        </>
      )}
      {params.invoiceDetails?.client.email && (
        <>
          <ThemedText style={styles.clientLabel}>Эл. почта:</ThemedText>
          <ThemedText style={styles.clientName}>
            {params.invoiceDetails?.client.email}
          </ThemedText>
        </>
      )}
    </ThemedView>
  );
};
export default memo(Client);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
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

    clientName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 8,
    },

    clientLabel: {
      fontSize: 13,
      color: Colors.text,
      opacity: 0.7,
      lineHeight: 18,
    },
    clientDetails: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.7,
      lineHeight: 20,
      marginBottom: 4,
    },
  });
};
