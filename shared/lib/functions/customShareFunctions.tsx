import { sharePdf, PdfConfig } from "./sharePdf";

/**
 * Функция для отправки PDF через Telegram
 */
export const sharePdfViaTelegram = async (invoiceId: string): Promise<void> => {
  try {
    await sharePdf(invoiceId, {
      fileName: `Счет_${invoiceId}.pdf`,
      shareTitle: "Отправить в Telegram",
      showAlert: false,
    });
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error);
    throw error;
  }
};

/**
 * Функция для отправки PDF через WhatsApp
 */
export const sharePdfViaWhatsApp = async (invoiceId: string): Promise<void> => {
  try {
    await sharePdf(invoiceId, {
      fileName: `Счет_${invoiceId}.pdf`,
      shareTitle: "Отправить в WhatsApp",
      showAlert: false,
    });
  } catch (error) {
    console.error("Ошибка отправки в WhatsApp:", error);
    throw error;
  }
};

/**
 * Хук для использования функции в компонентах
 */
export const usePdfSharing = () => {
  const sharePdf = async (invoiceId: string, config?: PdfConfig) => {
    return sharePdf(invoiceId, config);
  };

  const shareViaTelegram = async (invoiceId: string) => {
    return sharePdfViaTelegram(invoiceId);
  };

  const shareViaWhatsApp = async (invoiceId: string) => {
    return sharePdfViaWhatsApp(invoiceId);
  };

  return {
    sharePdf,
    shareViaTelegram,
    shareViaWhatsApp,
  };
};
