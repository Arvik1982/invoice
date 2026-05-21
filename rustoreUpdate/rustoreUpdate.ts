/* eslint-disable import/no-unresolved */

import { Platform } from "react-native";
import RustoreUpdateClient from "react-native-rustore-update";

// Константы статусов (из документации RuStore) [citation:3][citation:6]
export const InstallStatus = {
  UNKNOWN: 0,
  DOWNLOADED: 1,
  DOWNLOADING: 2,
  FAILED: 3,
  INSTALLING: 4,
  PENDING: 5,
};

export const UpdateAvailability = {
  UNKNOWN: 0,
  UPDATE_NOT_AVAILABLE: 1,
  UPDATE_AVAILABLE: 2,
  DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS: 3,
};

export const ResultCode = {
  RESULT_OK: -1,
  RESULT_CANCELED: 0,
  ACTIVITY_NOT_FOUND: 2,
};

// Проверка доступности обновлений
export const checkForUpdates = async () => {
  if (Platform.OS !== "android") return null;

  try {
    // Инициализация SDK (достаточно вызвать один раз)
    await RustoreUpdateClient.init();

    // Получение информации об обновлении
    const appUpdateInfo = await RustoreUpdateClient.getAppUpdateInfo();
    console.log("RuStore update info:", appUpdateInfo);

    if (
      appUpdateInfo?.updateAvailability === UpdateAvailability.UPDATE_AVAILABLE
    ) {
      return appUpdateInfo;
    }
    return null;
  } catch (error) {
    console.error("Ошибка проверки обновлений RuStore:", error);
    return null;
  }
};

// Отложенное обновление (с UI RuStore)
export const startFlexibleUpdate = async () => {
  try {
    const result = await RustoreUpdateClient.download();
    console.log("Flexible update started:", result);
    return result;
  } catch (error) {
    console.error("Ошибка запуска обновления:", error);
    throw error;
  }
};

// Принудительное обновление (блокирует приложение)
export const startImmediateUpdate = async () => {
  try {
    const result = await RustoreUpdateClient.immediate();
    console.log("Immediate update started:", result);
    return result;
  } catch (error) {
    console.error("Ошибка запуска принудительного обновления:", error);
    throw error;
  }
};

// Установка после загрузки
export const completeUpdate = async () => {
  try {
    await RustoreUpdateClient.completeUpdate();
    console.log("Update completed");
  } catch (error) {
    console.error("Ошибка установки обновления:", error);
  }
};
