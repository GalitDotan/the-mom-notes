/**
 * Centralized constants for Saga's Scout: routes, navigation items, storage
 * keys and other values shared across the app. User-visible text lives in the
 * translations (src/i18n/locales), not here.
 */

import {
    HelpCircle,
    LayoutDashboard,
    type LucideIcon,
} from 'lucide-react';

/**
 * Product branding. The name is not translated; translations refer to it
 * as {{productName}}.
 */
export const productName = "Saga's Scout" as const;

/** The product logo: the favicon (public/favicon.svg, also linked from index.html). */
export const productLogoUrl = '/favicon.svg';

/**
 * App routes, the single source for every path App.tsx serves and every
 * link to one. The paths appear in bookmarks and shared links, so their
 * values must not change.
 */
export const routes = {
    home: '/',
    login: '/login',
    dashboards: '/DashboardsPage',
    dashboardDetail: '/DashboardDetailPage',
    explanation: '/Guide',
    credits: '/Credits',
    about: '/About',
    privacyPolicy: '/PrivacyPolicy',
    termsOfUse: '/TermsOfUse',
    accessibilityStatement: '/AccessibilityStatement',
} as const;

/** Notes are rated from 1 star (the default) to this many. */
export const maxNoteImportance = 7;

/** The page of a single dashboard (DashboardDetailPage reads the `id` query parameter). */
export const dashboardUrl = (dashboardId: string) =>
    `${routes.dashboardDetail}?id=${encodeURIComponent(dashboardId)}`;

/**
 * Accessibility settings chosen in AccessibilityModal and applied by Layout.
 * The font size is a percentage of the browser's root font size.
 */
export const accessibilitySettings = {
    fontSizePercent: {
        default: 100,
        min: 80,
        max: 200,
        step: 10,
    },
    /** Class Layout puts on <html> in high-contrast mode; styles/accessibility.css keys on it. */
    highContrastClassName: 'high-contrast',
} as const;

export type NavigationItem = {
    /** The item's label, under `navigation` in the translations. */
    labelKey: 'navigation.dashboards' | 'navigation.guide';
    url: string;
    icon: LucideIcon;
};

/**
 * Navigation menu items configuration
 */
export const navigationItems: NavigationItem[] = [
    {
        labelKey: 'navigation.dashboards',
        url: routes.dashboards,
        icon: LayoutDashboard,
    },
    {
        labelKey: 'navigation.guide',
        url: routes.explanation,
        icon: HelpCircle,
    },
    // About, Credits and the legal pages are linked from the footer; the
    // accessibility statement sits next to Appearance Settings there.
];

/**
 * Dashboard permissions configuration
 */
export const permissions = {
    VIEW: 'view',
    EDIT: 'edit',
    ADMIN: 'admin',
} as const;

export type PermissionLevel = (typeof permissions)[keyof typeof permissions];

/**
 * Database collection names
 */
export const collections = {
    notes: 'notes',
    noteVersions: 'note_versions',
    dashboards: 'dashboards',
    dashboardShares: 'dashboard_shares',
    shares: 'shares',
    users: 'users',
} as const;

/**
 * Date/time formats
 */
export const dateFormats = {
    displayFormat: 'MMM d, yyyy',
    displayFormatWithTime: 'MMM d, yyyy hh:mm a',
};

/**
 * Animation settings
 */
export const animations = {
    duration: {
        fast: 150,
        normal: 200,
        slow: 300,
    },
    variants: {
        fadeIn: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
    },
};

/**
 * Browser localStorage keys. These hold users' existing research data and
 * settings, so their values must not change without a migration.
 */
export const storageKeys = {
    /** Each collection is stored under `${collectionPrefix}_${collectionName}` (see localStorageStore.ts). */
    collectionPrefix: 'momnotes',
    user: 'momnotes_user',
    accessibilityFontSize: 'accessibility-font-size',
    accessibilityHighContrast: 'accessibility-high-contrast',
    /** The chosen theme. index.html's startup script reads this key too. */
    theme: 'theme',
} as const;
