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

const CertificateTotal = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  // Функция для преобразования суммы прописью (упрощенная)
  const numberToWords = (num: number): string => {
    // Здесь можно реализовать функцию или использовать библиотеку
    // Для простоты вернем заглушку
    return `${num} рублей`;
  };

  const total = params.invoiceDetails?.totalSumm || 0;

  return (
    <ThemedView style={styles.totalSection}>
      <ThemedText style={styles.totalLabel}>
        Всего выполнено работ (оказано услуг) на сумму:
      </ThemedText>
      <ThemedText style={styles.totalWords}>{numberToWords(total)}</ThemedText>
      <View style={styles.totalRow}>
        <ThemedText style={styles.totalLabel}>Итого:</ThemedText>
        <ThemedText style={styles.totalAmount}>
          {formatCurrency(total)}
        </ThemedText>
      </View>
    </ThemedView>
  );
};
export default memo(CertificateTotal);

const { View } = require("react-native");

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    totalSection: {
      padding: 20,
      backgroundColor: Colors.backgroundItemSecond,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 8,
    },
    totalWords: {
      fontSize: 13,
      color: Colors.text,
      opacity: 0.8,
      lineHeight: 18,
      marginBottom: 16,
      fontStyle: "italic",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    totalAmount: {
      fontSize: 20,
      fontWeight: "800",
      color: Colors.tint,
    },
  });
};
