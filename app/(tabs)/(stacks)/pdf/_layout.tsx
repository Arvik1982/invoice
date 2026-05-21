import { Stack } from "expo-router";
import Header from "@/features/pdf/components/Header";

export default function PdfLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => <Header />,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="invoice/[id]"
        options={{
          title: "Просмотр PDF счета",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="certificate/[id]"
        options={{
          title: "Просмотр PDF акта",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
