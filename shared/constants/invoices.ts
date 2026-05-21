import { Invoice } from "@/types/main";
export const invoicePrefix = "С-";
export const certPrefix = "А-";

export const emptyInvoice: Invoice = {
  id: "",
  invoiceNumber: "",
  date: "",
  deleted: false,
  type: "certificate",
  contractorDetails: {
    name: "",
    inn: "",
    phone: "",
    bankName: "",
    bik: "",
    accountNumber: "",
    correspondentAccount: "",
    logoUri: undefined,
    type: "",
    isPremium: false,
    freeInvoicesUsed: 0,
  },
  invoiceDetails: {
    client: {
      id: "",
      type: "fz",
      clientName: "",
      phone: "",
      email: "",
      inn: "",
      createdAt: "",
    },
    services: [],
    totalSumm: 0,
    invoiceEnabled: false,
  },
};
