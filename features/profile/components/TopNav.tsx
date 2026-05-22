import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React, { memo } from "react";
import { tabScreenHeaderContainer } from "@/shared/config/styles";
import { useAppContext } from "@/shared/context/AppContext";
import { INVOICE_PATHS, SETTINGS_PATH } from "@/shared/constants/paths";
import Toast from "react-native-toast-message";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useWatch } from "react-hook-form";
import { SMALL_BUTTON_STYLES } from "@/shared/constants/styles";
import { router } from "expo-router";
import PremiumCrawnBadge from "@/shared/components/PremiumCrawnBadge";
import { usePremiumContext } from "@/shared/context/PremiumContext";

const TopNav = () => {
  const { themeObject } = useCustomTheme();
  const { setValue, control } = useInvoiceForm();
  const { appSettings, setAppSettingsFunc, setProfileRestore } =
    useAppContext();
  const { premiumStatus } = usePremiumContext();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const storage = useStorage();

  const contractor = useWatch({
    control,
    name: INVOICE_PATHS.CONTRACTOR_DETAILS,
  });

  const toggleEdit = async () => {
    try {
      const storageContractor = await storage.loadContractor();

      setProfileRestore(storageContractor);

      setValue(INVOICE_PATHS.CONTRACTOR_DETAILS, storageContractor);

      setAppSettingsFunc({
        field: SETTINGS_PATH.ISEDITING,
        data: !appSettings.isEditing,
      });

      // appSettings.isEditing &&
      //   Toast.show({
      //     type: "success",
      //     text1: "Сохранено",
      //     text2: "Реквизиты успешно обновлены",
      //   });
    } catch {
      console.error("Error:toggleEdit");
    }
  };
  return (
    <ThemedView
      style={{
        flex: 1,
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        {!appSettings.isEditing && (
          <TouchableOpacity onPress={toggleEdit} activeOpacity={0.8}>
            <LucideIcons.Pen size={30} color={Colors.tint} />
          </TouchableOpacity>
        )}

        {premiumStatus.isPremium && (
          <TouchableOpacity
            onPress={() => {
              router.navigate("/(tabs)/(stacks)/settings");
            }}
            activeOpacity={0.8}
          >
            <LucideIcons.Settings size={30} color={Colors.tint} />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
};

export default memo(TopNav);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    header: tabScreenHeaderContainer,
    headerTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: Colors.text,
      fontFamily: Fonts.bold.fontFamily,
      position: "relative",
      paddingLeft: 8,
    },

    headerMain: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    editButton: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: Colors.backgroundItem,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.tint,
      marginBottom: 4,
    },
    editButtonText: {
      width: 110,
      color: Colors.tint,
      textAlign: "right",
      fontWeight: "600",
      fontSize: 14,
      marginLeft: 6,
      fontFamily: Fonts.semiBold.fontFamily,
    },

    headerButtonStyles: SMALL_BUTTON_STYLES(Colors),
  });
};
