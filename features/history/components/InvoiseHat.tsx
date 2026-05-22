import { Fonts } from "@/shared/config/fonts";
import { tabScreenHeaderContainer } from "@/shared/config/styles";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { useAppContext } from "@/shared/context/AppContext";
import PremiumCrawnBadge from "@/shared/components/PremiumCrawnBadge";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import { screenTitle } from "@/shared/constants/names";
import { TITLE_STYLES } from "@/shared/constants/styles";

const InvoicesHat = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { premiumStatus } = usePremiumContext();

  return (
    <ThemedView style={styles.headerMain}>
      <ThemedText type="title" style={styles.headerTitle}>
        {screenTitle.history}
      </ThemedText>

      {premiumStatus.isPremium && <PremiumCrawnBadge />}
    </ThemedView>
  );
};

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    headerMain: tabScreenHeaderContainer,

    headerTitle: TITLE_STYLES(Colors),
  });
};
export default memo(InvoicesHat);
