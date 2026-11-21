import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dashboard, DashboardShare, User } from "@/entities/all";
import type { DashboardPermissionLevel, DashboardRecord, StoredUser } from "@/entities/all";
import { usePageTitle } from "@/hooks/use-page-title";
import { useDateFormatter } from "@/i18n/useDateFormatter";
import { dashboardUrl } from "@/lib/constants";
import { LIST_ITEM_MOTION } from "@/lib/motion";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, FolderOpen, Loader2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "sonner";

/**
 * @type {React.FC<{dashboard: Dashboard & {permission_level?: string}, isOwner: boolean, permission?: string}>}
 */
const DashboardCard = ({ dashboard, isOwner, permission }) => {
    const { t } = useTranslation();
    const { formatTimeAgo } = useDateFormatter();

    return (
        <motion.div
            layout
            initial={LIST_ITEM_MOTION.initial}
            animate={LIST_ITEM_MOTION.animate}
            exit={LIST_ITEM_MOTION.exit}
            transition={LIST_ITEM_MOTION.transition}
        >
            {/* A real link: reachable by keyboard and openable in a new tab. */}
            <Link
                to={dashboardUrl(dashboard.id)}
                className="group block rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:active:scale-[0.99] transition-transform duration-150"
            >
                <Card className="h-full p-5 transition-shadow duration-200 group-hover:shadow-card-hover">
                    <div className="flex items-center gap-3">
                        <span
                            className={isOwner ? "size-10 shrink-0 rounded-xl bg-accent text-primary-fg flex items-center justify-center" : "size-10 shrink-0 rounded-xl bg-tag-behavior/10 text-tag-behavior flex items-center justify-center"}
                            aria-hidden
                        >
                            {isOwner ? <FolderOpen className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground truncate">{dashboard.name}</h3>
                            <p className="text-[13px] text-muted-foreground">
                                {t("dashboards.updated", { timeAgo: formatTimeAgo(dashboard.updated_date) })}
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground/70 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 rtl:rotate-180 rtl:motion-safe:group-hover:-translate-x-0.5" aria-hidden />
                    </div>
                    {!isOwner && (
                        <Badge variant="secondary" className="mt-3">
                            {/* A permission the app does not know is shown as stored. */}
                            {t("dashboards.sharedBadge", { permission: t(`dashboards.permissions.${permission}`, { defaultValue: permission }) })}
                        </Badge>
                    )}
                </Card>
            </Link>
        </motion.div>
    );
};

export default function DashboardsPage() {
    const { t } = useTranslation();
    const [ownedDashboards, setOwnedDashboards] = useState<DashboardRecord[]>([]);
    const [sharedDashboards, setSharedDashboards] = useState<Array<DashboardRecord & { permission_level: DashboardPermissionLevel }>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    usePageTitle(t("documentTitles.dashboards"));

    useEffect(() => {
        const fetchUserAndDashboards = async () => {
            setIsLoading(true);
            try {
                const user = await User.me();
                setCurrentUser(user);
                if (user && user.email) {
                    const owned = await Dashboard.filter({ owner_email: user.email }, "-updated_date");
                    setOwnedDashboards(owned);

                    const shares = await DashboardShare.filter({ shared_with_email: user.email });
                    const sharedDashDetails = await Promise.all(
                        shares.map(async (share) => {
                            const detail = await Dashboard.get(share.dashboard_id);
                            return detail ? { ...detail, permission_level: share.permission_level } : null;
                        })
                    );
                    setSharedDashboards(sharedDashDetails.filter(d => d !== null).sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date)));
                }
            } catch (error) {
                console.error("Failed to load user or dashboards:", error);
                toast.error(t("dashboards.toasts.loadFailed"));
            }
            setIsLoading(false);
        };
        fetchUserAndDashboards();
    }, []);

    /**
     * Handles creating a new dashboard
     */
    const handleCreateDashboard = async () => {
        const dashboardName = newDashboardName.trim();

        // Validation
        if (!dashboardName) {
            toast.error(t("dashboards.toasts.nameRequired"));
            return;
        }

        if (!currentUser) {
            toast.error(t("dashboards.toasts.noUser"));
            return;
        }

        if (!currentUser.email) {
            toast.error(t("dashboards.toasts.noUserEmail"));
            return;
        }

        // Prevent double submission
        if (isCreating) {
            return;
        }

        try {
            setIsCreating(true);

            const newDashboard = await Dashboard.create({
                name: dashboardName,
                owner_email: currentUser.email,
            });

            // Update state
            setOwnedDashboards(prev =>
                [newDashboard, ...prev].sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
            );

            // Reset form
            setNewDashboardName("");
            setIsCreateDialogOpen(false);

            // Show success
            toast.success(t("dashboards.toasts.created"));
        } catch (error) {
            console.error("Failed to create dashboard:", error);
            toast.error(t("dashboards.toasts.createFailed"));
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center" role="status" aria-label={t("dashboards.loading")}>
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
        );
    }

    const allDashboardsPresent = ownedDashboards.length > 0 || sharedDashboards.length > 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8">
                <div>
                    <h1 className="text-[28px] leading-tight font-semibold text-foreground">{t("dashboards.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("dashboards.subtitle")}</p>
                </div>
                {allDashboardsPresent && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus aria-hidden />
                        {t("dashboards.newDashboard")}
                    </Button>
                )}
            </div>

            {!allDashboardsPresent && (
                <div className="text-center py-16 max-w-md mx-auto">
                    <div className="size-14 rounded-2xl bg-accent text-primary-fg mx-auto mb-5 flex items-center justify-center" aria-hidden>
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-1.5">
                        {t("dashboards.emptyState.title")}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        {t("dashboards.emptyState.description")}
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus aria-hidden />
                        {t("dashboards.newDashboard")}
                    </Button>
                </div>
            )}

            {ownedDashboards.length > 0 && (
                <section className="mb-10" aria-labelledby="owned-dashboards">
                    <h2 id="owned-dashboards" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        {t("dashboards.ownedByYou")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <AnimatePresence initial={false}>
                            {ownedDashboards.map(d => (
                                <DashboardCard key={d.id} dashboard={d} isOwner={true} />
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            )}

            {sharedDashboards.length > 0 && (
                <section aria-labelledby="shared-dashboards">
                    <h2 id="shared-dashboards" className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        {t("dashboards.sharedWithYou")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <AnimatePresence initial={false}>
                            {sharedDashboards.map(d => (
                                <DashboardCard
                                    key={d.id}
                                    dashboard={d}
                                    isOwner={false}
                                    permission={d.permission_level}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            )}

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form
                        className="grid gap-4"
                        onSubmit={(e) => { e.preventDefault(); handleCreateDashboard(); }}
                    >
                        <DialogHeader>
                            <DialogTitle>{t("dashboards.createDialog.title")}</DialogTitle>
                            <DialogDescription>
                                {t("dashboards.createDialog.description")}
                            </DialogDescription>
                        </DialogHeader>
                        <Input
                            id="name"
                            autoFocus
                            aria-label={t("dashboards.createDialog.nameLabel")}
                            placeholder={t("dashboards.createDialog.namePlaceholder")}
                            value={newDashboardName}
                            onChange={(e) => setNewDashboardName(e.target.value)}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isCreating}>
                                    {t("common.cancel")}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isCreating || !newDashboardName.trim()}>
                                {isCreating ? (
                                    <>
                                        <Loader2 className="animate-spin" aria-hidden />
                                        {t("dashboards.createDialog.submitting")}
                                    </>
                                ) : (
                                    t("dashboards.createDialog.submit")
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
