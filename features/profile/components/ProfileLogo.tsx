import React, { memo } from "react";
import { Text, StyleSheet, Image } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "@/shared/config/fonts";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import SectionContainer from "@/shared/components/SectionContainer";
import { profileItemTitleEnum } from "@/shared/constants/names";
import ButtonGroup from "@/shared/ui/ButtonGroup";

import { useAppContext } from "@/shared/context/AppContext";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useWatch } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import InfoBox from "@/shared/ui/InfoBox";
import { usePremiumContext } from "@/shared/context/PremiumContext";

const ProfileLogo = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { control, setValue } = useInvoiceForm();
  const { appSettings } = useAppContext();
  const { premiumStatus } = usePremiumContext();

  const invoiceUri = useWatch({
    control,
    name: INVOICE_PATHS.CONTRACTOR_LOGO_URI,
  });

  const handlePickLogo = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Требуется доступ к галерее",
      });

      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setValue(
        INVOICE_PATHS.CONTRACTOR_LOGO_URI,
        `data:image/jpeg;base64,${result.assets[0].base64}`,
      );

      Toast.show({
        type: "success",
        text1: "Логотип обновлён",
        text2: "",
      });
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Требуется доступ к галерее",
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setValue(
        INVOICE_PATHS.CONTRACTOR_LOGO_URI,
        `data:image/jpeg;base64,${result.assets[0].base64}`,
      );
      Toast.show({
        type: "success",
        text1: "Логотип обновлён",
        text2: "",
      });
    }
  };
  const handleClearPhoto = () => {
    setValue(INVOICE_PATHS.CONTRACTOR_LOGO_URI, "");
  };

  return (
    <SectionContainer title={profileItemTitleEnum.LOGO} index={1}>
      <ThemedView style={styles.logoContainer}>
        {invoiceUri && appSettings.isEditing && (
          <LucideIcons.XCircle
            style={{
              position: "absolute",
              top: 20,
              right: 50,
              zIndex: 10001,
              backgroundColor: "black",
              borderRadius: 50,
            }}
            onPress={handleClearPhoto}
            size={35}
            color={Colors.tint}
          />
        )}
        <ThemedView style={styles.logoPlaceholder}>
          {invoiceUri ? (
            <Image source={{ uri: invoiceUri }} style={styles.logoImage} />
          ) : (
            <LucideIcons.User size={40} color={Colors.tint} />
          )}
        </ThemedView>
        <Text style={styles.logoText}>100x100</Text>
      </ThemedView>

      {appSettings.isEditing && premiumStatus.isPremium && (
        <ThemedView style={styles.logoActions}>
          <ButtonGroup
            style={{ backgroundColor: Colors.backgroundItemSecond }}
            title="Из галереи"
            variant="secondary"
            onPress={handlePickLogo}
            activeOpacity={0.7}
          >
            <LucideIcons.Image size={20} color={Colors.tint} />
          </ButtonGroup>

          <ButtonGroup
            style={{ backgroundColor: Colors.backgroundItemSecond }}
            title="Сделать фото"
            variant="secondary"
            onPress={handleTakePhoto}
            activeOpacity={0.7}
          >
            <LucideIcons.Camera size={20} color={Colors.tint} />
          </ButtonGroup>
        </ThemedView>
      )}
      {!premiumStatus.isPremium && (
        <InfoBox text="Логотип доступен в премиум" />
      )}
      {premiumStatus.isPremium && <InfoBox text="Логотип организации" />}
    </SectionContainer>
  );
};

export default memo(ProfileLogo);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    noteContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      padding: 12,
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },
    noteCard: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
      gap: 12,
    },

    noteText: {
      fontSize: 14,
      color: Colors.textQuaternary,
      flex: 1,
      fontFamily: Fonts.regular.fontFamily,
      lineHeight: 20,
    },

    logoContainer: {
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 16,
      paddingVertical: 30, // отступы сверху и снизу
      paddingHorizontal: 15,
    },
    logoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: Colors.backgroundItemSecond,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: Colors.borderColor,
      marginBottom: 12,
      overflow: "hidden",
    },
    logoImage: {
      width: "100%",
      height: "100%",
      borderRadius: 50,
    },
    logoText: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.6,
      textAlign: "center",
      fontFamily: Fonts.regular.fontFamily,
    },
    logoActions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginBottom: 20,
      backgroundColor: "transparent",
    },
  });
};
