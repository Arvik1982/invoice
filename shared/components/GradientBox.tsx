import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { useCustomTheme } from "../context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { ReactNode } from "react";
import { ColorValue } from "react-native";

export interface GradientProps extends LinearGradientProps {
  children: ReactNode;
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

export default function GradientBox({
  children,
  colors,
  start,
  end,
  ...rest
}: Partial<GradientProps>) {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;

  return (
    <LinearGradient
      {...rest}
      colors={colors || [Colors.sectionBackground1, Colors.sectionBackground2]}
      start={start || { x: 0, y: 0 }}
      end={end || { x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
