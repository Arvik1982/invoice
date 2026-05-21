import { PremiumStatusFieldValue, PremiumStatusPath } from "@/types/configs";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

export const handleBuyPremium = (
  setIsPremium: <T extends PremiumStatusPath>(params: {
    field: T;
    data: PremiumStatusFieldValue<T>;
  }) => void,
) => {
  Alert.alert(
    "Премиум подписка",
    "Премиум 149 ₽/мес:\n\n✅ Безлимитное количество счетов\n",
    [
      { text: "Отмена", style: "cancel" },
      {
        text: "Купить",
        onPress: () => {
          setIsPremium({ field: "isPremium", data: true });
          Toast.show({
            type: "success",
            text1: "Премиум подписка активирована!",
            text2: "",
          });
        },
      },
    ],
  );
};
