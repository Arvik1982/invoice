import { CustomTheme } from "@/shared/config/theme";
import { StyleSheet } from "react-native";

export default function getLayoutStyles(theme?: CustomTheme) {
  if (!theme) return StyleSheet.create({ safeAreaStyles: { flex: 1 } });
  console.warn({ theme });
  return StyleSheet.create({
    safeAreaStyles: { flex: 1, backgroundColor: theme.colors.background },
  });
}
