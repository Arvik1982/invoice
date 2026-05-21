import { Haptic } from "@/shared/components/tapbar/Haptic";
import { User, History, HandCoins } from "lucide-react-native";
import { Colors } from "@/shared/constants/colors";
import { useColorScheme } from "@/shared/lib/hooks/useColorScheme";
import React from "react";
import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import HeaderBox from "@/features/home/components/Header";
import InvoiseHat from "@/features/history/components/InvoiseHat";
import ProfileHeader from "@/features/profile/components/ProfileHeader";
import * as LucideIcons from "lucide-react-native";
import TaxesHeader from "@/features/taxes/components/TaxesHeader";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textTertiary,
        headerShown: false,
        tabBarButton: Haptic,
        tabBarStyle: {
          // borderTopWidth: 1,
          // borderTopColor: colors.borderLight,
          backgroundColor: colors.background,
          height: Platform.OS === "ios" ? 85 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          shadowColor: colors.cardShadow,
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: focused
                  ? colors.accentBackground1
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <HandCoins
                color={focused ? colors.tint : color}
                size={24}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          header: ({ options, route }) => <HeaderBox />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: focused
                  ? colors.accentBackground1
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <History
                color={focused ? colors.tint : color}
                size={24}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          header: ({ options, route }) => <InvoiseHat />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: focused
                  ? colors.accentBackground1
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              <User
                color={focused ? colors.tint : color}
                size={24}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
          header: ({ options, route }) => <ProfileHeader />,
        }}
      />

      <Tabs.Screen
        name="taxes"
        options={{
          headerShown: true,
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: focused
                  ? colors.accentBackground1
                  : "transparent",
                transform: [{ scale: focused ? 1.1 : 1 }],
              }}
            >
              {/* <User
                color={focused ? colors.tint : color}
                size={24}
                strokeWidth={focused ? 2.5 : 2}
              /> */}
              <LucideIcons.BadgeRussianRuble
                color={focused ? colors.tint : color}
                size={24}
                strokeWidth={focused ? 2.5 : 2}
              ></LucideIcons.BadgeRussianRuble>
            </View>
          ),
          header: ({ options, route }) => <TaxesHeader />,
        }}
      />

      <Tabs.Screen
        name="(stacks)"
        options={{
          title: "(stacks)",
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
