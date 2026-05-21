import AsyncStorage from "@react-native-async-storage/async-storage";

import { Invoice } from "@/types/main";

export type CounterItemType = {
  id: string;
  itemNumber: string;
};

export type CountersType = {
  certificateCounter: CounterItemType[];
  invoiceCounter: CounterItemType[];
};

export type StorageData = {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  contractorDetails: any;
  clients: any[];
  serviceTemplates: any[];
  settings: any;
  premiumStatus: any;
  counters: CountersType;
  paymentId: string;
};

export const STORAGE_KEYS = {
  INVOICES: "@app_invoices",
  CURRENT_INVOICE: "@app_current_invoice",
  CONTRACTOR_DETAILS: "@app_contractor_details",
  CLIENTS: "@app_clients",
  SERVICE_TEMPLATES: "@app_service_templates",
  APP_SETTINGS: "@app_settings",
  PREMIUM_STATUS: "@app_premium_status",
  PAYMENT_ID: "@app_payment_id",
  COUNTERS: {
    CERTIFICATE_COUNTER: "@app_counters_cert",
    INVOICE_COUNTER: "@app_counters_invoice",
  },
} as const;

export const storage = {
  save: async <T>(key: string, data: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      throw error;
    }
  },

  load: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue) as T;

        return data;
      }
      return defaultValue;
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      return defaultValue;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Ошибка удаления:", error);
      throw error;
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
      console.warn("Все данные очищены");
    } catch (error) {
      console.error("Ошибка очистки:", error);
      throw error;
    }
  },
};
