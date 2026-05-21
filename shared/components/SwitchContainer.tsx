import { ColorPalette } from "@/types/configs";
import React, { memo, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import GradientBox from "./GradientBox";
import { gradientBoxColors } from "../constants/colors";
import { useCustomTheme } from "../context/CustomThemeContext";
type Props = { children: ReactNode; title: string; text: string };

const SwitchContainer = ({ children, title, text }: Props) => {
  const { theme, themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <GradientBox
      colors={gradientBoxColors(theme)}
      style={styles.switchContainer}
    >
      <View style={styles.switchContent}>
        <View style={styles.switchTextContainer}>
          <Text style={styles.switchTitle}>{title}</Text>
          <Text style={styles.switchDescription}>{text}</Text>
        </View>
        {children}
      </View>
    </GradientBox>
  );
};
export default memo(SwitchContainer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    switchContainer: {
      borderRadius: 16,
      marginTop: 8,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    switchContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },

    switchTextContainer: {
      flex: 1,
      paddingRight: 16,
    },

    switchTitle: {
      color: Colors.text,
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 4,
    },

    switchDescription: {
      color: Colors.notesText,
      fontSize: 13,
      lineHeight: 18,
    },
  });
};
