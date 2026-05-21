import { View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ThemedText } from "../ui/ThemedText";

import { useCustomTheme } from "../context/CustomThemeContext";
import React from "react";

export default function PremiumCrawnBadge() {
  const { themeObject } = useCustomTheme();

  const Colors = themeObject?.colors;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 5 }}>
      <LucideIcons.Crown size={20} color={Colors.gold} />
      <ThemedText style={{ color: "gold", alignItems: "flex-end" }}>
        Pro
      </ThemedText>
    </View>
  );
}
