import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { languageDefinition } from "./languages";

/** The ways the app shows a date; the examples are how English shows them. */
const DATE_STYLES = {
    /** November 21, 2026 */
    longDate: { dateStyle: "long" },
    /** Nov 21, 3:05 PM */
    shortDateTime: { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
    /** Nov 21, 2026, 3:05 PM */
    mediumDateTime: { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
    /** November 21, 2026 at 3:05 PM */
    longDateTime: { dateStyle: "long", timeStyle: "short" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

export type DateStyle = keyof typeof DATE_STYLES;

type DateInput = Date | string | number;

/** Formatters are costly to create and lists format many dates, so they are shared. */
const formatterCache = new Map<string, Intl.DateTimeFormat>();

const formatterFor = (language: string, style: DateStyle) => {
    const cacheKey = `${language}|${style}`;
    let formatter = formatterCache.get(cacheKey);
    if (formatter === undefined) {
        formatter = new Intl.DateTimeFormat(language, DATE_STYLES[style]);
        formatterCache.set(cacheKey, formatter);
    }
    return formatter;
};

/** Formats dates in the current language. Like date-fns, it throws on an invalid date. */
export function useDateFormatter() {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? i18n.language;

    return useMemo(() => ({
        formatDate: (date: DateInput, style: DateStyle) => formatterFor(language, style).format(new Date(date)),
        /** A relative time such as "3 days ago". */
        formatTimeAgo: (date: DateInput) =>
            formatDistanceToNow(new Date(date), { addSuffix: true, locale: languageDefinition(language).dateLocale }),
    }), [language]);
}
