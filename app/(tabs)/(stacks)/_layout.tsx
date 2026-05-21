import { useCustomTheme } from "@/shared/context/CustomThemeContext";
import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "react-native";

export default function StackLayout() {
  const { themeObject } = useCustomTheme();
  const Colors = themeObject?.colors;
  return (
    <Stack>
      <Stack.Screen
        name="templates"
        options={{
          title: "templates",
          headerShown: true,
          header: ({ options, route }) => (
            <ChevronLeft
              size={35}
              color={Colors.text}
              onPress={() => router.back()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="clients"
        options={{
          // title: "ЗАКАЗЧИКИ",
          headerShown: true,
          header: ({ options, route }) => (
            <>
              <ChevronLeft
                size={35}
                color={Colors.text}
                onPress={() => router.back()}
              />
              <Text>{options.title}</Text>
            </>
          ),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: "settings",
          headerShown: true,
          header: ({ options, route }) => (
            <>
              <ChevronLeft
                size={35}
                color={Colors.text}
                onPress={() => router.back()}
              />
            </>
          ),
        }}
      />
      <Stack.Screen
        name="pdf"
        options={{
          title: "pdf",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
