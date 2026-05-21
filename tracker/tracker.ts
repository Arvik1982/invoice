// // @ts-ignore
// import RNMyTracker from "@mytracker/react-native-mytracker";
// import { Platform } from "react-native";

// // Вставьте ваш SDK ключ сюда
// const MY_TRACKER_SDK_KEY = "94219303880826522543";

// export const initMyTracker = () => {
//   try {
//     // Включить debug режим для разработки
//     if (__DEV__) {
//       RNMyTracker.setDebugMode(true);
//       console.log("MyTracker debug mode enabled");
//     }

//     // Инициализация трекера
//     RNMyTracker.initTracker(MY_TRACKER_SDK_KEY);

//     console.log("MyTracker initialized successfully");
//   } catch (error) {
//     console.error("Failed to initialize MyTracker:", error);
//   }
// };

// // Отслеживание событий
// export const trackEvent = (
//   eventName: string,
//   params?: Record<string, string>,
// ) => {
//   try {
//     RNMyTracker.trackEvent(eventName, params || {});
//   } catch (error) {
//     console.error("Failed to track event:", error);
//   }
// };

// // Отслеживание авторизации
// export const trackLogin = (userId: string) => {
//   try {
//     RNMyTracker.trackLoginEvent(userId);
//   } catch (error) {
//     console.error("Failed to track login:", error);
//   }
// };

// // Отслеживание регистрации
// export const trackRegistration = (userId: string) => {
//   try {
//     RNMyTracker.trackRegistrationEvent(userId);
//   } catch (error) {
//     console.error("Failed to track registration:", error);
//   }
// };

// // Отслеживание покупок (если нужно)
// export const trackPurchase = (
//   amount: number,
//   currency: string,
//   productId: string,
// ) => {
//   try {
//     RNMyTracker.trackPurchaseEvent(amount, currency, productId);
//   } catch (error) {
//     console.error("Failed to track purchase:", error);
//   }
// };

// // Отслеживание просмотра экранов
// export const trackScreenView = (screenName: string) => {
//   trackEvent("screen_view", { screen: screenName });
// };

// @ts-ignore
import RNMyTracker from "@mytracker/react-native-mytracker";
import { Platform, AppState } from "react-native";

const MY_TRACKER_SDK_KEY = "94219303880826522543";

export const initMyTracker = () => {
  try {
    // ВАЖНО: сначала получаем конфиг и настраиваем forcingPeriod
    const config = RNMyTracker.getTrackerConfig();

    // Устанавливаем forcing period - 5 дней (432000 секунд) [citation:1]
    // В этот период события отправляются немедленно, без буферизации
    config.setForcingPeriod(432000); // 0-432000 секунд

    // Настраиваем интервал буферизации после forcingPeriod [citation:3]
    config.setBufferingPeriod(300); // 5 минут (можно увеличить до 900)

    // Отслеживание запусков включено по умолчанию, но можно явно указать [citation:1]
    config.setTrackingLaunchEnabled(true);

    if (__DEV__) {
      RNMyTracker.setDebugMode(true);
      console.log("MyTracker debug mode enabled");
    }

    // Инициализация
    RNMyTracker.initTracker(MY_TRACKER_SDK_KEY);
    console.log("MyTracker initialized with forcing period: 5 days");

    // Отслеживаем состояние приложения
    setupAppStateTracking();
  } catch (error) {
    console.error("Failed to initialize MyTracker:", error);
  }
};

// Функция для отслеживания состояния приложения
const setupAppStateTracking = () => {
  let appState = AppState.currentState;

  const subscription = AppState.addEventListener("change", (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      // Приложение стало активным (открытие)
      trackEvent("app_open", { source: "background" });
      console.log("App opened");
    }

    if (appState === "active" && nextAppState.match(/inactive|background/)) {
      // Приложение ушло в фон
      // Важно: при закрытии/flush отправляет накопленные события [citation:1]
      RNMyTracker.flush();
      console.log("App backgrounded, events flushed");
    }

    appState = nextAppState;
  });

  return subscription;
};

// Принудительная отправка всех накопленных событий [citation:1]
export const flushEvents = () => {
  try {
    RNMyTracker.flush();
    console.log("Events flushed manually");
  } catch (error) {
    console.error("Failed to flush events:", error);
  }
};

// Остальные функции остаются теми же
export const trackEvent = (
  eventName: string,
  params?: Record<string, string>,
) => {
  try {
    RNMyTracker.trackEvent(eventName, params || {});
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};

// Отслеживание просмотра экранов
export const trackScreenView = (screenName: string) => {
  trackEvent("screen_view", { screen: screenName });
};

// Удаляем неиспользуемые функции (trackLogin, trackRegistration, trackPurchase)
