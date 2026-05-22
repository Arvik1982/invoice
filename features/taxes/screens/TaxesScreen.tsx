import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Switch,
} from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import ScreenScrollContainer from "@/shared/components/ScreenScrollContainer";
import { Invoice } from "@/types/main";
import { useFocusEffect } from "expo-router";
import { ThemedText } from "@/shared/ui/ThemedText";
import * as LucideIcons from "lucide-react-native";
import { useStorage } from "@/shared/storage/ useAppStorage";

type TaxMode = "npd" | "usn6" | "usn15" | "psn" | "osno";

// Конфигурация систем налогообложения
const TAX_SYSTEMS = [
  {
    id: "usn6" as TaxMode,
    label: "УСН 6%",
    Icon: "Percent" as keyof typeof LucideIcons,
    description: "6% от доходов",
  },
  {
    id: "usn15" as TaxMode,
    label: "УСН 15%",
    Icon: "Minus" as keyof typeof LucideIcons,
    description: "15% от прибыли",
  },
  {
    id: "npd" as TaxMode,
    label: "НПД",
    Icon: "User" as keyof typeof LucideIcons,
    description: "4-6% от доходов",
  },
];

// Календарные периоды с начала года
const getCalendarPeriodDates = (periodType: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  let startDate, endDate, label;

  switch (periodType) {
    case "year":
      // С начала года по текущую дату
      startDate = new Date(currentYear, 0, 1); // 1 января текущего года
      endDate = now;
      label = `За год (с 01.01.${currentYear})`;
      break;

    case "quarter":
      // Текущий квартал с начала по текущую дату
      const currentQuarter = Math.floor(currentMonth / 3); // 0, 1, 2, 3
      const quarterStartMonth = currentQuarter * 3; // 0, 3, 6, 9
      startDate = new Date(currentYear, quarterStartMonth, 1);
      endDate = now;
      const quarterNumber = currentQuarter + 1;
      label = `За ${quarterNumber}-й квартал`;
      break;

    case "month":
      // Текущий месяц с начала по текущую дату
      startDate = new Date(currentYear, currentMonth, 1);
      endDate = now;
      const monthNames = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];
      label = `За ${monthNames[currentMonth]}`;
      break;

    default:
      startDate = new Date(currentYear, 0, 1);
      endDate = now;
      label = "За год";
  }

  // Форматирование дат
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return {
    startDate,
    endDate: now,
    label,
    from: formatDate(startDate),
    to: formatDate(now),
  };
};

