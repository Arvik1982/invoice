import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet } from "react-native";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React, { memo } from "react";
import { tabScreenHeaderContainer } from "@/shared/config/styles";
import PremiumCrawnBadge from "@/shared/components/PremiumCrawnBadge";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import { screenTitle } from "@/shared/constants/names";
import { TITLE_STYLES } from "@/shared/constants/styles";

const TaxesHeader = () => {
  const { themeObject } = useCustomTheme();
  const { premiumStatus } = usePremiumContext();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.headerMain}>
        <ThemedText type="title" style={styles.headerTitle}>
          {screenTitle.taxes}
        </ThemedText>
        {premiumStatus.isPremium && <PremiumCrawnBadge />}
      </ThemedView>
    </ThemedView>
  );
};

export default memo(TaxesHeader);

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
