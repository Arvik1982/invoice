import { FlatList } from "react-native";
import InvoiceItem from "./InvoiceItem";
import { filteredInvoices } from "../utils/functions";
import { Invoice } from "@/types/main";
import { FilterType } from "../types";
import { memo, useMemo, useState } from "react";
import { useStorage } from "@/shared/storage/ useAppStorage";
import AnimatedContainer from "@/shared/components/AnimatedContainer";
import { FadeInDown } from "react-native-reanimated";

type Props = {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  filter: FilterType;
  setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

const InvoicesList = ({ invoices, filter, setFilter, setInvoices }: Props) => {
  const storage = useStorage();
  const [isLoading, setIsLoading] = useState(false);
  const sortedInvoices = useMemo(() => {
    return invoices.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [invoices]);

  const handleDeleteInvoice = async (invoice: Invoice) => {
    const newInvoices = invoices.filter((i) => {
      return i.id !== invoice.id;
    });

    setInvoices(newInvoices);

    setIsLoading(true);
    try {
      await storage.deleteInvoice(invoice.id);
    } catch {
      console.error("ERROR_DELETE:INVOICE");
    } finally {
      setIsLoading(false);
    }
  };

  if (filteredInvoices(filter, invoices).length === 0) {
    return null;
  }

  return (
    <AnimatedContainer entering={FadeInDown.delay(300)}>
      <FlatList
        data={filteredInvoices(filter, sortedInvoices).filter((i) => {
          return i.deleted !== true;
        })}
        renderItem={({ item, index }) => (
          <InvoiceItem
            item={item}
            index={index}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onDelete={handleDeleteInvoice}
          />
        )}
        keyExtractor={(item) => item.id + item.invoiceNumber}
        scrollEnabled={false}
      />
    </AnimatedContainer>
  );
};

export default memo(InvoicesList);
