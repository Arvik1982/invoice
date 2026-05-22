import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";

import { StyleSheet } from "react-native";

import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React from "react";
import { tabScreenHeaderContainer } from "@/shared/config/styles";
import { Fonts } from "@/shared/config/fonts";
import PremiumButton from "./PremiumButton";
import { screenTitle } from "@/shared/constants/names";
import { TITLE_STYLES } from "@/shared/constants/styles";

export default function HeaderBox() {
  const { themeObject } = useCustomTheme();

  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.topBox}>
      <ThemedView style={styles.topBoxLeft}>
        <ThemedText style={styles.pageTitle} type="defaultMedium">
          {screenTitle.home}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.topBoxRight}>
        <PremiumButton />
      </ThemedView>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    topBox: {
      ...tabScreenHeaderContainer,
      backgroundColor: Colors.background,
      paddingVertical: 8,
    },

    topBoxLeft: {
      height: 40,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },

    pageTitle: TITLE_STYLES(Colors),

    topBoxRight: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      alignContent: "center",
      width: 90,
      height: 40,
    },
  });
};
