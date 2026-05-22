import { STORAGE_KEYS } from "@/shared/storage/storage";
import { ClientDetails } from "@/types/main";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { router, useFocusEffect } from "expo-router";
import ClientItem from "../components/ClientItem";
import Toast from "react-native-toast-message";
import { ThemedView } from "@/shared/ui/ThemedView";
import ClientSearchContainer from "@/features/search/components/ClientSearchContainer";
import { usePremiumContext } from "@/shared/context/PremiumContext";

export default function ClientsScreen() {
  const [clients, setClients] = useState<ClientDetails[]>([]);
  const [originalClients, setOriginalClients] = useState<ClientDetails[]>([]);
  const storage = useStorage();
  const { themeObject } = useCustomTheme();
  const { setValue } = useInvoiceForm();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);

  const { premiumStatus } = usePremiumContext();
  const [isSearchopen, setIsSearchOpen] = useState(false);

  const toggleSeachOpen = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const loadStorageClients = async () => {
    try {
      const data = await storage.load<ClientDetails[]>(
        STORAGE_KEYS.CLIENTS,
        [],
      );
      setClients(data);
      setOriginalClients(data);
    } catch {
      console.error("ERROR_LOAD:loadStorageClients");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStorageClients();
    }, []),
  );

  const handleAddToInvoice = (client: ClientDetails) => {
    setValue(INVOICE_PATHS.INVOICE_DETAILS_CLIENT, client);
    router.navigate("/");
  };

  const handleDeleteClient = async (client: ClientDetails) => {
    const newClients = clients.filter((i) => {
      return i.createdAt !== client.createdAt;
    });

    setClients(newClients);

    try {
      storage.save(STORAGE_KEYS.CLIENTS, newClients);
    } catch (err) {
      console.error(err);
      Toast.show({
        type: "error",
        text1: "Ошибка удаления",
      });
    }
  };

  const renderClientItem = ({
    item,
    index,
  }: {
    item: ClientDetails;
    index: number;
  }) => (
    <ClientItem
      item={item}
      index={index}
      onAddToInvoice={handleAddToInvoice}
      onDelete={handleDeleteClient}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <LucideIcons.Users size={48} color={Colors.text} opacity={0.3} />
      </View>
      <Text style={styles.emptyTitle}>Нет Заказчиков</Text>
      <Text style={styles.emptySubtitle}>
        Добавьте первого Заказчика, чтобы начать работу
      </Text>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginHorizontal: 16,
          marginBottom: 8,
        }}
      >
        {premiumStatus.isPremium && (
          <TouchableOpacity onPress={toggleSeachOpen}>
            <LucideIcons.Search size={30} color={Colors.tint} />
          </TouchableOpacity>
        )}
      </ThemedView>
      {isSearchopen && (
        <ClientSearchContainer
          originalData={originalClients}
          setData={setClients}
        />
      )}

      <FlatList
        data={clients}
        renderItem={renderClientItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 80,
      paddingHorizontal: 40,
    },
    emptyIconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.sectionBackground1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
      fontFamily: Fonts.bold.fontFamily,
      marginBottom: 8,
      textAlign: "center",
    },
    emptySubtitle: {
      fontSize: 15,
      color: Colors.text,
      opacity: 0.6,
      fontFamily: Fonts.regular.fontFamily,
      textAlign: "center",
      lineHeight: 22,
    },
  });
};
