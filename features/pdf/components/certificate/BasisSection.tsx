import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

type Props = {
  basis?: string;
};

const BasisSection = ({ basis }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  if (!basis) return null;
  return (
    <ThemedView style={styles.basisSection}>
      <ThemedText style={styles.basisLabel}>ОСНОВАНИЕ</ThemedText>
      <ThemedText style={styles.basisText}>{basis}</ThemedText>
    </ThemedView>
  );
};
export default memo(BasisSection);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    basisSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
    },
    basisLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: Colors.text,
      opacity: 0.6,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    basisText: {
      fontSize: 14,
      color: Colors.text,
      lineHeight: 20,
    },
  });
};
