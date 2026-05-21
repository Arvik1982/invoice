import { ContractorDetails, Invoice } from "@/types/main";
import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { emptyInvoice } from "@/shared/constants/invoices";

import { useStorage } from "../storage/ useAppStorage";
import {
  AppSettingsType,
  PremiumStatusFieldValue,
  PremiumStatusPath,
  PremiumStatusType,
  SettingsFieldValue,
  SettingsPath,
} from "@/types/configs";
import { defaultPremiumStatus } from "../constants/premium";
import { defaultAppSettings } from "../constants/settings";
import { set } from "lodash";

type AppContextType = {
  appSettings: AppSettingsType;

  storageInvoiceNumber: number;
  storageInvoicesArr: Invoice[];
  storageInvoicesArrLoading: boolean;
  setStorageInvoicesArr: React.Dispatch<React.SetStateAction<Invoice[]>>;

  premiumStatus: PremiumStatusType;

  setPremiumStatusFunc: <T extends PremiumStatusPath>(params: {
    field: T;
    data: PremiumStatusFieldValue<T>;
  }) => void;

  savePremiumStorage: (newPremiumStatus: PremiumStatusType) => Promise<void>;

  setAppSettingsFunc: <T extends SettingsPath>(params: {
    field: T;
    data: SettingsFieldValue<T>;
  }) => void;

  profileRestore: ContractorDetails;
  setProfileRestore: React.Dispatch<React.SetStateAction<ContractorDetails>>;

  saveClient: boolean;
  setSaveClient: React.Dispatch<React.SetStateAction<boolean>>;

  saveTemplate: boolean;
  setSaveTemplate: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialContextValue = {
  storageInvoicesArr: [emptyInvoice],
  storageInvoicesArrLoading: false,
  setStorageInvoicesArr: () => {},
  storageInvoiceNumber: 0,

  premiumStatus: defaultPremiumStatus,
  setPremiumStatusFunc: () => {},
  savePremiumStorage: async () => {
    console.log("savePremiumStorage called");
  },
  appSettings: defaultAppSettings,
  setAppSettingsFunc: () => {},
  profileRestore: emptyInvoice.contractorDetails,
  setProfileRestore: () => {},
  saveClient: false,
  setSaveClient: () => {},
  saveTemplate: false,
  setSaveTemplate: () => {},
};

const AppContext = createContext<AppContextType>(initialContextValue);

export const AppContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const storage = useStorage();

  const [saveClient, setSaveClient] = useState(false);
  const [saveTemplate, setSaveTemplate] = useState(false);

  const [profileRestore, setProfileRestore] = useState<ContractorDetails>(
    emptyInvoice.contractorDetails,
  );

  const [appSettings, setAppSettings] =
    useState<AppSettingsType>(defaultAppSettings);

  const [storageInvoicesArr, setStorageInvoicesArr] = useState<Invoice[]>(
    [] as Invoice[],
  );

  const [storageInvoicesArrLoading, setStorageInvoicesArrLoading] =
    useState(false);

  const [storageInvoiceNumber, setStorageInvoiceNumber] = useState<number>(0);

  // Invoices
  const loadStorageInvoices = useCallback(async () => {
    try {
      setStorageInvoicesArrLoading(true);
      const loadedInvoices = await storage.loadInvoices();

      setStorageInvoicesArr(loadedInvoices);

      setStorageInvoiceNumber(loadedInvoices.length);
    } catch (error) {
      console.error("AppContext - error loading invoices:", error);
    } finally {
      setStorageInvoicesArrLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStorageInvoices();
  }, [loadStorageInvoices]);

  // AppSettings
  const setAppSettingsFunc = ({
    field,
    data,
  }: {
    field: string;
    data: any;
  }) => {
    if (!appSettings) return null;
    const newAppSettings = { ...appSettings };
    set(newAppSettings, field, data);
    setAppSettings(newAppSettings);
  };

  const value: AppContextType = {
    storageInvoicesArr,
    setStorageInvoicesArr,
    storageInvoicesArrLoading,
    storageInvoiceNumber,
    setAppSettingsFunc,

    appSettings,
    profileRestore,
    setProfileRestore,
    saveClient,
    setSaveClient,
    saveTemplate,
    setSaveTemplate,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
