import { defaultPremiumStatus } from "../constants/premium";
import { defaultAppSettings } from "../constants/settings";
import { invoiceStorage } from "./invoiceStorage";
import { storage, STORAGE_KEYS, StorageData } from "./storage";

export const appStorage = {
  // Сохранить данные подрядчика
  saveContractorDetails: async (details: any): Promise<void> => {
    await storage.save(STORAGE_KEYS.CONTRACTOR_DETAILS, details);
  },

  // Сохранить ID платежа
  savePaymentId: async (id: string): Promise<void> => {
    await storage.save(STORAGE_KEYS.PAYMENT_ID, id);
  },

  // Загрузить данные подрядчика
  loadContractorDetails: async (): Promise<any> => {
    return await storage.load(STORAGE_KEYS.CONTRACTOR_DETAILS, null);
  },

  // Сохранить Заказчиков
  saveClients: async (clients: any[]): Promise<void> => {
    await storage.save(STORAGE_KEYS.CLIENTS, clients);
  },

  // Загрузить Заказчиков
  loadClients: async (): Promise<any[]> => {
    return await storage.load(STORAGE_KEYS.CLIENTS, []);
  },

  // Загрузить ID платежа
  loadPaymentId: async (): Promise<string> => {
    return await storage.load(STORAGE_KEYS.PAYMENT_ID, "");
  },

  // Сохранить шаблоны услуг
  saveServiceTemplates: async (templates: any[]): Promise<void> => {
    await storage.save(STORAGE_KEYS.SERVICE_TEMPLATES, templates);
  },

  // Загрузить шаблоны услуг
  loadServiceTemplates: async (): Promise<any[]> => {
    return await storage.load(STORAGE_KEYS.SERVICE_TEMPLATES, []);
  },

  // Сохранить настройки приложения
  saveSettings: async (settings: any): Promise<void> => {
    await storage.save(STORAGE_KEYS.APP_SETTINGS, settings);
  },

  // Загрузить настройки приложения
  loadSettings: async (): Promise<any> => {
    return await storage.load(STORAGE_KEYS.APP_SETTINGS, defaultAppSettings);
  },

  // Сохранить статус премиума
  savePremiumStatus: async (status: any): Promise<void> => {
    await storage.save(STORAGE_KEYS.PREMIUM_STATUS, status);
  },

  // Загрузить статус премиума
  loadPremiumStatus: async (): Promise<any> => {
    return await storage.load(
      STORAGE_KEYS.PREMIUM_STATUS,
      defaultPremiumStatus,
    );
  },

  // Экспорт всех данных
  exportAllData: async (): Promise<StorageData> => {
    const [
      invoices,
      currentInvoice,
      contractorDetails,
      clients,
      serviceTemplates,
      settings,
      premiumStatus,
    ] = await Promise.all([
      invoiceStorage.loadInvoices(),
      invoiceStorage.loadCurrentInvoice(),
      appStorage.loadContractorDetails(),
      appStorage.loadClients(),
      appStorage.loadServiceTemplates(),
      appStorage.loadSettings(),
      appStorage.loadPremiumStatus(),
    ]);

    return {
      invoices,
      currentInvoice,
      contractorDetails,
      clients,
      serviceTemplates,
      settings,
      premiumStatus,
    };
  },

  // Импорт всех данных
  importAllData: async (data: StorageData): Promise<void> => {
    await Promise.all([
      invoiceStorage.saveInvoices(data.invoices),
      invoiceStorage.saveCurrentInvoice(data.currentInvoice),
      appStorage.saveContractorDetails(data.contractorDetails),
      appStorage.saveClients(data.clients),
      appStorage.saveServiceTemplates(data.serviceTemplates),
      appStorage.saveSettings(data.settings),
      appStorage.savePremiumStatus(data.premiumStatus),
    ]);
  },

  // Сброс всех данных
  resetAllData: async (): Promise<void> => {
    await Promise.all([
      storage.remove(STORAGE_KEYS.INVOICES),
      storage.remove(STORAGE_KEYS.CURRENT_INVOICE),
      storage.remove(STORAGE_KEYS.CONTRACTOR_DETAILS),
      storage.remove(STORAGE_KEYS.CLIENTS),
      storage.remove(STORAGE_KEYS.SERVICE_TEMPLATES),
      storage.remove(STORAGE_KEYS.APP_SETTINGS),
      storage.remove(STORAGE_KEYS.PREMIUM_STATUS),
    ]);
  },
};
