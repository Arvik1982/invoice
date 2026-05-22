import { ColorPalette } from "@/types/configs";
import React, { ReactNode } from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { useCustomTheme } from "../context/CustomThemeContext";
interface Props extends ScrollViewProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
export default function ScreenScrollContainer({
  children,
  contentContainerStyle,
  ...rest
}: Props) {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ScrollView
      {...rest}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        contentContainerStyle && contentContainerStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 100,
    },
  });
};
