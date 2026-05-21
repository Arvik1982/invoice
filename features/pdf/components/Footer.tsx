import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { sharePdf } from "@/shared/lib/functions/sharePdf";
import { useStorage } from "@/shared/storage/ useAppStorage";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import { ThemedView } from "@/shared/ui/ThemedView";
import { trackEvent } from "@/tracker/tracker";
import { ColorPalette } from "@/types/configs";
import { router, useLocalSearchParams } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { memo, useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const Footer = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const storage = useStorage();

  const loadInvoise = async () => {
    setLoading(true);
    try {
      const data = await storage.getInvoice(id);

      const isOnlyCertificate = data?.type === "certificate";

      await sharePdf(
        id,
        {
          fileName: `Счет_${id}.pdf`,
          shareTitle: "Отправить счет",
          showAlert: true,
        },
        isOnlyCertificate,
      );
      setLoading(false);
    } catch {
      console.error("ERROR_LOAD:loadInvoicePdfscreen");
      setLoading(false);
    }
  };

  const handleSharePdf = async () => {
    trackEvent("pdf_share_button_click", {
      source: "pdf",
      location: "pdf_preview",
    });
    if (!id) return;

    try {
      await loadInvoise();
    } catch {
      Toast.show({
        type: "error",
        text1: "Отправка запрещена на устройстве",
        text2: "",
      });
    }
  };

  return (
    <ThemedView style={styles.bottomPanel}>
      <ButtonGroup
        variant="primary"
        activeOpacity={0.8}
        title="Закрыть"
        onPress={() => {
          router.navigate("/(tabs)/history");
        }}
      >
        {/* <LucideIcons.Share size={20} color={Colors.tint} /> */}
      </ButtonGroup>

      <ButtonGroup
        disabled={loading}
        variant="secondary"
        activeOpacity={0.8}
        title={loading ? "Отправка..." : "Отправить PDF"}
        onPress={handleSharePdf}
      >
        <LucideIcons.Share size={20} color={Colors.tint} />
      </ButtonGroup>
    </ThemedView>
  );
};
export default memo(Footer);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    bottomPanel: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: Colors.backgroundItem,
      borderRadius: 16,
      padding: 16,
      flexDirection: "column",
      gap: 12,
    },
  });
};
