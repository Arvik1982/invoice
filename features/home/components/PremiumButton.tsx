import { SMALL_BUTTON_STYLES as SMALL_BUTTON_ACCENT_STYLES } from "@/shared/constants/styles";
import { useAppContext } from "@/shared/context/AppContext";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import PremiumCrawnBadge from "@/shared/components/PremiumCrawnBadge";
import { usePremiumContext } from "@/shared/context/PremiumContext";

const PremiumButton = () => {
  const { themeObject } = useCustomTheme();

  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const { getPremiumFunc, premiumStatus } = usePremiumContext();
  const hadleSavePremium = () => {
    getPremiumFunc();
  };

  if (premiumStatus.isPremium) return <PremiumCrawnBadge />;

  return (
    <TouchableOpacity
      style={styles.premiumButton}
      activeOpacity={0.7}
      onPress={hadleSavePremium}
    >
      <Ionicons name="diamond-outline" size={14} color={Colors.tint} />
      <Text style={styles.premiumText}>Купить</Text>
    </TouchableOpacity>
  );
};

export default memo(PremiumButton);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    premiumButton: {
      flexDirection: "row",
      gap: 3,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: Colors.background,
      width: 100,
      height: 36,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: Colors.borderAccent,
      paddingHorizontal: 14,
      // Современный эффект
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
      marginBottom: 4,
    },

    premiumText: SMALL_BUTTON_ACCENT_STYLES(Colors),
  });
};
