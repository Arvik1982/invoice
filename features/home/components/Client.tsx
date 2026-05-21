import SectionContainer from "@/shared/components/SectionContainer";
import { invoiceItemTitleEnum } from "@/shared/constants/names";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";

import React, { memo } from "react";
import { Switch } from "react-native";
import { formatPhone } from "@/shared/lib/utils/formaters";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { Controller } from "react-hook-form";
import { ColorPalette } from "@/types/configs";
import { useAppContext } from "@/shared/context/AppContext";
import CardContainer from "@/shared/components/CardContainer";
import SwitchContainer from "@/shared/components/SwitchContainer";
import StackContainer from "@/shared/components/StackContainer";
import InputField from "@/shared/ui/InputField";

const Client = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors as ColorPalette;
  const { control } = useInvoiceForm();
  const { saveClient, setSaveClient } = useAppContext();

  return (
    <SectionContainer index={1} title={invoiceItemTitleEnum.CLIENT}>
      <StackContainer>
        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_CLIENT_NAME}
          rules={{
            required: "имя обязательно",
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CardContainer>
              <InputField
                editable
                label="Наименование"
                placeholder="Введите наименование"
                placeholderTextColor="#666666"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            </CardContainer>
          )}
        />

        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_CLIENT_INN}
          rules={{
            required: "ИНН обязателен",
            minLength: {
              value: 10,
              message: "ИНН должен содержать минимум 10 цифр",
            },
            maxLength: {
              value: 12,
              message: "ИНН не должен превышать 12 цифр",
            },
            pattern: {
              value: /^[0-9]{10,12}$/,
              message: "ИНН содержит только цифры (10-12 символов)",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CardContainer>
              <InputField
                editable
                label="Инн"
                placeholder="Инн"
                placeholderTextColor="#666666"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                autoCapitalize="none"
                error={error?.message}
              />
            </CardContainer>
          )}
        />

        {/* Телефон */}
        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_CLIENT_PHONE}
          rules={{
            pattern: {
              value: /^[\d\s\-\+\(\)]{10,}$/,
              message: "Некорректный формат телефона",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CardContainer>
              <InputField
                editable
                label="Телефон"
                placeholder="+7 (___) ___-__-__"
                placeholderTextColor="#666666"
                value={formatPhone(value || "")}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                error={error?.message}
              />
            </CardContainer>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_CLIENT_EMAIL}
          rules={{
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "некорректный email",
            },
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <CardContainer>
              <InputField
                editable
                label="Email"
                placeholder="email@example.com"
                placeholderTextColor="#666666"
                value={value || ""}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error?.message}
              />
            </CardContainer>
          )}
        />
      </StackContainer>

      <SwitchContainer
        text="Заказчик будет сохранён для быстрого выбора в будущем "
        title="Запомнить Заказчика"
      >
        <Switch
          value={saveClient}
          onValueChange={setSaveClient}
          trackColor={{
            false: Colors.sectionBackground2,
            true: Colors.succsess + "40",
          }}
          thumbColor={saveClient ? Colors.succsess : Colors.icon}
          ios_backgroundColor={Colors.sectionBackground2}
        />
      </SwitchContainer>
    </SectionContainer>
  );
};

export default memo(Client);
