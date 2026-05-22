import React, { memo, ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ColorPalette, FontsType } from "@/types/configs";
import { Fonts } from "../config/fonts";
import { ThemedText } from "./ThemedText";
import { LABEL_TEXT_STYLES } from "../constants/styles";
import { useCustomTheme } from "../context/CustomThemeContext";
import * as LucideIcons from "lucide-react-native";

interface InputProps extends TextInputProps {
  error?: string;
  icon?: ReactNode;
  label?: string;
  editable?: boolean;

  containerStyle?: ViewStyle;
}

const InputField = ({
  icon,
  label,
  editable = false,
  containerStyle,
  error,
  ...inputProps
}: InputProps) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  return (
    <ThemedView style={[styles.infoField, containerStyle]}>
      <ThemedView style={styles.fieldHeader}>
        {!icon ? <LucideIcons.Activity size={20} color={Colors.tint} /> : icon}
        <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      </ThemedView>
      {editable ? (
        <TextInput
          {...inputProps}
          style={[styles.editableInput, inputProps.style]}
          placeholderTextColor={Colors.placeholderTextColor}
          cursorColor={Colors.tint}
          selectionColor={`${Colors.tint}40`}
        />
      ) : (
        <ThemedView style={styles.fieldValueContainer}>
          <Text style={styles.fieldValue} numberOfLines={1}>
            {inputProps.value}
          </Text>
        </ThemedView>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </ThemedView>
  );
};

export default memo(InputField);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    infoField: {
      backgroundColor: "transparent",
    },

    fieldHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: "transparent",
    },

    fieldLabel: LABEL_TEXT_STYLES(Colors),

    fieldValueContainer: {
      minHeight: 48,
      justifyContent: "center",
      backgroundColor: Colors.transparentWhite05,
      borderRadius: 12,
      // borderWidth: 1,
      // borderColor: Colors.borderLight,
      paddingHorizontal: 12,
      paddingVertical: 14,
    },

    fieldValue: {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.text,
      fontFamily: Fonts.medium?.fontFamily || Fonts.regular.fontFamily,
    },

    editableInput: {
      fontSize: 16,
      fontWeight: "500",
      color: Colors.text,
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
      fontFamily: Fonts.medium?.fontFamily || Fonts.regular.fontFamily,
      backgroundColor: Colors.transparentWhite05,
      minHeight: 48,
    },
    error: {
      fontSize: 12,
      marginTop: 4,
      color: Colors.gold,
      letterSpacing: 0.5,
    },
  });
};
