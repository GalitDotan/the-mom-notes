/**
 * English, the source language: every user-visible string in the app.
 *
 * Keys are grouped by feature. `{{name}}` marks an interpolated value
 * ({{productName}} is filled in everywhere, see ../i18n.ts), `_one`/`_other`
 * suffixes are plural forms chosen by `count`, and `<tag>…</tag>` marks markup
 * that a `<Trans>` component supplies. Other locales provide the same keys
 * (see TranslationResource in ../languages.ts).
 */
export const en = {
    common: {
        cancel: "Cancel",
        close: "Close",
        saveChanges: "Save Changes",
        edit: "Edit",
        delete: "Delete",
        download: "Download",
    },

    documentTitles: {
        dashboards: "Your Dashboards - {{productName}}",
        dashboard: "Dashboard - {{productName}}",
        namedDashboard: "{{dashboardName}} - {{productName}}",
        guide: "Guide - {{productName}}",
        credits: "Credits - {{productName}}",
        about: "About - {{productName}}",
        accessibility: "Accessibility Statement - {{productName}}",
        privacy: "Privacy Policy - {{productName}}",
        terms: "Terms of Use - {{productName}}",
    },

    navigation: {
        dashboards: "Dashboards",
        guide: "Guide",
    },

    layout: {
        homeLink: "{{productName}}, go to dashboards",
        mainNavigation: "Main",
        offline: "Offline",
        openMobileMenu: "Open mobile menu",
        closeMobileMenu: "Close mobile menu",
        account: "Account: {{userName}}",
        /** Shown in the avatar when the user's name is empty. */
        userInitialFallback: "U",
        signOut: "Sign out",
        appearanceSettings: "Appearance Settings",
        copyright: "© {{year}} {{productName}}. All rights reserved.",
        legalNavigation: "Legal",
        footerLinks: {
            about: "About",
            credits: "Credits",
            privacyPolicy: "Privacy Policy",
            termsOfUse: "Terms of Use",
            accessibility: "Accessibility",
        },
    },

    appearanceSettings: {
        title: "Appearance Settings",
        description: "Adjust the appearance of the application to suit your needs. Your settings will be saved for your next visit.",
        fontSize: {
            label: "Font Size",
            sliderLabel: "Font size: {{percent}} percent",
            current: "Current size: {{percent}}%",
        },
        highContrast: {
            label: "High Contrast Mode",
            hint: "Increases text visibility for better readability.",
            switchLabelEnabled: "High contrast mode: enabled",
            switchLabelDisabled: "High contrast mode: disabled",
            enabledDescription: "High contrast mode is currently enabled. This uses black backgrounds and white text for better visibility.",
            disabledDescription: "High contrast mode is currently disabled. Enable this for better text visibility.",
        },
        /** <key> marks the name of a key on the keyboard. */
        keyboardShortcuts: {
            title: "Keyboard Shortcuts",
            nextElement: "<key>Tab</key>: Move to the next interactive element.",
            previousElement: "<key>Shift + Tab</key>: Move to the previous element.",
            activate: "<key>Enter</key> or <key>Space</key>: Activate buttons and controls.",
            closeDialogs: "<key>Escape</key>: Close dialogs and modals.",
            quickSave: "In Note Editor: <key>Ctrl/Cmd + Enter</key> to save quickly.",
        },
        done: "Done",
        closeLabel: "Close appearance settings",
    },

    theme: {
        legend: "Theme",
        themes: {
            parchment: { name: "Parchment", description: "Warm light" },
            frost: { name: "Frost", description: "Cool light" },
            ember: { name: "Ember", description: "Warm dark" },
            velvet: { name: "Velvet", description: "Deep plum" },
            ink: { name: "Ink", description: "Charcoal" },
        },
    },

    login: {
        title: "Welcome to {{productName}}",
        description: "Get started by entering your information",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        nameLabel: "Name",
        namePlaceholder: "Your Name",
        submit: "Continue",
        submitting: "Logging in...",
        success: "Welcome! Redirecting to dashboards...",
        methodology: "Based on <strong>The Mom Test</strong> methodology by Rob Fitzpatrick. This app helps you organize customer research into focused dashboards.",
        errors: {
            emailRequired: "Email is required",
            nameRequired: "Name is required",
            invalidEmail: "Please enter a valid email address.",
            failed: "Login failed",
        },
    },

    accessRestricted: {
        title: "Access Restricted",
        description: "You are not registered to use this application. Please contact the app administrator to request access.",
        suggestionsIntro: "If you believe this is an error, you can:",
        suggestions: [
            "Verify you are logged in with the correct account",
            "Contact the app administrator for access",
            "Try logging out and back in again",
        ],
    },

    notFound: {
        title: "Page Not Found",
        /** <pageName> wraps the path that was not found. */
        description: "The page <pageName>\"{{pageName}}\"</pageName> could not be found in this application.",
        goHome: "Go Home",
    },

    dashboards: {
        title: "Your Dashboards",
        subtitle: "Organize your research notes into shareable dashboards.",
        newDashboard: "New Dashboard",
        loading: "Loading dashboards",
        emptyState: {
            title: "Create your first dashboard",
            description: "Organize your notes into focused dashboards. Each dashboard can be shared with your team.",
        },
        ownedByYou: "Owned by you",
        sharedWithYou: "Shared with you",
        /** {{permission}} is one of dashboards.permissions. */
        sharedBadge: "Shared with you · {{permission}}",
        /** {{timeAgo}} is a relative time such as "3 days ago". */
        updated: "Updated {{timeAgo}}",
        permissions: {
            viewer: "Viewer",
            editor: "Editor",
        },
        createDialog: {
            title: "New Dashboard",
            description: "Give your new dashboard a name. You can add notes and share it later.",
            nameLabel: "Dashboard name",
            namePlaceholder: "E.g., Q4 User Interviews, Competitor Analysis",
            submit: "Create Dashboard",
            submitting: "Creating...",
        },
        toasts: {
            loadFailed: "Could not load your dashboards.",
            nameRequired: "Dashboard name cannot be empty.",
            noUser: "No user logged in.",
            noUserEmail: "User email not available.",
            created: "Dashboard created successfully!",
            createFailed: "Failed to save dashboard.",
        },
    },

    dashboardDetail: {
        loading: "Loading dashboard",
        backToDashboards: "Back to dashboards",
        renameLabel: "Rename dashboard",
        access: {
            owner: "You own this dashboard",
            editor: "Shared with you as editor",
            viewer: "Shared with you as viewer",
        },
        noteCount_one: "{{count}} note",
        noteCount_other: "{{count}} notes",
        actions: {
            export: "Export",
            exportLabel: "Export notes as CSV",
            share: "Share",
            shareLabel: "Share dashboard",
            newNote: "New Note",
            moreLabel: "More dashboard actions",
            rename: "Rename Dashboard",
            delete: "Delete Dashboard",
        },
        search: {
            label: "Search notes",
            placeholder: "Search notes, comments, client tags, or topics",
        },
        filters: {
            tag: {
                label: "Filter by note tag",
                placeholder: "Filter by tag",
                all: "All Notes",
            },
            client: {
                label: "Filter by client tag",
                placeholder: "Filter by Client Tag",
                all: "All Client Tags",
            },
            topic: {
                label: "Filter by topic",
                placeholder: "Filter by Topic",
                all: "All Topics",
            },
            importance: {
                label: "Filter by importance",
                placeholder: "Filter by Importance",
                all: "All Importance",
                exact_one: "{{count}} Star",
                exact_other: "{{count}} Stars",
                /** The highest importance level. */
                critical: "{{count}} Stars (Critical)",
                atLeast: "{{count}}+ Stars",
            },
            clear: "Clear filters",
        },
        sort: {
            label: "Sort notes by",
            placeholder: "Sort by...",
            fields: {
                updatedDate: "Last Updated",
                createdDate: "Date Created",
                importance: "Importance",
                clientReference: "Client Reference",
                topics: "Topics",
                upvotes: "Upvotes",
                downvotes: "Downvotes",
            },
            sortedAscending: "Sorted ascending; switch to descending",
            sortedDescending: "Sorted descending; switch to ascending",
        },
        view: {
            switchToList: "Switch to list view",
            switchToGrid: "Switch to grid view",
        },
        loadingNotes: "Loading notes",
        emptyState: {
            noMatchesTitle: "No matching notes",
            noMatchesDescription: "Try adjusting your search or filters.",
            emptyTitle: "This dashboard is empty",
            emptyDescription: "Start by adding your first research note to this dashboard.",
            addFirstNote: "Add Your First Note",
        },
        renameDialog: {
            title: "Rename Dashboard",
            description: "Enter a new name for your dashboard \"{{dashboardName}}\".",
        },
        confirmations: {
            deleteNote: "Are you sure you want to delete this note? This will also delete its version history.",
            deleteDashboard: "Are you sure you want to delete the dashboard \"{{dashboardName}}\"? This will also delete all its notes and shares. This action cannot be undone.",
        },
        toasts: {
            notFound: "Dashboard not found.",
            noViewPermission: "You do not have permission to view this dashboard.",
            loadFailed: "Failed to load dashboard.",
            loadNotesFailed: "Failed to load notes for this dashboard.",
            noSavePermission: "You don't have permission to save notes in this dashboard.",
            noteUpdated: "Note updated successfully",
            noteCreated: "Note created successfully",
            saveNoteFailed: "Failed to save note",
            noAddPermission: "You don't have permission to add notes to this dashboard.",
            noDeletePermission: "You don't have permission to delete notes from this dashboard.",
            noteDeleted: "Note deleted successfully",
            deleteNoteFailed: "Failed to delete note",
            renamed: "Dashboard renamed successfully!",
            renameFailed: "Failed to rename dashboard.",
            deleted: "Dashboard \"{{dashboardName}}\" deleted.",
            deleteFailed: "Failed to delete dashboard.",
        },
        export: {
            nothingToExport: "No notes to export (check filters).",
            preparing: "Preparing export...",
            success: "Export successful! CSV file has been downloaded with links to all images.",
            failed: "Failed to export dashboard.",
            /** Shown in the Note Type column for a note whose tag is not recognised. */
            unknownTag: "Unknown",
            columns: {
                noteType: "Note Type",
                content: "Content",
                internalComments: "Internal Comments",
                clientTags: "Client Tags",
                topics: "Topics",
                references: "References",
                importance: "Importance (1-{{max}})",
                upvotes: "Upvotes",
                downvotes: "Downvotes",
                lastUpdated: "Last Updated",
                imageUrls: "Attached Image URLs",
            },
        },
    },

    dashboardShare: {
        title: "Share \"{{dashboardName}}\"",
        description: "Invite others to collaborate or view this dashboard.",
        emailLabel: "Email address",
        emailPlaceholder: "Enter email to share with",
        permissionLabel: "Permission",
        permissionPlaceholder: "Role",
        currentlySharedWith: "Currently shared with:",
        notShared: "This dashboard isn't shared yet.",
        toasts: {
            loadFailed: "Could not load sharing information.",
            cannotShareWithSelf: "You cannot share a dashboard with yourself.",
            alreadyShared: "Dashboard is already shared with this email. You can edit their permission.",
            shared: "Dashboard shared successfully!",
            shareFailed: "Failed to share dashboard.",
            permissionUpdated: "Permission updated.",
            permissionUpdateFailed: "Failed to update permission.",
            removed: "Share removed.",
            removeFailed: "Failed to remove share.",
        },
    },

    /** The Mom Test tags and their categories (features/notes/note-tags.ts), by id. */
    noteTags: {
        categories: {
            emotional: { label: "Emotional Responses", description: "How users feel about their current situation" },
            problem: { label: "Problems & Pain Points", description: "Challenges and obstacles users face" },
            outcome: { label: "Goals & Outcomes", description: "What users want to achieve" },
            behavior: { label: "Current Behavior", description: "How users currently work around problems" },
            context: { label: "Context & Environment", description: "Background information that influences decisions" },
            business: { label: "Business Context", description: "Budget, purchasing, and business considerations" },
            action: { label: "Action Items", description: "Follow-up tasks and next steps" },
        },
        tags: {
            excited: { label: "Excited", description: "Positive emotions or enthusiasm" },
            angry: { label: "Angry", description: "Frustration, complaints, or negative feelings" },
            embarrassed: { label: "Embarrassed", description: "Awkwardness, discomfort, or uncertainty" },
            pain_problem: { label: "Pain/Problem", description: "Critical insight: the core challenge or pain the user urgently needs solved" },
            goal: { label: "Goal", description: "What the user ultimately wants to achieve or accomplish" },
            obstacle: { label: "Obstacle", description: "Something blocking progress or creating friction" },
            workaround: { label: "Workaround", description: "A clever or improvised solution the user employs" },
            context: { label: "Context", description: "Additional background details that shape the situation" },
            feature_request: { label: "Feature Request", description: "A suggestion for new functionality or improvements" },
            budget: { label: "Budget", description: "Conversations about pricing, spending, or funding" },
            person_company: { label: "Person/Company", description: "Mention of a specific individual, organization, competitor, collaborator, or key decision-maker" },
            follow_up: { label: "Follow-up", description: "Topics that require a future action or next step" },
        },
        untagged: "Untagged",
        untaggedNote: "Untagged note",
        picker: {
            triggerLabel: "Note tag: {{tag}}. Change tag",
            prompt: "What kind of insight is this?",
        },
    },

    /** Shared by the note card, the note editor and the version history. */
    notes: {
        /** Label of a note whose tag is not recognised. */
        fallbackLabel: "Note",
        noDate: "No date",
        importance: {
            label: "Importance",
            setLevel: "Set importance to {{level}}",
            summary: "Importance: {{level}} of {{max}}",
            selected: "({{level}}/{{max}})",
        },
        upvotes: "Upvotes",
        downvotes: "Downvotes",
        clientTags: "Client tags",
        topics: "Topics",
        references: "References",
        images: {
            viewFullSizeHint: "Double-click to view full size",
            download: "Download image",
            noDescription: "No description provided.",
        },
    },

    noteCard: {
        actionsLabel: "Note actions",
        copyContent: "Copy content",
        versionHistory: "Version history",
        internalComments: "Internal comments (researcher)",
        imageAlt: "Note image {{number}}",
        imagePrefix: "[Image]",
        viewImageFullSize: "View image full size",
        filterByClient: "Filter by client {{client}}",
        filterByTopic: "Filter by topic {{topic}}",
        upvote: "Upvote ({{count}})",
        downvote: "Downvote ({{count}})",
        toasts: {
            voteFailed: "Failed to record vote.",
            importanceFailed: "Failed to update importance.",
            copied: "Note content copied to clipboard",
        },
    },

    noteEditor: {
        newTitle: "New Note",
        editTitle: "Edit Note",
        newSubtitle: "Capture what you heard, then tag it",
        editSubtitle: "Update your research note",
        closeLabel: "Close editor",
        content: {
            label: "Note Content",
            placeholder: "What did you learn? What insights did you capture?",
        },
        quickSaveHint: "Press Ctrl+Enter to save quickly",
        characterCount_one: "{{count}} character",
        characterCount_other: "{{count}} characters",
        internalComments: {
            add: "Add internal comments...",
            label: "Our Comments (Internal)",
            placeholder: "Add internal notes, observations, or next steps (only visible to your team)...",
        },
        references: {
            label: "References (URLs)",
            placeholder: "Add a relevant link (e.g., https://example.com)",
            add: "Add",
            remove: "Remove {{url}}",
            invalid: "Please enter a valid URL (e.g., https://example.com)",
        },
        clientTags: {
            label: "Client Tags",
            placeholder: "Select or create client tags...",
            info: "Helps you track which client(s) or projects this insight relates to.",
        },
        topics: {
            label: "Topics",
            placeholder: "Select or create topic tags...",
            info: "Categorize this note by relevant topics.",
        },
        images: {
            label: "Attached Images",
            uploadHint: "Upload PNG, JPEG, GIF, or WebP files (max {{maxMegabytes}}MB each)",
            uploading: "Uploading images...",
            previewAlt: "Upload preview {{number}}",
            viewFullSize: "View full size",
            altTextPlaceholder: "Add description for accessibility...",
            altTextLabel: "Alternative text for image {{number}}",
            remove: "Remove image",
            tooLarge: "Some files are too large. Maximum size is {{maxMegabytes}}MB per file.",
            uploaded_one: "{{count}} image uploaded successfully!",
            uploaded_other: "{{count}} images uploaded successfully!",
            uploadFailed: "Failed to upload one or more images.",
        },
        discardConfirmation: "Discard your unsaved changes to this note?",
        save: "Save Note",
        update: "Update Note",
        saving: "Saving...",
    },

    versionHistory: {
        title: "Version History",
        versionCount_one: "{{count}} version",
        versionCount_other: "{{count}} versions",
        loading: "Loading versions...",
        empty: "No version history available.",
        current: "Current",
        versionNumber: "Version {{number}}",
        detailsTitle: "Version Details",
        /** Heading of a version whose tag is not recognised. */
        noteDetails: "Note Details",
        savedOn: "Saved on: {{date}}",
        notAvailable: "N/A",
        internalComments: "Internal Comments",
        attachedImages: "Attached Images",
        viewFullSize: "View Full Size",
        /** <lineBreak/> is a line break on small screens only. */
        selectPrompt: "Select a version from the list <lineBreak/> to view its details.",
    },

    tagSelector: {
        defaultLabel: "Tags",
        defaultPlaceholder: "Select or create tags...",
        addMore: "Add more...",
        searchPlaceholder: "Type to search or create new...",
        createNew: "Create new: \"{{tag}}\"",
        noExistingTags: "No existing tags. Type to create new.",
        noMatches: "No matching tags found.",
        remove: "Remove {{tag}} tag",
    },

    markdownEditor: {
        write: "Write",
        preview: "Preview",
        help: "Markdown",
        /** The example words are shown inside Markdown syntax, e.g. **bold**. */
        cheatSheet: {
            title: "Markdown Quick Guide",
            bold: "bold",
            italic: "italic",
            heading1: "H1",
            heading2: "H2",
            listItem: "List item",
            link: "Link",
            inlineCode: "inline code",
            blockquote: "Blockquote",
        },
    },

    imageLightbox: {
        zoomOut: "Zoom out (-)",
        zoomIn: "Zoom in (+)",
        zoomLevel: "{{percent}}%",
        close: "Close (Esc)",
        fullSizeAlt: "Full size view",
        instructions: "Click to zoom • Drag to pan • Esc to close",
    },

    guide: {
        title: "How tagging works",
        introduction: "Twelve tags, grouped in seven categories, help you capture and organize what you learn from user interviews, customer feedback, and research sessions.",
        quickTips: {
            title: "Quick tips",
            items: [
                "Use tags to quickly categorize insights during interviews",
                "One note can contain multiple insights - group related quotes together",
                "Focus on exact user quotes rather than your interpretations",
                "Review and tag notes immediately after interviews while memory is fresh",
            ],
        },
        categoriesTitle: "Categories",
        categoryButtonLabel_one: "{{category}}: {{count}} tag. Jump to section",
        categoryButtonLabel_other: "{{category}}: {{count}} tags. Jump to section",
        callToAction: {
            title: "Ready to start taking notes?",
            description: "Now that you know the tags, start capturing insights from your user research and interviews.",
            button: "Start taking notes",
        },
    },

    externalLink: {
        opensInNewTab: "(opens in a new tab)",
    },

    credits: {
        title: "Credits & Attribution",
        description: "This app stands on the shoulders of giants",
        inspiration: {
            title: "Inspired by \"The Mom Test\"",
            credit: "This app is inspired by and gives full credit to <strong>Rob Fitzpatrick</strong>, author of <em>The Mom Test</em> — a must-read book for anyone doing customer development, product interviews, or startup validation.",
            recommendation: "We highly recommend you buy the book and support Rob's work:",
            bookLink: "Get The Mom Test Book",
            disclaimer: "<strong>Important:</strong> This project is not affiliated with, endorsed by, or officially connected to Rob Fitzpatrick or The Mom Test. It's simply a tribute tool for those who want to apply the lessons in their own workflows.",
        },
        quote: {
            text: "\"The Mom Test is a set of simple rules for crafting good questions that even your mom can't lie to you about.\"",
            attribution: "— Rob Fitzpatrick",
        },
        benefits: {
            title: "Why The Mom Test Methodology Matters",
            questions: { title: "Better Questions", text: "Learn to ask questions that reveal actual behavior, not just opinions" },
            insights: { title: "Real Insights", text: "Discover what customers actually do, not what they say they'll do" },
            build: { title: "Build Better", text: "Create products people actually want by understanding real problems" },
        },
    },

    about: {
        title: "About The Creator",
        description: "Meet the person behind {{productName}}",
        creator: {
            initials: "GD",
            name: "Galit Dotan",
            biography: "This project was created by <strong>Galit Dotan</strong>, an entrepreneur consistent in building thoughtful, user-centered products. Galit has experience in innovation, product development, and leveraging customer insights to drive meaningful solutions.",
        },
        connect: {
            title: "Connect with Galit",
            linkedIn: "LinkedIn Profile",
            gitHub: "GitHub Profile",
        },
        mission: {
            title: "Project Mission",
            text: "{{productName}} was created to help entrepreneurs, product managers, and researchers systematically capture and organize customer insights using Rob Fitzpatrick's proven methodology. By making good customer development practices more accessible, we hope to help more people build products that truly matter.",
        },
    },

    /**
     * Legal documents, rendered by components/documents/LegalDocumentPage. A
     * section shows its paragraphs, then its items as a list; an item is plain
     * text, or a term shown in bold followed by its text.
     */
    legal: {
        lastUpdated: "Last updated: {{date}}",
        privacyPolicy: {
            title: "Privacy Policy",
            introduction: "Welcome to {{productName}}. This Privacy Policy explains how we collect, use, and protect your information. Your privacy is important to us.",
            sections: [
                {
                    title: "1. Information We Collect",
                    items: [
                        { term: "Account Information:", text: "When you sign in using Google Authentication, we receive your name and email address from Google to create and manage your account. We do not collect or store your password." },
                        { term: "User-Generated Content:", text: "We store the notes, dashboards, and related content you create within the application. This includes text, tags, and other data you input." },
                    ],
                },
                {
                    title: "2. How We Use Your Information",
                    items: [
                        { term: "To Provide the Service:", text: "Your information is used to operate, maintain, and provide you with the features and functionality of {{productName}}." },
                        { term: "Authentication:", text: "Your email is used to securely identify you and grant you access to your content." },
                        { term: "Communication:", text: "We may use your email to send you important service-related notices, but we will never send you marketing emails." },
                    ],
                },
                {
                    title: "3. Data Storage and Security",
                    items: [
                        { term: "Data Storage:", text: "All your data, including account information and user-generated content, is securely stored on cloud infrastructure." },
                        { term: "Data Residency:", text: "Our cloud provider may store data in various locations globally. We rely on their security and compliance programs to protect your data." },
                        { term: "Security Measures:", text: "We implement reasonable security measures to protect your data from unauthorized access, alteration, or destruction. However, no internet-based service is 100% secure." },
                    ],
                },
                {
                    title: "4. Data Sharing and Disclosure",
                    items: [
                        { term: "No Commercial Use:", text: "We will never sell, rent, or share your personal information or user-generated content with third parties for marketing or commercial purposes." },
                        { term: "Collaboration Features:", text: "If you use features to share dashboards with other users, the email addresses you invite and the associated content will be accessible to those users based on the permissions you set." },
                        { term: "Legal Requirements:", text: "We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation." },
                    ],
                },
                {
                    title: "5. Data Retention",
                    paragraphs: [
                        "We retain your personal data and content as long as your account is active. You can request the deletion of your account and all associated data by contacting us.",
                    ],
                },
                {
                    title: "6. Your Rights",
                    paragraphs: [
                        "You have the right to access, update, or delete your information at any time by logging into your account or contacting us for assistance.",
                    ],
                },
                {
                    title: "7. Changes to This Policy",
                    paragraphs: [
                        "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
                    ],
                },
            ],
        },
        termsOfUse: {
            title: "Terms of Use",
            introduction: "Welcome to {{productName}}. By using this application, you agree to these Terms of Use. Please read them carefully.",
            sections: [
                {
                    title: "1. Acceptance of Terms",
                    paragraphs: [
                        "By accessing and using {{productName}}, you accept and agree to be bound by the terms and provision of this agreement.",
                    ],
                },
                {
                    title: "2. Description of Service",
                    paragraphs: [
                        "{{productName}} is a free, non-commercial tool designed to help users organize research notes and customer insights using methodologies inspired by \"The Mom Test\" by Rob Fitzpatrick.",
                    ],
                },
                {
                    title: "3. User Account and Responsibilities",
                    items: [
                        "You must provide accurate and complete information when creating an account.",
                        "You are responsible for maintaining the confidentiality of your account.",
                        "You agree to use the service only for lawful purposes.",
                        "You will not attempt to gain unauthorized access to the service or other user accounts.",
                    ],
                },
                {
                    title: "4. User Content",
                    items: [
                        "You retain ownership of any content you create or upload to the service.",
                        "You grant us a limited license to store, display, and share your content as necessary to provide the service.",
                        "You are responsible for ensuring your content does not infringe on third-party rights.",
                        "We reserve the right to remove content that violates these terms.",
                    ],
                },
                {
                    title: "5. Intellectual Property",
                    paragraphs: [
                        "This application is inspired by \"The Mom Test\" by Rob Fitzpatrick. We acknowledge and respect the intellectual property rights of the original work. This tool is provided as a tribute and is not affiliated with or endorsed by Rob Fitzpatrick.",
                    ],
                },
                {
                    title: "6. Disclaimer of Warranties",
                    paragraphs: [
                        "The service is provided \"as is\" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.",
                    ],
                },
                {
                    title: "7. Limitation of Liability",
                    paragraphs: [
                        "In no event shall {{productName}} or its creators be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.",
                    ],
                },
                {
                    title: "8. Service Availability",
                    paragraphs: [
                        "We strive to maintain high availability but do not guarantee continuous, uninterrupted access to the service. We may need to perform maintenance or updates that temporarily affect availability.",
                    ],
                },
                {
                    title: "9. Termination",
                    paragraphs: [
                        "We reserve the right to terminate or suspend access to the service at any time, without prior notice, for conduct that we believe violates these Terms of Use.",
                    ],
                },
                {
                    title: "10. Changes to Terms",
                    paragraphs: [
                        "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the modified terms.",
                    ],
                },
                {
                    title: "11. Contact Information",
                    paragraphs: [
                        "If you have any questions about these Terms of Use, please contact us through the feedback mechanisms provided in the application.",
                    ],
                },
            ],
        },
        accessibilityStatement: {
            title: "Accessibility Statement",
            introduction: "{{productName}} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.",
            sections: [
                {
                    title: "1. Conformance Status",
                    paragraphs: [
                        "We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These guidelines explain how to make web content accessible to people with a wide array of disabilities.",
                    ],
                },
                {
                    title: "2. Accessibility Features",
                    items: [
                        { term: "Keyboard Navigation:", text: "The application is designed to be navigable using a keyboard." },
                        { term: "ARIA Attributes:", text: "We use Accessible Rich Internet Applications (ARIA) attributes to improve the accessibility of dynamic content." },
                        { term: "Customization:", text: "We provide user-controlled settings for font size and high-contrast mode to improve readability." },
                        { term: "Focus Management:", text: "Clear focus indicators help users understand where they are on the page." },
                        { term: "Color Contrast:", text: "We maintain appropriate color contrast ratios, especially in high-contrast mode." },
                        { term: "Responsive Design:", text: "The application works across different screen sizes and devices." },
                    ],
                },
                {
                    title: "3. Supported Technologies",
                    paragraphs: [
                        "{{productName}} is designed to work with the following assistive technologies:",
                    ],
                    items: [
                        "Screen readers (NVDA, JAWS, VoiceOver)",
                        "Keyboard navigation",
                        "Voice recognition software",
                        "Screen magnification software",
                    ],
                },
                {
                    title: "4. Known Limitations",
                    paragraphs: [
                        "Despite our efforts, some limitations may exist:",
                    ],
                    items: [
                        "Some complex interactive elements may require additional navigation steps.",
                        "File uploads and exports may require manual intervention for some assistive technologies.",
                        "Dynamic content updates may not always be immediately announced by screen readers.",
                    ],
                },
                {
                    title: "5. Feedback and Contact Information",
                    paragraphs: [
                        "We welcome your feedback on the accessibility of {{productName}}. If you encounter accessibility barriers or have suggestions for improvement, please let us know through the feedback mechanisms in the application.",
                    ],
                },
                {
                    title: "6. Ongoing Efforts",
                    paragraphs: [
                        "We are committed to continuing our accessibility improvements. This includes:",
                    ],
                    items: [
                        "Regular accessibility audits and testing",
                        "Training our development team on accessibility best practices",
                        "Incorporating accessibility considerations into our design and development process",
                        "Staying current with accessibility standards and guidelines",
                    ],
                },
                {
                    title: "7. Assessment Approach",
                    paragraphs: [
                        "Our accessibility assessment was conducted using a combination of automated testing tools and manual testing, including:",
                    ],
                    items: [
                        "Keyboard navigation testing",
                        "Screen reader testing",
                        "Color contrast analysis",
                        "Focus management evaluation",
                    ],
                },
            ],
        },
    },

    /** Built-in text of the shared UI primitives in components/ui. */
    ui: {
        dialog: {
            close: "Close",
        },
        sheet: {
            close: "Close",
        },
        carousel: {
            /** Announced by screen readers as the kind of region, and of each item in it. */
            roleDescription: "carousel",
            slideRoleDescription: "slide",
            previousSlide: "Previous slide",
            nextSlide: "Next slide",
        },
        pagination: {
            label: "pagination",
            previousPageLabel: "Go to previous page",
            previous: "Previous",
            nextPageLabel: "Go to next page",
            next: "Next",
            morePages: "More pages",
        },
        breadcrumb: {
            label: "breadcrumb",
            more: "More",
        },
        sidebar: {
            toggle: "Toggle Sidebar",
        },
        toaster: {
            notifications: "Notifications",
            closeToast: "Close toast",
        },
    },
} as const;
