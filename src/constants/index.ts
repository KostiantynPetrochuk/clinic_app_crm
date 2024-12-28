export const API_URL = import.meta.env.VITE_API_URL;

export const ROLES = {
  Developer: "Developer",
  Administarator: "Administarator",
};

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CRM_USERS: "/crm-users",
  FILIALS: "/filials",
  DOCTORS: "/doctors",
  PATIENTS: "/patients",
  APPLICATIONS: "/applications",
  APPOINTMENTS: "/appointments",
  ADD_APPOINTMENT: "/add-appointment",
  EDIT_APPOINTMENT: "/edit-appointment",
  UNAUTHORIZED: "/unauthorized",
};

export const API_ROUTES = {};

export const SERVICE_TYPES = {
  consultation: "Консультація",
};

export const SERVICE_PRICES = {
  consultation: {
    value: 500,
    label: "Консультація",
  },
};

export const RECORD_TYPES = {
  website: "Заявка на сайті",
  reception: "Рецепсія",
  insurance_company: "Страхова компанія",
  by_phone: "По телефону",
  partner: "Партнер",
  contract: "Контракт",
};

export const SOURCE_OF_INFO = {
  external_advertising: "Зовнішня реклама",
  instagram: "Інстаграм",
  facebook: "Фейсбук",
  print_advertising: "Друкована реклама",
  regular_customer: "Постійний клієнт",
  friends: "Друзі",
  business_cards: "Візитки",
  flyer: "Флаєр",
  website: "Сайт",
};

export const WORKING_TIME = [
  "08:30",
  "08:45",
  "09:00",
  "09:15",
  "09:30",
  "09:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
  "12:15",
  "12:30",
  "12:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
  "18:00",
  "18:15",
  "18:30",
  "18:45",
  "19:00",
  "19:15",
  "19:30",
];
