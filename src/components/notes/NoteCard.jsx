
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
    Edit3,
    History,
    MoreVertical,
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
import ImageLightbox from "./ImageLightbox";

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

// Utility to get domain from URL for display
const getDomainFromUrl = (url) => {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, ''); // Remove www.
    } catch (e) {
        return url; // Return original url if parsing fails
    }
};

export default function NoteCard({
    note,
    onEdit,
    onViewHistory,
    onDelete,
    onNoteDataChanged,
    onTopicClick, // New prop for handling topic clicks
    onClientClick // New prop for handling client clicks
}) {
    const [isHovered, setIsHovered] = useState(false);
    // These states are for optimistic UI updates. The source of truth comes from note prop.
    const [currentUpvotes, setCurrentUpvotes] = useState(note.upvote_count || 0);
    const [currentDownvotes, setCurrentDownvotes] = useState(note.downvote_count || 0);
    const [currentImportance, setCurrentImportance] = useState(note.importance || 1);

    const [isProcessing, setIsProcessing] = useState(false); // To prevent rapid multi-clicks during async
    const [lightboxImage, setLightboxImage] = useState(null);

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
            toast.error("Failed to record vote.");
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
            toast.error("Failed to update importance.");
            setCurrentImportance(oldImportance); // Revert
            console.error("Importance update error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyContent = () => {
        navigator.clipboard.writeText(note.content);
        toast.success("Note content copied to clipboard");
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
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="w-full max-w-lg mx-auto"
            >
                <Card
                    className="group transition-all duration-200 hover:shadow-lg hover:shadow-[var(--ruby-dust-100)] border-0 bg-white/70 backdrop-blur-sm h-full flex flex-col justify-between"
                    onClick={onEdit ? () => onEdit(note) : undefined}
                >
                    <CardContent className="p-6 flex-grow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{note.symbol}</div>
                                <Badge
                                    variant="secondary"
                                    className="text-xs bg-gray-100 text-gray-600 font-medium"
                                >
                                    {EMOJI_LABELS[note.symbol] || "Note"}
                                </Badge>
                            </div>

                            {(canPerformActions || onViewHistory) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 -mr-2 -mt-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                        {onEdit && <DropdownMenuItem onClick={() => onEdit(note)} disabled={isProcessing}>
                                            <Edit3 className="w-4 h-4 mr-2" /> Edit
                                        </DropdownMenuItem>}
                                        <DropdownMenuItem onClick={handleCopyContent} disabled={isProcessing}>
                                            <Copy className="w-4 h-4 mr-2" /> Copy content
                                        </DropdownMenuItem>
                                        {onViewHistory && <DropdownMenuItem onClick={() => onViewHistory(note)} disabled={isProcessing}>
                                            <History className="w-4 h-4 mr-2" /> Version history
                                        </DropdownMenuItem>}
                                        {onDelete && <DropdownMenuSeparator />}
                                        {onDelete && <DropdownMenuItem
                                            onClick={() => onDelete(note)}
                                            className="text-red-600 focus:text-red-600"
                                            disabled={isProcessing}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <div
                            className="text-gray-700 mb-4 prose prose-sm max-w-none"
                            title={note.content}
                        >
                            <ReactMarkdown>{note.content}</ReactMarkdown>
                        </div>

                        {note.internal_comments && (
                            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded-r-lg">
                                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-yellow-800">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    Internal Comments
                                </div>
                                <div className="prose prose-sm max-w-none text-yellow-900">
                                    <ReactMarkdown>{note.internal_comments}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {note.images && note.images.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {note.images.map((image, index) => (
                                    <div key={`${image.url}-${index}`} className="relative group overflow-hidden rounded-lg border border-gray-200">
                                        <img
                                            src={image.url}
                                            alt={image.alt || `Note image ${index + 1}`}
                                            className="w-full h-auto object-contain max-h-72 rounded-lg high-contrast-image cursor-pointer hover:opacity-90 transition-opacity"
                                            onDoubleClick={(e) => handleImageDoubleClick(image, e)}
                                            title="Double-click to view full size"
                                        />
                                        <div className="high-contrast-alt-text">
                                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm italic h-full flex items-center justify-center">
                                                <p><span className="font-bold mr-1">[Image]</span>{image.alt || 'No description provided.'}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-bl-lg flex gap-1">
                                            <button
                                                onClick={(e) => handleImageDoubleClick(image, e)}
                                                title="View full size"
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
                                                title="Download image"
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

                    <div className="p-6 pt-2 border-t border-gray-100/80">
                        <div className="flex flex-col gap-3">
                            {/* Client Tags */}
                            {note.client_reference && Array.isArray(note.client_reference) && note.client_reference.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <UserCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    {note.client_reference.map((tag, index) => (
                                        <Badge
                                            key={`client-${tag}-${index}`}
                                            variant="outline"
                                            className="text-xs bg-[var(--ruby-dust-50)] text-[var(--ruby-dust-700)] border-[var(--ruby-dust-200)] cursor-pointer hover:bg-[var(--ruby-dust-100)]"
                                            onClick={(e) => handleClientBadgeClick(e, tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Topics */}
                            {note.topics && Array.isArray(note.topics) && note.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <TopicIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    {note.topics.map((topic, index) => (
                                        <Badge
                                            key={`topic-${topic}-${index}`}
                                            variant="outline"
                                            className="text-xs bg-sky-50 text-sky-700 border-sky-200 cursor-pointer hover:bg-sky-100"
                                            onClick={(e) => handleTopicBadgeClick(e, topic)}
                                        >
                                            {topic}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* References */}
                            {note.references && Array.isArray(note.references) && note.references.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    <LinkIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                    {note.references.map((refUrl, index) => (
                                        <a
                                            key={`ref-${index}`}
                                            href={refUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 max-w-[150px] truncate"
                                            title={refUrl}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {getDomainFromUrl(refUrl)}
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Importance and Votes */}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-0.5" title={`Importance: ${currentImportance}/7`}>
                                    {Array.from({ length: 7 }).map((_, i) => {
                                        const starValue = i + 1;
                                        return (
                                            <button
                                                key={`star-${i}`}
                                                onClick={(e) => { e.stopPropagation(); handleImportanceChange(starValue); }}
                                                className={`p-0.5 rounded-sm transition-colors ${isProcessing ? 'cursor-not-allowed' : 'hover:bg-yellow-100'}`}
                                                aria-label={`Set importance to ${starValue}`}
                                                disabled={isProcessing}
                                            >
                                                <Star
                                                    className={`w-3.5 h-3.5 ${starValue <= currentImportance ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto px-1 py-0.5 flex items-center gap-1 text-green-500 hover:text-green-600"
                                    onClick={(e) => { e.stopPropagation(); handleVote('up'); }}
                                    title="Upvote"
                                    disabled={isProcessing}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                    <span>{currentUpvotes}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto px-1 py-0.5 flex items-center gap-1 text-red-500 hover:text-red-600"
                                    onClick={(e) => { e.stopPropagation(); handleVote('down'); }}
                                    title="Downvote"
                                    disabled={isProcessing}
                                >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                    <span>{currentDownvotes}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                            <span>
                                {note.updated_date ? format(new Date(note.updated_date), "MMM d, h:mm a") : 'No date'}
                            </span>

                            {onEdit && <div className={`flex items-center gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); onEdit(note) }}
                                    className="h-8 px-3 text-[var(--ruby-dust-600)] hover:text-[var(--ruby-dust-700)] hover:bg-[var(--ruby-dust-50)]"
                                    disabled={isProcessing}
                                >
                                    <Edit3 className="w-3 h-3 mr-1" />
                                    Edit
                                </Button>
                            </div>}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Image Lightbox */}
            <ImageLightbox
                image={lightboxImage}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </>
    );
}