export default function TaxesScreen() {
  const { themeObject } = useCustomTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [taxMode, setTaxMode] = useState<TaxMode>("usn6");
  const [totalExpenses, setTotalExpenses] = useState<string>("0");
  const [patentCost, setPatentCost] = useState(25000);

  // Новые состояния
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [includeActs, setIncludeActs] = useState(true);
  const [includeInvoices, setIncludeInvoices] = useState(true);

  const Colors = themeObject?.colors || {};
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);
  const storage = useStorage();

  // Загрузка счетов
  const getStorageInvoices = async () => {
    setIsLoading(true);
    try {
      const loadedInvoices = await storage.loadInvoices();
      setInvoices(loadedInvoices);
    } catch (err) {
      console.error("Ошибка загрузки счетов:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStorageInvoices();
    }, []),
  );

  // Получаем даты для выбранного периода
  const periodInfo = useMemo(() => {
    return getCalendarPeriodDates(selectedPeriod);
  }, [selectedPeriod]);

  // Фильтрация счетов по типу и периоду
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // Фильтрация по типу документа
      if (!includeActs && invoice.type === "certificate") return false;
      if (!includeInvoices && invoice.type === "invoice") return false;

      // Фильтрация по дате в выбранном календарном периоде
      const invoiceDate = new Date(invoice.date);
      return (
        invoiceDate >= periodInfo.startDate && invoiceDate <= periodInfo.endDate
      );
    });
  }, [invoices, periodInfo, includeActs, includeInvoices]);

  // Расчет общего дохода (без отрицательных сумм) из отфильтрованных счетов
  const totalIncome = useMemo(() => {
    return filteredInvoices.reduce((acc, invoice) => {
      const amount = invoice.invoiceDetails?.totalSumm || 0;
      return amount > 0 ? acc + amount : acc;
    }, 0);
  }, [filteredInvoices]);

  // Преобразование строки расходов в число
  const expensesNumber = useMemo(() => {
    const num = parseFloat(totalExpenses.replace(/\s/g, "").replace(",", "."));
    return isNaN(num) ? 0 : num;
  }, [totalExpenses]);

  // Расчет НПД налога
  const getNPDTax = useCallback((invs: Invoice[]): number => {
    return invs.reduce((acc, invoice) => {
      const amount = invoice.invoiceDetails?.totalSumm || 0;
      if (amount <= 0) return acc;

      const clientInn = invoice.invoiceDetails?.client?.inn?.trim() || "";
      const isLegalEntity = /^\d{12}$/.test(clientInn);
      const rate = isLegalEntity ? 0.04 : 0.06;

      return acc + amount * rate;
    }, 0);
  }, []);

  // ОСНО НДФЛ (прогрессивная шкала 2026)
  const getOsnoNDFL = useCallback((annualIncome: number): number => {
    if (annualIncome <= 0) return 0;
    if (annualIncome <= 2400000) return annualIncome * 0.13;
    if (annualIncome <= 5000000)
      return 312000 + (annualIncome - 2400000) * 0.15;
    if (annualIncome <= 20000000)
      return 642000 + (annualIncome - 5000000) * 0.18;
    if (annualIncome <= 50000000)
      return 3306000 + (annualIncome - 20000000) * 0.2;
    return 8826000 + (annualIncome - 50000000) * 0.22;
  }, []);

  // УСН 15% (Доходы-Расходы)
  const getUsn15Tax = useCallback(
    (income: number, expenses: number): number => {
      const profit = income - expenses;
      // Минимальный налог: 1% от доходов, если 15% от прибыли меньше
      const tax15 = profit > 0 ? profit * 0.15 : 0;
      const minTax = income * 0.01;
      return Math.max(tax15, minTax);
    },
    [],
  );

  // Универсальная функция расчета налога
  const getTaxesSum = useCallback(
    (
      mode: TaxMode,
      invs: Invoice[],
      expenses: number = 0,
      patent: number = 0,
    ): number => {
      const income = invs.reduce((acc, inv) => {
        const amount = inv.invoiceDetails?.totalSumm || 0;
        return amount > 0 ? acc + amount : acc;
      }, 0);

      switch (mode) {
        case "npd":
          return getNPDTax(invs);
        case "usn6":
          return income * 0.06;
        case "usn15":
          return getUsn15Tax(income, expenses);
        case "psn":
          return patent;
        case "osno":
          return getOsnoNDFL(income);
        default:
          return 0;
      }
    },
    [getNPDTax, getUsn15Tax, getOsnoNDFL],
  );

  // Расчет текущего налога
  const taxes = useMemo(() => {
    return getTaxesSum(taxMode, filteredInvoices, expensesNumber, patentCost);
  }, [taxMode, filteredInvoices, expensesNumber, patentCost, getTaxesSum]);

  // Форматирование суммы
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Форматирование ввода (добавляем пробелы каждые 3 цифры)
  const formatInput = (value: string): string => {
    const cleanValue = value.replace(/\s/g, "");
    if (cleanValue === "") return "";
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Обработчик изменения расходов
  const handleExpensesChange = (text: string) => {
    const formatted = formatInput(text);
    setTotalExpenses(formatted);
  };

  // Обработчик изменения периода
  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId);
  };

  // Получение информации о текущей системе
  const currentSystem = TAX_SYSTEMS.find((sys) => sys.id === taxMode);

  // Рассчитываем прибыль для УСН 15%
  const profit = useMemo(() => {
    return totalIncome - expensesNumber;
  }, [totalIncome, expensesNumber]);

  // Статистика по типам документов
  const documentStats = useMemo(() => {
    const actsCount = filteredInvoices.filter(
      (inv) => inv.type === "certificate",
    ).length;
    const invoicesCount = filteredInvoices.filter(
      (inv) => inv.type === "invoice",
    ).length;
    return { actsCount, invoicesCount };
  }, [filteredInvoices]);

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollContainer>
        {/* Блок фильтров */}
        <View style={styles.filtersCard}>
          <ThemedText style={styles.filtersTitle}>Параметры расчета</ThemedText>

          {/* Период */}
          <View style={styles.periodSection}>
            <View style={styles.periodHeader}>
              <ThemedText style={styles.sectionLabel}>
                {periodInfo.label}
              </ThemedText>
              <ThemedText style={styles.periodDates}>
                {periodInfo.from} – {periodInfo.to}
              </ThemedText>
            </View>

            <View style={styles.periodSwitchesContainer}>
              <View style={styles.periodSwitchRow}>
                <ThemedText style={styles.periodSwitchLabel}>
                  За год (с начала года)
                </ThemedText>
                <Switch
                  value={selectedPeriod === "year"}
                  onValueChange={() => handlePeriodChange("year")}
                  trackColor={{
                    false: Colors.sectionBackground2 || "#4a4a4a",
                    true: Colors.tint + "40" || "#FE590040",
                  }}
                  thumbColor={
                    selectedPeriod === "year"
                      ? Colors.tint || "#FE5900"
                      : Colors.icon || "#FFFFFF"
                  }
                />
              </View>
              <View style={styles.periodSwitchRow}>
                <ThemedText style={styles.periodSwitchLabel}>
                  За квартал (с начала квартала)
                </ThemedText>
                <Switch
                  value={selectedPeriod === "quarter"}
                  onValueChange={() => handlePeriodChange("quarter")}
                  trackColor={{
                    false: Colors.sectionBackground2 || "#4a4a4a",
                    true: Colors.tint + "40" || "#FE590040",
                  }}
                  thumbColor={
                    selectedPeriod === "quarter"
                      ? Colors.tint || "#FE5900"
                      : Colors.icon || "#FFFFFF"
                  }
                />
              </View>
              <View style={styles.periodSwitchRow}>
                <ThemedText style={styles.periodSwitchLabel}>
                  За месяц (с начала месяца)
                </ThemedText>
                <Switch
                  value={selectedPeriod === "month"}
                  onValueChange={() => handlePeriodChange("month")}
                  trackColor={{
                    false: Colors.sectionBackground2 || "#4a4a4a",
                    true: Colors.tint + "40" || "#FE590040",
                  }}
                  thumbColor={
                    selectedPeriod === "month"
                      ? Colors.tint || "#FE5900"
                      : Colors.icon || "#FFFFFF"
                  }
                />
              </View>
            </View>
          </View>

          {/* Типы документов */}
          <View style={styles.documentsSection}>
            <ThemedText style={styles.sectionLabel}>Типы документов</ThemedText>
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Акты</ThemedText>
                <Switch
                  value={includeActs}
                  onValueChange={setIncludeActs}
                  trackColor={{
                    false: Colors.sectionBackground2 || "#4a4a4a",
                    true: Colors.tint + "40" || "#FE590040",
                  }}
                  thumbColor={
                    includeActs
                      ? Colors.tint || "#FE5900"
                      : Colors.icon || "#FFFFFF"
                  }
                />
              </View>
              <View style={styles.switchRow}>
                <ThemedText style={styles.switchLabel}>Счета</ThemedText>
                <Switch
                  value={includeInvoices}
                  onValueChange={setIncludeInvoices}
                  trackColor={{
                    false: Colors.sectionBackground2 || "#4a4a4a",
                    true: Colors.tint + "40" || "#FE590040",
                  }}
                  thumbColor={
                    includeInvoices
                      ? Colors.tint || "#FE5900"
                      : Colors.icon || "#FFFFFF"
                  }
                />
              </View>
            </View>
            <ThemedText style={styles.documentsStats}>
              {documentStats.actsCount} актов • {documentStats.invoicesCount}{" "}
              счетов
            </ThemedText>
          </View>
        </View>

        {/* Выбор системы налогообложения */}
        <View style={styles.selectionCard}>
          <ThemedText style={styles.selectionTitle}>
            Система налогообложения
          </ThemedText>

          <View style={styles.taxSystemsContainer}>
            {TAX_SYSTEMS.map((system) => {
              const isActive = taxMode === system.id;

              return (
                <TouchableOpacity
                  key={system.id}
                  style={[
                    styles.taxSystemButton,
                    isActive && styles.taxSystemButtonActive,
                  ]}
                  onPress={() => setTaxMode(system.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.taxSystemTextContainer}>
                    <ThemedText
                      style={[
                        styles.taxSystemLabel,
                        isActive && styles.taxSystemLabelActive,
                      ]}
                    >
                      {system.label}
                    </ThemedText>
                    <ThemedText style={styles.taxSystemDescription}>
                      {system.description}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Поле для ввода расходов (только для УСН 15%) */}
        {taxMode === "usn15" && (
          <View style={styles.expensesCard}>
            <ThemedText style={styles.expensesTitle}>
              Расходы за период
            </ThemedText>
            <ThemedText style={styles.expensesSubtitle}>
              Укажите общую сумму расходов для расчета прибыли
            </ThemedText>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={totalExpenses}
                onChangeText={handleExpensesChange}
                placeholder="0"
                placeholderTextColor={
                  Colors.textSecondary || "rgba(255, 255, 255, 0.5)"
                }
                keyboardType="numeric"
                maxLength={15}
              />
              <ThemedText style={styles.currencySymbol}>₽</ThemedText>
            </View>

            {/* Информация о прибыли */}
            <View style={styles.profitInfo}>
              <View style={styles.profitRow}>
                <ThemedText style={styles.profitLabel}>Доход:</ThemedText>
                <ThemedText style={styles.profitValue}>
                  {formatCurrency(totalIncome)} ₽
                </ThemedText>
              </View>
              <View style={styles.profitRow}>
                <ThemedText style={styles.profitLabel}>Расходы:</ThemedText>
                <ThemedText style={styles.profitValue}>
                  {formatCurrency(expensesNumber)} ₽
                </ThemedText>
              </View>
              <View style={[styles.profitRow, styles.profitTotalRow]}>
                <ThemedText style={styles.profitTotalLabel}>
                  Прибыль:
                </ThemedText>
                <ThemedText
                  style={[
                    styles.profitTotalValue,
                    profit < 0 && styles.negativeProfit,
                  ]}
                >
                  {formatCurrency(profit)} ₽
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.expensesHint}>
              {profit < 0
                ? "Убыток. Налог будет рассчитан по минимальной ставке 1% от доходов"
                : `Налог: 15% от прибыли (${formatCurrency(profit * 0.15)} ₽) или минимум 1% от доходов (${formatCurrency(totalIncome * 0.01)} ₽)`}
            </ThemedText>
          </View>
        )}

        {/* Результат расчета */}
        <View style={styles.resultCard}>
          <ThemedText style={styles.resultTitle}>Налог к уплате</ThemedText>

          <ThemedText style={styles.resultAmount}>
            {formatCurrency(taxes)} ₽
          </ThemedText>

          {currentSystem && (
            <ThemedText style={styles.resultSubtitle}>
              {currentSystem.description}
              {taxMode === "usn15" && ` • Прибыль: ${formatCurrency(profit)} ₽`}
            </ThemedText>
          )}
          <View style={styles.incomeInfo}>
            <ThemedText style={styles.incomeText}>
              {periodInfo.label}
              {` • Доход: ${formatCurrency(totalIncome)} ₽`}
              {taxMode === "usn15" &&
                ` • Расходы: ${formatCurrency(expensesNumber)} ₽`}
            </ThemedText>
          </View>
        </View>

        {/* Статистика */}
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Общий доход</ThemedText>
              <ThemedText style={styles.statValue}>
                {formatCurrency(totalIncome)} ₽
              </ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statLabel}>Документов</ThemedText>
              <ThemedText style={styles.statValue}>
                {filteredInvoices.length}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Дополнительная информация */}
        <View style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>Пояснение</ThemedText>
          <ThemedText style={styles.infoText}>
            • УСН 6%: налог с общего дохода{"\n"}• УСН 15%: налог с прибыли
            (доходы минус расходы){"\n"}• НПД: 4% для юр. лиц, 6% для физ. лиц и
            ИП{"\n"}• Расчет является оценочным. Для точного расчета налогов
            обратитесь к бухгалтеру
          </ThemedText>
        </View>
      </ScreenScrollContainer>
    </ThemedView>
  );
}

