import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Login from './pages/Login';
import DashboardsPage from './pages/DashboardsPage';
import DashboardDetailPage from './pages/DashboardDetailPage';
import Explanation from './pages/Explanation';
import Credits from './pages/Credits';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import AccessibilityStatement from './pages/AccessibilityStatement';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isAuthenticated, navigateToLogin } = useAuth();

    if (isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<DashboardsPage />} />
            <Route path="/DashboardsPage" element={<DashboardsPage />} />
            <Route path="/DashboardDetailPage" element={<DashboardDetailPage />} />
            <Route path="/Explanation" element={<Explanation />} />
            <Route path="/Credits" element={<Credits />} />
            <Route path="/About" element={<About />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/TermsOfUse" element={<TermsOfUse />} />
            <Route path="/AccessibilityStatement" element={<AccessibilityStatement />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<AuthenticatedApp />} />
                    </Routes>
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App