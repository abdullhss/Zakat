import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./localization/en.json";
import translationAR from "./localization/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    ar: { translation: translationAR },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
