import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCustomTheme } from "../../context/CustomThemeContext";
import * as LucideIcons from "lucide-react-native";
import { ColorPalette } from "@/types/configs";
import { Fonts } from "../../config/fonts";
import React, { useEffect, useState } from "react";
import ButtonGroup from "../../ui/ButtonGroup";
import { LinearGradient } from "expo-linear-gradient";
import { usePremiumContext } from "@/shared/context/PremiumContext";
import InputField from "@/shared/ui/InputField";
import { appStorage } from "@/shared/storage/appStorage";
import { getPaymentStatus } from "@/yookassa/yookassa";

export const PremiumBanner = () => {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = getStyles(Colors);
  const [promocode, setPromocode] = useState("");

  const {
    getPremiumFunc,
    premiumStatus,
    getPromocodePremiumFunc,
    savePremiumStorage,
  } = usePremiumContext();

  const hadleSavePremium = () => {
    getPremiumFunc();
  };
  const hadlePromocodePremium = () => {
    getPromocodePremiumFunc(promocode);
  };

  const handlePromocodeChange = (value: string) => {
    setPromocode(value);
  };

  const checkIsPremiumUpdated = async () => {
    const prevId = await appStorage.loadPaymentId();
    if (!prevId) return;
    const result = await getPaymentStatus(prevId);
    if (result === "succeeded") {
      savePremiumStorage(result === "succeeded");

      return;
    }
  };

  useEffect(() => {
    checkIsPremiumUpdated();
  }, []);

  if (!premiumStatus.isPremium) {
    return (
      <LinearGradient
        colors={[Colors.accentBackground1, Colors.accentBackground3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.motivationContainer}
      >
        {/* Декоративный элемент */}
        <View style={styles.decorativeElement}>
          <LucideIcons.Sparkles size={20} color={Colors.gold} />
        </View>

        {/* Основной контент */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>УСИЛЬТЕ СВОЙ БИЗНЕС</Text>
            <Text style={styles.subtitle}>
              Переходите на профессиональный уровень
            </Text>
          </View>

          {/* Ограничения бесплатной версии */}
          <View style={styles.limitations}>
            <View style={styles.limitItem}>
              <LucideIcons.XCircle size={14} color="#FF6B6B" />
              <Text style={styles.limitText}>
                Только {premiumStatus.maxInvoices} документов
              </Text>
            </View>
            <View style={styles.limitItem}>
              <LucideIcons.XCircle size={14} color="#FF6B6B" />
              <Text style={styles.limitText}>Нет поиска документов</Text>
            </View>
            <View style={styles.limitItem}>
              <LucideIcons.XCircle size={14} color="#FF6B6B" />
              <Text style={styles.limitText}>Нет подписи документов</Text>
            </View>
          </View>

          {/* Что получите с премиум */}
          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>С ПРЕМИУМ ВЫ ПОЛУЧИТЕ:</Text>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <LucideIcons.CheckCircle size={14} color={Colors.succsess} />
                <Text style={styles.benefitText}>
                  Неограниченное кол-во документов
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <LucideIcons.CheckCircle size={14} color={Colors.succsess} />
                <Text style={styles.benefitText}>Фото подписи в PDF</Text>
              </View>
              <View style={styles.benefitItem}>
                <LucideIcons.CheckCircle size={14} color={Colors.succsess} />
                <Text style={styles.benefitText}>Поиск в истории счетов</Text>
              </View>
              <View style={styles.benefitItem}>
                <LucideIcons.CheckCircle size={14} color={Colors.succsess} />
                <Text style={styles.benefitText}>
                  Возможность создать шаблоны услуг
                </Text>
              </View>
            </View>
          </View>

          {/* Цена и CTA */}
          <View style={styles.ctaSection}>
            <View style={styles.priceContainer}>
              <Text style={styles.oldPrice}>299 ₽</Text>
              <View style={styles.currentPrice}>
                <Text style={styles.priceValue}>149 ₽</Text>
                {/* <Text style={styles.pricePeriod}>/месяц</Text> */}
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-50%</Text>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                marginBottom: 8,
              }}
            >
              <InputField
                value={promocode}
                onChangeText={handlePromocodeChange}
                label="Промокод"
                placeholder="Введите код"
                editable
              />
              <TouchableOpacity
                onPress={hadlePromocodePremium}
                style={styles.promocode}
              >
                <LucideIcons.ChevronRight
                  size={40}
                  color={Colors.tint}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>

            <ButtonGroup
              variant="primary"
              title="ПОЛУЧИТЬ ПРЕМИУМ"
              onPress={hadleSavePremium}
              activeOpacity={0.9}
              style={styles.ctaButton}
            ></ButtonGroup>
          </View>
        </View>
      </LinearGradient>
    );
  } else {
    return null;
  }
};

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    activeContainer: {
      backgroundColor: Colors.accentBackground2,
      borderRadius: 16,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors.gold,
      marginHorizontal: 16,
      marginBottom: 14,
    },
    activeHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    crownBadge: {
      width: 26,
      height: 26,
      borderRadius: 18,
      backgroundColor: "rgba(255, 215, 0, 0.2)",
      justifyContent: "center",
      alignItems: "center",

      borderWidth: 1,
      borderColor: Colors.gold,
    },
    activeTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: Colors.gold,
      fontFamily: Fonts.bold.fontFamily,
      letterSpacing: 0.5,
      textAlign: "center",
    },
    activeSubtitle: {
      fontSize: 14,
      color: Colors.text,
      opacity: 0.9,
      marginBottom: 14,
      fontFamily: Fonts.regular.fontFamily,
    },
    perksGrid: {
      gap: 10,
    },
    perkItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    perkText: {
      fontSize: 14,
      color: Colors.text,
      marginLeft: 10,
      fontFamily: Fonts.regular.fontFamily,
    },

    motivationContainer: {
      borderRadius: 20,
      marginHorizontal: 16,
      marginBottom: 15,
      overflow: "hidden",
      position: "relative",
    },
    decorativeElement: {
      position: "absolute",
      top: -10,
      right: -10,
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255, 215, 0, 0.15)",
      justifyContent: "center",
      alignItems: "center",
      transform: [{ rotate: "15deg" }],
    },
    content: {
      padding: 24,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "900",
      color: Colors.text,
      fontFamily: Fonts.bold.fontFamily,
      marginBottom: 3,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 15,
      color: Colors.text,
      opacity: 0.9,
      fontFamily: Fonts.regular.fontFamily,
    },
    limitations: {
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "rgba(255, 107, 107, 0.3)",
    },
    limitItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    limitText: {
      fontSize: 14,
      color: "#FF6B6B",
      marginLeft: 10,
      fontFamily: Fonts.regular.fontFamily,
    },
    benefits: {
      marginBottom: 24,
    },
    benefitsTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: Colors.text,
      marginBottom: 12,
      fontFamily: Fonts.bold.fontFamily,
    },
    benefitsGrid: {
      gap: 10,
    },
    benefitItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    benefitText: {
      fontSize: 14,
      color: Colors.text,
      marginLeft: 10,
      fontFamily: Fonts.regular.fontFamily,
    },
    ctaSection: {
      alignItems: "center",
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: 16,
      position: "relative",
    },
    oldPrice: {
      fontSize: 16,
      color: Colors.textSecondary,
      textDecorationLine: "line-through",
      fontFamily: Fonts.regular.fontFamily,
      marginRight: 8,
    },
    currentPrice: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    priceValue: {
      fontSize: 30,
      fontWeight: "900",
      color: Colors.gold,
      fontFamily: Fonts.bold.fontFamily,
    },
    pricePeriod: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginLeft: 4,
      fontFamily: Fonts.regular.fontFamily,
    },
    discountBadge: {
      position: "absolute",
      top: -20,
      right: 0,
      backgroundColor: "#FF6B6B",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    discountText: {
      fontSize: 12,
      fontWeight: "800",
      color: "#FFFFFF",
      fontFamily: Fonts.bold.fontFamily,
    },
    ctaButton: {
      width: "100%",
      height: 56,
      marginBottom: 6,
    },
    guarantee: {
      fontSize: 12,
      color: Colors.textSecondary,
      fontFamily: Fonts.regular.fontFamily,
      textAlign: "center",
    },
    promocode: {
      position: "absolute",
      right: 10,
      top: 40,
      backgroundColor: Colors.backgroundItemSecond,
      borderRadius: 8,
      alignItems: "center",
    },
  });
};
