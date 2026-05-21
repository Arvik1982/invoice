export const PREMIUM_STATUS_PATHS = {
  IS_PREMIUM: "isPremium",
  EXPIRES_AT: "expiresAt",
  INVOICES_USED: "invoicesUsed",
  MAX_INVOICES: "maxInvoices",
  MAX_CERTIFICATES: "maxCertificates",
} as const;

export const SETTINGS_PATH = {
  THEME: "theme",
  LANGUAGE: "language",
  CURRENCY: "currency",
  TAX: "taxRate",
  NOTIFICATIONS: "notificationEnabled",
  ISEDITING: "isEditing",
} as const;

export const INVOICE_PATHS = {
  ID: "id",
  DATE: "date",
  INVOICE_NUMBER: "invoiceNumber",
  DELETED: "deleted",
  TYPE: "type",
  //
  CONTRACTOR_DETAILS: "contractorDetails",
  CONTRACTOR_NAME: "contractorDetails.name",
  CONTRACTOR_INN: "contractorDetails.inn",
  CONTRACTOR_PHONE: "contractorDetails.phone",
  CONTRACTOR_BANK_NAME: "contractorDetails.bankName",
  CONTRACTOR_BIK: "contractorDetails.bik",
  CONTRACTOR_ACCOUNT_NUMBER: "contractorDetails.accountNumber",
  CONTRACTOR_CORRESPONDENT_ACCOUNT: "contractorDetails.correspondentAccount",
  CONTRACTOR_LOGO_URI: "contractorDetails.logoUri",
  CONTRACTOR_SIGN_URI: "contractorDetails.signUri",
  CONTRACTOR_TYPE: "contractorDetails.type",
  CONTRACTOR_IS_PREMIUM: "contractorDetails.isPremium",
  CONTRACTOR_FREE_INVOICES_USED: "contractorDetails.freeInvoicesUsed",
  //
  INVOICE_DETAILS_CLIENT_ID: "invoiceDetails.client.id",
  INVOICE_DETAILS_CLIENT_TYPE: "invoiceDetails.client.type",
  INVOICE_DETAILS_CLIENT_NAME: "invoiceDetails.client.clientName",
  INVOICE_DETAILS_CLIENT_PHONE: "invoiceDetails.client.phone",
  INVOICE_DETAILS_CLIENT_EMAIL: "invoiceDetails.client.email",
  INVOICE_DETAILS_CLIENT_INN: "invoiceDetails.client.inn",
  INVOICE_DETAILS_SERVICES: "invoiceDetails.services",
  INVOICE_DETAILS_TOTAL_SUMM: "invoiceDetails.totalSumm",
  INVOICE_DETAILS_INVOICE_ENABLED: "invoiceDetails.invoiceEnabled",
  INVOICE_DETAILS_CLIENT: "invoiceDetails.client",
  INVOICE_DETAILS_BASIS: "invoiceDetails.certificateBasis",
} as const;

export const TEMPLATES = {
  USER_TEMPLATES: "userTemplates",
} as const;
