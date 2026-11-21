/**
 * Centralized constants for Saga's Scout
 * Messages, navigation items, and other constants are defined here
 * to avoid duplication and make i18n easier in the future.
 */

import { createPageUrl } from '@/utils';
import {
    Heart,
    HelpCircle,
    LayoutDashboard,
    StickyNote,
    type LucideIcon,
} from 'lucide-react';

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
        url: createPageUrl('DashboardsPage'),
        icon: LayoutDashboard,
    },
    {
        title: 'Explanation',
        url: createPageUrl('Explanation'),
        icon: HelpCircle,
    },
    {
        title: 'Credits',
        url: createPageUrl('Credits'),
        icon: Heart,
    },
    {
        title: 'About',
        url: createPageUrl('About'),
        icon: StickyNote,
    },
    // The accessibility statement is linked from the footer, next to Accessibility Settings.
];

/**
 * Page titles configuration
 */
export const pageTitle = {
    dashboards: 'Your Dashboards - Saga\'s Scout',
    dashboard: 'Dashboard - Saga\'s Scout',
    explanation: 'How It Works - Saga\'s Scout',
    credits: 'Credits - Saga\'s Scout',
    about: 'About - Saga\'s Scout',
    accessibility: 'Accessibility - Saga\'s Scout',
    privacy: 'Privacy Policy - Saga\'s Scout',
    terms: 'Terms of Use - Saga\'s Scout',
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
 * Local storage keys
 */
export const storageKeys = {
    user: 'momnotes_user',
    notes: 'momnotes_notes',
    noteVersions: 'momnotes_note_versions',
    dashboards: 'momnotes_dashboards',
    shares: 'momnotes_shares',
} as const;
