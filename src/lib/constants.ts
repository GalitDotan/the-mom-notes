/**
 * Centralized constants for Saga's Scout
 * Messages, navigation items, and other constants are defined here
 * to avoid duplication and make i18n easier in the future.
 */

import {
    HelpCircle,
    LayoutDashboard,
    type LucideIcon,
} from 'lucide-react';

/**
 * Product branding
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

/**
 * Toast/notification messages
 */
export const messages = {
    errors: {
        loadDashboards: 'Could not load your dashboards.',
        emptyDashboardName: 'Dashboard name cannot be empty.',
        emptyNoteName: 'Note title cannot be empty.',
        loadNotes: 'Could not load notes.',
        saveDashboard: 'Failed to save dashboard.',
        shareError: 'Failed to share dashboard.',
        deleteError: 'Failed to delete dashboard.',
    },
    success: {
        dashboardCreated: 'Dashboard created successfully!',
        dashboardDeleted: 'Dashboard deleted successfully!',
        dashboardShared: 'Dashboard shared successfully!',
        noteSaved: 'Note saved successfully!',
    },
    validation: {
        invalidEmail: 'Please enter a valid email address.',
        emailRequired: 'Email is required.',
        nameRequired: 'Name is required.',
    },
};

export type NavigationItem = {
    title: string;
    url: string;
    icon: LucideIcon;
};

/**
 * Navigation menu items configuration
 */
export const navigationItems: NavigationItem[] = [
    {
        title: 'Dashboards',
        url: routes.dashboards,
        icon: LayoutDashboard,
    },
    {
        title: 'Guide',
        url: routes.explanation,
        icon: HelpCircle,
    },
    // About, Credits and the legal pages are linked from the footer; the
    // accessibility statement sits next to Appearance Settings there.
];

/**
 * Text only screen readers announce.
 */
export const screenReaderText = {
    opensInNewTab: '(opens in a new tab)',
};

/**
 * Page titles configuration
 */
export const pageTitle = {
    dashboards: `Your Dashboards - ${productName}`,
    dashboard: `Dashboard - ${productName}`,
    explanation: `How It Works - ${productName}`,
    credits: `Credits - ${productName}`,
    about: `About - ${productName}`,
    accessibility: `Accessibility Statement - ${productName}`,
    privacy: `Privacy Policy - ${productName}`,
    terms: `Terms of Use - ${productName}`,
};

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
 * Badge labels
 */
export const badgeLabels = {
    ownedByYou: 'Owned by you',
    sharedWithYou: 'Shared with you',
};

/**
 * Button labels
 */
export const buttonLabels = {
    create: 'Create',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    share: 'Share',
    close: 'Close',
    logout: 'Logout',
    login: 'Login',
    signUp: 'Sign Up',
    addNote: 'Add Note',
    createDashboard: 'Create Dashboard',
    saveChanges: 'Save Changes',
};

/**
 * Dialog/Modal titles
 */
export const dialogTitles = {
    createDashboard: 'Create New Dashboard',
    renameDashboard: 'Rename Dashboard',
    shareDashboard: 'Share Dashboard',
    deleteConfirmation: 'Delete Confirmation',
};

/**
 * Placeholder text
 */
export const placeholders = {
    dashboardName: 'Enter dashboard name',
    email: 'you@example.com',
    name: 'Your name',
    noteTitle: 'Note title',
    search: 'Search notes or dashboards',
};

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
