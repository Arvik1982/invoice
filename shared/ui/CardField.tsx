import { StyleSheet, Text, View } from "react-native";

import React, { memo, ReactNode } from "react";
import { useCustomTheme } from "../context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { LABEL_TEXT_STYLES } from "../constants/styles";
import CardContainer from "../components/CardContainer";
import { Fonts } from "../config/fonts";
import * as LucideIcons from "lucide-react-native";
interface CardFieldProps {
  icon?: ReactNode;
  text: string;
  error?: string;
  label: string;
}

const CardField = ({ icon, error, text, label }: CardFieldProps) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <CardContainer style={{ minHeight: 110 }}>
      <View style={styles.servicesHeader}>
        {!icon ? (
          <View style={styles.clientIcon}>
            <LucideIcons.Info size={16} color={Colors.text} opacity={0.7} />
          </View>
        ) : (
          <View style={styles.clientIcon}>{icon}</View>
        )}
        <Text style={styles.clientLabel}>{label}</Text>
      </View>
      <Text style={styles.servicesText} numberOfLines={2}>
        {text}
      </Text>
    </CardContainer>
  );
};
export default memo(CardField);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    clientLabel: LABEL_TEXT_STYLES(Colors),
    servicesHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },

    servicesTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold.fontFamily,
      letterSpacing: -0.2,
    },

    servicesText: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.9,
      lineHeight: 20,
      fontFamily: Fonts.semiBold.fontFamily,
      letterSpacing: -0.2,
    },

    totalContent: {
      height: 50,
      padding: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabel: {
      fontSize: 16,
      color: Colors.text,

      fontFamily: Fonts.semiBold.fontFamily,
    },

    totalAmount: {
      fontSize: 24,
      fontWeight: "800",
      color: Colors.tint,
      fontFamily: Fonts.bold.fontFamily,
      letterSpacing: -0.5,
    },

    secondaryActions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      paddingTop: 16,
    },

    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.08)",
    },
    clientIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: "rgba(254, 89, 0, 0.12)",
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
