import arrow from "@/assets/images/arrow.png";
import BillsonImg from "@/assets/images/Billson.jpg";

import planet from "@/assets/images/planet.png";
import StarbucksImg from "@/assets/images/Sbks.png";
import shield from "@/assets/images/shield.png";

export const MONTH_LIST: { [key: string]: string } = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};
export const IMAGE_MAP = {
  "planet.png": planet,
  "arrow.png": arrow,
  "shield.png": shield,

  "Billson.jpg": BillsonImg,
  "Sbks.jpg": StarbucksImg,
};

export enum invoiceItemTitleEnum {
  CLIENT = "Заказчик",
  SERVICES = "Услуги",
  SERT = "АКТ",
  INVOICE = "СЧЕТ",
  BASIS = "Основание",
}
export enum profileItemTitleEnum {
  MAIN_INFO = "Основная информация",
  BANK_REKUISITES = "Банковские реквизиты",
  LOGO = "Логотип",
  SIGNATURE = "Подпись",
  PREMIUM_STATUS = "ПРЕМИУМ СТАТУС",
}

export const screenTitle = {
  home: "Создать",
  history: "История",
  profile: "Реквизиты",
  taxes: "Налоги",
};
