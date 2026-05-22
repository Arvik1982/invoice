import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  params: Invoice;
};

const SignaturesSection = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.signaturesSection}>
      <View style={styles.signatureBlock}>
        <ThemedText style={styles.signatureTitle}>ИСПОЛНИТЕЛЬ:</ThemedText>
        <View style={styles.signatureLine} />
        <ThemedText style={styles.signatureName}>
          {params.contractorDetails?.name}
        </ThemedText>
        <ThemedText style={styles.signatureDetails}>
          {params.contractorDetails?.type === "ul"
            ? "Юридическое лицо"
            : "Физическое лицо"}
        </ThemedText>
        <ThemedText style={styles.signatureStamp}>М.П.</ThemedText>
      </View>

      <View style={styles.signatureBlock}>
        <ThemedText style={styles.signatureTitle}>ЗАКАЗЧИК:</ThemedText>
        <View style={styles.signatureLine} />
        <ThemedText style={styles.signatureName}>
          {params.invoiceDetails?.client.clientName}
        </ThemedText>
        <ThemedText style={styles.signatureDetails}>
          {params.invoiceDetails?.client.type === "ul"
            ? "Юридическое лицо"
            : "Физическое лицо"}
        </ThemedText>
        <ThemedText style={styles.signatureStamp}>М.П.</ThemedText>
      </View>
    </ThemedView>
  );
};
export default memo(SignaturesSection);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    signaturesSection: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    signatureBlock: {
      flex: 1,
      marginHorizontal: 8,
    },
    signatureTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 12,
    },
    signatureLine: {
      height: 1,
      backgroundColor: Colors.text,
      opacity: 0.3,
      marginBottom: 8,
    },
    signatureName: {
      fontSize: 13,
      color: Colors.text,
      marginTop: 4,
    },
    signatureDetails: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.7,
      marginTop: 2,
    },
    signatureStamp: {
      fontSize: 11,
      color: Colors.text,
      opacity: 0.5,
      marginTop: 16,
      fontStyle: "italic",
    },
  });
};
