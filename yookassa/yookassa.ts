import { supabase } from "@/shared/lib/supabase/supabase";
import { appStorage } from "@/shared/storage/appStorage";
import { STORAGE_KEYS } from "@/shared/storage/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";

/**
 * Создает платеж в ЮKassa
 * @param amount Сумма в рублях (например: 149.00)
 * @param description Описание платежа
 * @returns Объект с данными платежа или null при ошибке
 */

export interface PaymentRequest {
  amount: {
    value: string;
    currency: string;
  };
  capture?: boolean;
  confirmation: {
    type: "redirect";
    return_url: string;
  };
  description: string;
  metadata?: Record<string, any>;
  save_payment_method?: boolean;
}

export interface PaymentResponse {
  id: string;
  status: "pending" | "succeeded" | "canceled";
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: "redirect";
    confirmation_url: string;
    return_url: string;
  };
  created_at: string;
  description: string;
}

export const getYukassaCredentials = async () => {
  try {
    const { data, error } =
      await supabase.functions.invoke("get-yukassa-secret");

    if (error || !data?.success) {
      throw new Error("Не удалось получить ключи ЮKassa");
    }

    return {
      shopId: data.shopId,
      secret: data.secret,
    };
  } catch (error) {
    console.error("Ошибка получения ключей:", error);
    throw error;
  }
};

export const getPaymentStatus = async (
  paymentId: string,
): Promise<"pending" | "succeeded" | "canceled" | null> => {
  try {
    const { shopId: SHOP_ID, secret: SECRET_KEY } =
      await getYukassaCredentials();

    const authString = `${SHOP_ID}:${SECRET_KEY}`;
    const base64Auth = btoa(authString);

    const response = await fetch(
      `https://api.yookassa.ru/v3/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64Auth}`,
          "Content-Type": "application/json",
          "Idempotence-Key": `status_${Date.now()}`, // Для проверки статуса тоже нужен
        },
      },
    );

    if (!response.ok) {
      console.error("Ошибка проверки статуса:", await response.text());
      return null;
    }

    const paymentData = await response.json();
    console.log("Статус платежа:", paymentData.status);

    return paymentData.status;
  } catch (error) {
    console.error("Ошибка getPaymentStatus:", error);
    return null;
  }
};

export const createYooKassaPayment = async (
  amount: number,
  description: string,
) => {
  const prevId = await appStorage.loadPaymentId();
  const result = await getPaymentStatus(prevId);

  if (result === "succeeded") {
    const newPremium = {
      isPremium: true,
      expiresAt: "22-11-9999",
      invoicesUsed: 0,
      maxInvoices: 300000,
      maxCertificates: 300000,
    };

    appStorage.savePremiumStatus(newPremium);

    Toast.show({
      type: "success",
      text1: "Подписка ранее была активирована",
      text2: "Перезайдите в приложение",
      visibilityTime: 5000,
      autoHide: true,
      position: "top",
    });

    return;
  }

  await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENT_ID);

  try {
    const { shopId: SHOP_ID, secret: SECRET_KEY } =
      await getYukassaCredentials();

    console.warn("SHOP_ID", SHOP_ID);
    console.warn("SECRET_KEY", SECRET_KEY);

    const authString = `${SHOP_ID}:${SECRET_KEY}`;
    const base64Auth = btoa(authString);
    const routeId = `payment_${Date.now()}_${Math.random().toString(36)}`;

    const idempotenceKey = `payment_${Date.now()}`;

    const requestBody = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `invoicepro://(payments)/screen/${routeId}`,
      },
      description: description,
    };

    console.log("Отправляем запрос в ЮKassa...", {
      Authorization: `Basic ${base64Auth}`,
      requestBody: requestBody,
    });

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64Auth}`,
        "Idempotence-Key": idempotenceKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Ошибка:", await response.text());
      return null;
    }

    const paymentData = await response.json();

    console.log("Платеж создан! ID:", paymentData.id);
    console.log(
      "Ссылка для оплаты:",
      paymentData.confirmation?.confirmation_url,
    );
    const confirmation_url = paymentData.confirmation?.confirmation_url;

    if (confirmation_url) {
      console.log("Ссылка для оплаты:", confirmation_url);

      await appStorage.savePaymentId(paymentData.id);

      const supported = await Linking.canOpenURL(confirmation_url);
      if (supported) {
        await Linking.openURL(confirmation_url);
      } else {
        console.log("Не удается открыть URL");
      }

      return paymentData;
    }

    return null;
  } catch (error) {
    console.error(" Ошибка создания платежа:", error);
    return null;
  }
};
