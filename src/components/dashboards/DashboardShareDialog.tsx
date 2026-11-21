
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Added missing import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, Send, UserCheck, UserX, Edit, Eye, UserPlus } from "lucide-react"; // Added Eye and UserPlus imports
import { DashboardShare } from "@/entities/DashboardShare";
import type { DashboardPermissionLevel, DashboardShareRecord } from "@/entities/all"; // Assuming DashboardShare entity exists
import { toast } from "sonner";

export default function DashboardShareDialog({ dashboard, currentUserEmail, isOpen, onClose }) {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [permissionLevel, setPermissionLevel] = useState<DashboardPermissionLevel>("viewer");
    const [shares, setShares] = useState<DashboardShareRecord[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [editingShareId, setEditingShareId] = useState<string | null>(null);
    const [editPermissionLevel, setEditPermissionLevel] = useState<DashboardPermissionLevel>("viewer");


    const loadShares = async () => {
        if (!dashboard) return;
        try {
            const shareData = await DashboardShare.filter({ dashboard_id: dashboard.id });
            setShares(shareData);
        } catch (error) {
            console.error("Failed to load shares:", error);
            toast.error(t("dashboardShare.toasts.loadFailed"));
        }
    };

    useEffect(() => {
        if (isOpen && dashboard) {
            loadShares();
        }
    }, [isOpen, dashboard]);


    const handleShare = async () => {
        if (!email.trim() || !dashboard) return;
        if (email.trim() === currentUserEmail) {
            toast.error(t("dashboardShare.toasts.cannotShareWithSelf"));
            return;
        }

        setIsSending(true);
        try {
            const existingShare = shares.find(s => s.shared_with_email === email.trim());
            if (existingShare) {
                toast.error(t("dashboardShare.toasts.alreadyShared"));
                setIsSending(false);
                return;
            }

            await DashboardShare.create({
                dashboard_id: dashboard.id,
                shared_with_email: email.trim(),
                permission_level: permissionLevel,
            });

            setEmail("");
            setPermissionLevel("viewer");
            await loadShares();
            toast.success(t("dashboardShare.toasts.shared"));
        } catch (error) {
            toast.error(t("dashboardShare.toasts.shareFailed"));
            console.error("Share error:", error);
        }
        setIsSending(false);
    };

    const handleUpdatePermission = async (shareId, newPermission) => {
        try {
            await DashboardShare.update(shareId, { permission_level: newPermission });
            await loadShares();
            toast.success(t("dashboardShare.toasts.permissionUpdated"));
            setEditingShareId(null);
        } catch (error) {
            toast.error(t("dashboardShare.toasts.permissionUpdateFailed"));
            console.error("Update permission error:", error);
        }
    };

    const handleRemoveShare = async (shareId) => {
        try {
            await DashboardShare.delete(shareId);
            await loadShares();
            toast.success(t("dashboardShare.toasts.removed"));
        } catch (error) {
            toast.error(t("dashboardShare.toasts.removeFailed"));
            console.error("Remove share error:", error);
        }
    };

    const startEditing = (share) => {
        setEditingShareId(share.id);
        setEditPermissionLevel(share.permission_level);
    };

    if (!isOpen || !dashboard) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t("dashboardShare.title", { dashboardName: dashboard.name })}
                    </DialogTitle>
                    <DialogDescription>
                        {t("dashboardShare.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <label htmlFor="share-email" className="text-sm font-medium">{t("dashboardShare.emailLabel")}</label>
                            <Input
                                id="share-email"
                                type="email"
                                placeholder={t("dashboardShare.emailPlaceholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSending}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="share-permission" className="text-sm font-medium">{t("dashboardShare.permissionLabel")}</label>
                            <Select value={permissionLevel} onValueChange={setPermissionLevel} disabled={isSending}>
                                <SelectTrigger id="share-permission" className="w-[120px]">
                                    <SelectValue placeholder={t("dashboardShare.permissionPlaceholder")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="viewer"><div className="flex items-center gap-2"><Eye className="w-4 h-4" /> {t("dashboards.permissions.viewer")}</div></SelectItem>
                                    <SelectItem value="editor"><div className="flex items-center gap-2"><Edit className="w-4 h-4" /> {t("dashboards.permissions.editor")}</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleShare} disabled={!email.trim() || isSending} className="self-end">
                            {isSending ? <Send className="w-4 h-4 animate-pulse" /> : <UserPlus className="w-4 h-4" />}
                        </Button>
                    </div>

                    {shares.length > 0 && (
                        <div className="space-y-3 pt-4 border-t">
                            <h4 className="text-sm font-medium text-foreground">{t("dashboardShare.currentlySharedWith")}</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {shares.map((share) => (
                                    <div
                                        key={share.id}
                                        className="flex items-center justify-between p-2.5 bg-muted rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-primary-tint rounded-full flex items-center justify-center">
                                                <span className="text-sm text-primary-fg font-medium">
                                                    {share.shared_with_email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-sm text-foreground truncate max-w-[150px]" title={share.shared_with_email}>
                                                {share.shared_with_email}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {editingShareId === share.id ? (
                                                <Select value={editPermissionLevel} onValueChange={setEditPermissionLevel}>
                                                    <SelectTrigger className="w-[110px] h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="viewer">{t("dashboards.permissions.viewer")}</SelectItem>
                                                        <SelectItem value="editor">{t("dashboards.permissions.editor")}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge variant={share.permission_level === 'editor' ? 'default' : 'secondary'} className="h-7 text-xs">
                                                    {/* A permission the app does not know is shown as stored. */}
                                                    {t(`dashboards.permissions.${share.permission_level}`, { defaultValue: share.permission_level })}
                                                </Badge>
                                            )}

                                            {editingShareId === share.id ? (
                                                <Button variant="ghost" size="icon" onClick={() => handleUpdatePermission(share.id, editPermissionLevel)} className="h-7 w-7 text-success hover:text-success">
                                                    <UserCheck className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" onClick={() => startEditing(share)} className="h-7 w-7 text-muted-foreground hover:text-primary-fg">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveShare(share.id)}
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {shares.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">{t("dashboardShare.notShared")}</p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">{t("common.close")}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
