
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Dashboard, Note, NoteVersion, DashboardShare } from "@/entities/all";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { Plus, Search, Filter, SortAsc, Grid3X3, List, Sparkles, Edit3, Trash2, Users, ArrowLeft, MoreVertical, Loader2, ArrowUpNarrowWide, ArrowDownWideNarrow, UserCircle as UserFilterIcon, Star as StarIcon, FileSpreadsheet, Tag as TopicFilterIcon } from "lucide-react";

import NoteCard from "../components/notes/NoteCard";
import NoteEditor from "../components/notes/NoteEditor";
import VersionHistory from "../components/notes/VersionHistory";
import DashboardShareDialog from "../components/dashboards/DashboardShareDialog";

const EMOJI_LABELS = {
  "🙂": "Excited",
  "🙁": "Angry",
  "😳": "Embarrassed",
  "💥": "Pain/Problem",
  "🥅": "Goal",
  "🟥": "Obstacle",
  "↪️": "Workaround",
  "🏔": "Context",
  "☑️": "Feature Request",
  "💲": "Budget",
  "♀️": "Person/Company",
  "⭐": "Follow-up"
};

const EMOJI_FILTERS = [
  { value: "all", label: "All Notes", emoji: "📝" },
  { emoji: "🙂", label: "Excited" },
  { emoji: "🙁", label: "Angry" },
  { emoji: "😳", label: "Embarrassed" },
  { emoji: "💥", label: "Pain/Problem" },
  { emoji: "🥅", label: "Goal" },
  { emoji: "🟥", label: "Obstacle" },
  { emoji: "↪️", label: "Workaround" },
  { emoji: "🏔", label: "Context" },
  { emoji: "☑️", label: "Feature Request" },
  { emoji: "💲", label: "Budget" },
  { emoji: "♀️", label: "Person/Company" },
  { emoji: "⭐", label: "Follow-up" },
];

