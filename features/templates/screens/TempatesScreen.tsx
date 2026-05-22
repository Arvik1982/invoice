import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { formatCurrency } from "@/shared/lib/utils/formaters";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react-native";
import ButtonGroup from "@/shared/ui/ButtonGroup";
import Toast from "react-native-toast-message";
import { ServiceTemplate, ServiceItemDetails, Invoice } from "@/types/main";
import { useInvoiceForm } from "@/shared/context/InvoiceFormContext";
import { useWatch } from "react-hook-form";
import { storage, STORAGE_KEYS } from "@/shared/storage/storage";

export default function TemplatesScreen() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  const { control, setValue } = useInvoiceForm();
  const invoice = useWatch({ control }) as Invoice;

  // Состояния
  const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<ServiceTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    price: "",
  });

  // Загружаем шаблоны из хранилища при загрузке компонента
  useEffect(() => {
    loadTemplates();
  }, []);

  // Загрузка шаблонов из AsyncStorage
  const loadTemplates = async () => {
    try {
      const savedTemplates = await storage.load<ServiceTemplate[]>(
        STORAGE_KEYS.SERVICE_TEMPLATES,
        [],
      );
      setTemplates(savedTemplates);
    } catch (error) {
      console.error("Ошибка загрузки шаблонов:", error);
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось загрузить шаблоны",
      });
    }
  };

  // Сохранение шаблонов в AsyncStorage
  const saveTemplates = async (updatedTemplates: ServiceTemplate[]) => {
    try {
      await storage.save(STORAGE_KEYS.SERVICE_TEMPLATES, updatedTemplates);
      setTemplates(updatedTemplates);
    } catch (error) {
      console.error("Ошибка сохранения шаблонов:", error);
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Не удалось сохранить шаблоны",
      });
    }
  };

  // Обновление выбранного шаблона при изменении selectedTemplateId
  useEffect(() => {
    if (selectedTemplateId && templates.length > 0) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId, templates]);

  // Создание нового шаблона
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.price.trim()) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Заполните все поля",
      });
      return;
    }

    const price = parseFloat(newTemplate.price);

    if (isNaN(price) || price <= 0) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Введите корректную цену",
      });
      return;
    }

    // Генерируем ID для шаблона
    const templateId = Date.now().toString();

    // Создаем новый шаблон
    const newTemplateItem: ServiceTemplate = {
      id: templateId,
      name: newTemplate.name.trim(),
      price: price,
      notes: "",
    };

    // Сохраняем в хранилище
    const updatedTemplates = [...templates, newTemplateItem];
    await saveTemplates(updatedTemplates);

    // Выбираем созданный шаблон
    setSelectedTemplateId(templateId);

    // Сбрасываем форму
    setNewTemplate({ name: "", price: "" });
    setShowCreateModal(false);

    Toast.show({
      type: "success",
      text1: "Шаблон создан",
      text2: `${newTemplate.name.trim()} добавлен в список`,
    });
  };

  // Удаление шаблона
  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      "Удалить шаблон?",
      "Вы уверены, что хотите удалить этот шаблон?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            // Удаляем шаблон из списка
            const updatedTemplates = templates.filter(
              (template) => template.id !== templateId,
            );

            await saveTemplates(updatedTemplates);

            if (selectedTemplateId === templateId) {
              setSelectedTemplateId("");
            }

            Toast.show({
              type: "success",
              text1: "Шаблон удален",
              text2: "Шаблон успешно удален",
            });
          },
        },
      ],
    );
  };

  // Добавление шаблона в текущий инвойс
  const handleAddToInvoice = () => {
    if (!selectedTemplate) return;

    const currentServices = invoice.invoiceDetails.services || [];

    // Создаем новую услугу на основе шаблона
    const newService: ServiceItemDetails = {
      name: selectedTemplate.name,
      id: Date.now().toString(),
      templateId: selectedTemplate.id,
      ServiceItem: selectedTemplate.name,
      price: selectedTemplate.price,
      quantity: 1,
      custom: false,
    };

    // Добавляем услугу в инвойс
    const updatedServices = [...currentServices, newService];

    setValue("invoiceDetails.services" as any, updatedServices);

    // Обновляем общую сумму
    const currentTotal = invoice.invoiceDetails.totalSumm || 0;
    const newTotal = currentTotal + selectedTemplate.price;

    setValue("invoiceDetails.totalSumm" as any, newTotal);

    Toast.show({
      type: "success",
      text1: "Добавлено",
      text2: `${selectedTemplate.name} добавлен в документ`,
    });
  };

  // Если шаблонов нет - показываем экран создания первого шаблона
  if (templates.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <TouchableOpacity
          style={styles.bigPlusButton}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.bigPlusCircle}>
            <LucideIcons.Plus size={60} color={Colors.tint} />
          </View>
          <Text style={styles.bigPlusText}>Создать первый шаблон</Text>
        </TouchableOpacity>

        <Text style={styles.emptyTitle}>Шаблоны услуг</Text>
        <Text style={styles.emptyText}>
          Создайте свой первый шаблон Услуги для быстрого добавления в документы
        </Text>

        {/* ✅ Bottom Sheet вместо Modal - НЕ ломает навигацию */}
        {showCreateModal && (
          <ThemedView style={styles.bottomSheetOverlay}>
            <TouchableOpacity
              style={styles.bottomSheetBackdrop}
              activeOpacity={1}
              onPress={() => setShowCreateModal(false)}
            />
            <ThemedView style={styles.bottomSheetContainer}>
              <ThemedView style={styles.bottomSheetHandle} />

              <ThemedView style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Создать первый шаблон</Text>
                <TouchableOpacity
                  onPress={() => setShowCreateModal(false)}
                  style={styles.closeButton}
                >
                  <LucideIcons.X size={24} color={Colors.text} />
                </TouchableOpacity>
              </ThemedView>

              <Text style={styles.inputLabel}>Название Услуги</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Например: Консультация"
                placeholderTextColor="#666666"
                value={newTemplate.name}
                onChangeText={(text) =>
                  setNewTemplate({ ...newTemplate, name: text })
                }
                maxLength={50}
              />

              <Text style={styles.inputLabel}>Цена</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                placeholderTextColor="#666666"
                value={newTemplate.price}
                onChangeText={(text) =>
                  setNewTemplate({ ...newTemplate, price: text })
                }
                keyboardType="decimal-pad"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowCreateModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Отмена</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleCreateTemplate}
                  activeOpacity={0.7}
                  disabled={
                    !newTemplate.name.trim() || !newTemplate.price.trim()
                  }
                >
                  <Text style={styles.saveButtonText}>Сохранить</Text>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </ThemedView>
        )}
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <Text style={styles.title}>Шаблоны услуг</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <LucideIcons.PlusCircle size={32} color={Colors.tint} />
        </TouchableOpacity>
      </ThemedView>

      {selectedTemplate ? (
        <ThemedView style={styles.selectedTemplateCard}>
          <ThemedView style={styles.templateHeader}>
            <Text style={styles.selectedTemplateName}>
              {selectedTemplate.name}
            </Text>
          </ThemedView>
          <Text style={styles.selectedTemplatePrice}>
            {formatCurrency(selectedTemplate.price)}
          </Text>

          <ButtonGroup
            variant="primary"
            onPress={handleAddToInvoice}
            activeOpacity={0.8}
            title="Добавить в документ"
            style={{ marginTop: 16 }}
          >
            <LucideIcons.FileText size={20} color={Colors.background} />
          </ButtonGroup>
        </ThemedView>
      ) : (
        <ThemedView style={styles.noSelectionCard}>
          <LucideIcons.FileText size={48} color={Colors.tint} />
          <Text style={styles.noSelectionText}>
            Выберите шаблон из списка ниже
          </Text>
        </ThemedView>
      )}

      {/* Список всех шаблонов */}
      <Text style={styles.listTitle}>Все шаблоны ({templates.length})</Text>
      <ThemedView style={styles.templatesList}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateItem,
              selectedTemplateId === template.id && styles.templateItemSelected,
            ]}
            onPress={() => setSelectedTemplateId(template.id)}
          >
            <View style={styles.templateInfo}>
              <Text style={styles.templateItemName}>{template.name}</Text>
              <Text style={styles.templateItemPrice}>
                {formatCurrency(template.price)}
              </Text>
            </View>
            <View style={styles.templateActions}>
              {selectedTemplateId === template.id && (
                <LucideIcons.CheckCircle size={20} color={Colors.tint} />
              )}
              <TouchableOpacity
                onPress={() => handleDeleteTemplate(template.id)}
                style={styles.smallDeleteButton}
              >
                <LucideIcons.Trash2 size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Кнопка добавления нового шаблона внизу */}
      <TouchableOpacity
        style={styles.addNewButton}
        onPress={() => setShowCreateModal(true)}
      >
        <LucideIcons.PlusCircle size={24} color={Colors.tint} />
        <Text style={styles.addNewText}>Добавить новый шаблон</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      {showCreateModal && (
        <ThemedView style={styles.bottomSheetOverlay}>
          <TouchableOpacity
            style={styles.bottomSheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowCreateModal(false)}
          />
          <ThemedView style={styles.bottomSheetContainer}>
            <ThemedView style={styles.bottomSheetHandle} />

            <ThemedView style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Новый шаблон</Text>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                style={styles.closeButton}
              >
                <LucideIcons.X size={24} color={Colors.text} />
              </TouchableOpacity>
            </ThemedView>

            <Text style={styles.inputLabel}>Название Услуги</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Например: Консультация"
              placeholderTextColor="#666666"
              value={newTemplate.name}
              onChangeText={(text) =>
                setNewTemplate({ ...newTemplate, name: text })
              }
              maxLength={50}
            />

            <Text style={styles.inputLabel}>Цена</Text>
            <TextInput
              style={styles.textInput}
              placeholder="0.00"
              placeholderTextColor="#666666"
              value={newTemplate.price}
              onChangeText={(text) =>
                setNewTemplate({ ...newTemplate, price: text })
              }
              keyboardType="decimal-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCreateTemplate}
                activeOpacity={0.7}
                disabled={!newTemplate.name.trim() || !newTemplate.price.trim()}
              >
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: Colors.background,
    },
    bigPlusButton: {
      alignItems: "center",
      marginBottom: 30,
    },
    bigPlusCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: Colors.backgroundItem,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: Colors.tint,
      borderStyle: "dashed",
      marginBottom: 16,
    },
    bigPlusText: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors.tint,
      marginTop: 8,
    },
    emptyTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      lineHeight: 22,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: Colors.text,
    },
    addButton: {
      padding: 8,
    },
    selectedTemplateCard: {
      backgroundColor: Colors.backgroundItem,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: Colors.tint,
      marginHorizontal: 16,
    },
    noSelectionCard: {
      backgroundColor: Colors.backgroundItem,
      borderRadius: 16,
      padding: 40,
      marginBottom: 24,
      marginHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: Colors.borderColor,
      borderStyle: "dashed",
    },
    noSelectionText: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      marginTop: 12,
    },
    templateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    selectedTemplateName: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
      flex: 1,
    },
    deleteButton: {
      padding: 4,
    },
    selectedTemplatePrice: {
      fontSize: 24,
      fontWeight: "800",
      color: Colors.tint,
    },
    listTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    templatesList: {
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    templateItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "transparent",
    },
    templateItemSelected: {
      borderColor: Colors.tint,
      backgroundColor: Colors.backgroundItem,
    },
    templateInfo: {
      flex: 1,
    },
    templateItemName: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 4,
    },
    templateItemPrice: {
      fontSize: 14,
      color: Colors.tint,
    },
    templateActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    smallDeleteButton: {
      padding: 4,
    },
    addNewButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.backgroundItem,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 30,
      marginTop: 10,
      borderWidth: 1,
      borderColor: Colors.tint,
      borderStyle: "dashed",
    },
    addNewText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.tint,
      marginLeft: 10,
    },

    bottomSheetOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
    bottomSheetBackdrop: {
      flex: 1,
    },
    bottomSheetContainer: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 20,
    },
    bottomSheetHandle: {
      width: 40,
      height: 4,
      backgroundColor: Colors.borderColor,
      borderRadius: 2,
      alignSelf: "center",
      marginVertical: 12,
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: Colors.text,
    },
    closeButton: {
      padding: 4,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.text,
      marginBottom: 8,
      marginTop: 16,
    },
    textInput: {
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: Colors.text,
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },
    modalButtons: {
      flexDirection: "row",
      marginTop: 32,
      gap: 12,
    },
    modalButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButton: {
      backgroundColor: Colors.backgroundItemSecond,
      borderWidth: 1,
      borderColor: Colors.borderColor,
    },
    saveButton: {
      backgroundColor: Colors.tint,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.text,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: Colors.background,
    },
  });
};
