
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; // Added missing import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Mail, Plus, Trash2, Users, Send, UserCheck, UserX, Edit, Eye, UserPlus } from "lucide-react"; // Added Eye and UserPlus imports
import { DashboardShare } from "@/api/entities"; // Assuming DashboardShare entity exists
import { User } from "@/api/entities";
import { toast } from "sonner";

export default function DashboardShareDialog({ dashboard, currentUserEmail, isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [permissionLevel, setPermissionLevel] = useState("viewer");
  const [shares, setShares] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [editingShareId, setEditingShareId] = useState(null);
  const [editPermissionLevel, setEditPermissionLevel] = useState("viewer");


  const loadShares = async () => {
    if (!dashboard) return;
    try {
      const shareData = await DashboardShare.filter({ dashboard_id: dashboard.id });
      setShares(shareData);
    } catch (error) {
      console.error("Failed to load shares:", error);
      toast.error("Could not load sharing information.");
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
      toast.error("You cannot share a dashboard with yourself.");
      return;
    }
    
    setIsSending(true);
    try {
      const existingShare = shares.find(s => s.shared_with_email === email.trim());
      if (existingShare) {
        toast.error("Dashboard is already shared with this email. You can edit their permission.");
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
      toast.success("Dashboard shared successfully!");
    } catch (error) {
      toast.error("Failed to share dashboard.");
      console.error("Share error:", error);
    }
    setIsSending(false);
  };

  const handleUpdatePermission = async (shareId, newPermission) => {
    try {
      await DashboardShare.update(shareId, { permission_level: newPermission });
      await loadShares();
      toast.success("Permission updated.");
      setEditingShareId(null);
    } catch (error) {
      toast.error("Failed to update permission.");
      console.error("Update permission error:", error);
    }
  };

  const handleRemoveShare = async (shareId) => {
    try {
      await DashboardShare.delete(shareId);
      await loadShares();
      toast.success("Share removed.");
    } catch (error) {
      toast.error("Failed to remove share.");
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
            <Users className="w-5 h-5" /> Share "{dashboard.name}"
          </DialogTitle>
          <DialogDescription>
            Invite others to collaborate or view this dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <label htmlFor="share-email" className="text-sm font-medium">Email address</label>
              <Input
                id="share-email"
                type="email"
                placeholder="Enter email to share with"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSending}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="share-permission" className="text-sm font-medium">Permission</label>
              <Select value={permissionLevel} onValueChange={setPermissionLevel} disabled={isSending}>
                <SelectTrigger id="share-permission" className="w-[120px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer"><div className="flex items-center gap-2"><Eye className="w-4 h-4"/> Viewer</div></SelectItem>
                  <SelectItem value="editor"><div className="flex items-center gap-2"><Edit className="w-4 h-4"/> Editor</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleShare} disabled={!email.trim() || isSending} className="self-end">
              {isSending ? <Send className="w-4 h-4 animate-pulse" /> : <UserPlus className="w-4 h-4" />}
            </Button>
          </div>

          {shares.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700">Currently shared with:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm text-blue-600 font-medium">
                            {share.shared_with_email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      <span className="text-sm text-gray-800 truncate max-w-[150px]" title={share.shared_with_email}>
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
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={share.permission_level === 'editor' ? 'default' : 'secondary'} className="capitalize h-7 text-xs">
                          {share.permission_level}
                        </Badge>
                      )}

                      {editingShareId === share.id ? (
                        <Button variant="ghost" size="icon" onClick={() => handleUpdatePermission(share.id, editPermissionLevel)} className="h-7 w-7 text-green-600 hover:text-green-700">
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => startEditing(share)} className="h-7 w-7 text-gray-500 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveShare(share.id)}
                        className="h-7 w-7 text-gray-500 hover:text-red-600"
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
             <div className="text-center py-4 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">This dashboard isn't shared yet.</p>
              </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
