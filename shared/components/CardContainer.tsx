import { ColorPalette } from "@/types/configs";
import React, { FC, memo, ReactNode } from "react";
import { ColorValue, StyleProp, StyleSheet, ViewStyle } from "react-native";
import GradientBox from "./GradientBox";
import { gradientBoxColors } from "../constants/colors";
import { useCustomTheme } from "../context/CustomThemeContext";
import { LinearGradientProps } from "expo-linear-gradient";

interface Props extends Partial<LinearGradientProps> {
  children: ReactNode;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  style?: StyleProp<ViewStyle>;
}

const CardContainer: FC<Props> = ({
  children,
  colors,
  style,
  ...rest
}: Props) => {
  const { theme, themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const styles = getStyles(Colors);

  return (
    <GradientBox
      {...rest}
      colors={colors || gradientBoxColors(theme)}
      style={[style, styles.inputCard]}
    >
      {children}
    </GradientBox>
  );
};
export default memo(CardContainer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    inputCard: {
      padding: 20,
      borderRadius: 16,
      overflow: "hidden",
      // position: "relative",
    },
  });
};
