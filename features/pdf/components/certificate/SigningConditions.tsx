import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { memo } from "react";
import { StyleSheet } from "react-native";

const SigningConditions = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={styles.conditionsSection}>
      <ThemedText style={styles.conditionsTitle}>
        УСЛОВИЯ ВЫПОЛНЕНИЯ РАБОТ (ОКАЗАНИЯ УСЛУГ):
      </ThemedText>
      <ThemedText style={styles.condition}>
        1. Работы выполнены в полном объеме и в установленные сроки.
      </ThemedText>
      <ThemedText style={styles.condition}>
        2. Заказчик претензий к объему, качеству и срокам выполнения работ
        (оказания услуг) не имеет.
      </ThemedText>
      <ThemedText style={styles.condition}>
        3. Настоящий Акт составлен в двух экземплярах, имеющих одинаковую
        юридическую силу, по одному для каждой из Сторон.
      </ThemedText>
    </ThemedView>
  );
};
export default memo(SigningConditions);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    conditionsSection: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borderColor,
    },
    conditionsTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 12,
    },
    condition: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.8,
      lineHeight: 18,
      marginBottom: 6,
    },
  });
};
