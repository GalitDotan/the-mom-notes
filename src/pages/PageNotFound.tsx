import { Home } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/lib/constants';

export default function PageNotFound() {
    const { t } = useTranslation();
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-7xl font-light text-border" aria-hidden="true">404</p>
                        <div className="h-0.5 w-16 bg-muted mx-auto"></div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-2xl font-medium text-foreground">
                            {t('notFound.title')}
                        </h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {/* The path comes from the URL: Trans renders it as text, never as markup. */}
                            <Trans
                                i18nKey="notFound.description"
                                values={{ pageName }}
                                components={{ pageName: <span className="font-medium text-foreground" /> }}
                            />
                        </p>
                    </div>

                    <div className="pt-6">
                        <Link
                            to={routes.dashboards}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-accent hover:border-input transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                        >
                            <Home className="w-4 h-4 me-2" aria-hidden="true" />
                            {t('notFound.goHome')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
