declare module "react-native-rustore-update" {
  // Статусы установки
  export const InstallStatus: {
    UNKNOWN: 0;
    DOWNLOADED: 1;
    DOWNLOADING: 2;
    FAILED: 3;
    INSTALLING: 4;
    PENDING: 5;
  };

  // Доступность обновления
  export const UpdateAvailability: {
    UNKNOWN: 0;
    UPDATE_NOT_AVAILABLE: 1;
    UPDATE_AVAILABLE: 2;
    DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS: 3;
  };

  // События
  export const Events: {
    INSTALL_STATE_UPDATE: "INSTALL_STATE_UPDATE";
  };

  // Информация об обновлении
  export interface AppUpdateInfo {
    updatedAt: string;
    packageName: string;
    updatePriority: number;
    updateAvailability: number;
    availableVersionCode: number;
    installStatus: number;
  }

  // Состояние установки
  export interface InstallState {
    bytesDownloaded?: number;
    installErrorCode?: number;
    installStatus?: number;
    packageName?: string;
    totalBytesToDownload?: number;
  }

  // Event emitter
  export const eventEmitter: {
    addListener(
      eventType: string,
      listener: (state: InstallState) => void,
    ): { remove(): void };
  };

  const RustoreUpdateClient: {
    init(): Promise<void>;
    getAppUpdateInfo(): Promise<AppUpdateInfo>;
    download(): Promise<number>;
    immediate(): Promise<number>;
    silent(): Promise<number>;
    completeUpdate(): Promise<void>;
  };

  export default RustoreUpdateClient;
}
