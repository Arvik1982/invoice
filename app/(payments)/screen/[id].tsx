import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { appStorage } from "@/shared/storage/appStorage";
import { STORAGE_KEYS } from "@/shared/storage/storage";
import { ThemedText } from "@/shared/ui/ThemedText";
import { ThemedView } from "@/shared/ui/ThemedView";
import { getPaymentStatus } from "@/yookassa/yookassa";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import Toast from "react-native-toast-message";

export default function PaymentScreen() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;

  const { id } = useLocalSearchParams<{ id: string }>();

  const { savePremiumStorage } = usePremiumContext();

  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("");

  const [isChecking, setIsChecking] = useState(false);

  console.log("🎯 Открыт экран платежа с ID:", id);

  const showSuccessToast = useCallback(() => {
    Toast.show({
      type: "success",
      text1: "Платеж успешно завершен!",
      text2: "Подписка активирована",
      visibilityTime: 5000,
      autoHide: true,
      position: "bottom",
    });
  }, []);

  const showErrorToast = useCallback(() => {
    Toast.show({
      type: "error",
      text1: "Платеж отменен",
      text2: "Попробуйте еще раз",
      visibilityTime: 5000,
      autoHide: true,
      position: "bottom",
    });
  }, []);

  // ⭐ ПРОСТАЯ функция проверки
  const checkPayment = useCallback(async () => {
    console.log("🔍 Проверяем платеж...");
    setIsChecking(true);

    try {
      // Берем paymentId из AsyncStorage
      const savedPaymentId = await appStorage.loadPaymentId();
      console.log("Сохраненный paymentId:", savedPaymentId);

      if (!savedPaymentId) {
        console.log("❌ Нет paymentId для проверки");
        setIsChecking(false);
        return;
      }

      setPaymentId(savedPaymentId);

      // 5 попыток
      for (let attempt = 1; attempt <= 5; attempt++) {
        console.log(`Попытка ${attempt}/5`);

        if (attempt > 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        const paymentStatus = await getPaymentStatus(savedPaymentId);
        console.log(`Статус платежа: ${paymentStatus}`);

        const ruStatus =
          paymentStatus === "succeeded"
            ? "Завершен"
            : paymentStatus === "canceled"
              ? "Отменен"
              : "Отправляется";
        setStatus(ruStatus || "нет информации");

        if (paymentStatus === "succeeded") {
          console.log("✅ Платеж успешен!");

          await savePremiumStorage(paymentStatus === "succeeded");
          await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENT_ID);
          showSuccessToast();
          break;
        }

        if (paymentStatus === "canceled") {
          console.log("❌ Платеж отменен");
          await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENT_ID);
          showErrorToast();
          break;
        }
      }
    } catch (error) {
      console.error("Ошибка проверки:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // ⭐ ПРОВЕРЯЕМ СРАЗУ при открытии экрана
  useEffect(() => {
    console.log("🚀 Экран открыт, запускаем проверку...");
    checkPayment();
  }, []);

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedText type="title">💳 Статус платежа</ThemedText>

      <ThemedView
        style={{
          marginTop: 30,
          padding: 15,
          backgroundColor: Colors.backgroundItemSecond,
          borderRadius: 10,
        }}
      >
        {paymentId ? (
          <>
            <ThemedText style={{ fontWeight: "600" }}>
              {isChecking ? "🔍 Проверяем..." : "Информация о платеже"}
            </ThemedText>
            <ThemedText style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
              ID: {paymentId.substring(0, 20)}...
            </ThemedText>
            <ThemedText style={{ marginTop: 10, fontWeight: "bold" }}>
              Статус: {status || "запрашиваем..."}
            </ThemedText>
          </>
        ) : (
          <ThemedText>⏳ Получаем информацию о платеже...</ThemedText>
        )}
      </ThemedView>

      <ThemedText
        onPress={checkPayment}
        style={{
          marginTop: 30,
          padding: 15,
          backgroundColor: isChecking ? Colors.transparentWhite12 : "#8E8E93",
          color: "white",
          textAlign: "center",
          borderRadius: 8,
          fontWeight: "600",
        }}
      >
        {isChecking ? "Проверяем..." : "Проверить еще раз"}
      </ThemedText>

      {/* ⭐ КНОПКА ПРИНУДИТЕЛЬНОГО ВЫХОДА */}
      <ThemedText
        onPress={() => {
          console.log("✕ Принудительно закрываем экран");
          router.back();
        }}
        style={{
          marginTop: 15,
          padding: 15,
          backgroundColor: Colors.danger,
          color: "white",
          textAlign: "center",
          borderRadius: 8,
          fontWeight: "600",
        }}
      >
        ✕ Закрыть
      </ThemedText>
    </ThemedView>
  );
}
