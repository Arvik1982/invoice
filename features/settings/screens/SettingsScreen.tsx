import React, { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import SectionContainer from "@/shared/components/SectionContainer";
import SwitchContainer from "@/shared/components/SwitchContainer";
// import InputField from "@/shared/ui/InputField";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import { STORAGE_KEYS } from "@/shared/storage/storage";
import { useStorage } from "@/shared/storage/ useAppStorage";
import Toast from "react-native-toast-message";

export default function SettingsScreen() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const storage = useStorage();
  const [deleteAll, setDeleteAll] = useState(false);
  // const [createArchive, setCreateArchive] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [firstNumber, setFirstNumber] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (deleteAll) {
        await storage.remove(STORAGE_KEYS.COUNTERS.CERTIFICATE_COUNTER);
        await storage.remove(STORAGE_KEYS.COUNTERS.INVOICE_COUNTER);
        Toast.show({
          type: "success",
          text1: "Нумерация успешно сброшена",
        });
        setDeleteAll(false);
        setLoading(false);
      } else {
        setLoading(false);
        return;
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SectionContainer title="Настройки">
        {/* <SwitchContainer
          title="Начать новую нумерацию"
          text="Все старые документы бубут перенесены в архив"
        >
          <Switch
            value={createArchive}
            onValueChange={setCreateArchive}
            trackColor={{
              false: Colors.sectionBackground2,
              true: Colors.succsess + "40",
            }}
            thumbColor={createArchive ? Colors.succsess : Colors.icon}
            ios_backgroundColor={Colors.sectionBackground2}
          />
        </SwitchContainer> */}

        <SwitchContainer
          title="Сброс нумерации"
          text="Начать нумерацию документов сначала"
        >
          <Switch
            disabled={loading}
            value={deleteAll}
            onValueChange={setDeleteAll}
            trackColor={{
              false: Colors.sectionBackground2,
              true: Colors.succsess + "40",
            }}
            thumbColor={deleteAll ? Colors.succsess : Colors.icon}
            ios_backgroundColor={Colors.sectionBackground2}
          />
        </SwitchContainer>

        {/* <SwitchContainer
          title="Задать начальный номер"
          text="Указать номер первого документа вручную"
          >
          <Switch
            value={firstNumber}
            onValueChange={setFirstNumber}
            trackColor={{
              false: Colors.sectionBackground2,
              true: Colors.succsess + "40",
            }}
            thumbColor={firstNumber ? Colors.succsess : Colors.icon}
            ios_backgroundColor={Colors.sectionBackground2}
          />
        </SwitchContainer>
        {firstNumber && (
          <View style={{ marginVertical: 8 }}>
            <InputField editable></InputField>
          </View>
        )} */}

        <View style={{ marginTop: 18, height: 60 }}>
          <ButtonGroup
            disabled={loading}
            variant="primary"
            title={loading ? "Сохраняем..." : "Сохранить"}
            onPress={handleSave}
          />
        </View>
      </SectionContainer>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    buttonWrapper: {
      flex: 1,
      backgroundColor: "red",
    },
  });
};
