import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/shared/ui/ThemedView";
import { ColorPalette } from "@/types/configs";
import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { PremiumBanner } from "@/shared/premium/components/PremiumBanner";
import { Footer } from "../components/Footer";
import ProfileBankRequisites from "../components/ProfileBankRequisites";
import ProfileInfo from "../components/ProfileInfo";
import ProfileLogo from "../components/ProfileLogo";
import Signature from "../components/Signature";
import ScreenScrollContainer from "@/shared/components/ScreenScrollContainer";

import TopNav from "../components/TopNav";

export default function ProfileScreen() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  const styles = React.useMemo(() => getStyles(Colors), [Colors]);

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollContainer stickyHeaderIndices={[0]}>
        <TopNav />
        <PremiumBanner />
        <ProfileLogo />
        <ProfileInfo />
        <ProfileBankRequisites />
        <Signature />
        <Footer />
      </ScreenScrollContainer>
    </ThemedView>
  );
}

const getStyles = (Colors: ColorPalette) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    headerGradient: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 0,
    },
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 100,
    },
  });
};
