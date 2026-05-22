import { ColorPalette } from "@/types/configs";
import React, { ComponentProps, memo, ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyle,
  EntryOrExitLayoutType,
  FadeInDown,
} from "react-native-reanimated";
import { useCustomTheme } from "../context/CustomThemeContext";

interface Props extends ComponentProps<typeof Animated.View> {
  entering?: EntryOrExitLayoutType | undefined;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  children: ReactNode;
}

const AnimatedContainer = ({ children, style, entering }: Props) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  return (
    <Animated.View
      entering={
        entering
          ? entering
          : FadeInDown.delay(300).duration(500).springify().damping(12)
      }
      style={[style, styles.sectionWrapper]}
    >
      {children}
    </Animated.View>
  );
};
export default memo(AnimatedContainer);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    sectionWrapper: {
      marginBottom: 20,
    },
  });
};
