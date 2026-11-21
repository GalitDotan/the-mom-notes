import Layout from "./Layout";

import Guide from "./Guide";

import Credits from "./Credits";

import About from "./About";

import DashboardsPage from "./DashboardsPage";

import DashboardDetailPage from "./DashboardDetailPage";

import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Guide: Guide,

    DashboardsPage: DashboardsPage,

    DashboardDetailPage: DashboardDetailPage,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPage}>
            <Routes>

                <Route path="/" element={<Guide />} />

                <Route path="/Guide" element={<Guide />} />

                <Route path="/DashboardsPage" element={<DashboardsPage />} />

                <Route path="/DashboardDetailPage" element={<DashboardDetailPage />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}