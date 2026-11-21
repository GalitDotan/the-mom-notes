
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Loader2, Star, Plus, Minus, ThumbsUp, ThumbsDown, Link as LinkIcon, Tag as TopicIcon, MessageSquare, Trash2 as TrashIcon, ImagePlus, Download, Maximize2 } from "lucide-react";
import { NoteTagPicker } from "@/features/notes/NoteTagPicker";
import { DEFAULT_NOTE_TAG } from "@/features/notes/note-tags";
import { SPRING_SNAPPY } from "@/lib/motion";
import TagSelector from "./TagSelector";
import { Badge } from "@/components/ui/badge";
import { NOTE_CHIP_CLASSES } from "@/features/notes/note-chips";
import { cn } from "@/lib/utils";
import { maxNoteImportance } from "@/lib/constants";
import MarkdownEditor from "./MarkdownEditor";
import { UploadFile } from "@/integrations/Core";
import { toast } from "sonner";
import ImageLightbox from "./ImageLightbox";

/** Largest image a note accepts, per file. */
const MAX_IMAGE_SIZE_MEGABYTES = 10;

const ImportanceStarSelector = ({ value, onChange, disabled }) => {
    const { t } = useTranslation();
    const levels = Array.from({ length: maxNoteImportance }, (_, i) => i + 1);
    const [hoverValue, setHoverValue] = useState(0);

    return (
        <div className="space-y-2">
            <Label htmlFor="importance-star-selector" className="text-sm font-medium text-foreground">{t("notes.importance.label")}</Label>
            <div
                id="importance-star-selector"
                className="flex flex-wrap gap-1 items-center"
                onMouseLeave={() => setHoverValue(0)}
            >
                {levels.map((level) => (
                    <Button
                        key={level}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => !disabled && onChange(level)}
                        onMouseEnter={() => !disabled && setHoverValue(level)}
                        className={`p-1 transition-all duration-150 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-ring ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        disabled={disabled}
                        aria-label={t("notes.importance.setLevel", { level })}
                    >
                        <Star
                            className={`w-6 h-6 transition-colors duration-100 ${(hoverValue >= level || (!hoverValue && value >= level))
                                    ? 'text-warning fill-warning'
                                    : 'text-border hover:text-warning/70'
                                }`}
                        />
                    </Button>
                ))}
                {value > 0 && <span className="ml-2 text-sm text-muted-foreground">{t("notes.importance.selected", { level: value, max: maxNoteImportance })}</span>}
            </div>
        </div>
    );
};

/** Edits a note's upvote or downvote count. */
const CounterInput = ({ kind, count, onIncrement, onDecrement, disabled }: {
    kind: "upvotes" | "downvotes";
    count: number;
    onIncrement: () => void;
    onDecrement: () => void;
    disabled: boolean;
}) => {
    const { t } = useTranslation();

    return (
    <div className="space-y-1">
        <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            {kind === "upvotes" ? <ThumbsUp className="w-4 h-4 text-success" /> : <ThumbsDown className="w-4 h-4 text-error" />}
            {t(`notes.${kind}`)}
        </Label>
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onDecrement}
                disabled={disabled || count <= 0}
                className="h-8 w-8"
            >
                <Minus className="w-4 h-4" />
            </Button>
            <input
                type="number"
                value={count}
                readOnly
                className="w-16 text-center h-8 bg-muted border-0 rounded-md text-sm outline-hidden"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onIncrement}
                disabled={disabled}
                className="h-8 w-8"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    </div>
    );
};

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

type EditorState = {
    content: string;
    symbol: string;
    importance: number;
    clientTags: string[];
    upvotes: number;
    downvotes: number;
    references: string[];
    topics: string[];
    internalComments: string;
    images: unknown[];
};

const EMPTY_EDITOR_STATE: EditorState = {
    content: "",
    symbol: DEFAULT_NOTE_TAG.emoji,
    importance: 1,
    clientTags: [],
    upvotes: 0,
    downvotes: 0,
    references: [],
    topics: [],
    internalComments: "",
    images: [],
};

/** Comparable form of the editor's fields; only computed when closing. */
const snapshotOf = (state: EditorState) => JSON.stringify(state);

export default function NoteEditor({
    note,
    onSave,
    onCancel,
    isOpen,
    isSaving = false,
    availableClientTags = [],
    availableTopics = []
}) {
    const { t } = useTranslation();
    const [content, setContent] = useState("");
    const [symbol, setSymbol] = useState<string>(DEFAULT_NOTE_TAG.emoji);
    const [importance, setImportance] = useState(1);
    const [clientTags, setClientTags] = useState<string[]>([]);
    const [editableUpvotes, setEditableUpvotes] = useState(0);
    const [editableDownvotes, setEditableDownvotes] = useState(0);

    const [currentReferences, setCurrentReferences] = useState([]);
    const [newReferenceUrl, setNewReferenceUrl] = useState("");
    const [currentTopics, setCurrentTopics] = useState<string[]>([]);
    const [internalComments, setInternalComments] = useState("");
    const [showInternalComments, setShowInternalComments] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    const textareaRef = useRef(null);
    const isInitialEditLoadRef = useRef(false);
    const isDraggingRef = useRef(false);
    // What the editor held when it opened, to tell whether closing would discard edits.
    const openedSnapshotRef = useRef("");

    useEffect(() => {
        if (isOpen) {
            if (note) {
                setContent(note.content || "");
                setSymbol(note.symbol || DEFAULT_NOTE_TAG.emoji);
                setImportance(note.importance || 1);
                setClientTags(Array.isArray(note.client_reference) ? note.client_reference : []);
                setEditableUpvotes(note.upvote_count || 0);
                setEditableDownvotes(note.downvote_count || 0);
                setCurrentReferences(Array.isArray(note.references) ? note.references : []);
                setCurrentTopics(Array.isArray(note.topics) ? note.topics : []);
                setInternalComments(note.internal_comments || "");
                setShowInternalComments(!!note.internal_comments);
                setCurrentImages(Array.isArray(note.images) ? note.images : []);
                isInitialEditLoadRef.current = true;
            } else {
                setContent("");
                setSymbol(DEFAULT_NOTE_TAG.emoji);
                setImportance(1);
                setClientTags([]);
                setEditableUpvotes(0);
                setEditableDownvotes(0);
                setCurrentReferences([]);
                setCurrentTopics([]);
                setInternalComments("");
                setShowInternalComments(false);
                setCurrentImages([]);
                isInitialEditLoadRef.current = false;
            }
            setIsUploadingImages(false);
            openedSnapshotRef.current = snapshotOf(note ? {
                content: note.content || "",
                symbol: note.symbol || DEFAULT_NOTE_TAG.emoji,
                importance: note.importance || 1,
                clientTags: Array.isArray(note.client_reference) ? note.client_reference : [],
                upvotes: note.upvote_count || 0,
                downvotes: note.downvote_count || 0,
                references: Array.isArray(note.references) ? note.references : [],
                topics: Array.isArray(note.topics) ? note.topics : [],
                internalComments: note.internal_comments || "",
                images: Array.isArray(note.images) ? note.images : [],
            } : EMPTY_EDITOR_STATE);
        } else {
            isInitialEditLoadRef.current = false;
        }
    }, [note, isOpen]);

    const hasUnsavedChanges = () => snapshotOf({
        content,
        symbol,
        importance,
        clientTags,
        upvotes: editableUpvotes,
        downvotes: editableDownvotes,
        references: currentReferences,
        topics: currentTopics,
        internalComments,
        images: currentImages,
    }) !== openedSnapshotRef.current;

    /**
     * Closing via Escape, the close button or a click outside used to discard
     * edits silently; now it asks first whenever something would be lost.
     */
    const requestClose = () => {
        if (isSaving || isUploadingImages) return;
        if (hasUnsavedChanges() && !window.confirm(t("noteEditor.discardConfirmation"))) return;
        handleCancel();
    };

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
            if (isInitialEditLoadRef.current) {
                if (typeof textareaRef.current.select === 'function') {
                    textareaRef.current.select();
                }
                isInitialEditLoadRef.current = false;
            }
        }
    }, [isOpen]);

    const calculateTextareaHeight = (text) => {
        const lineHeight = 24;
        const minLines = 5;
        const maxLines = 15;
        if (!text) return `${minLines * lineHeight}px`;
        const contentLines = text.split('\n').length;
        const estimatedLines = Math.max(contentLines, text.length / 50);
        const targetLines = Math.max(minLines, Math.min(maxLines, estimatedLines));
        return `${targetLines * lineHeight}px`;
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file sizes (max 10MB per file)
        const maxSize = MAX_IMAGE_SIZE_MEGABYTES * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error(t("noteEditor.images.tooLarge", { maxMegabytes: MAX_IMAGE_SIZE_MEGABYTES }));
            return;
        }

        setIsUploadingImages(true);

        const uploadPromises = files.map(file => UploadFile({ file }));

        try {
            const results = await Promise.all(uploadPromises);
            const newImages = results.map((result, index) => ({
                url: result.file_url,
                alt: '',
                originalName: files[index].name
            }));
            setCurrentImages(prev => [...prev, ...newImages]);
            toast.success(t("noteEditor.images.uploaded", { count: files.length }));
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error(t("noteEditor.images.uploadFailed"));
        }

        setIsUploadingImages(false);
        e.target.value = null;
    };

    const handleAltTextChange = (index, newAltText) => {
        setCurrentImages(prev => {
            const updatedImages = [...prev];
            updatedImages[index].alt = newAltText;
            return updatedImages;
        });
    };

    const handleRemoveImage = (index) => {
        setCurrentImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageDoubleClick = (image) => {
        setLightboxImage(image);
    };

    const handleAddReference = () => {
        const trimmedUrl = newReferenceUrl.trim();
        if (trimmedUrl && isValidUrl(trimmedUrl) && !currentReferences.includes(trimmedUrl)) {
            setCurrentReferences([...currentReferences, trimmedUrl]);
            setNewReferenceUrl("");
        } else if (trimmedUrl && !isValidUrl(trimmedUrl)) {
            alert(t("noteEditor.references.invalid"));
        }
    };

    const handleRemoveReference = (urlToRemove) => {
        setCurrentReferences(currentReferences.filter(url => url !== urlToRemove));
    };

    const handleSave = () => {
        if (content.trim()) {
            onSave({
                content: content.trim(),
                symbol,
                importance,
                client_reference: clientTags,
                upvote_count: editableUpvotes,
                downvote_count: editableDownvotes,
                references: currentReferences,
                topics: currentTopics,
                internal_comments: internalComments.trim(),
                images: currentImages,
            });
        }
    };

    const handleCancel = () => {
        if (note) {
            setContent(note.content || "");
            setSymbol(note.symbol || DEFAULT_NOTE_TAG.emoji);
            setImportance(note.importance || 1);
            setClientTags(Array.isArray(note.client_reference) ? note.client_reference : []);
            setEditableUpvotes(note.upvote_count || 0);
            setEditableDownvotes(note.downvote_count || 0);
            setCurrentReferences(Array.isArray(note.references) ? note.references : []);
            setCurrentTopics(Array.isArray(note.topics) ? note.topics : []);
            setInternalComments(note.internal_comments || "");
            setShowInternalComments(!!note.internal_comments);
            setCurrentImages(Array.isArray(note.images) ? note.images : []);
        } else {
            setContent(""); setSymbol(DEFAULT_NOTE_TAG.emoji); setImportance(1); setClientTags([]);
            setEditableUpvotes(0); setEditableDownvotes(0); setCurrentReferences([]); setCurrentTopics([]);
            setInternalComments(""); setShowInternalComments(false); setCurrentImages([]);
        }
        onCancel();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            requestClose();
        } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSave();
        }
    };

    const handleReferenceInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddReference();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isDraggingRef.current && !isSaving) {
            requestClose();
        }
    };

    const handleMouseDown = () => {
        isDraggingRef.current = false;
    };

    const handleMouseMove = () => {
        isDraggingRef.current = true;
    };

    const handleMouseUp = () => {
        setTimeout(() => {
            isDraggingRef.current = false;
        }, 100);
    };

    return (
        <>
        {/* Always mounted so the editor can animate out; it renders nothing while closed. */}
        <AnimatePresence>
            {isOpen && (
            <motion.div
                key="note-editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRING_SNAPPY}
                className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto overscroll-contain"
                onClick={handleBackdropClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="note-editor-title"
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                    transition={SPRING_SNAPPY}
                    className="w-full max-w-2xl mb-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="shadow-overlay border-border/60">
                        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4 px-6 pt-6">
                            <div className="space-y-3">
                                <div>
                                    <h2 id="note-editor-title" className="text-xl font-semibold">
                                        {note ? t("noteEditor.editTitle") : t("noteEditor.newTitle")}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {note ? t("noteEditor.editSubtitle") : t("noteEditor.newSubtitle")}
                                    </p>
                                </div>
                                <NoteTagPicker
                                    value={symbol}
                                    onChange={setSymbol}
                                    disabled={isSaving || isUploadingImages}
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={requestClose}
                                className="-me-2 -mt-1 rounded-full text-muted-foreground"
                                disabled={isSaving || isUploadingImages}
                                aria-label={t("noteEditor.closeLabel")}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6 px-6 pb-6">
                            <div className="space-y-2">
                                <MarkdownEditor
                                    ref={textareaRef}
                                    label={t("noteEditor.content.label")}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t("noteEditor.content.placeholder")}
                                    height={calculateTextareaHeight(content)}
                                    disabled={isSaving || isUploadingImages}
                                />
                                <div className="text-xs text-muted-foreground flex justify-between">
                                    <span>{t("noteEditor.quickSaveHint")}</span>
                                    <span>{t("noteEditor.characterCount", { count: content.length })}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {!showInternalComments ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start text-muted-foreground hover:text-foreground border-dashed"
                                        onClick={() => setShowInternalComments(true)}
                                        disabled={isSaving || isUploadingImages}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        {t("noteEditor.internalComments.add")}
                                    </Button>
                                ) : (
                                    <MarkdownEditor
                                        label={t("noteEditor.internalComments.label")}
                                        value={internalComments}
                                        onChange={(e) => setInternalComments(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={t("noteEditor.internalComments.placeholder")}
                                        height={calculateTextareaHeight(internalComments)}
                                        disabled={isSaving || isUploadingImages}
                                    />
                                )}
                            </div>

                            <ImportanceStarSelector value={importance} onChange={setImportance} disabled={isSaving || isUploadingImages} />

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                    <LinkIcon className="w-4 h-4 text-muted-foreground" /> {t("noteEditor.references.label")}
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder={t("noteEditor.references.placeholder")}
                                        value={newReferenceUrl}
                                        onChange={(e) => setNewReferenceUrl(e.target.value)}
                                        onKeyDown={handleReferenceInputKeyDown}
                                        className="flex-grow bg-muted border-0 focus:bg-card"
                                        disabled={isSaving || isUploadingImages}
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddReference} disabled={isSaving || isUploadingImages || !newReferenceUrl.trim()}>
                                        <Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">{t("noteEditor.references.add")}</span>
                                    </Button>
                                </div>
                                {currentReferences.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {currentReferences.map((refUrl, index) => (
                                            <Badge key={index} variant="outline" className={cn("flex items-center gap-1.5", NOTE_CHIP_CLASSES.reference)}>
                                                <a href={refUrl} target="_blank" rel="noopener noreferrer" className="hover:underline max-w-[150px] sm:max-w-[200px] truncate" title={refUrl}>
                                                    {refUrl}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveReference(refUrl)}
                                                    className="ml-1 hover:bg-accent rounded-full p-0.5 transition-colors"
                                                    aria-label={t("noteEditor.references.remove", { url: refUrl })}
                                                    disabled={isSaving || isUploadingImages}
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <TagSelector
                                kind="client"
                                label={t("noteEditor.clientTags.label")}
                                selectedTags={clientTags}
                                availableTags={availableClientTags}
                                onTagsChange={setClientTags}
                                disabled={isSaving || isUploadingImages}
                                placeholder={t("noteEditor.clientTags.placeholder")}
                                infoText={t("noteEditor.clientTags.info")}
                            />

                            <TagSelector
                                kind="topic"
                                label={t("noteEditor.topics.label")}
                                selectedTags={currentTopics}
                                availableTags={availableTopics}
                                onTagsChange={setCurrentTopics}
                                disabled={isSaving || isUploadingImages}
                                placeholder={t("noteEditor.topics.placeholder")}
                                infoText={t("noteEditor.topics.info")}
                                icon={<TopicIcon className="w-4 h-4 text-muted-foreground" />}
                            />

                            {/* Images Section - Enhanced */}
                            <div className="space-y-4">
                                <Label htmlFor="image-upload" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                    <ImagePlus className="w-4 h-4 text-muted-foreground" /> {t("noteEditor.images.label")}
                                </Label>

                                {/* Upload Area - Fixed visibility */}
                                <div className="min-h-[120px] p-6 border-2 border-dashed border-border rounded-lg text-center bg-muted/50 hover:bg-accent transition-colors">
                                    <div className="flex flex-col items-center gap-3">
                                        <ImagePlus className="w-8 h-8 text-muted-foreground" />
                                        <div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                multiple
                                                accept="image/png, image/jpeg, image/gif, image/webp"
                                                onChange={handleImageUpload}
                                                disabled={isSaving || isUploadingImages}
                                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-tint file:text-primary-fg hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
                                            />
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {t("noteEditor.images.uploadHint", { maxMegabytes: MAX_IMAGE_SIZE_MEGABYTES })}
                                            </p>
                                        </div>
                                    </div>
                                    {isUploadingImages && (
                                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                                            <Loader2 className="w-4 h-4 animate-spin" /> {t("noteEditor.images.uploading")}
                                        </div>
                                    )}
                                </div>

                                {/* Image Previews - Enhanced with lightbox */}
                                {currentImages.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {currentImages.map((image, index) => (
                                            <div key={`${image.url}-${index}`} className="relative group space-y-3 p-3 border rounded-lg bg-card shadow-xs hover:shadow-md transition-shadow">
                                                <div className="relative">
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt || t("noteEditor.images.previewAlt", { number: index + 1 })}
                                                        className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                                        onDoubleClick={() => handleImageDoubleClick(image)}
                                                        title={t("notes.images.viewFullSizeHint")}
                                                    />
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white border-0"
                                                            onClick={() => handleImageDoubleClick(image)}
                                                            title={t("noteEditor.images.viewFullSize")}
                                                        >
                                                            <Maximize2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Input
                                                    type="text"
                                                    placeholder={t("noteEditor.images.altTextPlaceholder")}
                                                    value={image.alt}
                                                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                                                    disabled={isSaving || isUploadingImages}
                                                    className="bg-muted border-0 focus:bg-card text-sm"
                                                    aria-label={t("noteEditor.images.altTextLabel", { number: index + 1 })}
                                                />
                                                <div className="flex justify-end gap-1">
                                                    <a href={image.url} download={image.originalName || true} target="_blank" rel="noopener noreferrer" title={t("notes.images.download")}>
                                                        <Button variant="outline" size="icon" className="h-7 w-7" disabled={isSaving || isUploadingImages}>
                                                            <Download className="w-3 h-3" />
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleRemoveImage(index)}
                                                        disabled={isSaving || isUploadingImages}
                                                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-error-tint"
                                                        title={t("noteEditor.images.remove")}
                                                    >
                                                        <TrashIcon className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CounterInput
                                    kind="upvotes"
                                    count={editableUpvotes}
                                    onIncrement={() => setEditableUpvotes(prev => prev + 1)}
                                    onDecrement={() => setEditableUpvotes(prev => Math.max(0, prev - 1))}
                                    disabled={isSaving || isUploadingImages}
                                />
                                <CounterInput
                                    kind="downvotes"
                                    count={editableDownvotes}
                                    onIncrement={() => setEditableDownvotes(prev => prev + 1)}
                                    onDecrement={() => setEditableDownvotes(prev => Math.max(0, prev - 1))}
                                    disabled={isSaving || isUploadingImages}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border/70">
                                <Button
                                    variant="outline"
                                    onClick={requestClose}
                                    disabled={isSaving || isUploadingImages}
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isSaving || isUploadingImages}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="animate-spin" aria-hidden />
                                            {t("noteEditor.saving")}
                                        </>
                                    ) : (
                                        <>
                                            <Save aria-hidden />
                                            {note ? t("noteEditor.update") : t("noteEditor.save")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>

            {/* Image Lightbox */}
            <ImageLightbox
                image={lightboxImage}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </>
    );
}
