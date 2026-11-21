import AccessibilityModal from "@/components/AccessibilityModal";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";
import { navigationItems } from "@/lib/constants";
import { createPageUrl } from "@/utils";
import { ENTER_FROM_BELOW, SPRING_SNAPPY } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Accessibility, LogOut, Menu, StickyNote, WifiOff, X } from "lucide-react";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";

const FONT_SIZE_STORAGE_KEY = "accessibility-font-size";
const HIGH_CONTRAST_STORAGE_KEY = "accessibility-high-contrast";
const DEFAULT_FONT_SIZE_PERCENT = 100;

/**
 * Focus outlines and the high-contrast theme toggled from AccessibilityModal.
 * The palette variables these rules use are defined in index.css.
 */
const ACCESSIBILITY_STYLES = `
            /* Focus outlines for accessibility: a default for anything focusable.
               Zero specificity and no !important, so components that draw their
               own focus ring (buttons, inputs, nav) show one ring, not two.
               High-contrast mode below still forces its outlines. */
            :where(button, a, input, select, textarea, [tabindex]):focus-visible {
              outline: 2px solid hsl(var(--ring));
              outline-offset: 2px;
            }

            /* High contrast mode - COMPLETE OVERHAUL */
            .high-contrast {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
            }

            /* ALL TEXT AND ICONS - WHITE */
            .high-contrast *,
            .high-contrast h1, .high-contrast h2, .high-contrast h3, .high-contrast h4, .high-contrast h5, .high-contrast h6,
            .high-contrast p, .high-contrast span, .high-contrast div, .high-contrast label,
            .high-contrast li, .high-contrast ul, .high-contrast ol,
            .high-contrast .text-gray-900, .high-contrast .text-gray-800, .high-contrast .text-gray-700,
            .high-contrast .text-gray-600, .high-contrast .text-gray-500, .high-contrast .text-gray-400,
            .high-contrast .text-gray-300, .high-contrast .text-slate-900, .high-contrast .text-slate-700,
            .high-contrast .text-black, .high-contrast .text-blue-600, .high-contrast .text-blue-700,
            .high-contrast .text-green-700, .high-contrast .text-red-600, .high-contrast .text-yellow-800,
            .high-contrast .text-purple-700, .high-contrast .text-pink-800, .high-contrast .text-indigo-800,
            .high-contrast .text-amber-800, .high-contrast .text-sky-700, .high-contrast .text-emerald-800,
            .high-contrast .prose *, .high-contrast .prose p, .high-contrast .prose li,
            .high-contrast .prose h1, .high-contrast .prose h2, .high-contrast .prose h3,
            .high-contrast .text-blue-500, .high-contrast .text-green-500, .high-contrast .text-red-500,
            .high-contrast .text-yellow-500, .high-contrast .text-purple-500, .high-contrast .text-pink-500,
            .high-contrast .text-indigo-500, .high-contrast .text-sky-500, .high-contrast .text-emerald-500 {
              color: var(--hc-text) !important;
            }

            /* ALL BACKGROUNDS - BLACK */
            .high-contrast,
            .high-contrast .min-h-screen, /* specifically target the main layout background */
            .high-contrast .bg-white, .high-contrast .bg-white\\/80, .high-contrast .bg-white\\/70,
            .high-contrast .bg-gray-50, .high-contrast .bg-gray-100, .high-contrast .bg-slate-50,
            .high-contrast .bg-gradient-to-br, .high-contrast .bg-gradient-to-r,
            .high-contrast .bg-green-100, .high-contrast .bg-red-100, .high-contrast .bg-blue-100,
            .high-contrast .bg-yellow-100, .high-contrast .bg-purple-100, .high-contrast .bg-pink-100,
            .high-contrast .bg-orange-100, .high-contrast .bg-sky-50, .high-contrast .bg-amber-50,
            .high-contrast .bg-yellow-50, .high-contrast .bg-emerald-100, .high-contrast .bg-blue-50,
            .high-contrast .bg-green-50, .high-contrast .bg-red-50, .high-contrast .bg-purple-50,
            .high-contrast .bg-\\[var\\(--ruby-dust-50\\)\\], .high-contrast .bg-\\[var\\(--ruby-dust-100\\)\\] {
              background-color: var(--hc-bg) !important;
              background-image: none !important;
              backdrop-filter: none !important;
            }

            /* BADGES AND LABELS - BLACK BACKGROUND, WHITE TEXT */
            .high-contrast .badge, .high-contrast [class*="badge"],
            .high-contrast .bg-green-50, .high-contrast .bg-blue-50, .high-contrast .bg-red-50,
            .high-contrast .bg-yellow-50, .high-contrast .bg-purple-50, .high-contrast .bg-pink-50,
            .high-contrast .bg-orange-50, .high-contrast .bg-indigo-50, .high-contrast .bg-amber-50,
            .high-contrast .bg-sky-50, .high-contrast .bg-emerald-50, .high-contrast .bg-teal-50,
            .high-contrast .bg-lime-50, .high-contrast .bg-cyan-50, .high-contrast .bg-violet-50,
            .high-contrast .bg-fuchsia-50, .high-contrast .bg-rose-50 {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            /* COLORED BADGES AND TAGS - FORCE BLACK BACKGROUND */
            .high-contrast .bg-\\[var\\(--ruby-dust-50\\)\\],
            .high-contrast .text-\\[var\\(--ruby-dust-700\\)\\],
            .high-contrast .border-\\[var\\(--ruby-dust-200\\)\\],
            .high-contrast .text-green-700, .high-contrast .bg-green-50, .high-contrast .border-green-200,
            .high-contrast .text-blue-700, .high-contrast .bg-blue-50, .high-contrast .border-blue-200,
            .high-contrast .text-red-700, .high-contrast .bg-red-50, .high-contrast .border-red-200,
            .high-contrast .text-yellow-700, .high-contrast .bg-yellow-50, .high-contrast .border-yellow-200,
            .high-contrast .text-purple-700, .high-contrast .bg-purple-50, .high-contrast .border-purple-200,
            .high-contrast .text-pink-700, .high-contrast .bg-pink-50, .high-contrast .border-pink-200,
            .high-contrast .text-indigo-700, .high-contrast .bg-indigo-50, .high-contrast .border-indigo-200,
            .high-contrast .text-sky-700, .high-contrast .bg-sky-50, .high-contrast .border-sky-200,
            .high-contrast .text-emerald-700, .high-contrast .bg-emerald-50, .high-contrast .border-emerald-200 {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            /* SECTION LABELS AND CATEGORY HEADERS */
            .high-contrast .bg-\\[var\\(--ruby-dust-100\\)\\],
            .high-contrast .text-\\[var\\(--ruby-dust-600\\)\\],
            .high-contrast .bg-amber-100, .high-contrast .text-amber-800,
            .high-contrast .bg-blue-100, .high-contrast .text-blue-800,
            .high-contrast .bg-green-100, .high-contrast .text-green-800,
            .high-contrast .bg-red-100, .high-contrast .text-red-800,
            .high-contrast .bg-yellow-100, .high-contrast .text-yellow-800,
            .high-contrast .bg-purple-100, .high-contrast .text-purple-800 {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
            }

            /* INTERNAL COMMENTS BOXES */
            .high-contrast .bg-yellow-50, .high-contrast .border-yellow-300,
            .high-contrast .text-yellow-800, .high-contrast .text-yellow-900 {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            /* ALL ICONS - WHITE */
            .high-contrast svg,
            .high-contrast .lucide, .high-contrast .icon {
              color: var(--hc-text) !important;
              stroke: var(--hc-text) !important;
            }

            /* BUTTONS - GRAY ACCENT WITH WHITE TEXT */
            .high-contrast button {
              background-color: transparent !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
              border-width: 1px !important;
              border-style: solid !important;
            }

            .high-contrast button svg {
              color: var(--hc-text) !important;
            }

            /* BUTTON HOVER/FOCUS - LIGHT GRAY BACKGROUND */
            .high-contrast button:hover,
            .high-contrast button:focus-visible {
              background-color: var(--hc-accent) !important;
              border-color: var(--hc-accent-light) !important;
              color: var(--hc-text) !important;
              outline: 2px solid var(--hc-accent-light) !important;
              outline-offset: 1px !important;
            }

            .high-contrast button:hover svg,
            .high-contrast button:focus-visible svg {
              color: var(--hc-text) !important;
            }

            /* LINKS - GRAY ACCENT */
            .high-contrast a {
              color: var(--hc-accent-light) !important;
              border-color: var(--hc-accent) !important;
            }

            .high-contrast a:hover,
            .high-contrast a:focus-visible {
              color: var(--hc-text) !important;
              background-color: var(--hc-accent) !important;
              outline: 2px solid var(--hc-accent-light) !important;
              outline-offset: 1px !important;
            }

            /* BORDERS - GRAY */
            .high-contrast .border, .high-contrast .border-t, .high-contrast .border-b, 
            .high-contrast .border-l, .high-contrast .border-r,
            .high-contrast .border-white\\/20, .high-contrast .border-gray-100, 
            .high-contrast .border-gray-200, .high-contrast .border-slate-200,
            .high-contrast .border-red-200, .high-contrast .border-amber-200, 
            .high-contrast .border-yellow-300, .high-contrast .border-green-200,
            .high-contrast .border-blue-200, .high-contrast .border-purple-200,
            .high-contrast .border-pink-200, .high-contrast .border-sky-200 {
              border-color: var(--hc-border) !important;
            }

            /* INPUT FIELDS */
            .high-contrast input, .high-contrast textarea, .high-contrast select {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            .high-contrast input:focus, .high-contrast textarea:focus, .high-contrast select:focus {
              border-color: var(--hc-accent-light) !important;
              outline: 2px solid var(--hc-accent-light) !important;
              outline-offset: 1px !important;
            }

            /* FOCUS STYLES IN HIGH CONTRAST */
            .high-contrast button:focus-visible, 
            .high-contrast a:focus-visible, 
            .high-contrast input:focus-visible, 
            .high-contrast select:focus-visible,
            .high-contrast textarea:focus-visible,
            .high-contrast [tabindex]:focus-visible {
              outline: 3px solid var(--hc-accent-light) !important;
              outline-offset: 2px !important;
            }

            /* SPECIAL ELEMENTS */
            .high-contrast .shadow-lg, .high-contrast .shadow-xl {
              /* box-shadow is handled by the 'REMOVE ALL SHADOWS AND GRADIENTS' rule */
            }

            /* MARKDOWN CONTENT */
            .high-contrast .prose blockquote {
              border-left-color: var(--hc-accent) !important;
              color: var(--hc-text) !important;
              background-color: var(--hc-bg) !important;
            }

            .high-contrast .prose code {
              background-color: var(--hc-accent) !important;
              color: var(--hc-text) !important;
            }

            /* CARD CONTENT AND PANELS */
            .high-contrast .card, .high-contrast [class*="card"] {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            /* TOOLTIPS AND POPOVERS */
            .high-contrast .tooltip, .high-contrast .popover,
            .high-contrast [role="tooltip"], .high-contrast [role="dialog"] {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-accent) !important;
            }

            /* REMOVE ALL SHADOWS AND GRADIENTS */
            .high-contrast * {
              background-image: none !important;
              box-shadow: none !important;
            }

            /* OVERRIDE SPECIFIC UTILITY CLASSES */
            .high-contrast .text-center, .high-contrast .text-left, .high-contrast .text-right {
              color: var(--hc-text) !important;
            }

            /* ENSURE ALL NESTED CONTENT INHERITS PROPERLY */
            .high-contrast [class*="bg-"] {
              background-color: var(--hc-bg) !important;
            }

            .high-contrast [class*="text-"] {
              color: var(--hc-text) !important;
            }

            .high-contrast [class*="border-"] {
              border-color: var(--hc-accent) !important;
            }

            /* High contrast image handling */
            .high-contrast .high-contrast-image {
              display: none !important;
            }
            .high-contrast-alt-text {
              display: none !important;
            }
            .high-contrast .high-contrast-alt-text {
              display: block !important;
            }
            .high-contrast .high-contrast-alt-text > div {
              background-color: var(--hc-bg) !important;
              color: var(--hc-text) !important;
              border-color: var(--hc-border) !important;
            }

            /* Responsive Notes Grid for Accessibility */
            .responsive-notes-grid {
              display: grid;
              gap: 1.5rem; /* Corresponds to Tailwind's gap-6 */
              grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)); /* auto-fill: a lone note keeps card width */
            }
`;

