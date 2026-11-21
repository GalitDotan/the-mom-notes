
import React, { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NOTE_CHIP_CLASSES, NOTE_CHIP_HOVER_CLASSES } from "@/features/notes/note-chips";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { X, History, Clock, ArrowLeft, Star, UserCircle, ThumbsUp, ThumbsDown, Link as LinkIcon, Tag as TopicIcon, MessageSquare, Image as ImageIcon, Download } from "lucide-react";
import { NoteVersion } from "@/entities/NoteVersion";
import type { NoteVersionRecord } from "@/entities/all";
import { NoteTagIcon } from "@/features/notes/NoteTagIcon";
import { findNoteTagBySymbol, noteTagLabelKey } from "@/features/notes/note-tags";
import { useDateFormatter } from "@/i18n/useDateFormatter";
import { maxNoteImportance } from "@/lib/constants";

// Utility to get domain from URL for display (same as in NoteCard)
const getDomainFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        return url;
    }
};

export default function VersionHistory({ note, isOpen, onClose }) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();
    const [versions, setVersions] = useState<NoteVersionRecord[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<NoteVersionRecord | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && note) {
            loadVersions();
            setSelectedVersion(null);
        }
    }, [isOpen, note]);

    const loadVersions = async () => {
        if (!note) return;
        setIsLoading(true);
        try {
            const versionData = await NoteVersion.filter(
                { note_id: note.id },
                "-created_date" // Sort by most recent first
            );
            setVersions(versionData);
        } catch (error) {
            console.error("Failed to load versions:", error);
        }
        setIsLoading(false);
    };

    if (!isOpen || !note) return null;

    const selectedTag = selectedVersion ? findNoteTagBySymbol(selectedVersion.symbol) : undefined;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-3xl md:max-w-4xl max-h-[85vh] flex flex-col md:flex-row bg-card rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Version List Pane */}
                    <div className="w-full md:w-1/3 border-r border-border flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-tint rounded-lg flex items-center justify-center">
                                    <History className="w-4 h-4 text-primary-fg" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{t("versionHistory.title")}</CardTitle>
                                    <p className="text-xs text-muted-foreground">{t("versionHistory.versionCount", { count: versions.length })}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground h-8 w-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="p-2 flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-primary-fg" />
                                    {t("versionHistory.loading")}
                                </div>
                            ) : versions.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                    {t("versionHistory.empty")}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {versions.map((version, index) => (
                                        <button
                                            key={version.id}
                                            onClick={() => setSelectedVersion(version)}
                                            className={`w-full text-start p-3 rounded-xl border transition-colors duration-150 ${selectedVersion?.id === version.id
                                                    ? 'bg-accent border-primary/25'
                                                    : 'border-transparent hover:bg-accent'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2.5 mb-1.5">
                                                <NoteTagIcon symbol={version.symbol} size="sm" className="mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <Badge
                                                            variant={selectedVersion?.id === version.id ? "default" : "secondary"}
                                                            className="text-xs"
                                                        >
                                                            {note.current_version_id === version.id ? t("versionHistory.current") : t("versionHistory.versionNumber", { number: versions.length - index })}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-foreground line-clamp-2 break-words mt-1">
                                                        {version.content}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground ms-[38px]">
                                                {version.created_date ? formatDate(version.created_date, "mediumDateTime") : t("notes.noDate")}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </div>

                    {/* Version Detail Pane */}
                    <div className="w-full md:w-2/3 flex flex-col">
                        <CardHeader className="p-4 border-b">
                            {selectedVersion ? (
                                <div className="flex items-start gap-3">
                                    <NoteTagIcon symbol={selectedVersion.symbol} size="md" decorative={Boolean(selectedTag)} />
                                    <div className="flex-1 space-y-1.5">
                                        <h3 className="text-lg font-semibold">
                                            {selectedTag ? t(noteTagLabelKey(selectedTag.id)) : t("versionHistory.noteDetails")}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {t("versionHistory.savedOn", {
                                                date: selectedVersion.created_date ? formatDate(selectedVersion.created_date, "longDateTime") : t("notes.noDate"),
                                            })}
                                        </p>

                                        {/* Client Tags */}
                                        {selectedVersion.client_reference && Array.isArray(selectedVersion.client_reference) && selectedVersion.client_reference.length > 0 && (
                                            <div className="flex flex-wrap gap-1 items-center">
                                                <UserCircle className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                                                {selectedVersion.client_reference.map((tag, index) => (
                                                    <Badge key={`client-${tag}-${index}`} variant="outline" className={cn("text-xs", NOTE_CHIP_CLASSES.client)}>{tag}</Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Handle legacy single string client_reference */}
                                        {selectedVersion.client_reference && typeof selectedVersion.client_reference === 'string' && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <UserCircle className="w-3.5 h-3.5" />
                                                <span>{selectedVersion.client_reference}</span>
                                            </div>
                                        )}

                                        {/* Topics */}
                                        {selectedVersion.topics && Array.isArray(selectedVersion.topics) && selectedVersion.topics.length > 0 && (
                                            <div className="flex flex-wrap gap-1 items-center">
                                                <TopicIcon className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                                                {selectedVersion.topics.map((topic, index) => (
                                                    <Badge key={`topic-${topic}-${index}`} variant="outline" className={cn("text-xs", NOTE_CHIP_CLASSES.topic)}>{topic}</Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* References */}
                                        {selectedVersion.references && Array.isArray(selectedVersion.references) && selectedVersion.references.length > 0 && (
                                            <div className="flex flex-wrap gap-1 items-center">
                                                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                                                {selectedVersion.references.map((refUrl, index) => (
                                                    <a key={`ref-${index}`} href={refUrl} target="_blank" rel="noopener noreferrer"
                                                        className={cn("text-xs hover:underline px-1.5 py-0.5 rounded-md border max-w-[150px] truncate", NOTE_CHIP_CLASSES.reference)} title={refUrl}>
                                                        {getDomainFromUrl(refUrl)}
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        {/* Importance and Votes */}
                                        <div className="flex items-center gap-1" title={t("notes.importance.summary", { level: selectedVersion.importance || 1, max: maxNoteImportance })}>
                                            {Array.from({ length: selectedVersion.importance || 1 }).map((_, i) => <Star key={`s-filled-${i}`} className="w-3.5 h-3.5 text-warning fill-warning" />)}
                                            {Array.from({ length: Math.max(0, maxNoteImportance - (selectedVersion.importance || 1)) }).map((_, i) => <Star key={`s-empty-${i}`} className="w-3.5 h-3.5 text-border" />)}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <ThumbsUp className="w-3.5 h-3.5 text-success" />
                                                <span>{selectedVersion.upvote_count === undefined ? t("versionHistory.notAvailable") : selectedVersion.upvote_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <ThumbsDown className="w-3.5 h-3.5 text-error" />
                                                <span>{selectedVersion.downvote_count === undefined ? t("versionHistory.notAvailable") : selectedVersion.downvote_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <CardTitle className="text-lg text-foreground">{t("versionHistory.detailsTitle")}</CardTitle>
                            )}
                        </CardHeader>
                        <CardContent className="p-6 flex-1 overflow-y-auto space-y-4">
                            {selectedVersion ? (
                                <>
                                    <div className="bg-muted rounded-lg p-4 h-full prose prose-sm max-w-none text-foreground leading-relaxed">
                                        <ReactMarkdown>{selectedVersion.content}</ReactMarkdown>
                                    </div>
                                    {selectedVersion.internal_comments && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-muted-foreground"><MessageSquare className="w-4 h-4" /> {t("versionHistory.internalComments")}</h4>
                                            <div className="bg-warning-tint rounded-lg p-4 h-full prose prose-sm max-w-none text-foreground leading-relaxed">
                                                <ReactMarkdown>{selectedVersion.internal_comments}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                    {selectedVersion.images && selectedVersion.images.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-muted-foreground"><ImageIcon className="w-4 h-4" /> {t("versionHistory.attachedImages")}</h4>
                                            <div className="space-y-3">
                                                {selectedVersion.images.map((image, index) => (
                                                    <div key={image.url || index} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg shadow-xs">
                                                        <img src={image.url} alt={image.alt} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-foreground break-words">{image.alt || t("notes.images.noDescription")}</p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-fg hover:underline">{t("versionHistory.viewFullSize")}</a>
                                                                <span className="text-border">|</span>
                                                                <a href={image.url} download target="_blank" rel="noopener noreferrer" className="text-xs text-primary-fg hover:underline flex items-center gap-1">
                                                                    <Download className="w-3 h-3" /> {t("common.download")}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                    <ArrowLeft className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                    <p className="text-center">
                                        <Trans i18nKey="versionHistory.selectPrompt" components={{ lineBreak: <br className="sm:hidden" /> }} />
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