const getStyles = (colors: any) => {
  const safeColors = {
    background: colors?.background || "#000000",
    cardBackground: colors?.backgroundItem || "#0F0F0F",
    textPrimary: colors?.text || "#FFFFFF",
    textSecondary: colors?.textSecondary || "rgba(255, 255, 255, 0.7)",
    tint: colors?.tint || "#FE5900",
    borderLight: colors?.borderLight || "rgba(255, 255, 255, 0.1)",
    accentBackground1: colors?.accentBackground1 || "rgba(254, 89, 0, 0.1)",
    sectionBackground1:
      colors?.sectionBackground1 || "rgba(255, 255, 255, 0.04)",
    sectionBackground2:
      colors?.sectionBackground2 || "rgba(255, 255, 255, 0.06)",
    icon: colors?.icon || "#FFFFFF",
    danger: colors?.danger || "#FF3B30",
  };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: safeColors.background,
    },

    // Стили для блока фильтров
    filtersCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    filtersTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
      color: safeColors.textPrimary,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: safeColors.textSecondary,
      marginBottom: 4,
    },

    // Период
    periodSection: {
      marginBottom: 24,
    },
    periodHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    periodDates: {
      fontSize: 14,
      color: safeColors.tint,
      fontWeight: "500",
    },
    periodSwitchesContainer: {
      gap: 12,
    },
    periodSwitchRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: safeColors.borderLight,
    },
    periodSwitchLabel: {
      fontSize: 16,
      color: safeColors.textPrimary,
      flex: 1,
      marginRight: 16,
    },

    // Типы документов
    documentsSection: {
      marginBottom: 8,
    },
    switchContainer: {
      marginBottom: 12,
    },
    switchRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: safeColors.borderLight,
    },
    switchLabel: {
      fontSize: 16,
      color: safeColors.textPrimary,
    },
    documentsStats: {
      fontSize: 14,
      color: safeColors.textSecondary,
      fontStyle: "italic",
      marginTop: 8,
    },

    selectionCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    selectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: safeColors.textPrimary,
    },
    taxSystemsContainer: {
      gap: 10,
    },
    taxSystemButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: safeColors.sectionBackground1,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
    },
    taxSystemButtonActive: {
      backgroundColor: safeColors.accentBackground1,
      borderColor: safeColors.tint,
      borderWidth: 1.5,
    },
    taxSystemTextContainer: {
      flex: 1,
    },
    taxSystemLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: safeColors.textPrimary,
      marginBottom: 2,
    },
    taxSystemLabelActive: {
      color: safeColors.tint,
      fontWeight: "600",
    },
    taxSystemDescription: {
      fontSize: 14,
      color: safeColors.textSecondary,
    },

    // Стили для карточки расходов
    expensesCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    expensesTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: safeColors.textPrimary,
    },
    expensesSubtitle: {
      fontSize: 14,
      color: safeColors.textSecondary,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: safeColors.sectionBackground1,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    input: {
      flex: 1,
      fontSize: 24,
      fontWeight: "600",
      color: safeColors.textPrimary,
      paddingVertical: 16,
      minHeight: 60,
    },
    currencySymbol: {
      fontSize: 24,
      fontWeight: "600",
      color: safeColors.textPrimary,
      marginLeft: 8,
    },
    profitInfo: {
      backgroundColor: safeColors.sectionBackground1,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
    },
    profitRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    profitTotalRow: {
      marginTop: 8,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: safeColors.borderLight,
    },
    profitLabel: {
      fontSize: 14,
      color: safeColors.textSecondary,
    },
    profitValue: {
      fontSize: 16,
      fontWeight: "500",
      color: safeColors.textPrimary,
    },
    profitTotalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: safeColors.textPrimary,
    },
    profitTotalValue: {
      fontSize: 18,
      fontWeight: "700",
      color: safeColors.tint,
    },
    negativeProfit: {
      color: safeColors.danger,
    },
    expensesHint: {
      fontSize: 13,
      color: safeColors.textSecondary,
      fontStyle: "italic",
      lineHeight: 18,
    },

    // Остальные стили
    statsCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginBottom: 16,
      marginHorizontal: 16,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: safeColors.borderLight,
    },
    statLabel: {
      fontSize: 14,
      color: safeColors.textSecondary,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 22,
      fontWeight: "600",
      color: safeColors.textPrimary,
    },
    resultCard: {
      padding: 24,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginBottom: 16,
      alignItems: "center",
      marginHorizontal: 16,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: safeColors.textSecondary,
      marginBottom: 8,
    },
    resultAmount: {
      textAlign: "center",
      paddingVertical: 8,
      fontSize: 48,
      fontWeight: "700",
      color: safeColors.tint,
      marginBottom: 8,
    },
    resultSubtitle: {
      fontSize: 16,
      color: safeColors.textPrimary,
      marginBottom: 12,
      fontWeight: "500",
      textAlign: "center",
    },
    incomeInfo: {
      backgroundColor: safeColors.sectionBackground1,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
    },
    incomeText: {
      fontSize: 14,
      color: safeColors.textPrimary,
      textAlign: "center",
    },
    infoCard: {
      padding: 20,
      borderRadius: 16,
      backgroundColor: safeColors.cardBackground,
      borderWidth: 1,
      borderColor: safeColors.borderLight,
      marginHorizontal: 16,
      marginBottom: 24,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: safeColors.textPrimary,
      marginBottom: 12,
    },
    infoText: {
      fontSize: 14,
      color: safeColors.textSecondary,
      lineHeight: 20,
    },
  });
};
