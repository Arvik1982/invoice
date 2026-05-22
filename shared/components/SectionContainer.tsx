import * as LucideIcons from "lucide-react-native";
import React, { ReactNode, FC, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import ButtonGroup from "../ui/ButtonGroup";
import { router } from "expo-router";
import { invoiceItemTitleEnum } from "../constants/names";
import GradientBox from "./GradientBox";

type Props = {
  children: ReactNode;
  index?: number;
  title?: string;
  style?: any;
};

const SectionContainer: FC<Props> = ({ children, index, title, style }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const styles = getStyles(Colors);

  return (
    <Animated.View
      entering={FadeInDown.delay(index ? index : 1 * 100)}
      style={[styles.container, style]}
    >
      {/* Градиентный фон */}

      <GradientBox
        colors={[Colors.backgroundItem, Colors.backgroundItemSecond]}
        style={styles.gradientBackground}
      />
      <View style={styles.sectionContent}>
        <Animated.View
          entering={FadeIn.delay(index ? index : 1 * 100 + 100)}
          style={styles.header}
        >
          {/* Номер секции с небольшим акцентом */}
          <View style={styles.indexWrapper}>
            <LinearGradient
              colors={[Colors.gradientStart, Colors.gradientEnd]}
              style={styles.indexBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.indexText}>{index}</Text>
            </LinearGradient>
          </View>

          {/* Заголовок */}
          {title && <Text style={styles.title}>{title}</Text>}
        </Animated.View>

        <View style={styles.content}>{children}</View>

        {/* Кнопка "Выбрать из базы" в правом верхнем углу */}
        {title === invoiceItemTitleEnum.CLIENT && (
          <ButtonGroup
            variant="primary"
            title="Выбрать"
            activeOpacity={0.7}
            onPress={() => {
              router.navigate("/(tabs)/(stacks)/clients");
            }}
            style={styles.selectButton}
          >
            <LucideIcons.Database size={16} color="#FFFFFF" />
          </ButtonGroup>
        )}
      </View>
    </Animated.View>
  );
};

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: Colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 6,
    },

    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    sectionContent: {
      padding: 20,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    indexWrapper: {
      position: "relative",
    },

    indexBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    indexText: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
    },

    title: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
      letterSpacing: -0.3,
      flex: 1,
    },

    content: {
      // Контент внутри карточки
      backgroundColor: "transparent",
    },

    selectButton: {
      borderRadius: 20,
      position: "absolute",
      top: 15,
      right: 16,
      zIndex: 10,
      shadowColor: Colors.tint,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
      width: 110,
      height: 35,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },

    buttonIcon: {
      marginRight: 8,
    },

    buttonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
      letterSpacing: 0.2,
    },
  });
};

export default memo(SectionContainer);
