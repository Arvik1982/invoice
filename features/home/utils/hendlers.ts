import { ClientDetails, Invoice, InvoiceDetails } from "../../../types/main";
import { router } from "expo-router";

import Toast from "react-native-toast-message";
import { storage, STORAGE_KEYS } from "@/shared/storage/storage";
import { appStorage } from "@/shared/storage/appStorage";
import { Storage } from "@/types/configs";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { certPrefix, invoicePrefix } from "@/shared/constants/invoices";
import { UseFormSetValue } from "react-hook-form";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";

export const handleAddServiceDirect = () => {
  router.push("/(tabs)/(stacks)/templates");
};

export const handleRemoveService = (
  id: string,
  setInvoiceState: (value: React.SetStateAction<InvoiceDetails>) => void,
) => {
  setInvoiceState((prev) => ({
    ...prev,
    services: prev.services.filter((service) => service.id !== id),
  }));
};

export const handleQuantityChange = (
  id: string,
  quantity: number,
  setInvoiceState: (value: React.SetStateAction<InvoiceDetails>) => void,
) => {
  if (quantity < 1) return;
  setInvoiceState((prev) => ({
    ...prev,
    services: prev.services.map((service) =>
      service.id === id ? { ...service, quantity } : service,
    ),
  }));
};

export const handleToggleSert = (
  value: boolean,
  setInvoiceState: (value: React.SetStateAction<InvoiceDetails>) => void,
) => {
  setInvoiceState((prev) => ({ ...prev, invoiceEnabled: value }));
};

export const handleSaveClientToStorage = async (
  clientToSave: ClientDetails,
) => {
  if (!clientToSave.clientName?.trim()) {
    Toast.show({
      type: "error",
      text1: "Ошибка",
      text2: "Добавьте название Заказчика",
    });
    return false;
  }
  if (!clientToSave.inn?.trim()) {
    Toast.show({
      type: "error",
      text1: "Ошибка",
      text2: "Добавьте Инн Заказчика",
    });
    return false;
  }

  try {
    const storageClientsArray = await storage.load<ClientDetails[]>(
      STORAGE_KEYS.CLIENTS,
      [],
    );
    const normalizedInn = clientToSave.inn?.trim();
    const isClientExists = storageClientsArray.find((cl) => {
      return cl.inn?.trim() === normalizedInn;
    });

    if (!isClientExists) {
      const newClient: ClientDetails = {
        ...clientToSave,
        inn: normalizedInn,
        clientName: clientToSave.clientName?.trim(),
        createdAt: new Date().toISOString(),
      };

      const newClientsArray = [...storageClientsArray, newClient];
      await appStorage.saveClients(newClientsArray);
      Toast.show({
        type: "success",
        text1: "Заказчик сохранен",
        text2: newClient.clientName,
        visibilityTime: 3000,
      });
    } else {
      Toast.show({
        type: "info",
        text1: `Заказчик с Инн:${normalizedInn} уже есть`,
        text2: `${isClientExists.clientName}, ${isClientExists.inn?.trim()} добавлен не будет`,
        visibilityTime: 4000,
      });
      // throw new Error(`Заказчик с Инн ${normalizedInn} уже существует`);
    }
  } catch (error) {
    console.error("Ошибка загрузки Заказчиков:", error);
    return false;
  }
};
export const saveInvoice = async (
  invoice: Invoice,
  storage: Storage,
  setValue: UseFormSetValue<Invoice>,
  saveClient?: boolean,
  setSaveClient?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    if (invoice.invoiceDetails?.services.length === 0) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Добавьте хотя бы одну услугу",
      });
      return false;
    }
    if (!invoice.invoiceDetails.client.clientName?.trim()) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Добавьте заказчика",
      });
      return false;
    }

    if (!invoice.invoiceDetails.client.inn?.trim()) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Добавьте Инн заказчика",
      });
      return false;
    }
    if (
      invoice.invoiceDetails.client.inn?.trim().length! < 10 ||
      invoice.invoiceDetails.client.inn?.trim().length! > 12
    ) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "ИНН должен содержать 10-12 цифр",
      });
      return false;
    }

    if (saveClient && invoice.invoiceDetails.client) {
      await handleSaveClientToStorage(invoice.invoiceDetails.client);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (invoice) {
      const updatedInvoice = {
        ...invoice,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      };

      await storage.saveInvoice(updatedInvoice);

      if (invoice.type === "certificate") {
        await invoiceStorage.saveCertificateCounter({
          id: invoice.id,
          itemNumber: invoice.invoiceNumber,
        });
      }
      if (invoice.type === "invoice") {
        await invoiceStorage.saveInvoiceCounter({
          id: invoice.id,
          itemNumber: invoice.invoiceNumber,
        });
      }

      Toast.show({
        type: "success",
        text1: "Документ сохранен",
        text2: `Документ №${invoice.invoiceNumber} добавлен в историю`,
      });
      const timestamp = Date.now();
      const year = new Date(timestamp).getFullYear().toString();
      const yearLast = year.slice(2, 4);
      const counter =
        invoice.type === "certificate"
          ? await invoiceStorage.loadCertificateCounter()
          : await invoiceStorage.loadInvoiceCounter();
      const prefix =
        invoice.type === "certificate" ? certPrefix : invoicePrefix;

      setValue(
        INVOICE_PATHS.INVOICE_NUMBER,
        `${prefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
      );

      // reset;
      setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_NAME, "");
      setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_PHONE, "");
      setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_EMAIL, "");
      setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT_INN, "");
      setValue(INVOICE_PATHS.INVOICE_DETAILS_SERVICES, []);
      setValue(INVOICE_PATHS.INVOICE_DETAILS_TOTAL_SUMM, 0);
      setValue(INVOICE_PATHS.INVOICE_DETAILS_INVOICE_ENABLED, false);
      setValue(INVOICE_PATHS.ID, "");
      setValue(INVOICE_PATHS.DATE, "");
      setSaveClient && setSaveClient(false);

      if (invoice.type === "certificate") {
        router.navigate(
          `/(tabs)/(stacks)/pdf/certificate/${updatedInvoice.id}`,
        );
      } else {
        router.navigate(`/(tabs)/(stacks)/pdf/invoice/${updatedInvoice.id}`);
      }
    }
  } catch (error) {
    console.error("CURRENT_INVOICE_ERROR:", error);
  }
};
