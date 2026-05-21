import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatCurrency } from "@/shared/lib/utils/formaters";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  params: Invoice;
};

const CertificateServices = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={[styles.section, styles.sectionLast]}>
      <ThemedText style={styles.sectionLabel}>
        ВЫПОЛНЕННЫЕ РАБОТЫ / ОКАЗАННЫЕ Услуги
      </ThemedText>
      <View style={styles.servicesTable}>
        <View style={styles.tableHeader}>
          <ThemedText style={styles.tableHeaderText}>№</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Наименование</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Кол-во</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Цена</ThemedText>
          <ThemedText style={styles.tableHeaderText}>Сумма</ThemedText>
        </View>

        {params.invoiceDetails?.services.map((service, index) => (
          <View key={service.id} style={styles.tableRow}>
            <ThemedText style={styles.tableCellNumber}>{index + 1}</ThemedText>
            <ThemedText style={styles.tableCellName}>
              {service.ServiceItem}
            </ThemedText>
            <ThemedText style={styles.tableCellQuantity}>
              {service.quantity}
            </ThemedText>
            <ThemedText style={styles.tableCellPrice}>
              {formatCurrency(service.price)}
            </ThemedText>
            <ThemedText style={styles.tableCellSum}>
              {formatCurrency(service.price * service.quantity)}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
};
export default memo(CertificateServices);

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
    servicesTable: {
      marginTop: 8,
      width: "100%",
    },
    tableHeader: {
      flexDirection: "row",
      paddingVertical: 8,
      justifyContent: "space-between",
    },
    tableHeaderText: {
      fontSize: 11,
      fontWeight: "600",
      color: Colors.text,
      opacity: 0.6,
      textTransform: "uppercase",
      flex: 1,
      textAlign: "center",
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
      alignItems: "center",
    },
    tableCellNumber: {
      fontSize: 13,
      color: Colors.text,
      flex: 0.5,
      textAlign: "center",
    },
    tableCellName: {
      fontSize: 13,
      color: Colors.text,
      flex: 3,
      paddingHorizontal: 4,
    },
    tableCellQuantity: {
      fontSize: 13,
      color: Colors.text,
      flex: 1,
      textAlign: "center",
    },
    tableCellPrice: {
      fontSize: 13,
      color: Colors.text,
      flex: 1.5,
      textAlign: "right",
      paddingHorizontal: 4,
    },
    tableCellSum: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.tint,
      flex: 1.5,
      textAlign: "right",
      paddingHorizontal: 4,
    },
  });
};