/**
 * Pages only animate in; there is no exit animation. The previous
 * AnimatePresence mode="wait" setup waited for the old page to fade out
 * before showing the new one, rendered the *new* route inside the exiting
 * page, and could get stuck with the new page at opacity 0 (a blank page).
 * Responding immediately is also what a tab switch should do.
 */
const PAGE_ENTER = ENTER_FROM_BELOW;

/** Routes that belong to the Dashboards tab (the list and a single dashboard). */
const DASHBOARD_SECTION_PATHS = ["/", createPageUrl("DashboardsPage"), createPageUrl("DashboardDetailPage")];

const readStoredFontSize = () => {
    const stored = Number.parseInt(localStorage.getItem(FONT_SIZE_STORAGE_KEY) ?? "", 10);
    return Number.isNaN(stored) ? DEFAULT_FONT_SIZE_PERCENT : stored;
};

const readStoredHighContrast = () => localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === "true";

type LayoutProps = {
    children: ReactNode;
};

/** App chrome for signed-in users. App.tsx only renders it when authenticated. */
export default function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // The header's hairline only appears once content scrolls under it.
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 4);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Accessibility State
    const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
    const [fontSize, setFontSize] = useState(readStoredFontSize);
    const [isHighContrast, setIsHighContrast] = useState(readStoredHighContrast);

    // Apply and save accessibility settings whenever they change
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
        document.documentElement.classList.toggle("high-contrast", isHighContrast);
        localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(fontSize));
        localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(isHighContrast));
    }, [fontSize, isHighContrast]);

    useEffect(() => {
        // Set a default title, can be overridden by specific pages
        document.title = "Saga's Scout";

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        // When page changes, close mobile menu
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // A newly opened page starts at the top. Back/forward (POP) keeps the
    // browser's restored position, and in-page #anchors scroll themselves.
    const navigationType = useNavigationType();
    useLayoutEffect(() => {
        if (navigationType !== "POP" && !location.hash) {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, location.hash, navigationType]);

    // Signing out clears the auth context, and App.tsx then redirects to /login.
    const handleLogout = () => {
        void logout();
    };

    const userName = user?.name ?? "";
    const userInitial = userName.charAt(0).toUpperCase() || "U";

    // A dashboard's own page still lives under the Dashboards tab.
    const isNavItemActive = (url: string) =>
        url === createPageUrl("DashboardsPage")
            ? DASHBOARD_SECTION_PATHS.includes(location.pathname)
            : location.pathname === url;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <style>{ACCESSIBILITY_STYLES}</style>
            <header
                className={cn(
                    "material-chrome sticky top-0 z-50 border-b transition-colors duration-200",
                    isScrolled || isMobileMenuOpen ? "border-border/70" : "border-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4 min-w-0">
                            <Link to={createPageUrl("DashboardsPage")} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Saga's Scout, go to dashboards">
                                <div className="size-9 bg-gradient-to-br from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-[10px] flex items-center justify-center rotate-12 shadow-sm">
                                    <StickyNote className="w-[18px] h-[18px] text-white" aria-hidden="true" />
                                </div>
                                <span className="text-[17px] font-semibold tracking-tight text-foreground hidden sm:block">Saga's Scout</span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-0.5 ms-6" aria-label="Main">
                                {navigationItems.map((item) => {
                                    const isActive = isNavItemActive(item.url);
                                    return (
                                        <Link
                                            key={item.title}
                                            to={item.url}
                                            aria-current={isActive ? "page" : undefined}
                                            className={cn(
                                                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {/* One shared pill that springs from the old tab to the new one. */}
                                            {isActive && (
                                                <motion.span
                                                    layoutId="main-nav-active"
                                                    className="absolute inset-0 rounded-full bg-accent"
                                                    transition={SPRING_SNAPPY}
                                                    aria-hidden
                                                />
                                            )}
                                            <item.icon className="relative w-4 h-4" aria-hidden="true" />
                                            <span className="relative">{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Connection status only when it matters: being online is the normal case. */}
                            {!isOnline && (
                                <span role="status" className="flex items-center gap-1.5 rounded-full bg-tag-action/10 px-2.5 py-1 text-xs font-medium text-tag-action">
                                    <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
                                    Offline
                                </span>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                {isMobileMenuOpen ? <X className="!w-5 !h-5" /> : <Menu className="!w-5 !h-5" />}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="hidden md:flex items-center gap-2 ps-1.5 pe-3 rounded-full" aria-label={`Account: ${userName}`}>
                                        <span className="size-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[13px] font-semibold" aria-hidden="true">
                                            {userInitial}
                                        </span>
                                        <span className="text-sm font-medium text-foreground/80 max-w-[10rem] truncate">{userName}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2">
                                        <p className="font-medium truncate">{userName}</p>
                                        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                        <LogOut className="w-4 h-4 me-2" aria-hidden="true" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <AnimatePresence initial={false}>
                        {isMobileMenuOpen && (
                            <motion.div
                                id="mobile-menu"
                                className="md:hidden overflow-hidden"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={SPRING_SNAPPY}
                            >
                                <nav className="space-y-1 py-3 border-t border-border/70" aria-label="Main">
                                    {navigationItems.map((item) => {
                                        const isActive = isNavItemActive(item.url);
                                        return (
                                            <Link
                                                key={item.title}
                                                to={item.url}
                                                aria-current={isActive ? "page" : undefined}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors duration-150",
                                                    isActive ? "bg-accent text-primary" : "text-foreground/80 hover:bg-secondary"
                                                )}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <item.icon className="w-5 h-5" aria-hidden="true" />
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                    <div className="px-3 pt-3 mt-3 border-t border-border/70">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="size-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold" aria-hidden="true">
                                                {userInitial}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-medium text-foreground truncate">{userName}</p>
                                                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="w-full text-destructive hover:text-destructive"
                                        >
                                            <LogOut aria-hidden="true" />
                                            Sign out
                                        </Button>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <motion.main
                key={location.pathname}
                className="flex-1"
                initial={PAGE_ENTER.initial}
                animate={PAGE_ENTER.animate}
                transition={PAGE_ENTER.transition}
            >
                {children}
            </motion.main>

            <footer className="border-t border-border/70 mt-auto">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAccessibilityModalOpen(true)}
                            className="text-muted-foreground"
                        >
                            <Accessibility aria-hidden="true" />
                            Accessibility Settings
                        </Button>
                        <p className="text-center text-[13px] text-muted-foreground">&copy; {new Date().getFullYear()} Saga's Scout. All rights reserved.</p>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Legal">
                        <Link to={createPageUrl("PrivacyPolicy")} className="text-muted-foreground hover:text-foreground text-[13px]">Privacy Policy</Link>
                        <Link to={createPageUrl("TermsOfUse")} className="text-muted-foreground hover:text-foreground text-[13px]">Terms of Use</Link>
                        <Link to={createPageUrl("AccessibilityStatement")} className="text-muted-foreground hover:text-foreground text-[13px]">Accessibility</Link>
                    </nav>
                </div>
            </footer>

            <AccessibilityModal
                isOpen={isAccessibilityModalOpen}
                onClose={() => setIsAccessibilityModalOpen(false)}
                fontSize={fontSize}
                setFontSize={setFontSize}
                isHighContrast={isHighContrast}
                setIsHighContrast={setIsHighContrast}
            />
        </div>
    );
}
