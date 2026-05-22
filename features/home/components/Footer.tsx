import ButtonGroup from "@/shared/ui/ButtonGroup";
import React, { memo, useState } from "react";
import * as LucideIcons from "lucide-react-native";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import { StyleSheet, View } from "react-native";
import { Fonts } from "@/shared/config/fonts";
import useSaveInvoice from "../hooks/useHandleInvoice";
import { useWatch } from "react-hook-form";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { Invoice } from "@/types/main";
import { LinearGradient } from "expo-linear-gradient";
import { saveInvoice } from "../utils/hendlers";
import { useAppContext } from "@/shared/context/AppContext";
import { ThemedView } from "@/shared/ui/ThemedView";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";
import Toast from "react-native-toast-message";
import { usePremiumContext } from "@/shared/context/PremiumContext";

const Footer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { saveClient, setSaveClient } = useAppContext();
  const { premiumStatus } = usePremiumContext();
  const { control, setValue } = useInvoiceForm();
  const { handleClearInvoice } = useSaveInvoice();
  const { themeObject } = useCustomTheme();

  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const storage = useStorage();
  const invoice = useWatch({ control }) as Invoice;

  const handleSaveInvoiceCard = async () => {
    setIsLoading(true);
    try {
      const currentInvoiceNumber = (await invoiceStorage.loadInvoiceCounter())
        .length;

      const currentCertificateNumber = (
        await invoiceStorage.loadCertificateCounter()
      ).length;

      if (
        invoice.type === "certificate" &&
        currentCertificateNumber < premiumStatus.maxCertificates
      ) {
        await saveInvoice(
          invoice,
          storage,
          setValue,
          saveClient,
          setSaveClient,
        );
        setIsLoading(false);
      } else if (
        invoice.type === "invoice" &&
        currentInvoiceNumber < premiumStatus.maxInvoices
      ) {
        await saveInvoice(
          invoice,
          storage,
          setValue,
          saveClient,
          setSaveClient,
        );
        setIsLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Ошибка: Требуется премиум доступ",
          text2: "Достигнут лимит документов",
        });
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.footer}>
      {/* Градиентная обводка сверху */}
      <LinearGradient
        colors={[Colors.tint, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.footerTopBorder}
      />

      <View style={styles.footerContent}>
        {/* Кнопка Отмена */}
        <ThemedView style={styles.buttonWrapper}>
          <ButtonGroup
            variant="secondary"
            onPress={handleClearInvoice}
            activeOpacity={0.7}
            title="Отмена"
          >
            <LucideIcons.X size={20} color={Colors.tint} />
          </ButtonGroup>
        </ThemedView>

        {/* Кнопка Сохранить */}
        <ThemedView style={styles.buttonWrapper}>
          <ButtonGroup
            disabled={isLoading}
            variant="primary"
            onPress={handleSaveInvoiceCard}
            activeOpacity={0.7}
            title="Сохранить"
          >
            <LucideIcons.Check size={20} color={Colors.text} />
          </ButtonGroup>
        </ThemedView>
      </View>
    </View>
  );
};

export default memo(Footer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors.background,
      paddingTop: 1,
      paddingBottom: 20,
      paddingHorizontal: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.borderLight,
      shadowColor: Colors.cardShadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },

    footerTopBorder: {
      height: 1,
      width: "100%",
    },

    footerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 16,
    },

    cancelButton: {
      flex: 1,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    saveButton: {
      flex: 1,
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.borderAccent,
    },

    buttonGradient: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },

    buttonInner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.tint,
      fontFamily: Fonts.semiBold.fontFamily,
      letterSpacing: -0.2,
    },

    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold.fontFamily,
      letterSpacing: -0.2,
    },
    buttonWrapper: {
      flex: 1,
    },
  });
};
