import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { useState, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FilterType } from "../types";
import { ColorPalette } from "@/types/configs";

type Props = {
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

export default function InvoiceListFilter({ filter, setFilter }: Props) {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const styles = useMemo(() => getStyles(Colors), [Colors]);

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const filterFieldIndex = 0;
  const filterItems = [
    { all: "Все" },
    { today: "Сегодня" },
    { week: "Неделя" },
  ];

  const selectItemFunction = (index: number): void => {
    setSelectedItemIndex(index);
    const item = filterItems[index];
    const [key] = Object.entries(item);
    setFilter(key[filterFieldIndex] as FilterType);
  };

  return (
    <ThemedView style={styles.stickyContainer}>
      <ThemedView style={styles.container}>
        {filterItems.map((item, index) => {
          const label = Object.values(item)[0];
          const isActive = index === selectedItemIndex;

          return (
            <TouchableOpacity
              key={Object.keys(item)[0] + index}
              style={styles.filterItem}
              onPress={() => selectItemFunction(index)}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[styles.filterText, isActive && styles.filterTextActive]}
              >
                {label}
              </ThemedText>

              <View
                style={[
                  styles.underline,
                  isActive ? styles.underlineActive : styles.underlineInactive,
                ]}
              />
            </TouchableOpacity>
          );
        })}

        <View style={styles.baseLine} />
      </ThemedView>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    stickyContainer: {
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: Colors.background,
      paddingBottom: 8,
    },

    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: 16,
      marginTop: 8,
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    filterItem: {
      flex: 1,
      alignItems: "center",
      paddingVertical: 12,
      position: "relative",
    },

    filterText: {
      fontSize: 14,
      color: Colors.textTertiary,
      fontWeight: "500",
      letterSpacing: 0.2,
    },

    filterTextActive: {
      color: Colors.tint,
      fontWeight: "600",
    },

    underline: {
      position: "absolute",
      bottom: 0,
      height: 3,
      width: "100%",
      borderRadius: 1.5,
    },

    underlineActive: {
      backgroundColor: Colors.tint,
      // Градиент для underline
      shadowColor: Colors.tint,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 3,
    },

    underlineInactive: {
      backgroundColor: "transparent",
    },

    baseLine: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 1,
      backgroundColor: Colors.borderColor,
      opacity: 0.3,
    },
  });
};
