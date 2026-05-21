import InfoSectionContainer from "@/shared/components/InfoSectionContainer";
import * as LucideIcons from "lucide-react-native";
import InputField from "@/shared/ui/InputField";
import { ClientDetails } from "@/types/main";
import { debounce } from "lodash";
import { useEffect } from "react";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";

export default function ClientSearchContainer({
  originalData,
  setData,
}: {
  originalData: ClientDetails[];
  setData: React.Dispatch<React.SetStateAction<ClientDetails[]>>;
}) {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;

  const handleSaveInvoices = (newInvoicesArg: ClientDetails[]) => {
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
        i.clientName.toLowerCase().includes(vl) ||
        i.inn.toLowerCase().includes(vl)
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
        placeholder="Поиск Заказчика "
        editable
        label="Найти"
        icon={<LucideIcons.Glasses size={20} color={Colors.tint} />}
      />
    </InfoSectionContainer>
  );
}
