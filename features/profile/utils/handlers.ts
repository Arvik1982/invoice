// import * as ImagePicker from "expo-image-picker";
// import { InvoiceFieldValue, InvoicePath, SettingsPath } from "@/types/configs";
// import { INVOICE_PATHS } from "@/shared/constants/paths";
// import Toast from "react-native-toast-message";
// import { ContractorDetails } from "@/types/main";

// export const handleEditToggle = (
//   isEditing: boolean,
//   setOriginalDetails: React.Dispatch<React.SetStateAction<ContractorDetails>>,
//   currentDetails: ContractorDetails,
//   setAppSettingsFunc: <T extends SettingsPath>(params: {
//     field: T;
//     data: any;
//   }) => void
// ) => {
//   if (isEditing) {
//     Toast.show({
//       type: "success",
//       text1: "Сохранено",
//       text2: "Реквизиты успешно обновлены",
//     });

//     setOriginalDetails(currentDetails);
//   } else {
//     setOriginalDetails({ ...currentDetails });
//   }
//   setAppSettingsFunc({
//     field: "isEditing",
//     data: false,
//   });
// };

// export const handlePickLogo = async (
//   setIpDetails: <T extends InvoicePath>(params: {
//     field: T;
//     data: InvoiceFieldValue<T>;
//   }) => void
// ) => {
//   const permissionResult =
//     await ImagePicker.requestMediaLibraryPermissionsAsync();

//   if (permissionResult.granted === false) {
//     Toast.show({
//       type: "error",
//       text1: "Ошибка",
//       text2: "Требуется доступ к галерее",
//     });

//     return;
//   }

//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     allowsEditing: true,
//     aspect: [1, 1],
//     quality: 0.8,
//     base64: true,
//   });

//   if (!result.canceled && result.assets[0].base64) {
//     setIpDetails({
//       field: INVOICE_PATHS.CONTRACTOR_LOGO_URI,
//       data: `data:image/jpeg;base64,${result.assets[0].base64}`,
//     });

//     Toast.show({
//       type: "success",
//       text1: "Логотип обновлён",
//       text2: "",
//     });
//   }
// };

// export const handleTakePhoto = async (
//   setIpDetails: <T extends InvoicePath>(params: {
//     field: T;
//     data: InvoiceFieldValue<T>;
//   }) => void
// ) => {
//   const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//   if (permissionResult.granted === false) {
//     Toast.show({
//       type: "error",
//       text1: "Ошибка",
//       text2: "Требуется доступ к галерее",
//     });
//     return;
//   }

//   const result = await ImagePicker.launchCameraAsync({
//     allowsEditing: true,
//     aspect: [1, 1],
//     quality: 0.8,
//     base64: true,
//   });

//   if (!result.canceled && result.assets[0].base64) {
//     setIpDetails({
//       field: INVOICE_PATHS.CONTRACTOR_LOGO_URI,
//       data: `data:image/jpeg;base64,${result.assets[0].base64}`,
//     });
//     Toast.show({
//       type: "success",
//       text1: "Логотип обновлён",
//       text2: "",
//     });
//   }
// };
// // utils/handlers.ts
