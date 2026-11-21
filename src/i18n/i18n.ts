/**
 * The app's i18next instance. main.tsx imports this module before rendering;
 * the translations are bundled and init is synchronous, so they are ready on
 * the first render.
 *
 * Components translate with `useTranslation()` (or `<Trans>` for text with
 * markup) from react-i18next. Keys and their {{variables}} are type-checked
 * against locales/en.ts (see i18next.d.ts).
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { productName } from "@/lib/constants";

import { DEFAULT_LANGUAGE, LANGUAGES } from "./languages";

const resources = Object.fromEntries(
    Object.entries(LANGUAGES).map(([code, language]) => [code, { translation: language.translation }])
);

void i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: Object.keys(LANGUAGES),
    initAsync: false,
    interpolation: {
        // React escapes rendered text already. Escaping here as well would show
        // research content such as a dashboard named "Q&A" as "Q&amp;A".
        escapeValue: false,
        // The product name is not translated; any string can use {{productName}}.
        defaultVariables: { productName },
    },
});

/** Screen readers pick their voice from <html lang>, and RTL layouts follow <html dir>. */
const applyDocumentLanguage = (language: string) => {
    document.documentElement.lang = language;
    document.documentElement.dir = i18n.dir(language);
};

applyDocumentLanguage(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE);
i18n.on("languageChanged", applyDocumentLanguage);

export default i18n;
