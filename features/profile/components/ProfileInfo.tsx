import React, { memo } from "react";
import * as LucideIcons from "lucide-react-native";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "@/shared/config/fonts";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import SectionContainer from "@/shared/components/SectionContainer";
import { profileItemTitleEnum } from "@/shared/constants/names";
import { formatPhone } from "@/shared/lib/utils/formaters";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { Controller } from "react-hook-form";
import { useAppContext } from "@/shared/context/AppContext";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { LinearGradient } from "expo-linear-gradient";
import InputField from "@/shared/ui/InputField";
import InfoBox from "@/shared/ui/InfoBox";
import { FIELD_STYLES } from "@/shared/constants/styles";

const ProfileInfo = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { appSettings } = useAppContext();
  const { control } = useInvoiceForm();

  return (
    <SectionContainer title={profileItemTitleEnum.MAIN_INFO} index={2}>
      <ThemedView style={styles.fieldsStack}>
        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_NAME}
          rules={{
            required: "Имя обязательно",
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
                icon={<LucideIcons.Building2 size={20} color={Colors.tint} />}
                label="Наименование"
                value={value || ""}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            </LinearGradient>
          )}
        />

        <Controller
          control={control}
          name={INVOICE_PATHS.CONTRACTOR_INN}
          rules={{
            required: "Инн обязателен",
            minLength: {
              value: 10,
              message: "Инн должен содержать минимум 10 цифр",
            },
            maxLength: {
              value: 12,
              message: "Инн не должен превышать 12 цифр",
            },
            pattern: {
              value: /^[0-9]{10,12}$/,
              message: "Инн содержит только цифры (10-12 символов)",
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
                icon={<LucideIcons.FileText size={20} color={Colors.tint} />}
                label="Инн"
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
          name={INVOICE_PATHS.CONTRACTOR_PHONE}
          rules={{
            required: "Телефон обязателен",
            pattern: {
              value: /^[\d\s\-\+\(\)]{10,}$/,
              message: "Некорректный формат телефона",
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
                icon={<LucideIcons.Phone size={20} color={Colors.tint} />}
                label="Телефон"
                value={formatPhone(value || "")}
                editable={appSettings.isEditing}
                onChangeText={onChange}
                keyboardType="phone-pad"
                error={error?.message}
              />
            </LinearGradient>
          )}
        />
      </ThemedView>

      {/* Уведомление */}
      {!appSettings.isEditing && (
        <InfoBox text="Информация будет использована при формировании PDF счета" />
      )}
    </SectionContainer>
  );
};

export default memo(ProfileInfo);

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
