import React, { memo, useCallback, useEffect, useState } from "react";
import { ServiceItemDetails, ServiceTemplate } from "../../../types/main";
import { ThemedText } from "@/shared/ui/ThemedText";
import { StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatCurrency } from "@/shared/lib/utils/formaters";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { INVOICE_PATHS } from "@/shared/constants/paths";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Fonts } from "@/shared/config/fonts";
import InputField from "@/shared/ui/InputField";
import { LABEL_TEXT_STYLES } from "@/shared/constants/styles";
import SwitchContainer from "@/shared/components/SwitchContainer";
import Toast from "react-native-toast-message";
import { storage, STORAGE_KEYS } from "@/shared/storage/storage";

type Props = {
  index: number;
  item: ServiceItemDetails;
  onRemove: (index: number) => void;
};

const ServiceItem = ({ item, index, onRemove }: Props) => {
  const { themeObject } = useCustomTheme();
  const { setValue, getValues } = useInvoiceForm();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const [name, setName] = useState(item.ServiceItem);
  const [price, setPrice] = useState(item.price);
  const [newTemplate, setNewTemplate] = useState<ServiceTemplate>({
    name: "",
    price: 0,
    id: "",
    notes: "",
  });
  const existTemplate = item.templateId !== "0";
  const [quantity, setQuantity] = useState(item.quantity);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempPrice, setTempPrice] = useState(item.price?.toString());

  const updateTotalSumm = useCallback(() => {
    const services = getValues(INVOICE_PATHS.INVOICE_DETAILS_SERVICES) || [];
    const total = services.reduce((sum, service) => {
      return sum + service.price * service.quantity;
    }, 0);
    setValue(INVOICE_PATHS.INVOICE_DETAILS_TOTAL_SUMM as any, total, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [getValues, setValue]);

  const handleIncrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
    }
  };

  const handleRemoveService = useCallback(() => {
    onRemove(index);
    updateTotalSumm();
  }, [index, onRemove, updateTotalSumm]);

  const updateFormData = useCallback(() => {
    const services = getValues(INVOICE_PATHS.INVOICE_DETAILS_SERVICES) || [];
    if (services[index]) {
      const updatedServices = [...services];
      updatedServices[index] = {
        ...updatedServices[index],
        ServiceItem: name,
        price: price,
        quantity: quantity,
      };

      setValue(INVOICE_PATHS.INVOICE_DETAILS_SERVICES as any, updatedServices, {
        shouldValidate: true,
        shouldDirty: true,
      });

      updateTotalSumm();
    }
  }, [name, price, quantity, index, getValues, setValue, updateTotalSumm]);

  useEffect(() => {
    updateFormData();
  }, [quantity, price, name, updateFormData, getValues]);

  const handlePriceSubmit = () => {
    const numPrice = parseFloat(tempPrice);
    if (!isNaN(numPrice) && numPrice >= 0) {
      setPrice(numPrice);
      setNewTemplate((prev) => {
        return { ...prev, price: numPrice };
      });
    }
    setIsEditingPrice(false);
  };

  const handlePriceChange = (text: string) => {
    const cleanedText = text.replace(/[^\d.]/g, "");
    const parts = cleanedText.split(".");
    if (parts.length > 2) return;
    setTempPrice(cleanedText);
  };

  const handlePriceBlur = () => handlePriceSubmit();
  const handlePriceFocus = () => {
    setIsEditingPrice(true);
    setTempPrice(price.toString());
  };

  const handleNameSubmit = () => {
    setIsEditingName(false);
    setNewTemplate((prev) => {
      return { ...prev, name: name };
    });
  };
  const handleNameChange = (text: string) => setName(text);
  const handleNameBlur = () => handleNameSubmit();

  const handleNameFocus = () => {
    !existTemplate && setIsEditingName(true);
  };

  const serviceTotal = price * quantity;

  const saveTemplates = async (updatedTemplates: ServiceTemplate[]) => {
    try {
      await storage.save(STORAGE_KEYS.SERVICE_TEMPLATES, updatedTemplates);
    } catch (error) {
      console.error("Ошибка сохранения шаблонов:", error);
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось сохранить шаблоны",
      });
    }
  };

  const createTemplate = useCallback(async () => {
    if (!name.trim() || price <= 0) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Заполните все поля",
      });
      return;
    }

    try {
      const newId = item.id;

      const templateToSave = {
        name: name.trim(),
        price: price,
        id: newId,
        notes: "",
      };

      setNewTemplate(templateToSave);

      const savedTemplates = await storage.load<ServiceTemplate[]>(
        STORAGE_KEYS.SERVICE_TEMPLATES,
        [],
      );

      const exist = savedTemplates.find((i) => {
        return i.id === templateToSave.id;
      });

      if (exist) {
        console.log({ exist });

        const updatedTemplates = savedTemplates.filter((i) => {
          return i.id !== templateToSave.id;
        });
        await saveTemplates(updatedTemplates);
        Toast.show({
          type: "success",
          text1: "Шаблон удален",
          text2: `${templateToSave.name} УДАЛЕН из списка`,
        });
        setNewTemplate((prev) => {
          return { ...prev, id: "" };
        });
        return;
      }

      const updatedTemplates = [...savedTemplates, templateToSave];
      await saveTemplates(updatedTemplates);

      Toast.show({
        type: "success",
        text1: "Шаблон создан",
        text2: `${templateToSave.name} добавлен в список`,
      });
    } catch {
      console.error("error_createTemplate");
    }
  }, [name, price, item.id]);

  const handleSaveTemplate = () => {
    createTemplate();
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 50)}>
      <LinearGradient
        colors={[Colors.backgroundItem, Colors.accentBackground1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.serviceCard}
      >
        {/* Заголовок с кнопкой удаления */}
        <View style={styles.headerRow}>
          {isEditingName ? (
            <View style={styles.nameInputWrapper}>
              <InputField
                label="Название"
                icon={
                  <View style={styles.serviceIcon}>
                    <LucideIcons.Briefcase size={16} color={Colors.tint} />
                  </View>
                }
                editable={isEditingName}
                value={name}
                onChangeText={handleNameChange}
                onBlur={handleNameBlur}
                onSubmitEditing={handleNameSubmit}
                autoFocus
                style={styles.nameInput}
                placeholder="Название Услуги"
              />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleNameFocus}
              activeOpacity={0.7}
              style={{ flex: 1 }}
            >
              <InputField
                label="Название"
                icon={
                  <View style={styles.serviceIcon}>
                    <LucideIcons.Briefcase size={16} color={Colors.tint} />
                  </View>
                }
                editable={isEditingName}
                value={name}
                onChangeText={handleNameChange}
                onBlur={handleNameBlur}
                onSubmitEditing={handleNameSubmit}
                autoFocus
                style={styles.nameInput}
                placeholder="Название Услуги"
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleRemoveService}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <LucideIcons.X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Блок цены и количества в одну строку */}
        <View style={styles.detailsRow}>
          {/* Цена */}
          <View style={styles.detailBlock}>
            {isEditingPrice ? (
              <InputField
                label="Цена"
                editable={isEditingPrice}
                value={tempPrice !== "0" ? tempPrice : ""}
                onChangeText={handlePriceChange}
                onBlur={handlePriceBlur}
                onSubmitEditing={handlePriceSubmit}
                autoFocus
                keyboardType="decimal-pad"
                style={styles.priceInput}
              />
            ) : (
              <TouchableOpacity onPress={handlePriceFocus} activeOpacity={0.7}>
                <InputField
                  label="Цена"
                  value={formatCurrency(price) || "0"}
                  onChangeText={handlePriceChange}
                  onBlur={handlePriceBlur}
                  onSubmitEditing={handlePriceSubmit}
                  autoFocus
                  keyboardType="decimal-pad"
                  style={styles.priceInput}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Количество */}
          <View style={styles.detailBlock}>
            <ThemedText style={styles.detailLabel}>Кол-во</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity === 1 && styles.quantityButtonDisabled,
                ]}
                onPress={handleDecrementQuantity}
                disabled={quantity === 1}
                activeOpacity={0.6}
              >
                <ThemedText
                  style={[
                    styles.quantityButtonText,
                    quantity === 1 && styles.quantityButtonTextDisabled,
                  ]}
                >
                  −
                </ThemedText>
              </TouchableOpacity>

              <View style={styles.quantityValue}>
                <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncrementQuantity}
                activeOpacity={0.6}
              >
                <ThemedText style={styles.quantityButtonText}>+</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Итоговая сумма */}
        <View style={styles.totalRow}>
          <ThemedText style={styles.totalLabel}>Сумма:</ThemedText>
          <View style={styles.totalBadge}>
            <ThemedText style={styles.totalText}>
              {formatCurrency(serviceTotal)}
            </ThemedText>
          </View>
        </View>

        {!existTemplate && (
          <SwitchContainer
            text="Будет создан шаблон для быстрого выбора в будущем "
            title="Запомнить услугу"
          >
            <Switch
              value={newTemplate.id === item.id}
              onValueChange={handleSaveTemplate}
              trackColor={{
                false: Colors.sectionBackground2,
                true: Colors.succsess + "40",
              }}
              thumbColor={true ? Colors.succsess : Colors.icon}
              ios_backgroundColor={Colors.sectionBackground2}
            />
          </SwitchContainer>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default memo(ServiceItem);

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    serviceCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },

    nameInputWrapper: {
      marginTop: 8,
      flex: 1,
    },

    nameInput: {
      flex: 1,
    },

    serviceIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: Colors.accentBackground2,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    removeButton: {
      position: "absolute",
      right: 0,
      top: 0,
      width: 36,
      height: 36,
      borderRadius: 8,
      backgroundColor: Colors.transparentWhite05,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    detailBlock: {
      flex: 1,
      gap: 8,
      marginLeft: 4,
    },

    detailLabel: LABEL_TEXT_STYLES(Colors),

    priceInput: {
      marginTop: 0,
      marginBottom: 0,
    },

    quantityContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.transparentWhite05,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.borderLight,
      paddingHorizontal: 6,
      paddingVertical: 6,
      height: 51,
    },

    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 6,
      backgroundColor: Colors.sectionBackground1,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    quantityButtonDisabled: {
      opacity: 0.4,
    },

    quantityButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.tint,
      fontFamily: Fonts.semiBold.fontFamily,
    },

    quantityButtonTextDisabled: {
      color: Colors.textTertiary,
    },

    quantityValue: {
      marginHorizontal: 8,
      minWidth: 20,
    },

    quantityText: {
      fontSize: 15,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold.fontFamily,
      textAlign: "center",
    },

    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: Colors.accentBackground2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.borderAccent,
    },

    totalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      fontFamily: Fonts.semiBold.fontFamily,
    },

    totalBadge: {
      backgroundColor: Colors.sectionBackground1,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: Colors.borderLight,
    },

    totalText: {
      fontSize: 15,
      fontWeight: "700",
      color: Colors.tint,
      fontFamily: Fonts.bold.fontFamily,
    },
  });
};
