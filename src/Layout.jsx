
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  HelpCircle,
  User as UserIcon,
  LogOut,
  Wifi,
  WifiOff,
  Menu,
  X,
  Heart,
  Info,
  Loader2,
  StickyNote,
  Accessibility,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccessibilityModal from "../components/AccessibilityModal";

const navigationItems = [
  {
    title: "Dashboards",
    url: createPageUrl("DashboardsPage"),
    icon: LayoutDashboard,
  },
  {
    title: "Explanation",
    url: createPageUrl("Explanation"),
    icon: HelpCircle,
  },
  {
    title: "Credits",
    url: createPageUrl("Credits"),
    icon: Heart,
  },
  {
    title: "About",
    url: createPageUrl("About"),
    icon: Info,
  },
];

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};


export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(undefined);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Accessibility State
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Effect to load accessibility settings from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-font-size');
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
    if (savedHighContrast) {
      setIsHighContrast(savedHighContrast === 'true');
    }
  }, []);

  // Effect to apply and save accessibility settings whenever they change
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('accessibility-font-size', fontSize);

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('accessibility-high-contrast', isHighContrast);
  }, [fontSize, isHighContrast]);

  useEffect(() => {
    // Set a default title, can be overridden by specific pages
    document.title = "The Mom Notes";
    loadUser();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // When page changes, close mobile menu
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
  };

  const handleLogin = async () => {
    await User.login();
  };

  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)] flex items-center justify-center p-4">
        <style>
          {`
            :root {
              --ruby-dust-50: #fef2f7;
              --ruby-dust-100: #fce6ee;
              --ruby-dust-200: #f8cde0;
              --ruby-dust-300: #f5b3d1;
              --ruby-dust-400: #f08cbc;
              --ruby-dust-500: #d81768;
              --ruby-dust-600: #c0155d;
              --ruby-dust-700: #a91352;
              --ruby-dust-800: #911147;
              --ruby-dust-900: #7f103e;
              --ruby-dust-text-on-primary: white;
              --ruby-dust-text-interactive: var(--ruby-dust-600);
              --ruby-dust-focus-ring: var(--ruby-dust-400);
            }
          `}
        </style>
        <Loader2 className="w-16 h-16 text-[var(--ruby-dust-500)] animate-spin" />
      </div>
    );
  }

  if (user === null) {
    // Set title for login page
    document.title = "Login - The Mom Notes";
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)] flex items-center justify-center p-4">
        <style>
          {`
            :root {
              --ruby-dust-50: #fef2f7;
              --ruby-dust-100: #fce6ee;
              --ruby-dust-200: #f8cde0;
              --ruby-dust-300: #f5b3d1;
              --ruby-dust-400: #f08cbc;
              --ruby-dust-500: #d81768;
              --ruby-dust-600: #c0155d;
              --ruby-dust-700: #a91352;
              --ruby-dust-800: #911147;
              --ruby-dust-900: #7f103e;
              --ruby-dust-text-on-primary: white;
              --ruby-dust-text-interactive: var(--ruby-dust-600);
              --ruby-dust-focus-ring: var(--ruby-dust-400);
            }
          `}
        </style>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12">
              <StickyNote className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to The Mom Notes</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Capture insights with emoji-coded research notes.
              <br />Perfect for user interviews and feedback.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)] py-4 rounded-xl text-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <UserIcon className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">🙂</div>
                  <div className="text-xs text-gray-500">Excited</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">💥⚡</div>
                  <div className="text-xs text-gray-500">Pain Point</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🥅</div>
                  <div className="text-xs text-gray-500">Goal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)] flex flex-col">
       <style>
          {`
            :root {
              --ruby-dust-50: #fef2f7;
              --ruby-dust-100: #fce6ee;
              --ruby-dust-200: #f8cde0;
              --ruby-dust-300: #f5b3d1;
              --ruby-dust-400: #f08cbc;
              --ruby-dust-500: #d81768;
              --ruby-dust-600: #c0155d;
              --ruby-dust-700: #a91352;
              --ruby-dust-800: #911147;
              --ruby-dust-900: #7f103e;
              --ruby-dust-text-on-primary: white;
              --ruby-dust-text-interactive: var(--ruby-dust-600);
              --ruby-dust-focus-ring: var(--ruby-dust-400);

              /* High Contrast Variables */
              --hc-bg: #000000;
              --hc-text: #ffffff;
              --hc-accent: #666666;
              --hc-accent-light: #aaaaaa;
              --hc-border: #666666;
            }

            /* Focus outlines for accessibility */
            button:focus-visible, 
            a:focus-visible, 
            input:focus-visible, 
            select:focus-visible,
            textarea:focus-visible,
            [tabindex]:focus-visible {
              outline: 3px solid var(--ruby-dust-focus-ring) !important;
              outline-offset: 2px !important;
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
              grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
            }
          `}
        </style>
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("DashboardsPage")} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-xl flex items-center justify-center transform rotate-12">
                  <StickyNote className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">The Mom Notes</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1 ml-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-[var(--ruby-dust-100)] text-[var(--ruby-dust-text-interactive)]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isOnline
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    <span className="hidden sm:inline">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span className="hidden sm:inline">Offline</span>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium text-gray-700">{user.full_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      location.pathname === item.url
                        ? 'bg-[var(--ruby-dust-100)] text-[var(--ruby-dust-text-interactive)]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ))}
                <div className="px-4 py-3 border-t border-gray-100 mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.full_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 focus:bg-red-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

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

      <footer className="bg-white/70 backdrop-blur-sm border-t border-gray-100/80 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link to={createPageUrl("PrivacyPolicy")} className="text-gray-500 hover:text-gray-600 text-sm">Privacy Policy</Link>
            <Link to={createPageUrl("TermsOfUse")} className="text-gray-500 hover:text-gray-600 text-sm">Terms of Use</Link>
            <Link to={createPageUrl("AccessibilityStatement")} className="text-gray-500 hover:text-gray-600 text-sm">Accessibility</Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 flex items-center justify-center gap-4">
             <Button
                variant="ghost"
                onClick={() => setIsAccessibilityModalOpen(true)}
                className="text-gray-500 hover:text-gray-600"
              >
                <Accessibility className="w-5 h-5 mr-2" />
                Accessibility Settings
              </Button>
            <p className="text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} The Mom Notes. All rights reserved.</p>
          </div>
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
