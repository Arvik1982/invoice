import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { Invoice } from "@/types/main";
import React, { memo } from "react";
import * as LucideIcons from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ColorPalette } from "@/types/configs";
import { sharePdf } from "@/shared/lib/functions/sharePdf";
import { useLocalSearchParams } from "expo-router";

const Sertificate = ({ params }: { params: Invoice }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!params.invoiceDetails?.invoiceEnabled) return null;

  const handleCertificateSend = async () => {
    try {
      await sharePdf(
        id,
        {
          fileName: `Счет_${id}.pdf`,
          shareTitle: "Отправить счет",
          showAlert: true,
        },
        true,
      );
    } catch {
      console.error("Error:handleCertificateSend");
    }
  };

  return (
    <>
      <ThemedView style={styles.sertSection}>
        <ThemedText style={styles.sertText}>sert</ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={styles.sendButton}
        onPress={handleCertificateSend}
      >
        <LucideIcons.Send size={18} color={Colors.tint} />
        <ThemedText style={styles.sertSendButtonText}>Отправить</ThemedText>
      </TouchableOpacity>
    </>
  );
};

export default memo(Sertificate);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    sertSection: {
      alignItems: "center",
      padding: 24,
    },
    sertText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 4,
    },
    sertNote: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.6,
    },
    sertSendButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.tint,
      marginLeft: 8,
    },
    sendButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: Colors.backgroundItemSecond,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
  });
};
