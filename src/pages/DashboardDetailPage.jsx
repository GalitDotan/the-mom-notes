
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard, Note, NoteVersion, DashboardShare } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import { Plus, Search, Filter, SortAsc, SortDesc, Grid3X3, List, Sparkles, Edit3, Trash2, Share2, History, ArrowLeft, MoreVertical, Users, UserPlus, Eye, Edit, Save, XCircle, Loader2, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

import NoteCard from "../components/notes/NoteCard";
import NoteEditor from "../components/notes/NoteEditor";
import VersionHistory from "../components/notes/VersionHistory";
// New ShareDialog specifically for dashboards
import DashboardShareDialog from "../components/dashboards/DashboardShareDialog";

const EMOJI_FILTERS = [
  { value: "all", label: "All Notes", emoji: "📝" },
  { emoji: "🙂", label: "Excited", description: "Positive emotions or enthusiasm" },
  { emoji: "🙁", label: "Angry", description: "Frustration, complaints, or negative feelings" },
  { emoji: "😳", label: "Embarrassed", description: "Awkwardness, discomfort, or uncertainty" },
  { emoji: "💥", label: "Pain/Problem", description: "Critical insight: the core challenge or pain the user urgently needs solved" },
  { emoji: "🥅", label: "Goal", description: "What the user ultimately wants to achieve or accomplish" },
  { emoji: "🟥", label: "Obstacle", description: "Something blocking progress or creating friction" },
  { emoji: "↪️", label: "Workaround", description: "A clever or improvised solution the user employs" },
  { emoji: "🏔", label: "Context", description: "Additional background details that shape the situation" },
  { emoji: "☑️", label: "Feature Request", description: "A suggestion for new functionality or improvements" },
  { emoji: "💲", label: "Budget", description: "Conversations about pricing, spending, or funding" },
  { emoji: "♀️", label: "Person/Company", description: "Mention of a specific individual, organization, competitor, collaborator, or a key decision-maker" },
  { emoji: "⭐", label: "Follow-up", description: "Topics that require a future action, a next step, a to-track-later" },
];


export default function DashboardDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardId = new URLSearchParams(location.search).get("id");

  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emojiFilter, setEmojiFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated_date"); // Default sort field
  const [sortOrder, setSortOrder] = useState("desc"); // Default sort order: 'asc' or 'desc'
  const [viewMode, setViewMode] = useState("grid");

  const [isLoading, setIsLoading] = useState(true);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPermission, setUserPermission] = useState("viewer"); // Default to viewer

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Dialog states
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [historyDialogNote, setHistoryDialogNote] = useState(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");

  useEffect(() => {
    if (currentDashboard) {
      document.title = `${currentDashboard.name} - The Mom Notes`;
    } else {
      document.title = "Dashboard - The Mom Notes";
    }
  }, [currentDashboard]);

  const fetchDashboardData = useCallback(async (user) => {
    if (!dashboardId || !user) return;
    setIsLoading(true);
    try {
      const dashboardDetails = await Dashboard.get(dashboardId);
      if (!dashboardDetails) {
        toast.error("Dashboard not found.");
        navigate(createPageUrl("DashboardsPage"));
        return;
      }

      // Determine user permission
      let permission = "viewer";
      if (dashboardDetails.owner_email === user.email) {
        permission = "owner";
      } else {
        const share = await DashboardShare.filter({ dashboard_id: dashboardId, shared_with_email: user.email }, "", 1);
        if (share.length > 0) {
          permission = share[0].permission_level;
        } else {
          // Not owner and not shared with
          toast.error("You do not have permission to view this dashboard.");
          navigate(createPageUrl("DashboardsPage"));
          return;
        }
      }

      setCurrentDashboard(dashboardDetails);
      setNewDashboardName(dashboardDetails.name);
      setUserPermission(permission);
      setIsLoading(false);

      // Fetch notes only after dashboard and permissions are confirmed
      if (permission !== "none") { // "none" could be a state if not found or no permission
        fetchNotesForDashboard(dashboardDetails.id);
      }

    } catch (error) {
      console.error("Failed to load dashboard details:", error);
      toast.error("Failed to load dashboard.");
      navigate(createPageUrl("DashboardsPage"));
      setIsLoading(false);
    }
  }, [dashboardId, navigate]);

  const fetchNotesForDashboard = useCallback(async (currentDashboardId) => {
    setIsNotesLoading(true);
    try {
      const sortParam = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
      const fetchedNotes = await Note.filter({ dashboard_id: currentDashboardId }, sortParam);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes for this dashboard.");
    }
    setIsNotesLoading(false);
  }, [sortBy, sortOrder]); // Added sortOrder dependency

  useEffect(() => {
    const init = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        fetchDashboardData(user);
      } catch (error) { // User not logged in
        navigate(createPageUrl("DashboardsPage")); // Or a login page
      }
    };
    init();
  }, [dashboardId, fetchDashboardData, navigate]);

  useEffect(() => {
    if (currentDashboard) {
      fetchNotesForDashboard(currentDashboard.id);
    }
  }, [sortBy, sortOrder, currentDashboard, fetchNotesForDashboard]); // Added sortOrder

  useEffect(() => {
    const applyFilters = () => {
      let tempNotes = [...notes];
      if (searchTerm) {
        tempNotes = tempNotes.filter(note =>
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (emojiFilter !== "all") {
        tempNotes = tempNotes.filter(note => note.symbol === emojiFilter);
      }
      // Sorting is handled by the fetchNotesForDashboard via `sortBy`
      setFilteredNotes(tempNotes);
    };
    applyFilters();
  }, [notes, searchTerm, emojiFilter]);


  const handleSaveNote = async (noteData) => {
    if (!currentDashboard || (userPermission !== "owner" && userPermission !== "editor")) {
      toast.error("You don't have permission to save notes in this dashboard.");
      return;
    }
    setIsSavingNote(true);
    try {
      const dataToSave = {
        ...noteData,
        dashboard_id: currentDashboard.id,
      };

      if (editingNote) {
        await Note.update(editingNote.id, dataToSave);
        await NoteVersion.create({
          note_id: editingNote.id,
          content: dataToSave.content,
          symbol: dataToSave.symbol
        });
        toast.success("Note updated successfully");
      } else {
        const newNote = await Note.create(dataToSave);
        await NoteVersion.create({
          note_id: newNote.id,
          content: dataToSave.content,
          symbol: dataToSave.symbol
        });
        toast.success("Note created successfully");
      }
      setIsEditorOpen(false);
      setEditingNote(null);
      fetchNotesForDashboard(currentDashboard.id); // Refresh notes
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    }
    setIsSavingNote(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleNewNote = () => {
    if (userPermission !== "owner" && userPermission !== "editor") {
      toast.error("You don't have permission to add notes to this dashboard.");
      return;
    }
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (note) => {
    if (userPermission !== "owner" && userPermission !== "editor") {
      toast.error("You don't have permission to delete notes from this dashboard.");
      return;
    }
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        // First delete all versions associated with the note
        const versions = await NoteVersion.filter({ note_id: note.id });
        for (const version of versions) {
          await NoteVersion.delete(version.id);
        }
        // Then delete the note itself
        await Note.delete(note.id);
        toast.success("Note deleted successfully");
        fetchNotesForDashboard(currentDashboard.id); // Refresh notes
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast.error("Failed to delete note");
      }
    }
  };

  const handleViewHistory = (note) => {
    setHistoryDialogNote(note);
  };

  const handleRenameDashboard = async () => {
    if (!newDashboardName.trim() || !currentDashboard || userPermission !== "owner") return;
    try {
      await Dashboard.update(currentDashboard.id, { name: newDashboardName.trim() });
      setCurrentDashboard(prev => ({ ...prev, name: newDashboardName.trim() }));
      toast.success("Dashboard renamed successfully!");
      setIsRenameDialogOpen(false);
    } catch (error) {
      toast.error("Failed to rename dashboard.");
      console.error("Rename dashboard error:", error);
    }
  };

  const handleDeleteDashboard = async () => {
    if (!currentDashboard || userPermission !== "owner") return;
    if (confirm(`Are you sure you want to delete the dashboard "${currentDashboard.name}"? This will also delete all its notes and shares. This action cannot be undone.`)) {
      try {
        // Delete all notes and their versions in the dashboard
        const notesInDashboard = await Note.filter({ dashboard_id: currentDashboard.id });
        for (const note of notesInDashboard) {
          const versions = await NoteVersion.filter({ note_id: note.id });
          for (const version of versions) {
            await NoteVersion.delete(version.id);
          }
          await Note.delete(note.id);
        }
        // Delete all shares associated with the dashboard
        const shares = await DashboardShare.filter({ dashboard_id: currentDashboard.id });
        for (const share of shares) {
          await DashboardShare.delete(share.id);
        }
        // Delete the dashboard itself
        await Dashboard.delete(currentDashboard.id);
        toast.success(`Dashboard "${currentDashboard.name}" deleted.`);
        navigate(createPageUrl("DashboardsPage"));
      } catch (error) {
        toast.error("Failed to delete dashboard.");
        console.error("Delete dashboard error:", error);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  if (isLoading || !currentUser || !currentDashboard) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const canEditDashboard = userPermission === "owner";
  const canAddEditNotes = userPermission === "owner" || userPermission === "editor";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("DashboardsPage"))} className="bg-white/80 border-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                {currentDashboard.name}
                {canEditDashboard && (
                  <Button variant="ghost" size="icon" onClick={() => setIsRenameDialogOpen(true)} className="h-8 w-8">
                    <Edit3 className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                  </Button>
                )}
              </h1>
              <p className="text-gray-600">
                {userPermission === "owner" ? "You own this dashboard." : `Shared with you as ${userPermission}.`}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            {canEditDashboard && (
              <Button variant="outline" onClick={() => setIsShareDialogOpen(true)} className="bg-white/80 border-0 shadow-sm">
                <Users className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            {canAddEditNotes && (
              <Button
                onClick={handleNewNote}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Note
              </Button>
            )}
             {canEditDashboard && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white/80 border-0 shadow-sm">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                    <Edit3 className="w-4 h-4 mr-2" /> Rename Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDeleteDashboard} className="text-red-600 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-0 focus:bg-white h-10"
                />
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Select value={emojiFilter} onValueChange={setEmojiFilter}>
                <SelectTrigger className="w-full sm:w-auto lg:w-48 bg-white/80 border-0 h-10">
                  <div className="flex items-center gap-2"> <Filter className="w-4 h-4" /> <SelectValue /> </div>
                </SelectTrigger>
                <SelectContent>
                  {EMOJI_FILTERS.map((filter) => (
                    <SelectItem key={filter.value || filter.emoji} value={filter.value || filter.emoji}>
                      <div className="flex items-center gap-2"><span>{filter.emoji}</span><span>{filter.label}</span></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Select value={sortBy} onValueChange={(value) => {setSortBy(value);}}>
                  <SelectTrigger className="w-full sm:w-auto lg:w-[150px] bg-white/80 border-0 h-10">
                     <div className="flex items-center gap-2"> <SortAsc className="w-4 h-4" /> <SelectValue /> </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_date">Last Updated</SelectItem>
                    <SelectItem value="created_date">Date Created</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={toggleSortOrder} className="bg-white/80 border-0 h-10 w-10">
                  {sortOrder === 'asc' ? <ArrowUpNarrowWide className="w-4 h-4 text-gray-600" /> : <ArrowDownWideNarrow className="w-4 h-4 text-gray-600" />}
                </Button>
              </div>
              <Button variant="outline" size="icon" onClick={toggleViewMode} className="bg-white/80 border-0 h-10 w-10">
                {viewMode === "grid" ? <Grid3X3 className="w-4 h-4 text-gray-600" /> : <List className="w-4 h-4 text-gray-600" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Notes Grid/List */}
        <div className="mb-8">
          {isNotesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => ( <div key={i} className="animate-pulse"><div className="bg-white/50 rounded-xl h-48 p-6"><div className="w-8 h-8 bg-gray-200 rounded-lg mb-4"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div></div></div>))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12"> <Sparkles className="w-12 h-12 text-white" /> </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || emojiFilter !== "all" ? "No matching notes" : "This dashboard is empty"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || emojiFilter !== "all" ? "Try adjusting your search or filters" : "Start by adding your first research note to this dashboard."}
              </p>
              {canAddEditNotes && (!searchTerm && emojiFilter === "all") && (
                <Button onClick={handleNewNote} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"> <Plus className="w-5 h-5 mr-2" /> Add Your First Note </Button>
              )}
            </div>
          ) : (
            <motion.div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"} layout>
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={canAddEditNotes ? handleEditNote : undefined}
                    onViewHistory={handleViewHistory}
                    onDelete={canAddEditNotes ? handleDeleteNote : undefined}
                    // Sharing is now at dashboard level, so onShare is removed from NoteCard props
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => { setIsEditorOpen(false); setEditingNote(null); }}
        isOpen={isEditorOpen}
        isSaving={isSavingNote}
      />
      {currentDashboard && currentUser && ( // Ensure dashboard and user are loaded before rendering dialog
          <DashboardShareDialog
            dashboard={currentDashboard}
            currentUserEmail={currentUser.email}
            isOpen={isShareDialogOpen}
            onClose={() => setIsShareDialogOpen(false)}
          />
      )}
      <VersionHistory
        note={historyDialogNote}
        isOpen={!!historyDialogNote}
        onClose={() => setHistoryDialogNote(null)}
      />
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Dashboard</DialogTitle>
            <DialogDescription>Enter a new name for your dashboard "{currentDashboard?.name}".</DialogDescription>
          </DialogHeader>
          <Input
            value={newDashboardName}
            onChange={(e) => setNewDashboardName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRenameDashboard()}
            className="my-4"
          />
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleRenameDashboard} disabled={!newDashboardName.trim() || newDashboardName.trim() === currentDashboard?.name}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
