import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import Client from "../components/Client";
import Services from "../components/Services";
import InvoiceWrapper from "../components/InvoiceWrapper";
import InvoiceToggleBox from "../components/InvoiceToggleBox";

export default function CreateInvoiceScreen() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={styles.container}>
      <InvoiceWrapper>
        <Client />
        <Services />
        <InvoiceToggleBox />
      </InvoiceWrapper>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
  });
};
