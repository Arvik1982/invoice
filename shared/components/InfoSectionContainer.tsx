import { StyleSheet, View } from "react-native";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React, { FC, memo, ReactNode } from "react";
import { ColorPalette } from "@/types/configs";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  children: ReactNode;
  index: number;
  style?: any;
};
const InfoSectionContainer: FC<Props> = ({ children, index, style }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      style={[styles.invoiceCard, style]}
    >
      <View style={styles.cardContainer}>{children}</View>
    </Animated.View>
  );
};

export default memo(InfoSectionContainer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // Делаем градиент прозрачным, если нужно его оставить
      opacity: 0,
    },

    invoiceCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 20,
      overflow: "hidden",

      backgroundColor: Colors.sectionBackground1,
      shadowColor: "#533e3e",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
    },

    cardContainer: {
      padding: 20,
      backgroundColor: "transparent",
    },
  });
};
