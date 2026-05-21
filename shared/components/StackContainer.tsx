import { ColorPalette } from "@/types/configs";
import React, { memo, ReactNode } from "react";
import { StyleSheet } from "react-native";
import GradientBox from "./GradientBox";

import { useCustomTheme } from "../context/CustomThemeContext";
type Props = { children: ReactNode };

const StackContainer = ({ children }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <GradientBox
      colors={[Colors.backgroundItem, Colors.backgroundItemSecond]}
      style={styles.inputsStack}
    >
      {children}
    </GradientBox>
  );
};
export default memo(StackContainer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    inputsStack: {
      gap: 12,
      marginBottom: 6,
      backgroundColor: "transpaent",
      borderRadius: 18,
    },
  });
};
