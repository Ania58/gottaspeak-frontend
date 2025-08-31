import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translations.en.json";
import es from "./translations.es.json";
import pl from "./translations.pl.json";

const supported = ["en", "es", "pl"] as const;
type SupportedLang = typeof supported[number];

function detectFromNavigator(): SupportedLang {
  const list = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language]
  ).map((l) => l?.toLowerCase().split("-")[0]);

  const found = list.find((code) => supported.includes(code as SupportedLang));
  return (found as SupportedLang) || "en";
}

function initialLanguage(): SupportedLang {
  const saved = localStorage.getItem("lang") as SupportedLang | null;
  if (saved && supported.includes(saved)) return saved;
  return detectFromNavigator();
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      es: { common: es },
      pl: { common: pl }
    },
    lng: initialLanguage(),
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });

export function changeLanguage(lang: SupportedLang) {
  if (!supported.includes(lang)) return;
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
}

export default i18n;
