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
  certificateBasis?: string;
};

const CertificateHat = ({ params, certificateBasis }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.certificateHeader}>
      <ThemedText style={styles.certificateTitle}>
        АКТ ВЫПОЛНЕННЫХ РАБОТ
      </ThemedText>
      <ThemedText style={styles.certificateNumber}>
        №{params.invoiceNumber}
      </ThemedText>
      <ThemedText style={styles.certificateDate}>
        от {formatDate(params.date)}
      </ThemedText>

      {certificateBasis && (
        <ThemedText style={styles.certificateBasis}>
          Основание: {certificateBasis}
        </ThemedText>
      )}
    </ThemedView>
  );
};
export default memo(CertificateHat);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    certificateHeader: {
      padding: 20,
      backgroundColor: Colors.backgroundItemSecond,
      alignItems: "center",
    },
    certificateTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    certificateNumber: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.tint,
      marginBottom: 4,
    },
    certificateDate: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.6,
      marginBottom: 8,
    },
    certificateBasis: {
      fontSize: 13,
      color: Colors.text,
      opacity: 0.8,
      textAlign: "center",
      marginTop: 8,
      fontStyle: "italic",
    },
  });
};
