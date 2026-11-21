
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dashboard, DashboardShare, Note, NoteVersion, User } from "@/entities/all";
import type { DashboardRecord, NoteRecord, StoredUser } from "@/entities/all";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDownWideNarrow, ArrowLeft, ArrowUpNarrowWide, Edit3, FileSpreadsheet, Filter, Grid3X3, List, Loader2, MoreHorizontal, Plus, Search, SortAsc, Star as StarIcon, Tag as TopicFilterIcon, Trash2, UserCircle as UserFilterIcon, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { List as AllNotesIcon } from "@/components/animate-ui/icons/list";
import { NoteTagIcon } from "@/features/notes/NoteTagIcon";
import { usePageTitle } from "@/hooks/use-page-title";
import { NOTE_TAGS, findNoteTagBySymbol, noteHasTag, noteTagLabelKey } from "@/features/notes/note-tags";
import { maxNoteImportance, routes } from "@/lib/constants";
import { LIST_ITEM_MOTION } from "@/lib/motion";

import DashboardShareDialog from "../components/dashboards/DashboardShareDialog";
import NoteCard from "../components/notes/NoteCard";
import NoteEditor from "../components/notes/NoteEditor";
import VersionHistory from "../components/notes/VersionHistory";

/** "all" or a note tag id. Matching goes through the tag catalog, not exact emoji strings. */
const ALL_TAGS_FILTER = "all";

/** Each option's label is a translation under dashboardDetail.filters.importance, given its count. */
const IMPORTANCE_FILTER_OPTIONS = [
    { value: "all", labelKey: "all" },
    { value: "1", labelKey: "exact", count: 1 },
    { value: "2", labelKey: "exact", count: 2 },
    { value: "3", labelKey: "exact", count: 3 },
    { value: "4", labelKey: "exact", count: 4 },
    { value: "5", labelKey: "exact", count: 5 },
    { value: "6", labelKey: "exact", count: 6 },
    { value: "7", labelKey: "critical", count: 7 },
    { value: "5+", labelKey: "atLeast", count: 5 },
    { value: "3+", labelKey: "atLeast", count: 3 },
] as const;

