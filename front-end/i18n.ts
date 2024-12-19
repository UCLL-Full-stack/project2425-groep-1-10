import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: { common: require("./public/locales/en/common.json") },
    nl: { common: require("./public/locales/nl/common.json") },
    fr: { common: require("./public/locales/fr/common.json") },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
