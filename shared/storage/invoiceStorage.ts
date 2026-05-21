import { Invoice } from "@/types/main";
import { CounterItemType, storage, STORAGE_KEYS } from "./storage";

export const invoiceStorage = {
  // Сохранить список счетов
  saveInvoices: async (invoices: Invoice[]): Promise<void> => {
    await storage.save(STORAGE_KEYS.INVOICES, invoices);
  },

  // Загрузить список счетов
  loadInvoices: async (): Promise<Invoice[]> => {
    return await storage.load(STORAGE_KEYS.INVOICES, []);
  },

  // Сохранить текущий счет
  saveCurrentInvoice: async (invoice: Invoice | null): Promise<void> => {
    await storage.save(STORAGE_KEYS.CURRENT_INVOICE, invoice);
  },

  // Загрузить текущий счет
  loadCurrentInvoice: async (): Promise<Invoice | null> => {
    return await storage.load(STORAGE_KEYS.CURRENT_INVOICE, null);
  },

  // Добавить или обновить счет
  saveOrUpdateInvoice: async (invoice: Invoice): Promise<void> => {
    const invoices = await invoiceStorage.loadInvoices();
    const existingIndex = invoices.findIndex((i) => i.id === invoice.id);

    if (existingIndex >= 0) {
      // Обновить существующий
      console.error("SAME_INDEX");
      invoices[existingIndex] = invoice;
    } else {
      // Добавить новый
      invoices.push(invoice);
    }

    await invoiceStorage.saveInvoices(invoices);
  },

  // Удалить счет по ID
  deleteInvoice: async (invoiceId: string): Promise<void> => {
    const invoices = await invoiceStorage.loadInvoices();
    // const filteredInvoices = invoices.filter((i) => i.id !== invoiceId);
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId ? { ...invoice, deleted: true } : invoice
    );
    await invoiceStorage.saveInvoices(updatedInvoices);
  },
  choreInvoice: async (invoiceId: string): Promise<void> => {
    const invoices = await invoiceStorage.loadInvoices();
    const filteredInvoices = invoices.filter((i) => i.id !== invoiceId);
    await invoiceStorage.saveInvoices(filteredInvoices);
  },

  // Получить счет по ID
  getInvoiceById: async (invoiceId: string): Promise<Invoice | undefined> => {
    const invoices = await invoiceStorage.loadInvoices();
    return invoices.find((i) => i.id === invoiceId);
  },

  // Получить последние счета
  getRecentInvoices: async (limit: number = 10): Promise<Invoice[]> => {
    const invoices = await invoiceStorage.loadInvoices();
    return invoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  },

  // COUNTERS

  // INVOICE

  loadInvoiceCounter: async (): Promise<CounterItemType[]> => {
    return await storage.load(STORAGE_KEYS.COUNTERS.INVOICE_COUNTER, []);
  },
  saveInvoiceCounter: async (counterItem: CounterItemType): Promise<void> => {
    const currentCounter = await invoiceStorage.loadInvoiceCounter();
    currentCounter.push(counterItem);
    storage.save(STORAGE_KEYS.COUNTERS.INVOICE_COUNTER, currentCounter);
  },

  // CERTIFICATE

  loadCertificateCounter: async (): Promise<CounterItemType[]> => {
    return await storage.load(STORAGE_KEYS.COUNTERS.CERTIFICATE_COUNTER, []);
  },
  saveCertificateCounter: async (
    counterItem: CounterItemType
  ): Promise<void> => {
    const currentCounter = await invoiceStorage.loadCertificateCounter();
    currentCounter.push(counterItem);
    storage.save(STORAGE_KEYS.COUNTERS.CERTIFICATE_COUNTER, currentCounter);
  },
};
