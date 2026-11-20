import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import AccessibilityModal from "@/components/AccessibilityModal";
import { User } from "@/entities/all";

const AppHeader = ({ user, isOnline, onLogout }: { user: any; isOnline: boolean; onLogout: () => Promise<void> }) => null;
const AppFooter = ({ onOpenAccessibility }: { onOpenAccessibility: () => void }) => null;
const AuthScreen = ({ onLogin }: { onLogin: () => void }) => null;
const LoadingScreen = () => null;

type LayoutProps = {
    children: React.ReactNode;
    currentPageName?: string;
};

const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3,
};

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const [user, setUser] = useState<any | null | undefined>(undefined);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        document.title = "The Mom Notes";

        User.me()
            .then(setUser)
            .catch(() => setUser(null));

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
        const savedFontSize = localStorage.getItem("accessibility-font-size");
        const savedHighContrast = localStorage.getItem("accessibility-high-contrast");

        if (savedFontSize) setFontSize(Number(savedFontSize));
        if (savedHighContrast) setIsHighContrast(savedHighContrast === "true");
    }, []);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}%`;
        document.documentElement.classList.toggle("high-contrast", isHighContrast);

        localStorage.setItem("accessibility-font-size", String(fontSize));
        localStorage.setItem("accessibility-high-contrast", String(isHighContrast));
    }, [fontSize, isHighContrast]);

    if (user === undefined) {
        return <LoadingScreen />;
    }

    if (user === null) {
        return <AuthScreen onLogin={() => User.login()} />;
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <AppHeader
                user={user}
                isOnline={isOnline}
                onLogout={async () => {
                    await User.logout();
                    setUser(null);
                }}
            />

            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    className="flex-1"
                    variants={pageVariants}
                    initial="initial"
                    animate="in"
                    exit="out"
                    transition={pageTransition}
                >
                    {children}
                </motion.main>
            </AnimatePresence>

            <AppFooter onOpenAccessibility={() => setIsAccessibilityModalOpen(true)} />

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
