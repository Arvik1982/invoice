import { useCustomTheme } from "@/shared/context/CustomThemeContext";

import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";

import React, { FC, memo, ReactNode } from "react";
import { ScrollView, StyleSheet } from "react-native";

const PreviewWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ПРЕВЬЮ СЧЁТА */}
      <ThemedView style={styles.previewCard}>{children}</ThemedView>
    </ScrollView>
  );
};
export default memo(PreviewWrapper);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    scrollView: {
      flex: 1,
      marginBottom: 30,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 140,
    },
    previewCard: {
      backgroundColor: Colors.background,
      borderRadius: 12,
      overflow: "hidden",
    },
  });
};
