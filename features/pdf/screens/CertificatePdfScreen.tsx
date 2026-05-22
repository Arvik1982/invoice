import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Invoice } from "../../../types/main";
import Footer from "../components/Footer";

import Contractor from "../components/Contractor";
import Client from "../components/Client";

import PreviewWrapper from "../components/PreviewWrapper";

import { useLocalSearchParams } from "expo-router";
import { useStorage } from "@/shared/storage/ useAppStorage";
import CertificateHat from "../components/certificate/CertificateHat";
import BasisSection from "../components/certificate/BasisSection";
import CertificateServices from "../components/certificate/CertificateServices";
import CertificateTotal from "../components/certificate/CertificateTotal";
import SigningConditions from "../components/certificate/SigningConditions";
import SignaturesSection from "../components/certificate/SignaturesSection";

export default function CertificatePdfScreen() {
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
      console.error("ERROR_LOAD:loadCertificatePreview");
    }
  };

  useEffect(() => {
    loadInvoise();
  }, []);

  if (!invoice) return null;

  const certificateBasis =
    invoice.invoiceDetails?.certificateBasis || undefined;

  return (
    <ThemedView style={styles.container}>
      <PreviewWrapper>
        {/* Шапка с номером акта */}
        <CertificateHat params={invoice} certificateBasis={certificateBasis} />

        {/* Основание для акта */}
        <BasisSection basis={certificateBasis} />

        {/* Исполнитель */}
        <Contractor params={invoice} />

        {/* Заказчик */}
        <Client params={invoice} />

        {/* Выполненные работы/Услуги */}
        <CertificateServices params={invoice} />

        {/* Итого */}
        <CertificateTotal params={invoice} />

        {/* Условия подписания */}
        <SigningConditions />

        {/* Подписи сторон */}
        <SignaturesSection params={invoice} />
      </PreviewWrapper>

      {/* Кнопки */}
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
