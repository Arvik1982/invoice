import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet } from "react-native";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React, { memo } from "react";
import { tabScreenHeaderContainer } from "@/shared/config/styles";
import PremiumCrawnBadge from "@/shared/components/PremiumCrawnBadge";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import { screenTitle } from "@/shared/constants/names";
import { TITLE_STYLES } from "@/shared/constants/styles";

const ProfileHeader = () => {
  const { themeObject } = useCustomTheme();
  const { premiumStatus } = usePremiumContext();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerMain}>
        <ThemedText type="title" style={styles.headerTitle}>
          {screenTitle.profile}
        </ThemedText>
        {premiumStatus.isPremium && <PremiumCrawnBadge />}
      </ThemedView>
    </ThemedView>
  );
};

export default memo(ProfileHeader);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    header: tabScreenHeaderContainer,
    headerTitle: TITLE_STYLES(Colors),
    headerMain: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
};
