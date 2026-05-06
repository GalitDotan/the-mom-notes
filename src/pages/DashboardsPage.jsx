
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Dashboard, DashboardShare, User } from "@/entities/all";
import { badgeLabels, messages, pageTitle, animations } from "@/lib/constants";
import { css, icons } from "@/lib/theme";
import { createPageUrl } from "@/utils";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, FolderOpen, FolderPlus, Loader2, Plus, Sparkles, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * @type {React.FC<{dashboard: Dashboard & {permission_level?: string}, isOwner: boolean, permission?: string}>}
 */
const DashboardCard = ({ dashboard, isOwner, permission }) => {
    const navigate = useNavigate();
    
    return (
        <motion.div
            layout
            initial={animations.variants.fadeIn.initial}
            animate={animations.variants.fadeIn.animate}
            exit={animations.variants.fadeIn.exit}
            className="cursor-pointer"
            onClick={() => navigate(createPageUrl(`DashboardDetailPage?id=${dashboard.id}`))}
        >
            <Card className="group h-full flex flex-col justify-between bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg hover:shadow-[var(--ruby-dust-100)] transition-all duration-200">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 mb-2">
                            {isOwner ? (
                                <FolderPlus className={`${icons.sizes.xl} text-[var(--ruby-dust-500)]`} />
                            ) : (
                                <FolderOpen className={`${icons.sizes.xl} text-purple-500`} />
                            )}
                            <CardTitle className="text-xl group-hover:text-[var(--ruby-dust-600)] transition-colors">
                                {dashboard.name}
                            </CardTitle>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--ruby-dust-600)] transition-transform group-hover:translate-x-1" />
                    </div>
                    {isOwner ? (
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            {badgeLabels.ownedByYou}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                            {badgeLabels.sharedWithYou} ({permission})
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        Last updated: {formatDistanceToNow(new Date(dashboard.updated_date), { addSuffix: true })}
                    </CardDescription>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default function DashboardsPage() {
    const [ownedDashboards, setOwnedDashboards] = useState([]);
    const [sharedDashboards, setSharedDashboards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        document.title = pageTitle.dashboards;
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
                toast.error(messages.errors.loadDashboards);
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
            toast.error(messages.errors.emptyDashboardName);
            return;
        }
        
        if (!currentUser) {
            toast.error("No user logged in.");
            return;
        }
        
        if (!currentUser.email) {
            toast.error("User email not available.");
            return;
        }
        
        // Prevent double submission
        if (isCreating) {
            return;
        }
        
        try {
            setIsCreating(true);
            console.log("Creating dashboard with name:", dashboardName, "and owner:", currentUser.email);
            
            const newDashboard = await Dashboard.create({
                name: dashboardName,
                owner_email: currentUser.email,
            });
            
            console.log("Dashboard created:", newDashboard);
            
            // Update state
            setOwnedDashboards(prev => 
                [newDashboard, ...prev].sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date))
            );
            
            // Reset form
            setNewDashboardName("");
            setIsCreateDialogOpen(false);
            
            // Show success
            toast.success(messages.success.dashboardCreated);
        } catch (error) {
            console.error("Failed to create dashboard:", error);
            toast.error(messages.errors.saveDashboard);
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className={`${icons.sizes['2xl']} text-[var(--ruby-dust-500)] animate-spin`} />
            </div>
        );
    }

    const allDashboardsPresent = ownedDashboards.length > 0 || sharedDashboards.length > 0;

    return (
        <div className={css.pageGradient}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboards</h1>
                        <p className="text-gray-600">Organize your research notes into shareable dashboards.</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className={css.gradientButtonSecondary}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        New Dashboard
                    </Button>
                </div>

                {!allDashboardsPresent && !isLoading && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12">
                            <Sparkles className={`${icons.sizes['3xl']} text-white`} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Create your first dashboard
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Organize your notes into focused dashboards. Each dashboard can be shared with your team.
                        </p>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className={css.gradientButton}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create Dashboard
                        </Button>
                    </div>
                )}

                {ownedDashboards.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                            <Star className={`${icons.sizes.lg} text-yellow-500`} />
                            Owned by you
                        </h2>
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {ownedDashboards.map(d => (
                                    <DashboardCard key={d.id} dashboard={d} isOwner={true} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                )}

                {sharedDashboards.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                            <Users className={`${icons.sizes.lg} text-purple-500`} />
                            Shared with you
                        </h2>
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {sharedDashboards.map(d => (
                                    <DashboardCard 
                                        key={d.id} 
                                        dashboard={d} 
                                        isOwner={false} 
                                        permission={d.permission_level} 
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                )}

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Dashboard</DialogTitle>
                            <DialogDescription>
                                Give your new dashboard a name. You can add notes and share it later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Input
                                id="name"
                                placeholder="E.g., Q4 User Interviews, Competitor Analysis"
                                value={newDashboardName}
                                onChange={(e) => setNewDashboardName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateDashboard()}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isCreating}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button 
                                type="button" 
                                onClick={handleCreateDashboard} 
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className={`${icons.sizes.sm} mr-2 animate-spin`} />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Dashboard"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
