import InfoSectionContainer from "@/shared/components/InfoSectionContainer";
import * as LucideIcons from "lucide-react-native";
import InputField from "@/shared/ui/InputField";
import { Invoice } from "@/types/main";
import { debounce } from "lodash";
import { useEffect } from "react";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";

export default function InvoiceSearchContainer({
  originalData,
  setData,
}: {
  originalData: Invoice[];
  setData: React.Dispatch<React.SetStateAction<Invoice[]>>;
}) {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;

  const handleSaveInvoices = (newInvoicesArg: Invoice[]) => {
    setData(newInvoicesArg);
  };
  const handleDebouncedSearch = debounce((value) => {
    if (value === "") {
      setData(originalData);
      return;
    }
    const vl = value.toLowerCase();
    const newInvoices = originalData?.filter((i) => {
      return (
        i.invoiceDetails.client.clientName.toLowerCase().includes(vl) ||
        i.invoiceDetails.client.inn.toLowerCase().includes(vl) ||
        i.invoiceNumber === vl.trim() ||
        i.invoiceDetails.client.phone.trim().includes(vl.trim())
      );
    });
    handleSaveInvoices(newInvoices);
  }, 300);

  useEffect(() => {
    return () => {
      handleSaveInvoices(originalData);
    };
  }, []);

  return (
    <InfoSectionContainer index={0}>
      <InputField
        onChangeText={handleDebouncedSearch}
        placeholder="Поиск документа "
        editable
        label="Найти"
        icon={<LucideIcons.Glasses size={20} color={Colors.tint} />}
      />
    </InfoSectionContainer>
  );
}
