import { INVOICE_PATHS } from "@/shared/constants/paths";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { certPrefix, invoicePrefix } from "@/shared/constants/invoices";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";
import { LinearGradient } from "expo-linear-gradient";

export default function InvoiceTitle() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  const { control, setValue } = useInvoiceForm();

  const invoiceNumberForm = useWatch({
    control,
    name: INVOICE_PATHS.INVOICE_NUMBER,
  });

  const invoiceType = useWatch({
    control,
    name: INVOICE_PATHS.TYPE,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [invoiceTypeValue, setInvoiceTypeValue] = useState<
    "certificate" | "invoice"
  >("certificate");
  const [translateX] = useState(new Animated.Value(0));

  const values = ["Акт", "Счет"];
  const segmentWidth = 90;

  useEffect(() => {
    setInvoiceTypeValue(selectedIndex === 0 ? "certificate" : "invoice");
  }, [selectedIndex]);

  useEffect(() => {
    setValue(INVOICE_PATHS.TYPE, invoiceTypeValue);
  }, [invoiceTypeValue]);

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: selectedIndex * segmentWidth,
      useNativeDriver: true,
      tension: 100,
      friction: 15,
    }).start();
  }, [selectedIndex]);

  const timestamp = Date.now();
  const year = new Date(timestamp).getFullYear().toString();
  const yearLast = year.slice(2, 4);

  const loadCounter = async () => {
    try {
      if (invoiceType === "certificate") {
        const counter = await invoiceStorage.loadCertificateCounter();
        setValue(
          INVOICE_PATHS.INVOICE_NUMBER,
          `${certPrefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
        );
      } else if (invoiceType === "invoice") {
        const counter = await invoiceStorage.loadInvoiceCounter();
        setValue(
          INVOICE_PATHS.INVOICE_NUMBER,
          `${invoicePrefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
        );
      }
    } catch {
      console.error("error: loadCounter");
    }
  };

  useEffect(() => {
    loadCounter();
  }, [invoiceType, invoiceNumberForm]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          {/* Кастомный Segmented Control */}
          <View style={styles.customSegmentedContainer}>
            <View style={styles.segmentedBackground}>
              {/* Анимированный индикатор выбора */}
              <Animated.View
                style={[
                  styles.selectionIndicator,
                  {
                    transform: [{ translateX }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[Colors.tint, Colors.glassOverlay || Colors.tint]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientIndicator}
                />
              </Animated.View>

              {/* Кнопки сегментов */}
              {values.map((value, index) => (
                <React.Fragment key={value}>
                  <TouchableOpacity
                    style={styles.segmentButton}
                    activeOpacity={0.7}
                    onPress={() => setSelectedIndex(index)}
                  >
                    <Animated.Text
                      style={[
                        styles.segmentText,
                        selectedIndex === index
                          ? styles.segmentTextActive
                          : styles.segmentTextInactive,
                      ]}
                    >
                      {value}
                    </Animated.Text>
                  </TouchableOpacity>

                  {/* Разделительная линия между кнопками */}
                  {index < values.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.rightSection}>
          <ThemedText type="title" style={styles.invoiceNumber}>
            {invoiceNumberForm}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      marginHorizontal: 16,
      marginTop: Platform.OS === "ios" ? 20 : 10,
      marginBottom: 8,
      borderRadius: 20,
      backgroundColor: Colors.background,
      padding: 20,
      shadowColor: Colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: 44,
    },

    leftSection: {
      flexDirection: "row",
      alignItems: "center",
    },

    customSegmentedContainer: {
      height: "100%",
    },

    segmentedBackground: {
      flexDirection: "row",
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 16,
      width: 180,
      height: "100%",
      position: "relative",
      overflow: "hidden",

      shadowColor: Colors.cardShadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },

    selectionIndicator: {
      position: "absolute",
      width: 90,
      height: "100%",
      borderRadius: 16,
    },

    gradientIndicator: {
      flex: 1,
      borderRadius: 16,
    },

    segmentButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,
    },

    separator: {
      width: 1,
      backgroundColor: Colors.accentBackground1,
      height: "60%",
      alignSelf: "center",
      zIndex: 2,
    },

    segmentText: {
      fontSize: 15,
      fontWeight: "700",
      letterSpacing: 0.3,
    },

    segmentTextActive: {
      color: Colors.text,
    },

    segmentTextInactive: {
      color: Colors.textTertiary,
    },

    rightSection: {
      flex: 1,
      alignItems: "flex-end",
    },

    invoiceNumber: {
      fontSize: 22,
      fontWeight: "700",
      color: Colors.text,
      letterSpacing: -0.2,
    },
  });
};
