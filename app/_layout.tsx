/* eslint-disable import/no-unresolved */
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import { ThemeProvider } from "@react-navigation/native"; // Провайдер темы в навигации приложения
import { Stack, usePathname, useRouter } from "expo-router";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import getLayoutStyles from "./layoutStyles";
import {
  CustomThemeProvider,
  useCustomTheme,
} from "@/shared/context/CustomThemeContext";

import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import {
  InvoiceFormProvider,
  useInvoiceForm,
} from "@/shared/context/InvoiceFormContext";
import * as NavigationBar from "expo-navigation-bar";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { certPrefix } from "@/shared/constants/invoices";
import { useEffect } from "react";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { invoiceStorage } from "@/shared/storage/invoiceStorage";
import { Alert, AppState, KeyboardAvoidingView, Platform } from "react-native";
import PremiumContextProvider from "@/shared/context/PremiumContext";
import { AppContextProvider } from "@/shared/context/AppContext";
import { useColorScheme } from "@/shared/lib/hooks/useColorScheme";
import { flushEvents, initMyTracker, trackScreenView } from "@/tracker/tracker";
import {
  checkForUpdates,
  completeUpdate,
  startFlexibleUpdate,
  startImmediateUpdate,
} from "@/rustoreUpdate/rustoreUpdate";

import {
  eventEmitter,
  Events,
  InstallState,
  InstallStatus,
} from "react-native-rustore-update";

export const unstable_settings = {
  anchor: "(tabs)",
};

const App = () => {
  console.log("render-APP");
  const { themeObject } = useCustomTheme();
  const { setValue } = useInvoiceForm();
  const storage = useStorage();
  const timestamp = Date.now();
  const year = new Date(timestamp).getFullYear().toString();
  const yearLast = year.slice(2, 4);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
  });
  console.warn("Шрифты загружены:", fontsLoaded);

  const loadCounter = async () => {
    try {
      const counter = await invoiceStorage.loadCertificateCounter();

      setValue(
        INVOICE_PATHS.INVOICE_NUMBER,
        `${certPrefix}${yearLast}/${String(counter.length + 1).padStart(4, "0")}`,
      );

      setValue(INVOICE_PATHS.TYPE, "certificate");
    } catch {
      console.error("error: loadCounter");
    }
  };

  useEffect(() => {
    loadCounter();
  }, []);

  const loadStorageRequisites = async () => {
    try {
      const data = await storage.loadContractor();
      setValue(INVOICE_PATHS.CONTRACTOR_DETAILS, data);
    } catch (error) {
      console.error("ERROR_LOAD:loadStorageRequisites", error);
    }
  };

  useEffect(() => {
    loadStorageRequisites();
  }, []);
  const colorScheme = useColorScheme();

  useEffect(() => {
    NavigationBar.setPositionAsync("absolute");

    if (colorScheme === "light") {
      // Светлая тема - голубой акцент
      NavigationBar.setBackgroundColorAsync("#1CA8CE");
      NavigationBar.setButtonStyleAsync("dark"); // Темные кнопки на светлом фоне
    } else {
      // Темная тема - темно-серый (рекомендую)
      NavigationBar.setBackgroundColorAsync("#1A1A1A");
      NavigationBar.setButtonStyleAsync("light"); // Светлые кнопки на темном фоне
    }
  }, [colorScheme]); // ← Важно добавить зависимость!

  const pathname = usePathname();

  useEffect(() => {
    // Инициализация трекера
    initMyTracker();

    // При закрытии приложения отправляем данные
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        flushEvents();
      }
    });

    return () => {
      subscription.remove();
      flushEvents(); // Финальная отправка
    };
  }, []);

  // Отслеживание смены экранов
  useEffect(() => {
    trackScreenView(pathname);
  }, [pathname]);

  useEffect(() => {
    const checkUpdate = async () => {
      const updateInfo = await checkForUpdates();
      if (updateInfo) {
        // Если обновление доступно
        if (updateInfo.updatePriority > 5) {
          // Принудительное обновление
          startImmediateUpdate();
        } else {
          // Обычное обновление
          startFlexibleUpdate();
        }
      }
    };

    checkUpdate();
  }, []);

  useEffect(() => {
    // Подписываемся на события от RuStore SDK
    const listener = eventEmitter.addListener(
      Events.INSTALL_STATE_UPDATE, // Слушаем события обновления
      (state: InstallState) => {
        // Когда что-то меняется
        console.log("Update state:", state);

        // Проверяем, что именно произошло
        if (state.installStatus === InstallStatus.DOWNLOADED) {
          // Теперь можно показать диалог
          Alert.alert("Обновление готово", "Установить сейчас?", [
            { text: "Позже", style: "cancel" },
            { text: "Установить", onPress: completeUpdate },
          ]);
        }
      },
    );

    // Обязательно отписываемся, когда компонент уничтожается
    return () => listener.remove();
  }, []);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={themeObject}>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(payments)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};

function RootLayoutContent() {
  const { theme, themeObject } = useCustomTheme();

  const style = getLayoutStyles(themeObject);
  return (
    <SafeAreaView style={style.safeAreaStyles}>
      <StatusBar style={theme === "light" ? "dark" : "light"} />

      <PremiumContextProvider>
        <AppContextProvider>
          <InvoiceFormProvider>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.select({
                ios: 0,
                android: -100,
              })}
            >
              <App />
            </KeyboardAvoidingView>
          </InvoiceFormProvider>
          <Toast />
        </AppContextProvider>
      </PremiumContextProvider>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <RootLayoutContent />
    </CustomThemeProvider>
  );
}
