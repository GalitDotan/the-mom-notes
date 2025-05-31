
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard, DashboardShare } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus, LayoutDashboard, Users, Lock, Edit3, Trash2, LogIn, ChevronRight, Star, FolderOpen, FolderPlus, Sparkles, Loader2 } from "lucide-react"; 
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { formatDistanceToNow } from "date-fns"; // This will format in local time by default

const DashboardCard = ({ dashboard, isOwner, permission }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="cursor-pointer"
      onClick={() => navigate(createPageUrl(`DashboardDetailPage?id=${dashboard.id}`))}
    >
      <Card className="group h-full flex flex-col justify-between bg-white/70 backdrop-blur-sm border-0 shadow-md hover:shadow-lg hover:shadow-blue-100 transition-all duration-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 mb-2">
              {isOwner ? (
                <FolderPlus className="w-8 h-8 text-blue-500" />
              ) : (
                <FolderOpen className="w-8 h-8 text-purple-500" />
              )}
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{dashboard.name}</CardTitle>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
          </div>
          {isOwner ? (
            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Owned by you</Badge>
          ) : (
            <Badge variant="outline" className={`border-purple-200 text-purple-700 bg-purple-50`}>
              Shared with you ({permission})
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <CardDescription>
            {/* Ensured new Date() is used; formatDistanceToNow() will use client's local timezone */}
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

  useEffect(() => {
    document.title = "Your Dashboards - The Mom Notes"; // Added this line
    const fetchUserAndDashboards = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
        if (user && user.email) {
          // Fetch owned dashboards
          const owned = await Dashboard.filter({ owner_email: user.email }, "-updated_date");
          setOwnedDashboards(owned);

          // Fetch shared dashboards
          const shares = await DashboardShare.filter({ shared_with_email: user.email });
          const sharedDashDetails = await Promise.all(
            shares.map(async (share) => {
              const detail = await Dashboard.get(share.dashboard_id);
              return detail ? { ...detail, permission_level: share.permission_level } : null;
            })
          );
          setSharedDashboards(sharedDashDetails.filter(d => d !== null).sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date)));
        }
      } catch (error) {
        console.error("Failed to load user or dashboards:", error);
        toast.error("Could not load your dashboards.");
      }
      setIsLoading(false);
    };
    fetchUserAndDashboards();
  }, []);

  const handleCreateDashboard = async () => {
    if (!newDashboardName.trim() || !currentUser || !currentUser.email) {
      toast.error("Dashboard name cannot be empty.");
      return;
    }
    try {
      const newDashboard = await Dashboard.create({
        name: newDashboardName.trim(),
        owner_email: currentUser.email,
      });
      setOwnedDashboards(prev => [newDashboard, ...prev].sort((a,b) => new Date(b.updated_date) - new Date(a.updated_date)));
      setNewDashboardName("");
      setIsCreateDialogOpen(false);
      toast.success(`Dashboard "${newDashboard.name}" created!`);
    } catch (error) {
      console.error("Failed to create dashboard:", error);
      toast.error("Failed to create dashboard.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const allDashboardsPresent = ownedDashboards.length > 0 || sharedDashboards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboards</h1>
            <p className="text-gray-600">Organize your research notes into shareable dashboards.</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Dashboard
          </Button>
        </div>

        {!allDashboardsPresent && !isLoading && (
           <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create your first dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Organize your notes into focused dashboards. Each dashboard can be shared with your team.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Dashboard
              </Button>
            </div>
        )}

        {ownedDashboards.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" />
              Owned by you
            </h2>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {ownedDashboards.map(d => <DashboardCard key={d.id} dashboard={d} isOwner={true} />)}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {sharedDashboards.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-500" />
              Shared with you
            </h2>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {sharedDashboards.map(d => <DashboardCard key={d.id} dashboard={d} isOwner={false} permission={d.permission_level} />)}
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
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleCreateDashboard} disabled={!newDashboardName.trim()}>Create Dashboard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
