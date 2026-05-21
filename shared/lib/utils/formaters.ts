import { ServiceItemDetails } from "@/types/main";

export const formatCurrency = (amount: number) => {
  if (!amount) return 0;
  return amount?.toLocaleString("ru-RU") + " ₽";
};

export const formatPhone = (phone: string) => {
  let numbers = phone.replace(/\D/g, "");
  if (numbers.startsWith("7") || numbers.startsWith("8")) {
    numbers = numbers.substring(1);
  }
  if (numbers.length > 10) numbers = numbers.substring(0, 10);

  let formatted = "+7 (";
  if (numbers.length > 0) formatted += numbers.substring(0, 3);
  if (numbers.length > 3) formatted += ") " + numbers.substring(3, 6);
  if (numbers.length > 6) formatted += "-" + numbers.substring(6, 8);
  if (numbers.length > 8) formatted += "-" + numbers.substring(8, 10);

  return formatted;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};
export const getServicesText = (services: ServiceItemDetails[]) => {
  const names = services.map((s) => s.ServiceItem);
  const uniqueNames = [...new Set(names)];
  return uniqueNames.join(" + ");
};
