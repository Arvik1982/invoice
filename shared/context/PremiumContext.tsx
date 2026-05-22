import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStorage } from "../storage/ useAppStorage";
import { defaultPremiumStatus } from "../constants/premium";
import { ColorPalette, PremiumStatusType } from "@/types/configs";

import { StyleSheet, View } from "react-native";
import { useCustomTheme } from "./CustomThemeContext";
import ButtonGroup from "../ui/ButtonGroup";

import { ThemedText } from "../ui/ThemedText";
import { createYooKassaPayment } from "@/yookassa/yookassa";

type ContextType = {
  getPremiumFunc: () => void;
  getPromocodePremiumFunc: (code?: string) => void;
  premiumStatus: PremiumStatusType;
  savePremiumStorage: (isPremium: boolean) => Promise<void>;
};

const defaultContextValue = {
  getPremiumFunc: () => {
    console.log("premiumContext_init");
  },
  getPromocodePremiumFunc: () => {
    console.log("premiumContext_init");
  },
  premiumStatus: {} as PremiumStatusType,
  savePremiumStorage: () => Promise.resolve(console.log("premiumContext_init")),
};

const ConfirmBox = ({
  setDisplayConfirmBox,
}: {
  setDisplayConfirmBox: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { themeObject } = useCustomTheme();

  const Colors = themeObject?.colors;

  const styles = getStyles(Colors);

  const handlePay = async () => {
    setDisplayConfirmBox(false);
    try {
      await createYooKassaPayment(149, "Покупка Инвойс Про");
    } catch (err) {
      console.error({ err });
    }
  };
  const handleCancelPay = async () => {
    setDisplayConfirmBox(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={{ fontSize: 18 }}>Оплатить 149 р ?</ThemedText>
      <View style={styles.buttonContainer}>
        <ButtonGroup
          onPress={handleCancelPay}
          variant="secondary"
          title="Нет"
        />
        <ButtonGroup onPress={handlePay} variant="primary" title="Да" />
      </View>
    </View>
  );
};

const PremiumContext = createContext<ContextType>(defaultContextValue);

const PremiumContextProvider = ({ children }: { children: ReactNode }) => {
  const [displayConfirmBox, setDisplayConfirmBox] = useState(false);
  const [premiumStatus, setPremiumStatus] =
    useState<PremiumStatusType>(defaultPremiumStatus);
  const storage = useStorage();

  const getPremiumStateStorage = async () => {
    try {
      const storagePremium = await storage.loadPremiumFromStorage();

      console.warn("STATUS_PREMIUM_STORAGE:", storagePremium);
      if (storagePremium.isPremium) {
        setPremiumStatus((prev) => {
          return {
            ...prev,
            isPremium: storagePremium.isPremium,
            maxInvoices: storagePremium.maxInvoices,
            maxCertificates: storagePremium.maxCertificates,
          };
        });
        console.warn("updated_local_state_premium");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const savePremiumStorage = async (isPremium: boolean) => {
    const newPremium = {
      isPremium: isPremium,
      expiresAt: "22-11-9999",
      invoicesUsed: 0,
      maxInvoices: 300000,
      maxCertificates: 300000,
    };

    try {
      await storage.savePremiumToStorage(newPremium);
      await getPremiumStateStorage();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPremiumStateStorage();
  }, []);

  const getPremiumFunc = () => {
    setDisplayConfirmBox(true);
  };

  const getPromocodePremiumFunc = (code?: string) => {
    if (code && code === "INVOICE_PRO_TEST") {
      savePremiumStorage(true);
      return;
    }
  };

  const value: ContextType = {
    getPremiumFunc,
    premiumStatus,
    getPromocodePremiumFunc,
    savePremiumStorage,
  };
  return (
    <PremiumContext.Provider value={value}>
      {displayConfirmBox && (
        <ConfirmBox setDisplayConfirmBox={setDisplayConfirmBox} />
      )}
      {children}
    </PremiumContext.Provider>
  );
};

export default PremiumContextProvider;

export const usePremiumContext = () => useContext(PremiumContext);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      justifyContent: "space-between",
      gap: 8,
      padding: 18,
      zIndex: 101,
      position: "absolute",
      top: "50%",
      left: "10%",
      right: "10%",
      height: 160,
      borderRadius: 18,
      marginTop: -100,
      backgroundColor: Colors.background,
      borderWidth: 1,
      borderColor: Colors.backgroundThird,
    },
    buttonContainer: { flex: 1, flexDirection: "row", maxHeight: 55, gap: 8 },
  });
};
