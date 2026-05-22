import React, { memo } from "react";
import { StyleSheet } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "@/shared/config/fonts";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import SectionContainer from "@/shared/components/SectionContainer";
import { profileItemTitleEnum } from "@/shared/constants/names";
import InputField from "@/shared/ui/InputField";
import { useAppContext } from "@/shared/context/AppContext";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { Controller } from "react-hook-form";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { LinearGradient } from "expo-linear-gradient";
import InfoBox from "@/shared/ui/InfoBox";
import { FIELD_STYLES } from "@/shared/constants/styles";

const ProfileBankRequisites = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { control } = useInvoiceForm();
  const { appSettings } = useAppContext();

  return (
    <SectionContainer title={profileItemTitleEnum.BANK_REKUISITES} index={3}>
      <ThemedView style={styles.fieldsStack}>
        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_BANK_NAME}
          rules={{
            required: "Название обязательно",
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LinearGradient
              colors={[Colors.sectionBackground1, Colors.sectionBackground2]}
              style={styles.fieldCard}
            >
              <InputField
                icon={<LucideIcons.Landmark size={20} color={Colors.tint} />}
                label="Банк"
                value={value || ""}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                error={error?.message}
              />
            </LinearGradient>
          )}
        />

        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_BIK}
          rules={{
            required: "Бик обязателен",
            pattern: {
              value: /^\d{9}$/,
              message: "Бик должен содержать ровно 9 цифр",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LinearGradient
              colors={[Colors.sectionBackground1, Colors.sectionBackground2]}
              style={styles.fieldCard}
            >
              <InputField
                icon={<LucideIcons.Hash size={20} color={Colors.tint} />}
                label="Бик"
                value={value || ""}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                keyboardType="numeric"
                error={error?.message}
              />
            </LinearGradient>
          )}
        />

        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_ACCOUNT_NUMBER}
          rules={{
            required: "Номер счета обязателен",
            pattern: {
              value: /^\d{20}$/,
              message: "Расчетный счет — ровно 20 цифр",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LinearGradient
              colors={[Colors.sectionBackground1, Colors.sectionBackground2]}
              style={styles.fieldCard}
            >
              <InputField
                icon={<LucideIcons.CreditCard size={20} color={Colors.tint} />}
                label="Расчётный счёт"
                value={value || ""}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                keyboardType="numeric"
                error={error?.message}
              />
            </LinearGradient>
          )}
        />

        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_CORRESPONDENT_ACCOUNT}
          rules={{
            required: "Корр. счёт обязателен",
            pattern: {
              value: /^\d{20}$/,
              message: "Корр. счёт — ровно 20 цифр",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <LinearGradient
              colors={[Colors.sectionBackground1, Colors.sectionBackground2]}
              style={styles.fieldCard}
            >
              <InputField
                icon={
                  <LucideIcons.LucideCreditCard size={20} color={Colors.tint} />
                }
                label="Корр. счёт"
                value={value || ""}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                keyboardType="numeric"
                error={error?.message}
              />
            </LinearGradient>
          )}
        />
      </ThemedView>

      {/* Уведомление */}
      <InfoBox text="Реквизиты будут использованы при формировании PDF счета" />
    </SectionContainer>
  );
};

export default memo(ProfileBankRequisites);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    fieldsStack: {
      gap: 20,
      backgroundColor: "transparent",
    },

    fieldCard: FIELD_STYLES(Colors),

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
  });
};
