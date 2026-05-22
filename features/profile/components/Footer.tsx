import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet } from "react-native";
import * as LucideIcons from "lucide-react-native";
import React from "react";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import { useAppContext } from "@/shared/context/AppContext";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useWatch } from "react-hook-form";
import { INVOICE_PATHS, SETTINGS_PATH } from "@/shared/constants/paths";
import Toast from "react-native-toast-message";
import { useStorage } from "@/shared/storage/ useAppStorage";

export const Footer = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const storage = useStorage();
  const { appSettings, setAppSettingsFunc, profileRestore } = useAppContext();
  const { setValue, control } = useInvoiceForm();

  const contractor = useWatch({
    control,
    name: INVOICE_PATHS.CONTRACTOR_DETAILS,
  });

  const handleSave = async () => {
    try {
      if (!contractor.name) {
        Toast.show({
          type: "error",
          text1: "Ошибка",
          text2: "Добавьте наименование",
        });
        return;
      }
      if (!contractor.inn) {
        Toast.show({
          type: "error",
          text1: "Ошибка",
          text2: "Добавьте Инн",
        });
        return;
      }
      if (!contractor.phone) {
        Toast.show({
          type: "error",
          text1: "Ошибка",
          text2: "Добавьте телефон",
        });
        return;
      }

      if (contractor) {
        await storage.saveContractor(contractor);

        setAppSettingsFunc({ field: SETTINGS_PATH.ISEDITING, data: false });

        Toast.show({
          type: "success",
          text1: "Данные сохранены",
          text2: "",
        });
      }
    } catch {
      console.error("CURRENT_CONTRACTOR_ERROR");
    }
  };

  const handleCancel = () => {
    setValue(INVOICE_PATHS.CONTRACTOR_DETAILS, profileRestore);
    setAppSettingsFunc({ field: SETTINGS_PATH.ISEDITING, data: false });
    Toast.show({
      type: "success",
      text1: "Изменения отменены",
      text2: "",
    });
  };

  if (!appSettings.isEditing) return null;
  return (
    <ThemedView style={styles.footer}>
      {appSettings.isEditing && (
        <ThemedView style={styles.buttonContainer}>
          <ThemedView style={styles.buttonWrapper}>
            <ButtonGroup
              variant="secondary"
              title="Отмена"
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <LucideIcons.X size={20} color={Colors.tint} />
            </ButtonGroup>
          </ThemedView>

          <ThemedView style={styles.buttonWrapper}>
            <ButtonGroup
              variant="primary"
              title="Сохранить"
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <LucideIcons.Check size={20} color={Colors.text} />
            </ButtonGroup>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      backgroundColor: Colors.background,

      height: 80,
    },
    footerButton: {
      flex: 1,
      flexDirection: "row",
    },

    footerButtonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
      fontFamily: Fonts.semiBold.fontFamily,
    },
    saveButtonText: {
      color: Colors.background,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      gap: 12,
    },
    buttonWrapper: {
      flex: 1,
    },
  });
};
