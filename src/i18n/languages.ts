import type { Locale } from "date-fns";
import { enUS } from "date-fns/locale";

import { en } from "./locales/en";

/** Every plural form i18next may look up, depending on the language (Intl.PluralRules). */
type PluralForm = "zero" | "one" | "two" | "few" | "many" | "other";

/** The plural keys English uses; another language may need more forms or fewer. */
type EnglishPluralKey = `${string}_${"one" | "other"}`;
type PluralBase<Key> = Key extends `${infer Base}_${"one" | "other"}` ? Base : never;

/**
 * The shape every locale provides: the keys of the English source with any
 * text as values. Plural keys are the exception, because languages differ in
 * the forms they need (Hebrew adds `_two`, Japanese only uses `_other`): any
 * form may be given, and a missing one falls back to English.
 */
type LocaleShape<Source> = Source extends string
    ? string
    : Source extends readonly (infer Item)[]
        ? readonly LocaleShape<Item>[]
        : {
            [Key in keyof Source as Key extends EnglishPluralKey ? never : Key]: LocaleShape<Source[Key]>;
        } & {
            [Key in keyof Source as Key extends EnglishPluralKey ? `${PluralBase<Key>}_${PluralForm}` : never]?: string;
        };

export type TranslationResource = LocaleShape<typeof en>;

type LanguageDefinition = {
    translation: TranslationResource;
    /** Used for relative times such as "3 days ago" (see useDateFormatter). */
    dateLocale: Locale;
};

/**
 * The languages the app is translated into, by BCP 47 code. To add one, copy
 * locales/en.ts to locales/<code>.ts, translate its values, mark it
 * `satisfies TranslationResource` instead of `as const`, and register it here
 * with its date-fns locale. Text direction (RTL) follows from the code.
 */
export const LANGUAGES = {
    en: { translation: en, dateLocale: enUS },
} as const satisfies Record<string, LanguageDefinition>;

export type LanguageCode = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: LanguageCode = "en";

const isLanguageCode = (code: string): code is LanguageCode => Object.prototype.hasOwnProperty.call(LANGUAGES, code);

/** The definition of a language i18next reports, or the default for one the app does not know. */
export const languageDefinition = (code: string | undefined): LanguageDefinition =>
    LANGUAGES[code !== undefined && isLanguageCode(code) ? code : DEFAULT_LANGUAGE];
