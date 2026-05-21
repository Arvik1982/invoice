import { Invoice } from "@/types/main";
import { FilterType } from "../types";

export const filteredInvoices = (filter: FilterType, invoices: Invoice[]) =>
  invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.date);
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    switch (filter) {
      case "today":
        return invoiceDate.toDateString() === today.toDateString();
      case "week":
        return invoiceDate >= weekAgo;
      default:
        return true;
    }
  });
