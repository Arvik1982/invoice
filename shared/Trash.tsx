import { StyleSheet, TouchableOpacity } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ColorPalette } from "@/types/configs";
import React from "react";
import { useCustomTheme } from "./context/CustomThemeContext";

export const Trash = ({ onPress }: { onPress: any }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LucideIcons.Trash2 size={20} color="#FF3B30" opacity={0.9} />
    </TouchableOpacity>
  );
};
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
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
  });
};
