import { Invoice } from "@/types/main";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { formatDate, getServicesText } from "@/shared/lib/utils/formaters";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import React, { memo, useState } from "react";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import { router } from "expo-router";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useStorage } from "@/shared/storage/ useAppStorage";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import InfoSectionContainer from "@/shared/components/InfoSectionContainer";
import { saveInvoice } from "@/features/home/utils/hendlers";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import StackContainer from "@/shared/components/StackContainer";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";
import { certPrefix, invoicePrefix } from "@/shared/constants/invoices";
import Toast from "react-native-toast-message";
import { ThemedText } from "@/shared/ui/ThemedText";
import { AccentField } from "@/shared/ui/AccentField";
import CardField from "@/shared/ui/CardField";
import { useAppContext } from "@/shared/context/AppContext";
import { Trash } from "@/shared/Trash";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import SectionContainer from "@/shared/components/SectionContainer";

const InvoiceItem = ({
  item,
  index,
  isLoading,
  setIsLoading,
  onDelete,
}: {
  item: Invoice;
  index: number;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  onDelete: (invoice: Invoice) => Promise<void>;
}) => {
  const { themeObject } = useCustomTheme();
  const { premiumStatus } = usePremiumContext();
  const { setValue } = useInvoiceForm();
  const [loading, setloading] = useState(false);
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const storage = useStorage();

  const handleOpenInvoice = () => {
    if (item.type === "certificate") {
      router.navigate(`/(tabs)/(stacks)/pdf/certificate/${item.id}`);
    } else {
      router.navigate(`/(tabs)/(stacks)/pdf/invoice/${item.id}`);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Удалить документ?",
      `Документ "${item.invoiceNumber}" будет удален, номер документа освобожден не будет`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ],
    );
  };

  const timestamp = Date.now();
  const year = new Date(timestamp).getFullYear().toString();
  const yearLast = year.slice(2, 4);

  const handleSaveInvoiceCard = async () => {
    try {
      setloading(true);
      if (item.type === "certificate") {
        const counter = await invoiceStorage.loadCertificateCounter();

        const newInvoice: Invoice = {
          ...item,
          invoiceNumber: `${certPrefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
          type: item.type,
        };
        await saveInvoice(newInvoice, storage, setValue);
        setloading(false);
      } else if (item.type === "invoice") {
        const counter = await invoiceStorage.loadInvoiceCounter();

        const newInvoice: Invoice = {
          ...item,
          invoiceNumber: `${invoicePrefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
          type: item.type,
        };
        await saveInvoice(newInvoice, storage, setValue);
        setloading(false);
      }
    } catch {
      console.error("Error:handleSaveInvoiceCard");
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Ошибка создания документа",
      });
      setloading(false);
    }
  };

  return (
    <SectionContainer>
      {/* Верхняя часть - номер счета и дата в одной строке */}
      <View style={styles.cardHeader}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceNumber}>{item.invoiceNumber}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <View style={styles.dateBadge}>
            <LucideIcons.Calendar size={12} color={Colors.text} opacity={0.8} />
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          </View>
          <Trash onPress={handleDelete} />
        </View>
      </View>

      <StackContainer>
        {item.invoiceDetails.invoiceEnabled &&
          item.invoiceDetails.certificateBasis && (
            <Animated.View
              entering={FadeInRight.duration(1600)}
              style={styles.basisBadge}
            >
              <Text style={styles.clientLabel}>Основание:</Text>
              <ThemedText>{item.invoiceDetails.certificateBasis}</ThemedText>
            </Animated.View>
          )}

        <CardField
          label="Заказчик"
          text={item.invoiceDetails.client.clientName}
          icon={
            <LucideIcons.User size={16} color={Colors.tint} opacity={0.7} />
          }
        />

        <CardField
          label="Услуги"
          icon={
            <LucideIcons.ListChecks
              size={16}
              color={Colors.tint}
              opacity={0.7}
            />
          }
          text={getServicesText(item.invoiceDetails.services)}
        />
        <CardField
          label="Инн:"
          icon={
            <LucideIcons.ListChecks
              size={16}
              color={Colors.tint}
              opacity={0.7}
            />
          }
          text={`${item.invoiceDetails.client.inn}`}
        />

        <AccentField
          label="К ОПЛАТЕ"
          numberValue={item.invoiceDetails.totalSumm}
        />
      </StackContainer>

      {/* Основные кнопки действий */}

      <View style={styles.secondaryActions}>
        <ButtonGroup
          variant="primary"
          title="Открыть"
          onPress={handleOpenInvoice}
          activeOpacity={0.7}
        >
          <LucideIcons.Eye size={18} color="#FFFFFF" />
        </ButtonGroup>

        {premiumStatus.isPremium && (
          <ButtonGroup
            disabled={loading}
            variant="secondary"
            onPress={handleSaveInvoiceCard}
            activeOpacity={0.7}
            title={loading ? "Загрузка..." : "Повторить"}
            style={{ backgroundColor: Colors.background }}
          >
            <LucideIcons.Repeat size={18} color={Colors.tint} />
          </ButtonGroup>
        )}
      </View>
    </SectionContainer>
  );
};

export default memo(InvoiceItem);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },

    invoiceHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    invoiceNumber: {
      fontSize: 15,
      fontWeight: "700",
      color: Colors.tint,
      fontFamily: Fonts.bold.fontFamily,
      letterSpacing: -0.2,
    },

    dateBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },

    dateText: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.8,
      fontFamily: Fonts.regular.fontFamily,
    },

    clientLabel: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.6,
      fontFamily: Fonts.regular.fontFamily,
      marginBottom: 2,
      letterSpacing: 0.5,
    },

    basisBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },

    secondaryActions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      paddingTop: 16,
    },
  });
};
