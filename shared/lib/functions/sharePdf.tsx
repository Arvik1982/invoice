import { appStorage } from "@/shared/storage/appStorage";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";
import * as Print from "expo-print";
import { File } from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import { generatePdfHtml } from "./generatePdfHtml";

export interface PdfConfig {
  fileName?: string;
  shareTitle?: string;
  showAlert?: boolean;
}

export const sharePdf = async (
  invoiceId: string,
  config: PdfConfig = {},
  onlyCertificate?: boolean,
): Promise<void> => {
  // const time = Date.now().toString();

  const {
    // fileName = `Счет_${invoiceId}_${time}.pdf`,
    shareTitle = "Отправить счет",
    showAlert = true,
  } = config;

  try {
    const invoice = await invoiceStorage.getInvoiceById(invoiceId);
    const contractorDetails = await appStorage.loadContractorDetails();
    const settings = await appStorage.loadSettings();

    if (!invoice) {
      throw new Error("Счет не найден");
    }

    const htmlContent = generatePdfHtml(
      invoice,
      contractorDetails,
      settings,
      onlyCertificate,
    );

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    console.log("PDF создан Print по пути:", uri);

    // Создаем File из URI
    const pdfFile = new File(uri);

    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      if (showAlert) {
        Toast.show({
          type: "error",
          text1: "Отправка запрещена на устройстве",
          text2: ``,
        });
      }
      return;
    }

    // Делимся файлом напрямую
    await Sharing.shareAsync(pdfFile.uri, {
      mimeType: "application/pdf",
      dialogTitle: shareTitle,
      UTI: "com.adobe.pdf",
    });
  } catch (error: any) {
    console.error("Ошибка при создании PDF:", error);

    if (showAlert) {
      Toast.show({
        type: "error",
        text1: "Ошибка при создании PDF",
        text2: error.message || "",
      });
    }
    throw error;
  }
};
