import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Invoice } from "../../../types/main";
import Footer from "../components/Footer";
import Sertificate from "../components/CompleatedSertificate";
import PdfHat from "../components/PdfHat";
import Contractor from "../components/Contractor";
import Client from "../components/Client";
import Services from "../components/Services";
import Requisites from "../components/Requisites";
import Total from "../components/Total";
import PreviewWrapper from "../components/PreviewWrapper";

import { useLocalSearchParams } from "expo-router";
import { useStorage } from "@/shared/storage/ useAppStorage";

export default function InvoicePdfScreen() {
  {
    /* TODO: В скролле превью листик с Подписью скачать - вверху или в хедере */
  }

  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const storage = useStorage();

  const loadInvoise = async () => {
    try {
      const data = await storage.getInvoice(id);
      data && setInvoice(data);
    } catch {
      console.error("ERROR_LOAD:loadInvoicePdfscreen");
    }
  };

  useEffect(() => {
    loadInvoise();
  }, []);

  if (!invoice) return null;
  return (
    <ThemedView style={styles.container}>
      <PreviewWrapper>
        {/* Шапка с номером счёта */}
        <PdfHat params={invoice} />

        {/* Исполнитель */}
        <Contractor params={invoice} />

        {/* Заказчик */}
        <Client params={invoice} />

        {/* Услуги */}
        <Services params={invoice} />

        {/* Итого */}
        <Total params={invoice} />

        {/* Акт-работ */}
        {/* <Sertificate params={invoice} /> */}

        {/* Реквизиты */}
        <Requisites params={invoice} />
      </PreviewWrapper>

      {/*  Кнопки */}
      <Footer />
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
  });
};
