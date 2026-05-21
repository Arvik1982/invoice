import { StyleSheet, Text, View } from "react-native";
import CardContainer from "../components/CardContainer";
import { formatCurrency } from "../lib/utils/formaters";
import { useCustomTheme } from "../context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import React from "react";

interface Props {
  label?: string;
  numberValue?: number;
  textValue?: string;
}

export const AccentField = ({ label, numberValue, textValue }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const isText = typeof textValue === "string";
  const isNumber = typeof numberValue === "number";

  return (
    <CardContainer
      colors={[Colors.accentBackground1, Colors.accentBackground4]}
      style={styles.totalContainer}
    >
      <View style={styles.totalContent}>
        {label && (
          <View style={styles.totalLabelContainer}>
            <Text style={styles.totalLabel}>{label}</Text>
          </View>
        )}
        {isNumber && (
          <Text style={styles.totalAmount}>
            {String(formatCurrency(numberValue))}
          </Text>
        )}
        {isText && <Text style={styles.totalAmount}>{textValue}</Text>}
      </View>
    </CardContainer>
  );
};

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    totalContainer: {
      borderRadius: 16,
      marginTop: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
    },

    totalContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    totalLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text,
      marginLeft: 8,
    },

    totalAmount: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.tint,
      letterSpacing: -0.5,
    },
  });
};
