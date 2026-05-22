import { StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../../../shared/lib/utils/formaters";
import { useCustomTheme } from "../../../shared/context/CustomThemeContext";
import React, { memo } from "react";
import { ColorPalette } from "@/types/configs";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { Controller, useWatch } from "react-hook-form";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import CardContainer from "@/shared/components/CardContainer";
import InputField from "@/shared/ui/InputField";

const InvoiceBasisBox = ({ enabled }: { enabled: boolean }) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const { control } = useInvoiceForm();

  const totalSumm = useWatch({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_TOTAL_SUMM,
  });

  if (!enabled) return null;

  return (
    <CardContainer style={styles.sertPreviewContainer}>
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <Controller
          control={control}
          name={INVOICE_PATHS.INVOICE_DETAILS_BASIS}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <InputField
              editable
              label="Основание документа"
              placeholder="Введите основание"
              placeholderTextColor="#666666"
              value={value || ""}
              onChangeText={onChange}
              onBlur={onBlur}
              error={error?.message}
              style={{ flex: 1 }}
            />
          )}
        />
      </View>

      {/* <Text style={styles.sertDescription}>Выберите счет</Text> */}
      <Text style={styles.sertInstruction}>
        Сумма к оплате: {formatCurrency(totalSumm)}
      </Text>
    </CardContainer>
  );
};
export default memo(InvoiceBasisBox);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    sertPreviewContainer: {
      marginTop: 18,
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },
    sertDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    sertInstruction: {
      marginTop: 8,
      fontSize: 14,
      color: Colors.placeholderTextColor,
      textAlign: "center",
      lineHeight: 20,
    },
  });
};
