import { appStorage } from "./appStorage";
import { invoiceStorage } from "./invoiceStorage";
import { storage } from "./storage";

export const useStorage = () => {
  return {
    // Общие методы
    save: storage.save,
    load: storage.load,
    remove: storage.remove,
    clearAll: storage.clearAll,

    // Счета
    saveInvoice: invoiceStorage.saveOrUpdateInvoice,
    loadInvoices: invoiceStorage.loadInvoices,
    deleteInvoice: invoiceStorage.deleteInvoice,
    getInvoice: invoiceStorage.getInvoiceById,

    // Настройки приложения
    saveSettings: appStorage.saveSettings,
    loadSettings: appStorage.loadSettings,

    // Премиум статус
    savePremiumToStorage: appStorage.savePremiumStatus,
    loadPremiumFromStorage: appStorage.loadPremiumStatus,

    // Контрагенты
    saveContractor: appStorage.saveContractorDetails,
    loadContractor: appStorage.loadContractorDetails,

    // Экспорт/импорт
    exportData: appStorage.exportAllData,
    importData: appStorage.importAllData,
    resetData: appStorage.resetAllData,
  };
};
