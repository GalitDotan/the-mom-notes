import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Note, NoteVersion } from "@/api/entities";
import { Share } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import NoteCard from "../components/notes/NoteCard";
import NoteEditor from "../components/notes/NoteEditor";
import ShareDialog from "../components/notes/ShareDialog";
import VersionHistory from "../components/notes/VersionHistory";

const EMOJI_FILTERS = [
  { value: "all", label: "All Notes", emoji: "📝" },
  { value: "🙂", label: "Excited", emoji: "🙂" },
  { value: "🙁", label: "Angry", emoji: "🙁" },
  { value: "😳", label: "Embarrassed", emoji: "😳" },
  { value: "⚡", label: "Pain/Problem", emoji: "⚡" },
  { value: "🥅", label: "Goal", emoji: "🥅" },
  { value: "🟥", label: "Obstacle", emoji: "🟥" },
  { value: "↪️", label: "Workaround", emoji: "↪️" },
  { value: "🏔", label: "Context", emoji: "🏔" },
  { value: "☑️", label: "Feature Request", emoji: "☑️" },
  { value: "💲", label: "Budget", emoji: "💲" },
  { value: "♀️", label: "Person/Company", emoji: "♀️" },
  { value: "⭐", label: "Follow-up", emoji: "⭐" },
];

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [emojiFilter, setEmojiFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated_date");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Dialog states
  const [shareDialogNote, setShareDialogNote] = useState(null);
  const [historyDialogNote, setHistoryDialogNote] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, sharedNotes, searchTerm, emojiFilter, sortBy]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      // Load user's own notes
      const myNotes = await Note.list(`-${sortBy}`);
      
      // Load shared notes
      let shared = [];
      if (user?.email) {
        const shares = await Share.filter({ shared_with_email: user.email });
        const sharedNoteIds = shares.map(s => s.note_id);
        if (sharedNoteIds.length > 0) {
          shared = await Promise.all(
            sharedNoteIds.map(id => Note.filter({ id }))
          );
          shared = shared.flat();
        }
      }
      
      setNotes(myNotes);
      setSharedNotes(shared);
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes");
    }
    setIsLoading(false);
  };

  const filterAndSortNotes = () => {
    let allNotes = [
      ...notes.map(note => ({ ...note, isShared: false })),
      ...sharedNotes.map(note => ({ ...note, isShared: true }))
    ];

    // Apply search filter
    if (searchTerm) {
      allNotes = allNotes.filter(note =>
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply emoji filter
    if (emojiFilter !== "all") {
      allNotes = allNotes.filter(note => note.symbol === emojiFilter);
    }

    // Sort notes
    allNotes.sort((a, b) => {
      if (sortBy === "created_date" || sortBy === "updated_date") {
        return new Date(b[sortBy]) - new Date(a[sortBy]);
      }
      return 0;
    });

    setFilteredNotes(allNotes);
  };

  const handleSaveNote = async (noteData) => {
    setIsSaving(true);
    try {
      if (editingNote) {
        // Update existing note
        await Note.update(editingNote.id, noteData);
        
        // Create version history entry
        await NoteVersion.create({
          note_id: editingNote.id,
          content: noteData.content,
          symbol: noteData.symbol
        });
        
        toast.success("Note updated successfully");
      } else {
        // Create new note
        const newNote = await Note.create(noteData);
        
        // Create initial version
        await NoteVersion.create({
          note_id: newNote.id,
          content: noteData.content,
          symbol: noteData.symbol
        });
        
        toast.success("Note created successfully");
      }
      
      setIsEditorOpen(false);
      setEditingNote(null);
      await loadNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    }
    setIsSaving(false);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleNewNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (note) => {
    if (confirm("Are you sure you want to delete this note?")) {
      try {
        await Note.delete(note.id);
        toast.success("Note deleted successfully");
        await loadNotes();
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast.error("Failed to delete note");
      }
    }
  };

  const handleShareNote = (note) => {
    setShareDialogNote(note);
  };

  const handleViewHistory = (note) => {
    setHistoryDialogNote(note);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Research Notes
            </h1>
            <p className="text-gray-600">
              Capture insights from user interviews and research sessions
            </p>
          </div>
          
          <Button
            onClick={handleNewNote}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Note
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-0 focus:bg-white"
                />
              </div>
            </div>

            {/* Emoji Filter */}
            <Select value={emojiFilter} onValueChange={setEmojiFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/80 border-0">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {EMOJI_FILTERS.map((filter) => (
                  <SelectItem key={filter.value} value={filter.value}>
                    <div className="flex items-center gap-2">
                      <span>{filter.emoji}</span>
                      <span>{filter.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 bg-white/80 border-0">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_date">Last Updated</SelectItem>
                <SelectItem value="created_date">Date Created</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="bg-white/80 border-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="bg-white/80 border-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || emojiFilter !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Search: "{searchTerm}"
                </Badge>
              )}
              {emojiFilter !== "all" && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {EMOJI_FILTERS.find(f => f.value === emojiFilter)?.emoji} {EMOJI_FILTERS.find(f => f.value === emojiFilter)?.label}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Notes Grid */}
        <div className="mb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/50 rounded-xl h-48 p-6">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center transform rotate-12">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || emojiFilter !== "all" ? "No matching notes" : "Start capturing insights"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || emojiFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Create your first research note with emoji categories"
                }
              </p>
              {!searchTerm && emojiFilter === "all" && (
                <Button
                  onClick={handleNewNote}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Note
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onShare={handleShareNote}
                    onViewHistory={handleViewHistory}
                    onDelete={handleDeleteNote}
                    isShared={note.isShared}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <NoteEditor
        note={editingNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setIsEditorOpen(false);
          setEditingNote(null);
        }}
        isOpen={isEditorOpen}
        isSaving={isSaving}
      />

      <ShareDialog
        note={shareDialogNote}
        isOpen={!!shareDialogNote}
        onClose={() => setShareDialogNote(null)}
      />

      <VersionHistory
        note={historyDialogNote}
        isOpen={!!historyDialogNote}
        onClose={() => setHistoryDialogNote(null)}
      />
    </div>
  );
}