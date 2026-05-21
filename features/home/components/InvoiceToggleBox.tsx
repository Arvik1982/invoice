import React, { memo } from "react";
import { Switch } from "react-native";
import SectionContainer from "../../../shared/components/SectionContainer";
import { invoiceItemTitleEnum } from "@/shared/constants/names";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { Controller, useWatch } from "react-hook-form";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import SwitchContainer from "@/shared/components/SwitchContainer";
import InvoiceBasisBox from "@/features/home/components/InvoiceBasisBox";

const InvoiceToggleBox = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const { control, setValue } = useInvoiceForm();

  const invoiceEnabled = useWatch({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_INVOICE_ENABLED,
  });

  const handleInvoiceEnabled = () => {
    setValue(INVOICE_PATHS.INVOICE_DETAILS_INVOICE_ENABLED, !invoiceEnabled);
    !invoiceEnabled && setValue(INVOICE_PATHS.INVOICE_DETAILS_BASIS, "");
  };

  const invoiceType = useWatch({
    control,
    name: INVOICE_PATHS.TYPE,
  });

  if (invoiceType !== "certificate") return null;
  return (
    <SectionContainer title={invoiceItemTitleEnum.BASIS} index={3}>
      {/* Переключатель AKT*/}
      <SwitchContainer title="Ввести основание" text="Указать номер документа">
        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_INVOICE_ENABLED}
          defaultValue={false}
          render={({ field: { onChange, value } }) => {
            return (
              <Switch
                value={value}
                onValueChange={(val) => {
                  handleInvoiceEnabled();
                  onChange(val);
                }}
                trackColor={{
                  false: Colors.sectionBackground2,
                  true: Colors.succsess + "40",
                }}
                thumbColor={value ? Colors.succsess : Colors.icon}
                ios_backgroundColor={Colors.sectionBackground2}
              />
            );
          }}
        />
      </SwitchContainer>
      <InvoiceBasisBox enabled={invoiceEnabled} />
    </SectionContainer>
  );
};

export default memo(InvoiceToggleBox);
