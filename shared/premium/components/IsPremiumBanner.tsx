import { StyleSheet, Text, View } from "react-native";
import { useCustomTheme } from "../../context/CustomThemeContext";
import * as LucideIcons from "lucide-react-native";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "../../config/fonts";
import React from "react";

import { usePremiumContext } from "@/shared/context/PremiumContext";

export const IsPremiumBanner = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const { premiumStatus } = usePremiumContext();

  if (!premiumStatus.isPremium) return null;

  return (
    <View style={styles.activeContainer}>
      <View style={styles.activeHeader}>
        <View style={styles.crownBadge}>
          <LucideIcons.Crown size={16} color={Colors.gold} />
        </View>
        <Text style={styles.activeTitle}>ПРЕМИУМ АКТИВЕН</Text>
        <View style={styles.crownBadge}>
          <LucideIcons.Crown size={16} color={Colors.gold} />
        </View>
      </View>
    </View>
  );
};

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    activeContainer: {
      backgroundColor: Colors.accentBackground2,
      borderRadius: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors.gold,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    activeHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    crownBadge: {
      width: 26,
      height: 26,
      borderRadius: 18,
      backgroundColor: "rgba(255, 215, 0, 0.2)",
      justifyContent: "center",
      alignItems: "center",

      borderWidth: 1,
      borderColor: Colors.gold,
    },
    activeTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.gold,
      fontFamily: Fonts.bold.fontFamily,
      letterSpacing: 0.5,
      textAlign: "center",
    },
  });
};
