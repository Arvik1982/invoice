import { ClientDetails } from "@/types/main";
import React, { memo } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { Fonts } from "@/shared/config/fonts";
import { ColorPalette } from "@/types/configs";
import { LinearGradient } from "expo-linear-gradient";
import { formatPhone } from "@/shared/lib/utils/formaters";
import StackContainer from "@/shared/components/StackContainer";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import { Trash } from "@/shared/Trash";
import CardContainer from "@/shared/components/CardContainer";
import SectionContainer from "@/shared/components/SectionContainer";

interface ClientItemProps {
  item: ClientDetails;
  index: number;
  onAddToInvoice: (client: ClientDetails) => void;

  onDelete: (client: ClientDetails) => void;
}

const ClientItem = ({
  item,
  index,
  onAddToInvoice,
  //   onEdit,
  onDelete,
}: ClientItemProps) => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const handleDeletePress = () => {
    Alert.alert(
      "Удалить Заказчика?",
      `Заказчик "${item.clientName}" будет удален`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: () => onDelete(item),
        },
      ],
    );
  };

  return (
    <SectionContainer>
      <View style={styles.cardHeader}>
        <View style={styles.clientIconContainer}>
          <LinearGradient
            colors={[Colors.accentBackground2, Colors.accentBackground3]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.clientIcon}
          >
            <LucideIcons.User size={22} color={Colors.tint} />
          </LinearGradient>
        </View>

        <View style={styles.clientNameSection}>
          <Text style={styles.clientName} numberOfLines={1}>
            {item.clientName}
          </Text>

          {item.inn && (
            <View style={styles.innBadge}>
              <LucideIcons.FileText
                size={12}
                color={Colors.text}
                opacity={0.7}
              />
              <Text style={styles.innText}>Инн: {item.inn}</Text>
            </View>
          )}
        </View>
        {/* Вторичные кнопки */}

        <Trash onPress={handleDeletePress} />
      </View>

      {/* Информация о Заказчике */}
      <StackContainer>
        {/* Email */}
        {(item.email || item.phone) && (
          <CardContainer>
            {item.email && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <LucideIcons.Mail
                    size={14}
                    color={Colors.text}
                    opacity={0.6}
                  />
                  <Text style={styles.infoLabel}>Email</Text>
                </View>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {item.email}
                </Text>
              </View>
            )}

            {/* Телефон */}
            {item.phone && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <LucideIcons.Phone
                    size={14}
                    color={Colors.text}
                    opacity={0.6}
                  />
                  <Text style={styles.infoLabel}>Телефон</Text>
                </View>
                <Text style={styles.infoValue}>{formatPhone(item.phone)}</Text>
              </View>
            )}
          </CardContainer>
        )}
      </StackContainer>

      {/* Кнопки действий */}
      <View style={styles.actionsSection}>
        {/* Кнопка "Добавить в счет" - основная */}

        <ButtonGroup
          variant="primary"
          title="Добавить в счет"
          onPress={() => onAddToInvoice(item)}
          activeOpacity={0.7}
        />
      </View>
    </SectionContainer>
  );
};

export default memo(ClientItem);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    clientIconContainer: {
      marginRight: 12,
    },
    clientIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    clientNameSection: {
      flex: 1,
      paddingHorizontal: 5,
      marginRight: 5,
    },
    clientName: {
      fontSize: 18,
      fontWeight: "700",
      color: Colors.text,
      fontFamily: Fonts.bold.fontFamily,
      letterSpacing: -0.3,
      marginBottom: 4,
    },
    innBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: Colors.sectionBackground1,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    innText: {
      fontSize: 12,
      color: Colors.text,
      opacity: 0.7,
      fontFamily: Fonts.regular.fontFamily,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    infoLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    infoLabel: {
      fontSize: 13,
      color: Colors.text,
      opacity: 0.6,
      fontFamily: Fonts.regular.fontFamily,
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "500",
      color: Colors.text,
      fontFamily: Fonts.medium.fontFamily,
      letterSpacing: -0.2,
      flex: 1,
      textAlign: "right",
      marginLeft: 8,
    },
    actionsSection: {
      gap: 12,
    },
  });
};
