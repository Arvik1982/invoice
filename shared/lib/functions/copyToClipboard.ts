import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

export const copyToClipboard = async (
  data: any,
  successMessage = "Скопировано в буфер обмена"
) => {
  try {
    let textToCopy = "";

    if (typeof data === "string") {
      textToCopy = data.trim();
    } else if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        textToCopy = data
          .filter((item) => item != null)
          .map((item) => String(item))
          .join("\n");
      } else {
        textToCopy = Object.entries(data)
          .filter(([_, value]) => value != null && value !== "")
          .map(([key, value]) => {
            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            return `${formattedKey}: ${value}`;
          })
          .join("\n");
      }
    } else if (data != null) {
      textToCopy = String(data);
    }

    await Clipboard.setStringAsync(textToCopy);
    Toast.show({
      type: "success",
      text1: successMessage,
      text2: "",
    });
    return true;
  } catch (error) {
    console.error("Ошибка копирования:", error);

    return false;
  }
};
