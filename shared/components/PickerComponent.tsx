import { Picker } from "@react-native-picker/picker";
import { useCustomTheme } from "../context/CustomThemeContext";
import React, { memo, useEffect, useState } from "react";
import { ColorPalette } from "@/types/configs";
import { StyleSheet } from "react-native";
import { useStorage } from "../storage/ useAppStorage";
import { ServiceTemplate } from "@/types/main";
import { STORAGE_KEYS } from "../storage/storage";
import { useFieldArray, useWatch } from "react-hook-form";
import { INVOICE_PATHS } from "../constants/paths";
import { useInvoiceForm } from "../context/InvoiceFormContext";

const PickerComponent = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const storage = useStorage();
  const { control } = useInvoiceForm();

  const { append } = useFieldArray({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_SERVICES,
    keyName: "fieldId",
  });

  // const invoiceServices = useWatch({
  //   control,
  //   name: INVOICE_PATHS.INVOICE_DETAILS_SERVICES,
  // });

  const basePrice = 0;
  const baseTemplate = [
    {
      id: "0",
      name: "Новая услуга",
      price: basePrice,
      notes: "",
      templateId: "0",
    },
  ];

  const [serviceTemplates, setServiceTemplates] =
    useState<ServiceTemplate[]>(baseTemplate);

  useEffect(() => {
    const loadStorageServices = async () => {
      try {
        const data = await storage.load(STORAGE_KEYS.SERVICE_TEMPLATES, []);

        setServiceTemplates((prev) => [...prev, ...data]);
      } catch {
        console.error("ERROR_LOAD:loadStorageTemplates");
      }
    };
    loadStorageServices();
  }, []);

  return (
    <Picker
      style={styles.picker}
      dropdownIconColor={Colors.tint}
      mode="dropdown"
      itemStyle={styles.pickerItemStyle}
      onValueChange={(itemValue) => {
        const template = serviceTemplates?.find((t) => t.id === itemValue);
        if (template) {
          const newService = {
            name: template.name,
            id: Date.now().toString(),
            templateId: template.id,
            ServiceItem: template.name,
            price: template.price,
            quantity: 1,
            custom: false,
          };
          append(newService);
        }
      }}
    >
      <Picker.Item
        label="Выберите услугу из списка..."
        value=""
        style={styles.pickerItem}
        color={Colors.placeholderTextColor}
      />
      {serviceTemplates.map((template) => (
        <Picker.Item
          key={template.id}
          label={`${template.name} `}
          value={template.id}
          style={styles.pickerItem}
          color={Colors.text}
        />
      ))}
    </Picker>
  );
};
export default memo(PickerComponent);
const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    pickerSection: {
      borderRadius: 16,
      marginBottom: 20,
      padding: 16,
      backgroundColor: Colors.sectionBackground1,
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    pickerHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    pickerTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: Colors.textSecondary,
      marginLeft: 8,
    },

    pickerItemStyle: {
      fontSize: 16,
      color: Colors.text,
      backgroundColor: Colors.backgroundItem,
    },

    pickerContainer: {
      backgroundColor: Colors.backgroundItemSecond, // #0F0F0F - самый темный
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.borderLight, // Используем borderLight из новой палитры
      overflow: "hidden",
    },
    picker: {
      color: Colors.text,
      backgroundColor: Colors.backgroundItemSecond, // Такой же как контейнер
      height: 50,
      fontSize: 16,
      paddingHorizontal: 12, // Добавляем отступы
    },
    pickerItem: {
      fontSize: 16,
      backgroundColor: Colors.backgroundItemSecond,
    },

    emptyContainer: {
      alignItems: "center",
      padding: 40,
      borderRadius: 16,
      backgroundColor: Colors.sectionBackground1,
      borderWidth: 1,
      borderColor: Colors.borderLight,
      borderStyle: "dashed",
    },

    emptyTitle: {
      marginTop: 16,
      color: Colors.text,
      fontSize: 18,
      fontWeight: "600",
    },

    emptyText: {
      marginTop: 8,
      color: Colors.textTertiary,
      fontSize: 14,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 300,
    },

    customServiceButton: {
      marginTop: 12,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.borderLight,
      backgroundColor: Colors.backgroundItemSecond,
    },

    customButtonGradient: {
      paddingVertical: 16,
      paddingHorizontal: 20,
    },

    customButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },

    customButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.tint,
      marginLeft: 12,
    },

    totalContainer: {
      borderRadius: 16,
      marginTop: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
    },

    totalContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    totalLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    totalLabel: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text,
      marginLeft: 8,
    },

    totalAmount: {
      fontSize: 28,
      fontWeight: "800",
      color: Colors.tint,
      letterSpacing: -0.5,
    },
  });
};
