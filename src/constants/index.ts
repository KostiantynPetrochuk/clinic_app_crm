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
  UNAUTHORIZED: "/unauthorized",
};

export const API_ROUTES = {};

export const SERVICE_TYPES = {
  consultation: "Консультація",
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
  facebook: "Фуйсбук",
  print_advertising: "Друкована реклама",
  regular_customer: "Постійний клієнт",
  friends: "Друзі",
  business_cards: "Візитки",
  flyer: "Флаєр",
  website: "Сайт",
};
