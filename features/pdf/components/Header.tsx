import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";
import React, { memo, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const Header = () => {
  const [showPdfPreview, setShowPdfPreview] = useState(true);
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  if (!showPdfPreview) router.back();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.info}>
        <TouchableOpacity
          hitSlop={{ ...styles.backButton }}
          style={{
            alignItems: "center",
          }}
          onPress={() => router.navigate("/(tabs)/history")}
        >
          <ThemedView>
            <ChevronLeftIcon size={35} color={Colors.text} />
          </ThemedView>
        </TouchableOpacity>

        <ThemedText style={styles.text}>Предпросмотр</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
export default memo(Header);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
    },
    info: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.background,
      borderRadius: 12,
    },
    text: {
      fontSize: 14,
      color: Colors.text,
      textAlign: "center",
      flex: 1,
    },
    backButton: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 50,
    },
  });
};
