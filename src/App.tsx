import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { MotionConfig } from "motion/react"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './pages/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './Layout';
import { routes } from '@/lib/constants';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

import Login from './pages/Login';
import DashboardsPage from './pages/DashboardsPage';
import DashboardDetailPage from './pages/DashboardDetailPage';
import Guide from './pages/Guide';
import Credits from './pages/Credits';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AccessibilityStatement from './pages/AccessibilityStatement';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isAuthenticated } = useAuth();

    if (isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={routes.login} replace />;
    }

    return (
        <Layout>
            <Routes>
                <Route path={routes.home} element={<DashboardsPage />} />
                <Route path={routes.dashboards} element={<DashboardsPage />} />
                <Route path={routes.dashboardDetail} element={<DashboardDetailPage />} />
                <Route path={routes.explanation} element={<Guide />} />
                <Route path={routes.credits} element={<Credits />} />
                <Route path={routes.about} element={<About />} />
                <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />
                <Route path={routes.termsOfUse} element={<TermsOfUse />} />
                <Route path={routes.accessibilityStatement} element={<AccessibilityStatement />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Layout>
    );
};

function App() {
    return (
        // Respects the OS "reduce motion" setting everywhere: transform and layout
        // animations are skipped, opacity fades remain.
        <MotionConfig reducedMotion="user">
            <ThemeProvider>
                <AuthProvider>
                    <QueryClientProvider client={queryClientInstance}>
                        <Router>
                            <Routes>
                                <Route path={routes.login} element={<Login />} />
                                <Route path="*" element={<AuthenticatedApp />} />
                            </Routes>
                        </Router>
                        <Toaster />
                        {/* The pages report success and errors through sonner's `toast`; without
                            this, none of those messages (including failures) were ever shown. */}
                        <SonnerToaster position="bottom-right" closeButton />
                    </QueryClientProvider>
                </AuthProvider>
            </ThemeProvider>
        </MotionConfig>
    )
}

export default App