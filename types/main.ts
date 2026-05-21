export interface ContractorDetails {
  name: string;
  inn: string;
  phone: string;
  bankName: string;
  bik: string;
  accountNumber: string;
  correspondentAccount: string;
  logoUri?: string;
  signUri?: string;
  type: string;
  isPremium: boolean;
  freeInvoicesUsed: number;
}

export interface ClientDetails {
  id: string;
  type: "fz" | "ul";
  clientName: string;
  phone: string;
  email: string;
  inn: string;
  createdAt: string;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  price: number;
  notes: string;
}

export interface ServiceItemDetails {
  id: string;
  templateId?: string;
  ServiceItem: string;
  price: number;
  quantity: number;
  custom?: boolean;
  name: string;
}

export interface InvoiceDetails {
  client: ClientDetails;
  services: ServiceItemDetails[];
  totalSumm: number;
  invoiceEnabled: boolean;
  certificateBasis?: string;
}

export type InvoiceType = "invoice" | "certificate";

export interface Invoice {
  id: string;
  date: string;
  invoiceNumber: string;
  deleted: boolean;
  type: InvoiceType;

  contractorDetails: ContractorDetails;
  invoiceDetails: InvoiceDetails;
}
