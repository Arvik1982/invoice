import { ColorPalette } from "@/types/configs";
import { TextStyle, ViewStyle } from "react-native";
import { Fonts } from "../config/fonts";

export const SMALL_BUTTON_STYLES = (Colors: ColorPalette): TextStyle => {
  return {
    color: Colors.tint,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  };
};

export const LABEL_TEXT_STYLES = (Colors: ColorPalette): TextStyle => {
  return {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textQuaternary,
    marginLeft: 10,
    letterSpacing: 0.5,
    fontFamily: Fonts.semiBold?.fontFamily || Fonts.regular.fontFamily,
  };
};

export const TITLE_STYLES = (Colors: ColorPalette): TextStyle => {
  return {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.text,
    fontFamily: Fonts.bold.fontFamily,
    position: "relative",
    paddingLeft: 8,
    letterSpacing: 0.8,
  };
};

export const FIELD_STYLES = (Colors: ColorPalette): ViewStyle => {
  return {
    padding: 20,
    borderRadius: 16,
    overflow: "hidden",
  };
};
