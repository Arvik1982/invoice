import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { useCustomTheme } from "../context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "@/shared/config/fonts";
import { LinearGradient } from "expo-linear-gradient";
import GradientBox from "../components/GradientBox";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

const ButtonGroup = ({
  title,
  variant = "secondary",
  loading,
  children,
  style,
  ...buttonProps
}: ButtonProps) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors!), [Colors]);

  if (loading) {
    return (
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          variant === "primary"
            ? styles.primaryContainer
            : styles.secondaryContainer,
          style,
        ]}
        disabled
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[Colors!.transparentWhite08!, Colors!.transparentWhite05!]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.loadingText}>Загрузка...</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        variant === "primary"
          ? styles.primaryContainer
          : styles.secondaryContainer,
        style,
      ]}
      {...buttonProps}
      activeOpacity={0.7}
    >
      {variant === "primary" ? (
        <GradientBox
          colors={[Colors!.gradientStart!, Colors!.gradientEnd!]}
          style={styles.buttonGradient}
        >
          <View style={styles.buttonInner}>
            {children}
            <Text style={styles.primaryButtonText}>{title}</Text>
          </View>
        </GradientBox>
      ) : (
        <GradientBox
          style={styles.buttonGradient}
          colors={[Colors!.transparentWhite08!, Colors!.transparentWhite05!]}
        >
          <View style={styles.buttonInner}>
            {children}
            <Text style={styles.secondaryButtonText}>{title}</Text>
          </View>
        </GradientBox>
      )}
    </TouchableOpacity>
  );
};

export default memo(ButtonGroup);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    buttonContainer: {
      flex: 1,
      borderRadius: 14,
      overflow: "hidden",
      shadowColor: Colors.cardShadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },

    primaryContainer: {
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },

    secondaryContainer: {
      borderWidth: 1,
      borderColor: Colors.borderAccent,
    },

    buttonGradient: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 20,
      minHeight: 56,
      justifyContent: "center",
    },

    buttonInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "transparent",
    },

    primaryButtonText: {
      backgroundColor: "transparent",
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold?.fontFamily || Fonts.regular.fontFamily,
      letterSpacing: -0.2,
    },

    secondaryButtonText: {
      backgroundColor: "transparent",
      fontSize: 16,
      fontWeight: "600",
      color: Colors.tint,
      fontFamily: Fonts.semiBold?.fontFamily || Fonts.regular.fontFamily,
      letterSpacing: -0.2,
    },

    loadingText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.textSecondary,
      fontFamily: Fonts.semiBold?.fontFamily || Fonts.regular.fontFamily,
      opacity: 0.7,
    },
  });
};
