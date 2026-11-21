
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
    Edit3,
    History,
    MoreHorizontal,
    Trash2,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Star,
    UserCircle,
    Link as LinkIcon,
    Tag as TopicIcon,
    MessageSquare,
    Download,
    Maximize2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Note, NoteVersion } from "@/entities/all";
import { NoteTagIcon } from "@/features/notes/NoteTagIcon";
import { findNoteTagBySymbol, noteTagLabelKey } from "@/features/notes/note-tags";
import { useDateFormatter } from "@/i18n/useDateFormatter";
import { maxNoteImportance } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NOTE_CHIP_CLASSES, NOTE_CHIP_HOVER_CLASSES } from "@/features/notes/note-chips";
import ImageLightbox from "./ImageLightbox";

// Utility to get domain from URL for display
const getDomainFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, ''); // Remove www.
    } catch (e) {
        return url; // Return original url if parsing fails
    }
};

// Actions that appear on hover are always shown on touch screens (no hover)
// and whenever focus is inside the card, so they never depend on a mouse.
const REVEAL_ON_INTERACTION =
    "opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

/**
 * A research note. The list that renders it owns its enter/exit/layout
 * animation (see DashboardDetailPage), so this component is a plain element.
 */
export default function NoteCard({
    note,
    onEdit,
    onViewHistory,
    onDelete,
    onNoteDataChanged,
    onTopicClick, // New prop for handling topic clicks
    onClientClick // New prop for handling client clicks
}) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();
    const [isHovered, setIsHovered] = useState(false);
    // These states are for optimistic UI updates. The source of truth comes from note prop.
    const [currentUpvotes, setCurrentUpvotes] = useState(note.upvote_count || 0);
    const [currentDownvotes, setCurrentDownvotes] = useState(note.downvote_count || 0);
    const [currentImportance, setCurrentImportance] = useState(note.importance || 1);

    const [isProcessing, setIsProcessing] = useState(false); // To prevent rapid multi-clicks during async
    const [lightboxImage, setLightboxImage] = useState(null);

    const tag = findNoteTagBySymbol(note.symbol);

    useEffect(() => {
        setCurrentUpvotes(note.upvote_count || 0);
        setCurrentDownvotes(note.downvote_count || 0);
        setCurrentImportance(note.importance || 1);
    }, [note]);

    const createNewVersionForNoteChange = async (updatedNoteData) => {
        // Ensure client_reference is an array. If it's a string (legacy) or undefined, make it an array.
        let clientRefArray = [];
        if (Array.isArray(updatedNoteData.client_reference)) {
            clientRefArray = updatedNoteData.client_reference;
        } else if (updatedNoteData.client_reference && typeof updatedNoteData.client_reference === 'string') {
            clientRefArray = [updatedNoteData.client_reference];
        }

        // Ensure references and topics are arrays
        const referencesArray = Array.isArray(updatedNoteData.references) ? updatedNoteData.references : [];
        const topicsArray = Array.isArray(updatedNoteData.topics) ? updatedNoteData.topics : [];
        // Ensure internal_comments is a string, default to empty string if not provided
        const internalComments = updatedNoteData.internal_comments === undefined ? (note.internal_comments || "") : updatedNoteData.internal_comments;

        // Ensure images are an array
        const imagesArray = Array.isArray(updatedNoteData.images) ? updatedNoteData.images : [];


        const newVersion = await NoteVersion.create({
            note_id: note.id,
            content: updatedNoteData.content || note.content,
            symbol: updatedNoteData.symbol || note.symbol,
            importance: updatedNoteData.importance === undefined ? note.importance : updatedNoteData.importance,
            client_reference: clientRefArray, // Pass as array
            upvote_count: updatedNoteData.upvote_count === undefined ? note.upvote_count : updatedNoteData.upvote_count,
            downvote_count: updatedNoteData.downvote_count === undefined ? note.downvote_count : updatedNoteData.downvote_count, // Fixed typo here
            references: referencesArray, // Add references
            topics: topicsArray, // Add topics
            internal_comments: internalComments, // Add internal_comments
            images: imagesArray, // Add images
        });

        // Update the main Note entity with the new version ID and potentially changed fields
        await Note.update(note.id, {
            current_version_id: newVersion.id,
            ...updatedNoteData, // Pass all updated data
            client_reference: clientRefArray, // Ensure it's an array
            internal_comments: internalComments, // Ensure it's a string
            images: imagesArray, // Ensure it's an array
        });
    };

    const handleVote = async (type) => {
        if (isProcessing) return;
        setIsProcessing(true);

        let newUpvotes = currentUpvotes;
        let newDownvotes = currentDownvotes;

        if (type === 'up') {
            newUpvotes = currentUpvotes + 1;
            setCurrentUpvotes(newUpvotes); // Optimistic UI
        } else if (type === 'down') {
            newDownvotes = currentDownvotes + 1;
            setCurrentDownvotes(newDownvotes); // Optimistic UI
        }

        try {
            // Prepare data for the new version, reflecting the vote change
            const versionedVoteData = {
                ...note, // existing note data
                upvote_count: newUpvotes,
                downvote_count: newDownvotes,
            };
            await createNewVersionForNoteChange(versionedVoteData);
            if (onNoteDataChanged) onNoteDataChanged();
        } catch (error) {
            toast.error(t("noteCard.toasts.voteFailed"));
            // Revert optimistic update
            setCurrentUpvotes(note.upvote_count || 0);
            setCurrentDownvotes(note.downvote_count || 0);
            console.error("Vote error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImportanceChange = async (newImportance) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const oldImportance = currentImportance;
        setCurrentImportance(newImportance); // Optimistic UI update

        try {
            const versionedImportanceData = {
                ...note, // existing note data
                importance: newImportance
            };
            await createNewVersionForNoteChange(versionedImportanceData);
            if (onNoteDataChanged) {
                onNoteDataChanged();
            }
        } catch (error) {
            toast.error(t("noteCard.toasts.importanceFailed"));
            setCurrentImportance(oldImportance); // Revert
            console.error("Importance update error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyContent = () => {
        navigator.clipboard.writeText(note.content);
        toast.success(t("noteCard.toasts.copied"));
    };

    const canPerformActions = !!onEdit || !!onDelete;

    const handleTopicBadgeClick = (e, topic) => {
        e.stopPropagation(); // Prevent card's onClick from firing
        if (onTopicClick) {
            onTopicClick(topic);
        }
    };

    const handleClientBadgeClick = (e, client) => {
        e.stopPropagation();
        if (onClientClick) {
            onClientClick(client);
        }
    };

    const handleImageDoubleClick = (image, e) => {
        e.stopPropagation(); // Prevent card's onClick from firing
        setLightboxImage(image);
    };

    return (
        <>
            <div
                className="h-full"
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <Card
                    className={cn(
                        "group h-full flex flex-col justify-between transition-shadow duration-200 hover:shadow-card-hover",
                        onEdit && "cursor-pointer"
                    )}
                    onClick={onEdit ? () => onEdit(note) : undefined}
                >
                    <CardContent className="p-5 flex-grow">
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <NoteTagIcon symbol={note.symbol} tag={tag} size="sm" animate={isHovered} decorative={!!tag} />
                                <span className="text-[13px] font-medium text-muted-foreground truncate">
                                    {tag ? t(noteTagLabelKey(tag.id)) : t("notes.fallbackLabel")}
                                </span>
                            </div>

                            {(canPerformActions || onViewHistory) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn("h-8 w-8 -me-2 rounded-full text-muted-foreground", REVEAL_ON_INTERACTION, "data-[state=open]:opacity-100")}
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label={t("noteCard.actionsLabel")}
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        {onEdit && <DropdownMenuItem onClick={() => onEdit(note)} disabled={isProcessing}>
                                            <Edit3 className="w-4 h-4 me-2" /> {t("common.edit")}
                                        </DropdownMenuItem>}
                                        <DropdownMenuItem onClick={handleCopyContent} disabled={isProcessing}>
                                            <Copy className="w-4 h-4 me-2" /> {t("noteCard.copyContent")}
                                        </DropdownMenuItem>
                                        {onViewHistory && <DropdownMenuItem onClick={() => onViewHistory(note)} disabled={isProcessing}>
                                            <History className="w-4 h-4 me-2" /> {t("noteCard.versionHistory")}
                                        </DropdownMenuItem>}
                                        {onDelete && <DropdownMenuSeparator />}
                                        {onDelete && <DropdownMenuItem
                                            onClick={() => onDelete(note)}
                                            className="text-destructive focus:text-destructive"
                                            disabled={isProcessing}
                                        >
                                            <Trash2 className="w-4 h-4 me-2" /> {t("common.delete")}
                                        </DropdownMenuItem>}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <div
                            className="text-[15px] text-foreground/90 prose max-w-none"
                            dir="auto"
                        >
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>

                        {note.internal_comments && (
                            <div className="mt-4 rounded-lg border-s-2 border-tag-emotional/50 bg-muted/60 px-3 py-2.5">
                                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium text-muted-foreground">
                                    <MessageSquare className="w-3.5 h-3.5" aria-hidden />
                                    {t("noteCard.internalComments")}
                                </div>
                                <div className="prose text-sm max-w-none text-foreground/80" dir="auto">
                                    <ReactMarkdown>{note.internal_comments}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {note.images && note.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {note.images.map((image, index) => (
                                    <div key={`${image.url}-${index}`} className="relative group/image overflow-hidden rounded-lg border border-border/70">
                                        <img
                                            src={image.url}
                                            alt={image.alt || t("noteCard.imageAlt", { number: index + 1 })}
                                            className="w-full h-auto object-contain max-h-72 rounded-lg high-contrast-image cursor-pointer hover:opacity-90 transition-opacity"
                                            onDoubleClick={(e) => handleImageDoubleClick(image, e)}
                                            title={t("notes.images.viewFullSizeHint")}
                                        />
                                        <div className="high-contrast-alt-text">
                                            <div className="p-3 bg-muted border border-border rounded-lg text-sm italic h-full flex items-center justify-center">
                                                <p><span className="font-bold me-1">{t("noteCard.imagePrefix")}</span>{image.alt || t("notes.images.noDescription")}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 end-0 p-1 opacity-0 group-hover/image:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity bg-black/50 rounded-es-lg flex gap-1">
                                            <button
                                                onClick={(e) => handleImageDoubleClick(image, e)}
                                                aria-label={t("noteCard.viewImageFullSize")}
                                                className="block p-1 hover:bg-black/70 rounded"
                                            >
                                                <Maximize2 className="w-4 h-4 text-white" />
                                            </button>
                                            <a
                                                href={image.url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                aria-label={t("notes.images.download")}
                                                className="block p-1 hover:bg-black/70 rounded"
                                            >
                                                <Download className="w-4 h-4 text-white" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    <div className="px-5 pb-4 pt-3 border-t border-border/60">
                        <div className="flex flex-col gap-2.5">
                            {/* Client Tags */}
                            {note.client_reference && Array.isArray(note.client_reference) && note.client_reference.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <UserCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-label={t("notes.clientTags")} />
                                    {note.client_reference.map((clientTag, index) => (
                                        <button
                                            type="button"
                                            key={`client-${clientTag}-${index}`}
                                            className={cn(badgeVariants({ variant: "outline" }), NOTE_CHIP_CLASSES.client, NOTE_CHIP_HOVER_CLASSES.client)}
                                            onClick={(e) => handleClientBadgeClick(e, clientTag)}
                                            aria-label={t("noteCard.filterByClient", { client: clientTag })}
                                        >
                                            {clientTag}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Topics */}
                            {note.topics && Array.isArray(note.topics) && note.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <TopicIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-label={t("notes.topics")} />
                                    {note.topics.map((topic, index) => (
                                        <button
                                            type="button"
                                            key={`topic-${topic}-${index}`}
                                            className={cn(badgeVariants({ variant: "outline" }), NOTE_CHIP_CLASSES.topic, NOTE_CHIP_HOVER_CLASSES.topic)}
                                            onClick={(e) => handleTopicBadgeClick(e, topic)}
                                            aria-label={t("noteCard.filterByTopic", { topic })}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* References */}
                            {note.references && Array.isArray(note.references) && note.references.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <LinkIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" aria-label={t("notes.references")} />
                                    {note.references.map((refUrl, index) => (
                                        <a
                                            key={`ref-${index}`}
                                            href={refUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn("text-xs hover:underline px-2 py-0.5 rounded-full max-w-[160px] truncate", NOTE_CHIP_CLASSES.reference)}
                                            title={refUrl}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {getDomainFromUrl(refUrl)}
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Importance and Votes */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center" role="group" aria-label={t("notes.importance.summary", { level: currentImportance, max: maxNoteImportance })}>
                                    {Array.from({ length: maxNoteImportance }).map((_, i) => {
                                        const starValue = i + 1;
                                        return (
                                            <button
                                                key={`star-${i}`}
                                                onClick={(e) => { e.stopPropagation(); handleImportanceChange(starValue); }}
                                                className={cn("p-0.5 rounded-sm transition-colors motion-safe:active:scale-90", isProcessing ? 'cursor-not-allowed' : 'hover:bg-warning-tint')}
                                                aria-label={t("notes.importance.setLevel", { level: starValue })}
                                                aria-pressed={starValue <= currentImportance}
                                                disabled={isProcessing}
                                            >
                                                <Star
                                                    className={cn("w-3.5 h-3.5", starValue <= currentImportance ? 'text-warning fill-warning' : 'text-border')}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-1.5 gap-1 text-muted-foreground hover:text-tag-business"
                                    onClick={(e) => { e.stopPropagation(); handleVote('up'); }}
                                    aria-label={t("noteCard.upvote", { count: currentUpvotes })}
                                    disabled={isProcessing}
                                >
                                    <ThumbsUp className="!w-3.5 !h-3.5" />
                                    <span className="tabular-nums">{currentUpvotes}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-1.5 gap-1 text-muted-foreground hover:text-tag-problem"
                                    onClick={(e) => { e.stopPropagation(); handleVote('down'); }}
                                    aria-label={t("noteCard.downvote", { count: currentDownvotes })}
                                    disabled={isProcessing}
                                >
                                    <ThumbsDown className="!w-3.5 !h-3.5" />
                                    <span className="tabular-nums">{currentDownvotes}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span>
                                {note.updated_date ? formatDate(note.updated_date, "shortDateTime") : t("notes.noDate")}
                            </span>

                            {onEdit && <div className={REVEAL_ON_INTERACTION}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); onEdit(note) }}
                                    className="h-7 px-2.5 text-primary-fg hover:bg-accent hover:text-primary-fg"
                                    disabled={isProcessing}
                                >
                                    <Edit3 className="!w-3.5 !h-3.5" />
                                    {t("common.edit")}
                                </Button>
                            </div>}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Image Lightbox */}
            <ImageLightbox
                image={lightboxImage}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </>
    );
}
