import {
  INVOICE_PATHS,
  PREMIUM_STATUS_PATHS,
  SETTINGS_PATH,
  TEMPLATES,
} from "@/shared/constants/paths";
import {
  ClientDetails,
  ContractorDetails,
  Invoice,
  InvoiceDetails,
  InvoiceType,
  ServiceItemDetails,
  ServiceTemplate,
} from "./main";
import { StorageData } from "@/shared/storage/storage";

export type ColorPalette = {
  text: string;
  background: string;

  backgroundItem: string;
  backgroundColor: string;
  backgroundButton: string;
  backgroundItemSecond: string;

  borderColor: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  succsess: string;
  gold: string;
  placeholderTextColor: string;
  notesText: string;

  // Новые свойства
  statusDot: string;
  glassOverlay: string;
  cardShadow: string;

  sectionBackground1: string;
  sectionBackground2: string;
  sectionBackground3: string;

  accentBackground1: string;
  accentBackground2: string;
  accentBackground3: string;
  accentBackground4: string;

  gradientStart: string;
  gradientEnd: string;

  transparentWhite05: string;
  transparentWhite08: string;
  transparentWhite12: string;

  danger: string;
  dangerBackground: string;

  borderLight: string;
  borderAccent: string;
  borderAccentLight: string;

  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  textAccent: string;
};
export type AllowedFontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "normal"
  | "bold";

export type FontsType = {
  regular: {
    fontFamily: string;
    fontWeight: AllowedFontWeight;
  };
  medium: {
    fontFamily: string;
    fontWeight: AllowedFontWeight;
  };
  semiBold: {
    fontFamily: string;
    fontWeight: AllowedFontWeight;
  };
  bold: {
    fontFamily: string;
    fontWeight: AllowedFontWeight;
  };
  heavy: {
    fontFamily: string;
    fontWeight: AllowedFontWeight;
  };
};

export type TemplatesType = {
  userTemplates: ServiceTemplate[];
};

export type AppSettingsType = {
  theme: string;
  language: string;
  currency: string;
  taxRate: number;
  notificationEnabled: boolean;
  isEditing: boolean;
};

export type PremiumStatusType = {
  isPremium: boolean;
  expiresAt: string | null;
  invoicesUsed: number;
  maxInvoices: number;
  maxCertificates: number;
};

export type SettingsPath = (typeof SETTINGS_PATH)[keyof typeof SETTINGS_PATH];

export type UserTempatesPath = (typeof TEMPLATES)[keyof typeof TEMPLATES];

export type InvoicePath = (typeof INVOICE_PATHS)[keyof typeof INVOICE_PATHS];

export type PremiumStatusPath =
  (typeof PREMIUM_STATUS_PATHS)[keyof typeof PREMIUM_STATUS_PATHS];

export type SettingsFieldValue<T extends SettingsPath> = T extends "theme"
  ? "light" | "dark" | "auto"
  : T extends "language"
    ? "ru" | "en" | "de" | "fr" | "es"
    : T extends "currency"
      ? "RUB" | "USD" | "EUR" | "GBP"
      : T extends "taxRate"
        ? number
        : T extends "notificationEnabled"
          ? boolean
          : T extends "isEditing"
            ? boolean
            : never;

export type InvoiceFieldValue<T extends InvoicePath> = T extends
  | "id"
  | "invoiceNumber"
  | "date"
  ? string
  : T extends "type"
    ? InvoiceType
    : T extends "deleted"
      ? boolean
      : T extends
            | "contractorDetails.name"
            | "contractorDetails.inn"
            | "contractorDetails.phone"
            | "contractorDetails.bankName"
            | "contractorDetails.bik"
            | "contractorDetails.accountNumber"
            | "contractorDetails.correspondentAccount"
            | "contractorDetails.type"
        ? string
        : T extends "contractorDetails"
          ? ContractorDetails
          : T extends "contractorDetails.logoUri"
            ? string | undefined
            : T extends "contractorDetails.signUri"
              ? string | undefined
              : T extends "contractorDetails.isPremium"
                ? boolean
                : T extends "contractorDetails.freeInvoicesUsed"
                  ? number
                  : T extends "invoiceDetails"
                    ? InvoiceDetails
                    : T extends "invoiceDetails.client"
                      ? ClientDetails
                      : T extends
                            | "invoiceDetails.client.id"
                            | "invoiceDetails.client.clientName"
                            | "invoiceDetails.client.phone"
                            | "invoiceDetails.client.email"
                            | "invoiceDetails.client.inn"
                        ? string
                        : T extends "invoiceDetails.client.type"
                          ? "fz" | "ul"
                          : T extends "invoiceDetails.services"
                            ? ServiceItemDetails[]
                            : T extends "invoiceDetails.totalSumm"
                              ? number
                              : T extends "invoiceDetails.invoiceEnabled"
                                ? boolean
                                : T extends "invoiceDetails.certificateBasis"
                                  ? string | undefined
                                  : never;

export type PremiumStatusFieldValue<T extends PremiumStatusPath> =
  T extends "isPremium"
    ? boolean
    : T extends "expiresAt"
      ? string | null
      : T extends "invoicesUsed" | "maxInvoices"
        ? number
        : never;

export type SetInvoiceParams<T extends InvoicePath> = {
  field: T;
  data: InvoiceFieldValue<T>;
};

export type SetPremiumStatusParams<T extends PremiumStatusPath> = {
  field: T;
  data: PremiumStatusFieldValue<T>;
};

export type Storage = {
  save: <T>(key: string, data: T) => Promise<void>;
  load: <T>(key: string, defaultValue: T) => Promise<T>;
  remove: (key: string) => Promise<void>;
  clearAll: () => Promise<void>;
  saveInvoice: (invoice: Invoice) => Promise<void>;
  loadInvoices: () => Promise<Invoice[]>;
  deleteInvoice: (invoiceId: string) => Promise<void>;
  getInvoice: (invoiceId: string) => Promise<Invoice | undefined>;
  saveSettings: (settings: any) => Promise<void>;
  loadSettings: () => Promise<any>;
  saveContractor: (details: any) => Promise<void>;
  loadContractor: () => Promise<any>;
  exportData: () => Promise<StorageData>;
  importData: (data: StorageData) => Promise<void>;
  resetData: () => Promise<void>;
};