const IMPORTANCE_FILTER_OPTIONS = [
  { value: "all", label: "All Importance" },
  { value: "1", label: "1 Star" },
  { value: "2", label: "2 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "5", label: "5 Stars" },
  { value: "6", label: "6 Stars" },
  { value: "7", label: "7 Stars (Critical)" },
  { value: "5+", label: "5+ Stars" },
  { value: "3+", label: "3+ Stars" },
];

// Enhanced helper function to properly format and sanitize a field for CSV
const sanitizeCsvField = (data) => {
  if (data === null || data === undefined) {
    return '';
  }
  
  let stringData;
  if (Array.isArray(data)) {
    // Join arrays with semicolons to avoid comma conflicts
    stringData = data.filter(item => item && item.trim()).join('; ');
  } else {
    stringData = String(data);
  }
  
  // Remove problematic characters that cause row height issues
  stringData = stringData
    .replace(/[\r\n\t]/g, ' ') // Replace newlines, returns, tabs with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces into one
    .trim(); // Remove leading/trailing whitespace
  
  // Escape quotes properly for CSV
  if (stringData.includes('"') || stringData.includes(',') || stringData.includes(';')) {
    stringData = '"' + stringData.replace(/"/g, '""') + '"';
  }
  
  return stringData;
};

export default function DashboardDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dashboardId = new URLSearchParams(location.search).get("id");

  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emojiFilter, setEmojiFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [importanceFilter, setImportanceFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const [uniqueClients, setUniqueClients] = useState(["all"]);
  const [availableClientTags, setAvailableClientTags] = useState([]);
  const [uniqueTopics, setUniqueTopics] = useState(["all"]);
  const [availableTopics, setAvailableTopics] = useState([]);

  const [sortBy, setSortBy] = useState("updated_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid");

  const [isLoading, setIsLoading] = useState(true);
  const [isNotesLoading, setIsNotesLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPermission, setUserPermission] = useState("viewer");

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

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

      let permission = "viewer";
      if (dashboardDetails.owner_email === user.email) {
        permission = "owner";
      } else {
        const share = await DashboardShare.filter({ dashboard_id: dashboardId, shared_with_email: user.email }, "", 1);
        if (share.length > 0) {
          permission = share[0].permission_level;
        } else {
          toast.error("You do not have permission to view this dashboard.");
          navigate(createPageUrl("DashboardsPage"));
          return;
        }
      }

      setCurrentDashboard(dashboardDetails);
      setNewDashboardName(dashboardDetails.name);
      setUserPermission(permission);
      setIsLoading(false);

      if (permission !== "none") {
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

      const allClientTags = new Set();
      const allTopics = new Set();
      fetchedNotes.forEach(note => {
        if (Array.isArray(note.client_reference)) {
          note.client_reference.forEach(tag => tag && allClientTags.add(tag));
        }
        if (Array.isArray(note.topics)) {
          note.topics.forEach(topic => topic && allTopics.add(topic));
        }
      });
      const uniqueClientsArray = Array.from(allClientTags).sort();
      setUniqueClients(["all", ...uniqueClientsArray]);
      setAvailableClientTags(uniqueClientsArray);

      const uniqueTopicsArray = Array.from(allTopics).sort();
      setUniqueTopics(["all", ...uniqueTopicsArray]);
      setAvailableTopics(uniqueTopicsArray);

    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes for this dashboard.");
    }
    setIsNotesLoading(false);
  }, [sortBy, sortOrder]);

  const handleNoteDataChangedOnCard = () => {
    if (currentDashboard) {
      fetchNotesForDashboard(currentDashboard.id);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        fetchDashboardData(user);
      } catch (error) {
        navigate(createPageUrl("DashboardsPage"));
      }
    };
    init();
  }, [dashboardId, fetchDashboardData, navigate]);

  useEffect(() => {
    if (currentDashboard) {
      fetchNotesForDashboard(currentDashboard.id);
    }
  }, [sortBy, sortOrder, currentDashboard, fetchNotesForDashboard]);

  useEffect(() => {
    const applyFilters = () => {
      let tempNotes = [...notes];
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        tempNotes = tempNotes.filter(note => {
          const contentMatch = note.content?.toLowerCase().includes(lowercasedTerm);
          const clientTagMatch = Array.isArray(note.client_reference) && note.client_reference.some(tag => tag.toLowerCase().includes(lowercasedTerm));
          const topicTagMatch = Array.isArray(note.topics) && note.topics.some(tag => tag.toLowerCase().includes(lowercasedTerm));
          const commentsMatch = note.internal_comments?.toLowerCase().includes(lowercasedTerm);
          // Check for image alt text or original name in search
          const imageMatch = Array.isArray(note.images) && note.images.some(img => 
            (img.alt?.toLowerCase().includes(lowercasedTerm) || img.originalName?.toLowerCase().includes(lowercasedTerm))
          );
          return contentMatch || clientTagMatch || topicTagMatch || commentsMatch || imageMatch;
        });
      }
      if (emojiFilter !== "all") {
        tempNotes = tempNotes.filter(note => note.symbol === emojiFilter);
      }
      if (clientFilter !== "all") {
        tempNotes = tempNotes.filter(note =>
          Array.isArray(note.client_reference) && note.client_reference.includes(clientFilter)
        );
      }
      if (topicFilter !== "all") {
        tempNotes = tempNotes.filter(note =>
          Array.isArray(note.topics) && note.topics.includes(topicFilter)
        );
      }
      if (importanceFilter !== "all") {
        if (importanceFilter.endsWith('+')) {
          const minImportance = parseInt(importanceFilter.slice(0, -1));
          tempNotes = tempNotes.filter(note => (note.importance || 0) >= minImportance);
        } else {
          const exactImportance = parseInt(importanceFilter);
          tempNotes = tempNotes.filter(note => (note.importance || 0) === exactImportance);
        }
      }
      setFilteredNotes(tempNotes);
    };
    applyFilters();
  }, [notes, searchTerm, emojiFilter, clientFilter, importanceFilter, topicFilter]);

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
        references: Array.isArray(noteData.references) ? noteData.references : [],
        topics: Array.isArray(noteData.topics) ? noteData.topics : [],
        internal_comments: noteData.internal_comments || "",
        client_reference: Array.isArray(noteData.client_reference) ? noteData.client_reference : [],
        images: Array.isArray(noteData.images) ? noteData.images : [], // Ensure images are included
      };

      let savedNote;
      if (editingNote) {
        const updatePayload = { ...dataToSave };
        delete updatePayload.dashboard_id;
        
        await Note.update(editingNote.id, updatePayload);
        savedNote = { ...editingNote, ...updatePayload, id: editingNote.id };
        toast.success("Note updated successfully");
      } else {
        savedNote = await Note.create(dataToSave);
        toast.success("Note created successfully");
      }

      // Create a new version for the note, with correct payload
      const versionPayload = { ...dataToSave };
      delete versionPayload.dashboard_id; // NoteVersion doesn't have dashboard_id
      
      const newVersion = await NoteVersion.create({
        note_id: savedNote.id,
        ...versionPayload,
      });

      // Update the main note to point to the new version
      await Note.update(savedNote.id, { current_version_id: newVersion.id });

      setIsEditorOpen(false);
      setEditingNote(null);
      fetchNotesForDashboard(currentDashboard.id);
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
    if (window.confirm("Are you sure you want to delete this note? This will also delete its version history.")) {
      try {
        const versions = await NoteVersion.filter({ note_id: note.id });
        for (const version of versions) {
          await NoteVersion.delete(version.id);
        }
        await Note.delete(note.id);
        toast.success("Note deleted successfully");
        fetchNotesForDashboard(currentDashboard.id);
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
    if (window.confirm(`Are you sure you want to delete the dashboard "${currentDashboard.name}"? This will also delete all its notes and shares. This action cannot be undone.`)) {
      try {
        const notesInDashboard = await Note.filter({ dashboard_id: currentDashboard.id });
        for (const note of notesInDashboard) {
          const versions = await NoteVersion.filter({ note_id: note.id });
          for (const version of versions) {
            await NoteVersion.delete(version.id);
          }
          await Note.delete(note.id);
        }
        const shares = await DashboardShare.filter({ dashboard_id: currentDashboard.id });
        for (const share of shares) {
          await DashboardShare.delete(share.id);
        }
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

  const handleExportToExcel = async () => {
    if (!filteredNotes || filteredNotes.length === 0) {
        toast.info("No notes to export (check filters).");
        return;
    }

    try {
      toast.info("Preparing export...");
      
      const headers = [
        "Note Type", "Content", "Internal Comments", "Client Tags", "Topics", 
        "References", "Importance (1-7)", "Upvotes", "Downvotes", "Last Updated", "Attached Image URLs"
      ];

      const csvData = filteredNotes.map((note) => {
        const imageUrls = (note.images || []).map(img => img.url).join('; ');
        return [
          sanitizeCsvField(EMOJI_LABELS[note.symbol] || note.symbol || "Unknown"),
          sanitizeCsvField(note.content || ""),
          sanitizeCsvField(note.internal_comments || ""),
          sanitizeCsvField(note.client_reference || []),
          sanitizeCsvField(note.topics || []),
          sanitizeCsvField(note.references || []),
          note.importance || 1,
          note.upvote_count || 0,
          note.downvote_count || 0,
          note.updated_date ? format(new Date(note.updated_date), "yyyy-MM-dd HH:mm") : "",
          sanitizeCsvField(imageUrls)
        ];
      });

      const csvRows = [
          headers.join(","),
          ...csvData.map(row => row.join(","))
      ];
      
      const csvContent = csvRows.join("\n");
      const BOM = '\uFEFF'; // Byte Order Mark for Excel compatibility
      const csvWithBOM = BOM + csvContent;
      
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      const fileName = `${currentDashboard.name.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast.success(
        "Export successful! CSV file has been downloaded with links to all images.",
        { duration: 6000 }
      );
        
    } catch (error) {
        toast.error("Failed to export dashboard.");
        console.error("Export error:", error);
    }
  };
  
  // New handlers for badge clicks
  const handleTopicBadgeClick = (topic) => {
    setTopicFilter(topic);
  };
  
  const handleClientBadgeClick = (client) => {
    setClientFilter(client);
  };

  if (isLoading || !currentUser || !currentDashboard) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--ruby-dust-500)] animate-spin" />
      </div>
    );
  }

  const canEditDashboard = userPermission === "owner";
  const canAddEditNotes = userPermission === "owner" || userPermission === "editor";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ruby-dust-50)] via-white to-[var(--ruby-dust-50)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
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
                    <Edit3 className="w-4 h-4 text-gray-500 hover:text-[var(--ruby-dust-600)]" />
                  </Button>
                )}
              </h1>
              <p className="text-gray-600">
                {userPermission === "owner" ? "You own this dashboard." : `Shared with you as ${userPermission}.`}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <Button variant="outline" onClick={handleExportToExcel} className="bg-white/80 border-0 shadow-sm">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Notes
            </Button>
            {canEditDashboard && (
              <Button variant="outline" onClick={() => setIsShareDialogOpen(true)} className="bg-white/80 border-0 shadow-sm">
                <Users className="w-4 h-4 mr-2" />
                Share
              </Button>
            )}
            {canAddEditNotes && (
              <Button
                onClick={handleNewNote}
                className="bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)] shadow-lg transform hover:scale-105 transition-all duration-200"
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
                  placeholder="Search notes, client tags, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-0 focus:bg-white h-10"
                />
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <Select value={emojiFilter} onValueChange={setEmojiFilter}>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-auto bg-white/80 border-0 h-10">
                  <div className="flex items-center gap-2"> <Filter className="w-4 h-4" /> <SelectValue placeholder="Filter by Emoji"/> </div>
                </SelectTrigger>
                <SelectContent>
                  {EMOJI_FILTERS.map((filter) => (
                    <SelectItem key={filter.value || filter.emoji} value={filter.value || filter.emoji}>
                      <div className="flex items-center gap-2"><span>{filter.emoji}</span><span>{filter.label}</span></div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={clientFilter} onValueChange={setClientFilter} disabled={uniqueClients.length <= 1}>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-auto bg-white/80 border-0 h-10">
                  <div className="flex items-center gap-2"> <UserFilterIcon className="w-4 h-4" /> <SelectValue placeholder="Filter by Client Tag"/> </div>
                </SelectTrigger>
                <SelectContent>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client === "all" ? "All Client Tags" : client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={topicFilter} onValueChange={setTopicFilter} disabled={uniqueTopics.length <= 1}>
                <SelectTrigger className="w-full sm:w-[150px] lg:w-auto bg-white/80 border-0 h-10">
                  <div className="flex items-center gap-2"> <TopicFilterIcon className="w-4 h-4" /> <SelectValue placeholder="Filter by Topic"/> </div>
                </SelectTrigger>
                <SelectContent>
                  {uniqueTopics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic === "all" ? "All Topics" : topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                <SelectTrigger className="w-full sm:w-[160px] lg:w-auto bg-white/80 border-0 h-10">
                  <div className="flex items-center gap-2"> <StarIcon className="w-4 h-4 text-yellow-500" /> <SelectValue placeholder="Filter by Importance"/> </div>
                </SelectTrigger>
                <SelectContent>
                  {IMPORTANCE_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                <Select value={sortBy} onValueChange={(value) => {setSortBy(value);}}>
                  <SelectTrigger className="w-full sm:w-auto lg:w-[160px] bg-white/80 border-0 h-10">
                     <div className="flex items-center gap-2"> <SortAsc className="w-4 h-4" /> <SelectValue placeholder="Sort by..."/> </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated_date">Last Updated</SelectItem>
                    <SelectItem value="created_date">Date Created</SelectItem>
                    <SelectItem value="importance">Importance</SelectItem>
                    <SelectItem value="client_reference">Client Reference</SelectItem>
                    <SelectItem value="topics">Topics</SelectItem>
                    <SelectItem value="upvote_count">Upvotes</SelectItem>
                    <SelectItem value="downvote_count">Downvotes</SelectItem>
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
            <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
              {Array(viewMode === "grid" ? 6 : 3).fill(0).map((_, i) => ( <div key={i} className="animate-pulse"><div className="bg-white/50 rounded-xl h-72 p-6"><div className="w-8 h-8 bg-gray-200 rounded-lg mb-4"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div><div className="h-4 bg-gray-200 rounded w-5/6 mt-3"></div><div className="h-3 bg-gray-200 rounded w-1/3 mt-4"></div><div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div></div></div></div>))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12"> <Sparkles className="w-12 h-12 text-white" /> </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || emojiFilter !== "all" || clientFilter !== "all" || topicFilter !== "all" || importanceFilter !== "all" ? "No matching notes" : "This dashboard is empty"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || emojiFilter !== "all" || clientFilter === "all" || topicFilter !== "all" || importanceFilter !== "all" ? "Try adjusting your search or filters" : "Start by adding your first research note to this dashboard."}
              </p>
              {canAddEditNotes && (!searchTerm && emojiFilter === "all" && clientFilter === "all" && topicFilter === "all" && importanceFilter === "all") && (
                <Button onClick={handleNewNote} className="bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)]"> <Plus className="w-5 h-5 mr-2" /> Add Your First Note </Button>
              )}
            </div>
          ) : (
            <motion.div className={viewMode === "grid" ? "responsive-notes-grid" : "space-y-4"} layout>
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={canAddEditNotes ? handleEditNote : undefined}
                    onViewHistory={handleViewHistory}
                    onDelete={canAddEditNotes ? handleDeleteNote : undefined}
                    onNoteDataChanged={handleNoteDataChangedOnCard}
                    onTopicClick={handleTopicBadgeClick}
                    onClientClick={handleClientBadgeClick}
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
        availableClientTags={availableClientTags}
        availableTopics={availableTopics}
      />
      {currentDashboard && currentUser && (
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
            <Button onClick={handleRenameDashboard} disabled={!newDashboardName.trim() || newDashboardName.trim() === currentDashboard?.name} className="bg-[var(--ruby-dust-600)] hover:bg-[var(--ruby-dust-700)] text-[var(--ruby-dust-text-on-primary)]">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
