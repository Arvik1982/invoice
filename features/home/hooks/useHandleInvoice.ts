import { INVOICE_PATHS } from "@/shared/constants/paths";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import Toast from "react-native-toast-message";

export default function useSaveInvoice() {
  const { setValue } = useInvoiceForm();
  const handleClearInvoice = () => {
    setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_NAME, "");
    setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_PHONE, "");
    setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_EMAIL, "");
    setValue(INVOICE_PATHS.INVOICE_DETAILS_SERVICES, []);
    setValue(INVOICE_PATHS.INVOICE_DETAILS_TOTAL_SUMM, 0);
    setValue(INVOICE_PATHS.INVOICE_DETAILS_INVOICE_ENABLED, false);
    setValue(INVOICE_PATHS.ID, "");
    setValue(INVOICE_PATHS.DATE, "");
    setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_INN, "");
    Toast.show({
      type: "success",
      text1: "Форма очищена",
      text2: "Все поля сброшены",
    });
  };

  return { handleClearInvoice };
}
