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
import { accessibilitySettings, navigationItems, productLogoUrl, productName, routes, storageKeys } from "@/lib/constants";
import { ENTER_FROM_BELOW, SPRING_SNAPPY } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Accessibility, LogOut, Menu, WifiOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigationType } from "react-router-dom";

/** The header's hairline appears once the page has scrolled this far under it. */
const HEADER_HAIRLINE_SCROLL_THRESHOLD_PX = 4;

/**
 * Pages only animate in; there is no exit animation. The previous
 * AnimatePresence mode="wait" setup waited for the old page to fade out
 * before showing the new one, rendered the *new* route inside the exiting
 * page, and could get stuck with the new page at opacity 0 (a blank page).
 * Responding immediately is also what a tab switch should do.
 */
const PAGE_ENTER = ENTER_FROM_BELOW;

/** Routes that belong to the Dashboards tab (the list and a single dashboard). */
const DASHBOARD_SECTION_PATHS: string[] = [routes.home, routes.dashboards, routes.dashboardDetail];

const readStoredFontSize = () => {
    const stored = Number.parseInt(localStorage.getItem(storageKeys.accessibilityFontSize) ?? "", 10);
    return Number.isNaN(stored) ? accessibilitySettings.fontSizePercent.default : stored;
};

const readStoredHighContrast = () => localStorage.getItem(storageKeys.accessibilityHighContrast) === "true";

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
        const handleScroll = () => setIsScrolled(window.scrollY > HEADER_HAIRLINE_SCROLL_THRESHOLD_PX);
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
        document.documentElement.classList.toggle(accessibilitySettings.highContrastClassName, isHighContrast);
        localStorage.setItem(storageKeys.accessibilityFontSize, String(fontSize));
        localStorage.setItem(storageKeys.accessibilityHighContrast, String(isHighContrast));
    }, [fontSize, isHighContrast]);

    useEffect(() => {
        // Set a default title, can be overridden by specific pages
        document.title = productName;

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
        url === routes.dashboards
            ? DASHBOARD_SECTION_PATHS.includes(location.pathname)
            : location.pathname === url;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header
                className={cn(
                    "material-chrome sticky top-0 z-50 border-b transition-colors duration-200",
                    isScrolled || isMobileMenuOpen ? "border-border/70" : "border-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4 min-w-0">
                            <Link to={routes.dashboards} className="flex items-center gap-2.5 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${productName}, go to dashboards`}>
                                {/* Decorative: the link's aria-label already names the product. */}
                                <img src={productLogoUrl} alt="" className="size-9 shrink-0" />

                                <span className="text-[17px] font-semibold tracking-tight text-foreground hidden sm:block">{productName}</span>
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
                                                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
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
                        <p className="text-center text-[13px] text-muted-foreground">&copy; {new Date().getFullYear()} {productName}. All rights reserved.</p>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Legal">
                        <Link to={routes.about} className="text-muted-foreground hover:text-foreground text-[13px]">About</Link>
                        <Link to={routes.credits} className="text-muted-foreground hover:text-foreground text-[13px]">Credits</Link>
                        <Link to={routes.privacyPolicy} className="text-muted-foreground hover:text-foreground text-[13px]">Privacy Policy</Link>
                        <Link to={routes.termsOfUse} className="text-muted-foreground hover:text-foreground text-[13px]">Terms of Use</Link>
                        <Link to={routes.accessibilityStatement} className="text-muted-foreground hover:text-foreground text-[13px]">Accessibility</Link>
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
