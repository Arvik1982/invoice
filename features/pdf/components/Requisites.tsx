import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { copyToClipboard } from "@/shared/lib/functions/copyToClipboard";

import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Invoice } from "@/types/main";

import * as LucideIcons from "lucide-react-native";
import React, { memo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  params: Invoice;
};

const Requisites = ({ params }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const [copied, setCopied] = useState(false);

  const handleCopyDetails = async () => {
    const success = await copyToClipboard(
      {
        Исполнитель: params?.contractorDetails?.name,
        Инн: params?.contractorDetails?.inn,
        Банк: params?.contractorDetails?.bankName,
        Бик: params?.contractorDetails?.bik,
        "Расчётный счёт": params?.contractorDetails?.accountNumber || "",
      },
      "Реквизиты скопированы в буфер обмена"
    );

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <ThemedView style={styles.detailsSection}>
        {params?.contractorDetails?.bankName && (
          <ThemedText style={styles.detailsText}>
            Банк: {params?.contractorDetails?.bankName || ""}
          </ThemedText>
        )}
        <ThemedText style={styles.detailsText}>
          Бик: {params?.contractorDetails?.accountNumber || ""}
        </ThemedText>
        <ThemedText style={styles.detailsText}>
          Расчётный счёт: {params?.contractorDetails?.accountNumber || ""}
        </ThemedText>
        <ThemedText style={styles?.detailsText}>
          Инн: {params?.contractorDetails?.inn}
        </ThemedText>
        {/* <ThemedText style={styles.detailsNote}>
          Счёт действителен в течение 5 банковских дней
        </ThemedText> */}
        <ThemedText style={styles.signature}>
          Подпись исполнителя: _____________
        </ThemedText>
      </ThemedView>

      {/* Кнопка копирования реквизитов */}
      <TouchableOpacity style={styles.copyButton} onPress={handleCopyDetails}>
        <LucideIcons.CopyIcon size={18} color={Colors.tint} />

        <ThemedText style={styles.copyButtonText}>
          Копировать реквизиты
        </ThemedText>
      </TouchableOpacity>
    </>
  );
};

export default memo(Requisites);

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
