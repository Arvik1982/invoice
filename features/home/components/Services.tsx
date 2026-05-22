import React, { memo } from "react";
import { Text, StyleSheet, FlatList, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ColorPalette } from "@/types/configs";
import ServiceItem from "../components/ServiceItem";
import SectionContainer from "../../../shared/components/SectionContainer";
import { invoiceItemTitleEnum } from "@/shared/constants/names";
import { handleAddServiceDirect } from "../utils/hendlers";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useFieldArray, useWatch } from "react-hook-form";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import PickerComponent from "@/shared/components/PickerComponent";
import { AccentField } from "@/shared/ui/AccentField";
import { usePremiumContext } from "@/shared/context/PremiumContext";

const Services = () => {
  const { themeObject } = useCustomTheme();
  const { premiumStatus } = usePremiumContext();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const { control } = useInvoiceForm();
  const { remove } = useFieldArray({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_SERVICES,
    keyName: "fieldId",
  });

  const fields = useWatch({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_SERVICES,
  });
  const totalSumm = useWatch({
    control,
    name: INVOICE_PATHS.INVOICE_DETAILS_TOTAL_SUMM,
  });

  return (
    <SectionContainer index={2} title={invoiceItemTitleEnum.SERVICES}>
      {/* Выбор шаблонных услуг */}
      <View style={styles.pickerSection}>
        <View style={styles.pickerHeader}>
          <LucideIcons.ListChecks size={18} color={Colors.textSecondary} />
          <Text style={styles.pickerTitle}>Быстрый выбор</Text>
        </View>

        <View style={styles.pickerContainer}>
          <PickerComponent />
        </View>
      </View>

      {/* Список услуг */}
      <FlatList
        data={fields.sort((a, b) => {
          return Number(b.id) - Number(a.id);
        })}
        renderItem={({ item, index }) => (
          <ServiceItem item={item} index={index} onRemove={remove} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="list-outline"
              size={56}
              color={Colors.textTertiary}
            />
            <Text style={styles.emptyTitle}>Нет услуг</Text>
            <Text style={styles.emptyText}>
              Выберите услугу из списка выше или добавьте свою
            </Text>
          </View>
        }
        contentContainerStyle={fields.length === 0 ? { minHeight: 200 } : null}
      />

      {/* Кнопка добавления своей Услуги */}

      {premiumStatus.isPremium && (
        <ButtonGroup
          style={styles.customServiceButton}
          title="К шаблонам"
          onPress={handleAddServiceDirect}
          activeOpacity={0.8}
        >
          <View style={styles.customButtonContent}>
            <LucideIcons.PlusCircle size={20} color={Colors.tint} />
          </View>
        </ButtonGroup>
      )}

      {/* ИТОГО */}

      <AccentField label="ИТОГО" numberValue={totalSumm} />
    </SectionContainer>
  );
};

export default memo(Services);

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

    pickerContainer: {
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.borderLight,
      overflow: "hidden",
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

    customButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
