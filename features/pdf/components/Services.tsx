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
const Services = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={[styles.section, , styles.sectionLast]}>
      <ThemedText style={styles.sectionLabel}>Услуги</ThemedText>
      <View style={styles.servicesTable}>
        <View style={styles.tableHeader}>
          <View>
            <ThemedText style={styles.tableHeaderText}>Наименование</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.tableHeaderText}>Кол-во</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.tableHeaderText}>Сумма</ThemedText>
          </View>
        </View>

        {params.invoiceDetails?.services.map((service, index) => (
          <View key={service.id} style={styles.tableRow}>
            <ThemedText style={styles.tableCell}>
              {service.ServiceItem}
            </ThemedText>
            <ThemedText style={styles.tableCellCenter}>
              ×{service.quantity}
            </ThemedText>
            <ThemedText style={styles.tableCellRight}>
              {formatCurrency(service.price)}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
};
export default memo(Services);
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
      // borderBottomWidth: 1,
      // borderBottomColor: Colors.borderColor,
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
  });
};
