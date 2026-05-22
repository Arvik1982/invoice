import { StyleSheet } from "react-native";
import GradientBox from "./GradientBox";
import * as LucideIcons from "lucide-react-native";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "../context/CustomThemeContext";
import React, { memo } from "react";
import { Fonts } from "../config/fonts";
const GradientIcon = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  return (
    <GradientBox
      colors={[Colors.accentBackground2, Colors.accentBackground3]}
      style={styles.sertIconContainer}
    >
      <LucideIcons.Sheet size={20} color={Colors.tint} />
    </GradientBox>
  );
};

export default memo(GradientIcon);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    sertToggleContainer: {
      borderRadius: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: Colors.borderLight,
      overflow: "hidden",
    },

    sertToggleContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },

    sertIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
      shadowColor: Colors.tint,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    sertToggleInfo: {
      flex: 1,
      marginRight: 12,
    },

    sertToggleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold.fontFamily,
      marginBottom: 2,
      letterSpacing: -0.2,
    },

    sertToggleDescription: {
      fontSize: 13,
      color: Colors.textTertiary,
      fontFamily: Fonts.regular.fontFamily,
      lineHeight: 16,
    },

    switchContainer: {
      // Для правильного позиционирования Switch
    },
  });
};