/** The fields notes can be sorted by, with their labels under dashboardDetail.sort.fields. */
const SORT_OPTIONS = [
    { value: "updated_date", labelKey: "updatedDate" },
    { value: "created_date", labelKey: "createdDate" },
    { value: "importance", labelKey: "importance" },
    { value: "client_reference", labelKey: "clientReference" },
    { value: "topics", labelKey: "topics" },
    { value: "upvote_count", labelKey: "upvotes" },
    { value: "downvote_count", labelKey: "downvotes" },
] as const;

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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const dashboardId = new URLSearchParams(location.search).get("id");

    const [currentDashboard, setCurrentDashboard] = useState<DashboardRecord | null>(null);
    const [notes, setNotes] = useState<NoteRecord[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<NoteRecord[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [tagFilter, setTagFilter] = useState(ALL_TAGS_FILTER);
    const [clientFilter, setClientFilter] = useState("all");
    const [importanceFilter, setImportanceFilter] = useState("all");
    const [topicFilter, setTopicFilter] = useState("all");

    const [uniqueClients, setUniqueClients] = useState(["all"]);
    const [availableClientTags, setAvailableClientTags] = useState<string[]>([]);
    const [uniqueTopics, setUniqueTopics] = useState(["all"]);
    const [availableTopics, setAvailableTopics] = useState<string[]>([]);

    const [sortBy, setSortBy] = useState("updated_date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [viewMode, setViewMode] = useState("grid");

    const [isLoading, setIsLoading] = useState(true);
    const [isNotesLoading, setIsNotesLoading] = useState(true);
    const [isSavingNote, setIsSavingNote] = useState(false);
    const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
    const [userPermission, setUserPermission] = useState<string>("viewer");

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteRecord | null>(null);

    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [historyDialogNote, setHistoryDialogNote] = useState<NoteRecord | null>(null);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState("");

    usePageTitle(currentDashboard
        ? t("documentTitles.namedDashboard", { dashboardName: currentDashboard.name })
        : t("documentTitles.dashboard"));

    const fetchDashboardData = useCallback(async (user) => {
        if (!dashboardId || !user) return;
        setIsLoading(true);
        try {
            const dashboardDetails = await Dashboard.get(dashboardId);
            if (!dashboardDetails) {
                toast.error(t("dashboardDetail.toasts.notFound"));
                navigate(routes.dashboards);
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
                    toast.error(t("dashboardDetail.toasts.noViewPermission"));
                    navigate(routes.dashboards);
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
            toast.error(t("dashboardDetail.toasts.loadFailed"));
            navigate(routes.dashboards);
            setIsLoading(false);
        }
    }, [dashboardId, navigate, t]);

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
            toast.error(t("dashboardDetail.toasts.loadNotesFailed"));
        }
        setIsNotesLoading(false);
    }, [sortBy, sortOrder, t]);

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
                navigate(routes.dashboards);
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
            if (tagFilter !== ALL_TAGS_FILTER) {
                tempNotes = tempNotes.filter(note => noteHasTag(note.symbol, tagFilter));
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
    }, [notes, searchTerm, tagFilter, clientFilter, importanceFilter, topicFilter]);

    const handleSaveNote = async (noteData) => {
        if (!currentDashboard || (userPermission !== "owner" && userPermission !== "editor")) {
            toast.error(t("dashboardDetail.toasts.noSavePermission"));
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
                toast.success(t("dashboardDetail.toasts.noteUpdated"));
            } else {
                savedNote = await Note.create(dataToSave);
                toast.success(t("dashboardDetail.toasts.noteCreated"));
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
            toast.error(t("dashboardDetail.toasts.saveNoteFailed"));
        }
        setIsSavingNote(false);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setIsEditorOpen(true);
    };

    const handleNewNote = () => {
        if (userPermission !== "owner" && userPermission !== "editor") {
            toast.error(t("dashboardDetail.toasts.noAddPermission"));
            return;
        }
        setEditingNote(null);
        setIsEditorOpen(true);
    };

    const handleDeleteNote = async (note) => {
        if (userPermission !== "owner" && userPermission !== "editor") {
            toast.error(t("dashboardDetail.toasts.noDeletePermission"));
            return;
        }
        if (window.confirm(t("dashboardDetail.confirmations.deleteNote"))) {
            try {
                const versions = await NoteVersion.filter({ note_id: note.id });
                for (const version of versions) {
                    await NoteVersion.delete(version.id);
                }
                await Note.delete(note.id);
                toast.success(t("dashboardDetail.toasts.noteDeleted"));
                fetchNotesForDashboard(currentDashboard.id);
            } catch (error) {
                console.error("Failed to delete note:", error);
                toast.error(t("dashboardDetail.toasts.deleteNoteFailed"));
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
            toast.success(t("dashboardDetail.toasts.renamed"));
            setIsRenameDialogOpen(false);
        } catch (error) {
            toast.error(t("dashboardDetail.toasts.renameFailed"));
            console.error("Rename dashboard error:", error);
        }
    };

    const handleDeleteDashboard = async () => {
        if (!currentDashboard || userPermission !== "owner") return;
        if (window.confirm(t("dashboardDetail.confirmations.deleteDashboard", { dashboardName: currentDashboard.name }))) {
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
                toast.success(t("dashboardDetail.toasts.deleted", { dashboardName: currentDashboard.name }));
                navigate(routes.dashboards);
            } catch (error) {
                toast.error(t("dashboardDetail.toasts.deleteFailed"));
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
            toast.info(t("dashboardDetail.export.nothingToExport"));
            return;
        }

        try {
            toast.info(t("dashboardDetail.export.preparing"));

            const headers = [
                t("dashboardDetail.export.columns.noteType"),
                t("dashboardDetail.export.columns.content"),
                t("dashboardDetail.export.columns.internalComments"),
                t("dashboardDetail.export.columns.clientTags"),
                t("dashboardDetail.export.columns.topics"),
                t("dashboardDetail.export.columns.references"),
                t("dashboardDetail.export.columns.importance", { max: maxNoteImportance }),
                t("dashboardDetail.export.columns.upvotes"),
                t("dashboardDetail.export.columns.downvotes"),
                t("dashboardDetail.export.columns.lastUpdated"),
                t("dashboardDetail.export.columns.imageUrls"),
            ].map(sanitizeCsvField);

            const csvData = filteredNotes.map((note) => {
                const imageUrls = (note.images || []).map(img => img.url).join('; ');
                const tag = findNoteTagBySymbol(note.symbol);
                return [
                    sanitizeCsvField(tag ? t(noteTagLabelKey(tag.id)) : note.symbol || t("dashboardDetail.export.unknownTag")),
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
                t("dashboardDetail.export.success"),
                { duration: 6000 }
            );

        } catch (error) {
            toast.error(t("dashboardDetail.export.failed"));
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
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center" role="status" aria-label={t("dashboardDetail.loading")}>
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
        );
    }

    const canEditDashboard = userPermission === "owner";
    const canAddEditNotes = userPermission === "owner" || userPermission === "editor";
    const hasActiveFilters = Boolean(searchTerm) || tagFilter !== ALL_TAGS_FILTER || clientFilter !== "all" || topicFilter !== "all" || importanceFilter !== "all";
    const accessDescription =
        userPermission === "owner" ? t("dashboardDetail.access.owner")
            : userPermission === "editor" ? t("dashboardDetail.access.editor")
                : t("dashboardDetail.access.viewer");

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-6">
                    <div className="flex items-center gap-3 min-w-0">
                        <Button variant="ghost" size="icon" onClick={() => navigate(routes.dashboards)} className="rounded-full shrink-0 rtl:rotate-180" aria-label={t("dashboardDetail.backToDashboards")}>
                            <ArrowLeft className="!w-5 !h-5" />
                        </Button>
                        <div className="min-w-0">
                            <h1 className="text-[28px] leading-tight font-semibold text-foreground flex items-center gap-1.5">
                                <span className="truncate">{currentDashboard.name}</span>
                                {canEditDashboard && (
                                    <Button variant="ghost" size="icon" onClick={() => setIsRenameDialogOpen(true)} className="h-8 w-8 rounded-full text-muted-foreground shrink-0" aria-label={t("dashboardDetail.renameLabel")}>
                                        <Edit3 />
                                    </Button>
                                )}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {accessDescription}
                                {!isNotesLoading && ` · ${t("dashboardDetail.noteCount", { count: notes.length })}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                        <Button variant="outline" onClick={handleExportToExcel} aria-label={t("dashboardDetail.actions.exportLabel")} className="max-sm:w-9 max-sm:px-0">
                            <FileSpreadsheet aria-hidden />
                            <span className="hidden sm:inline">{t("dashboardDetail.actions.export")}</span>
                        </Button>
                        {canEditDashboard && (
                            <Button variant="outline" onClick={() => setIsShareDialogOpen(true)} aria-label={t("dashboardDetail.actions.shareLabel")} className="max-sm:w-9 max-sm:px-0">
                                <Users aria-hidden />
                                <span className="hidden sm:inline">{t("dashboardDetail.actions.share")}</span>
                            </Button>
                        )}
                        {canAddEditNotes && (
                            <Button onClick={handleNewNote}>
                                <Plus aria-hidden />
                                {t("dashboardDetail.actions.newNote")}
                            </Button>
                        )}
                        {canEditDashboard && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" aria-label={t("dashboardDetail.actions.moreLabel")}>
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                                        <Edit3 className="w-4 h-4 me-2" /> {t("dashboardDetail.actions.rename")}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleDeleteDashboard} className="text-destructive focus:text-destructive">
                                        <Trash2 className="w-4 h-4 me-2" /> {t("dashboardDetail.actions.delete")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="rounded-2xl border border-border/70 bg-card shadow-card p-3 mb-6">
                    <div className="flex flex-col lg:flex-row gap-2.5">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden />
                                <Input
                                    type="search"
                                    placeholder={t("dashboardDetail.search.placeholder")}
                                    aria-label={t("dashboardDetail.search.label")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="ps-9 h-9 bg-muted/60 border-transparent focus-visible:bg-card"
                                />
                            </div>
                        </div>
                        {/* One scrollable row on small screens instead of five stacked full-width rows. */}
                        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-0.5 lg:overflow-visible lg:flex-wrap [&>*]:shrink-0">
                            <Select value={tagFilter} onValueChange={setTagFilter}>
                                <SelectTrigger className="w-auto h-9" aria-label={t("dashboardDetail.filters.tag.label")}>
                                    <div className="flex items-center gap-2"> <Filter className="w-4 h-4 text-muted-foreground" aria-hidden /> <SelectValue placeholder={t("dashboardDetail.filters.tag.placeholder")} /> </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={ALL_TAGS_FILTER}>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground" aria-hidden><AllNotesIcon size={15} /></span>
                                            <span>{t("dashboardDetail.filters.tag.all")}</span>
                                        </div>
                                    </SelectItem>
                                    {NOTE_TAGS.map((tag) => (
                                        <SelectItem key={tag.id} value={tag.id}>
                                            <div className="flex items-center gap-2"><NoteTagIcon tag={tag} size="sm" decorative /><span>{t(noteTagLabelKey(tag.id))}</span></div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={clientFilter} onValueChange={setClientFilter} disabled={uniqueClients.length <= 1}>
                                <SelectTrigger className="w-auto h-9" aria-label={t("dashboardDetail.filters.client.label")}>
                                    <div className="flex items-center gap-2"> <UserFilterIcon className="w-4 h-4 text-muted-foreground" aria-hidden /> <SelectValue placeholder={t("dashboardDetail.filters.client.placeholder")} /> </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueClients.map((client) => (
                                        <SelectItem key={client} value={client}>
                                            {client === "all" ? t("dashboardDetail.filters.client.all") : client}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={topicFilter} onValueChange={setTopicFilter} disabled={uniqueTopics.length <= 1}>
                                <SelectTrigger className="w-auto h-9" aria-label={t("dashboardDetail.filters.topic.label")}>
                                    <div className="flex items-center gap-2"> <TopicFilterIcon className="w-4 h-4 text-muted-foreground" aria-hidden /> <SelectValue placeholder={t("dashboardDetail.filters.topic.placeholder")} /> </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {uniqueTopics.map((topic) => (
                                        <SelectItem key={topic} value={topic}>
                                            {topic === "all" ? t("dashboardDetail.filters.topic.all") : topic}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                                <SelectTrigger className="w-auto h-9" aria-label={t("dashboardDetail.filters.importance.label")}>
                                    <div className="flex items-center gap-2"> <StarIcon className="w-4 h-4 text-warning" aria-hidden /> <SelectValue placeholder={t("dashboardDetail.filters.importance.placeholder")} /> </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {IMPORTANCE_FILTER_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {"count" in opt
                                                ? t(`dashboardDetail.filters.importance.${opt.labelKey}`, { count: opt.count })
                                                : t(`dashboardDetail.filters.importance.${opt.labelKey}`)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex gap-1">
                                <Select value={sortBy} onValueChange={(value) => { setSortBy(value); }}>
                                    <SelectTrigger className="w-auto h-9" aria-label={t("dashboardDetail.sort.label")}>
                                        <div className="flex items-center gap-2"> <SortAsc className="w-4 h-4 text-muted-foreground" aria-hidden /> <SelectValue placeholder={t("dashboardDetail.sort.placeholder")} /> </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {t(`dashboardDetail.sort.fields.${option.labelKey}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon" onClick={toggleSortOrder} aria-label={sortOrder === 'asc' ? t("dashboardDetail.sort.sortedAscending") : t("dashboardDetail.sort.sortedDescending")}>
                                    {sortOrder === 'asc' ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
                                </Button>
                            </div>
                            {/* Shows the view you'd switch to, as its label says. */}
                            <Button variant="outline" size="icon" onClick={toggleViewMode} aria-label={viewMode === "grid" ? t("dashboardDetail.view.switchToList") : t("dashboardDetail.view.switchToGrid")}>
                                {viewMode === "grid" ? <List /> : <Grid3X3 />}
                            </Button>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    onClick={() => { setSearchTerm(""); setTagFilter(ALL_TAGS_FILTER); setClientFilter("all"); setTopicFilter("all"); setImportanceFilter("all"); }}
                                    className="text-primary-fg hover:text-primary-fg"
                                >
                                    {t("dashboardDetail.filters.clear")}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes Grid/List */}
                <div className="mb-8">
                    {isNotesLoading ? (
                        <div className={viewMode === "grid" ? "responsive-notes-grid" : "space-y-4"} role="status" aria-label={t("dashboardDetail.loadingNotes")}>
                            {Array(viewMode === "grid" ? 6 : 3).fill(0).map((_, i) => (<div key={i} className="motion-safe:animate-pulse"><div className="rounded-2xl border border-border/60 bg-card h-64 p-5"><div className="size-7 bg-muted rounded-lg mb-4"></div><div className="space-y-2"><div className="h-4 bg-muted rounded w-3/4"></div><div className="h-4 bg-muted rounded w-1/2"></div><div className="h-4 bg-muted rounded w-5/6 mt-3"></div><div className="h-3 bg-muted rounded w-1/3 mt-4"></div></div></div></div>))}
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="text-center py-16 max-w-md mx-auto">
                            <div className="size-14 rounded-2xl bg-accent text-primary-fg mx-auto mb-5 flex items-center justify-center" aria-hidden>
                                {hasActiveFilters ? <Search className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                            </div>
                            <h2 className="text-lg font-semibold text-foreground mb-1.5">
                                {hasActiveFilters ? t("dashboardDetail.emptyState.noMatchesTitle") : t("dashboardDetail.emptyState.emptyTitle")}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                {hasActiveFilters ? t("dashboardDetail.emptyState.noMatchesDescription") : t("dashboardDetail.emptyState.emptyDescription")}
                            </p>
                            {canAddEditNotes && !hasActiveFilters && (
                                <Button onClick={handleNewNote}><Plus aria-hidden /> {t("dashboardDetail.emptyState.addFirstNote")}</Button>
                            )}
                        </div>
                    ) : (
                        <div className={viewMode === "grid" ? "responsive-notes-grid" : "space-y-4"}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {filteredNotes.map((note) => (
                                    // The list owns each card's motion: enter, exit and
                                    // re-flow when filters or sorting change.
                                    <motion.div
                                        key={note.id}
                                        layout
                                        initial={LIST_ITEM_MOTION.initial}
                                        animate={LIST_ITEM_MOTION.animate}
                                        exit={LIST_ITEM_MOTION.exit}
                                        transition={LIST_ITEM_MOTION.transition}
                                    >
                                        <NoteCard
                                            note={note}
                                            onEdit={canAddEditNotes ? handleEditNote : undefined}
                                            onViewHistory={handleViewHistory}
                                            onDelete={canAddEditNotes ? handleDeleteNote : undefined}
                                            onNoteDataChanged={handleNoteDataChangedOnCard}
                                            onTopicClick={handleTopicBadgeClick}
                                            onClientClick={handleClientBadgeClick}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
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
                        <DialogTitle>{t("dashboardDetail.renameDialog.title")}</DialogTitle>
                        <DialogDescription>{t("dashboardDetail.renameDialog.description", { dashboardName: currentDashboard?.name ?? "" })}</DialogDescription>
                    </DialogHeader>
                    <Input
                        value={newDashboardName}
                        onChange={(e) => setNewDashboardName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleRenameDashboard()}
                        className="my-4"
                    />
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">{t("common.cancel")}</Button></DialogClose>
                        <Button onClick={handleRenameDashboard} disabled={!newDashboardName.trim() || newDashboardName.trim() === currentDashboard?.name}>{t("common.saveChanges")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
