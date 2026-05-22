import { ColorPalette } from "@/types/configs";
import GradientBox from "../components/GradientBox";
import { Fonts } from "../config/fonts";
import { StyleSheet, Text } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useCustomTheme } from "../context/CustomThemeContext";
import React, { memo, ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  text: string;
}

const InfoBox = ({ text, icon }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <GradientBox
      colors={[Colors.accentBackground1, Colors.accentBackground2]}
      style={styles.noteCard}
    >
      {!icon ? (
        <LucideIcons.AlertCircle size={20} color={Colors.tint} opacity={0.6} />
      ) : (
        icon
      )}
      <Text style={styles.noteText}>{text}</Text>
    </GradientBox>
  );
};
export default memo(InfoBox);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    noteContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      padding: 12,
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },
    noteCard: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
      gap: 12,
    },

    noteText: {
      fontSize: 14,
      color: Colors.textQuaternary,
      flex: 1,
      fontFamily: Fonts.regular.fontFamily,
      lineHeight: 20,
    },
  });
};
