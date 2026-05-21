import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { FilterType } from "../types";
import EmptyInvoicesList from "../components/EmptyInvoicesList";
import InvocesList from "../components/InvocesList";
import { PremiumBanner } from "@/shared/premium/components/PremiumBanner";
import InvoiceListFilter from "../components/InvoiceListFilter";
import { useAppContext } from "@/shared/context/AppContext";
import { filteredInvoices } from "../utils/functions";
import ScreenScrollContainer from "@/shared/components/ScreenScrollContainer";
import { useStorage } from "@/shared/storage/ useAppStorage";
import { Invoice } from "@/types/main";
import { useFocusEffect } from "expo-router";
import InvoiceSearchContainer from "@/features/search/components/InvoiceSearchContainer";
import * as LucideIcons from "lucide-react-native";
import { usePremiumContext } from "@/shared/context/PremiumContext";

export default function HistoryScreen() {
  const { premiumStatus } = usePremiumContext();
  const { themeObject } = useCustomTheme();

  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchopen, setIsSearchOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [originalInvoices, setOriginalInvoices] = useState<Invoice[]>([]);

  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const storage = useStorage();

  const getStorageInvoices = async () => {
    setIsLoading(true);
    try {
      const loadedInvoices = await storage.loadInvoices();
      setInvoices(loadedInvoices);
      setOriginalInvoices(loadedInvoices);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStorageInvoices();
      return () => {
        console.log("Screen historyScreen unfocused");
      };
    }, []),
  );

  const toggleSeachOpen = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <ThemedView style={styles.container}>
      <InvoiceListFilter filter={filter} setFilter={setFilter} />
      <ScreenScrollContainer stickyHeaderIndices={[0]}>
        <ThemedView>
          {isLoading ? (
            <Text
              style={{
                color: Colors.notesText,
                marginHorizontal: 16,
                marginBottom: 12,
              }}
            >
              загрузка...
            </Text>
          ) : (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 20,
              }}
            >
              <Text
                style={{
                  color: Colors.notesText,
                  marginHorizontal: 16,
                  marginBottom: 12,
                }}
              >
                Всего:{" "}
                {
                  filteredInvoices(filter, invoices).filter((i) => {
                    return i.deleted === false;
                  }).length
                }{" "}
                счетов
              </Text>
              {premiumStatus.isPremium && (
                <TouchableOpacity onPress={toggleSeachOpen}>
                  <LucideIcons.Search size={30} color={Colors.tint} />
                </TouchableOpacity>
              )}
            </View>
          )}

          {isSearchopen && (
            <InvoiceSearchContainer
              originalData={originalInvoices}
              setData={setInvoices}
            />
          )}
        </ThemedView>
        {!premiumStatus.isPremium && <PremiumBanner />}
        {filteredInvoices(filter, invoices).length !== 0 ? (
          <InvocesList
            filter={filter}
            invoices={invoices}
            setFilter={setFilter}
            setInvoices={setInvoices}
          />
        ) : (
          <EmptyInvoicesList filter={filter} invoices={invoices} />
        )}
      </ScreenScrollContainer>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    premiumFooter: {
      marginHorizontal: 16,
      marginBottom: 20,
      marginTop: 10,
    },
  });
};
