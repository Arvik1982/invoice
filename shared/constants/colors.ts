import { ColorValue } from "react-native";

const tintColorLight = "#1CA8CE";
const tintColorDark = "#FE5900";

export const Colors = {
  light: {
    // Основной текст - темно-синий (контрастный)
    text: "#0A2A3A",
    textSecondary: "#2C4A5A",
    textTertiary: "#4A6A7A",
    textQuaternary: "#6A8A9A",
    textAccent: "#1CA8CE", // Голубой акцент

    // Фоны - светлые голубоватые
    background: "#F0F7FA",
    backgroundSecond: "#E4F0F5",
    backgroundThird: "#D8E9F0",
    backgroundColor: "#FFFFFF",

    // Карточки - белые
    // backgroundItem: "#FFFFFF",
    // backgroundItemSecond: "#F5FBFD",

    backgroundItem: "#dfeef9", // Чисто белый (было #FFFFFF)
    backgroundItemSecond: "#b3ddf4", // Яркий голубой (было #F5FBFD)

    // Кнопки - голубой градиент
    backgroundButton: "#1CA8CE",
    backgroundButtonSecond: "#E1F2F8",

    // Границы - голубовато-серые
    borderColor: "#B8D8E5",
    borderLight: "#D0E5F0",
    borderAccent: "#1CA8CE",
    borderAccentLight: "#9FD8F0",

    tint: tintColorLight, // Основной акцент

    gold: "#F5B342", // Теплый золотой для контраста

    icon: "#3A6A7A", // Голубовато-серый

    // Табы
    tabIconDefault: "#8AAABA",
    tabIconSelected: "#1CA8CE",

    // Статусы
    success: "#2E9A68",
    statusDot: "#2E9A68",
    danger: "#D95A4A",
    dangerBackground: "#FFEFEC",

    // Текстовые подсказки
    placeholderTextColor: "#9ABAC8",
    notesText: "#5A7A8A",

    // Эффекты
    glassOverlay: "rgba(255, 255, 255, 0.8)",
    cardShadow: "rgba(28, 168, 206, 0.1)",

    // Фоновые цвета для секций - градация голубого
    sectionBackground1: "#F0F7FA",
    sectionBackground2: "#E4F0F5",
    sectionBackground3: "#D8E9F0",

    // Акцентные цвета - голубая гамма
    accentBackground1: "#E1F2F8", // Самый светлый
    accentBackground2: "#C2E5F0", // Светлый
    accentBackground3: "#A3D8E8", // Средний
    accentBackground4: "#84CBE0", // Насыщенный

    // Градиенты - как в запросе
    gradientStart: "#1CA8CE",
    gradientEnd: "#90BCCE",

    // Прозрачные оттенки
    transparentWhite05: "rgba(28, 168, 206, 0.05)",
    transparentWhite08: "rgba(28, 168, 206, 0.08)",
    transparentWhite12: "rgba(28, 168, 206, 0.12)",
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    backgroundColor: "#ffffff",
    backgroundSecond: "#767577",
    backgroundThird: "#868588",

    backgroundItem: "#0F0F0F",
    backgroundItemSecond: "#1A1A1A",
    backgroundButton: "#CC3F02",
    backgroundButtonSecond: "rgba(254, 89, 0, 0.1)",

    borderColor: "#333333",
    tint: tintColorDark,
    gold: "#FFD700",
    icon: "#FFFFFF",
    tabIconDefault: "#FFFFFF",
    tabIconSelected: tintColorDark,
    succsess: "#38A169",
    placeholderTextColor: "#666666",
    notesText: "#666666",

    // Новые цвета на основе компонента (одинаковые для темной темы)
    statusDot: "#38A169",
    glassOverlay: "rgba(255, 255, 255, 0.03)",
    cardShadow: "#000000",

    // Фоновые цвета для секций
    sectionBackground1: "rgba(255, 255, 255, 0.04)",
    sectionBackground2: "rgba(255, 255, 255, 0.06)",
    sectionBackground3: "rgba(255, 255, 255, 0.08)",

    // Акцентные цвета
    accentBackground1: "rgba(254, 89, 0, 0.1)",
    accentBackground2: "rgba(254, 89, 0, 0.12)",
    accentBackground3: "rgba(254, 89, 0, 0.15)",
    accentBackground4: "rgba(254, 89, 0, 0.05)",

    // Градиенты
    gradientStart: "#FE5900",
    gradientEnd: "#FF9332",

    // Прозрачные оттенки
    transparentWhite05: "rgba(255, 255, 255, 0.05)",
    transparentWhite08: "rgba(255, 255, 255, 0.08)",
    transparentWhite12: "rgba(255, 255, 255, 0.12)",

    // Цвета для состояний
    danger: "#FF3B30",
    dangerBackground: "rgba(255, 59, 48, 0.1)",

    // Цвета границ
    borderLight: "rgba(255, 255, 255, 0.1)",
    borderAccent: "rgba(254, 89, 0, 0.2)",
    borderAccentLight: "rgba(254, 89, 0, 0.3)",

    // Текстовые оттенки
    textSecondary: "rgba(255, 255, 255, 0.7)",
    textTertiary: "rgba(255, 255, 255, 0.6)",
    textQuaternary: "rgba(255, 255, 255, 0.8)",
    textAccent: "#FE5900",
  },
  default: {
    expencesBarColors: ["#CC3F02", "#FE5900", "#FF9332", "#FFD8A5"],
  },
};

export const gradientBoxColors = (
  theme: "light" | "dark" = "dark",
): readonly [ColorValue, ColorValue, ...ColorValue[]] => {
  return [
    Colors[theme].sectionBackground1,
    Colors[theme].sectionBackground2,
  ] as readonly [ColorValue, ColorValue, ...ColorValue[]];
};
