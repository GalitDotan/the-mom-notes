
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Loader2, Star, Plus, Minus, ThumbsUp, ThumbsDown, Link as LinkIcon, Tag as TopicIcon, MessageSquare, Trash2 as TrashIcon, ImagePlus, Download, Maximize2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import TagSelector from "./TagSelector";
import { Badge } from "@/components/ui/badge";
import MarkdownEditor from "./MarkdownEditor";
import { UploadFile } from "@/integrations/Core";
import { toast } from "sonner";
import ImageLightbox from "./ImageLightbox";

const ImportanceStarSelector = ({ value, onChange, disabled }) => {
    const levels = Array.from({ length: 7 }, (_, i) => i + 1);
    const [hoverValue, setHoverValue] = useState(0);

    return (
        <div className="space-y-2">
            <Label htmlFor="importance-star-selector" className="text-sm font-medium text-gray-700">Importance</Label>
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
                        className={`p-1 transition-all duration-150 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-[var(--ruby-dust-focus-ring)] ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        disabled={disabled}
                        aria-label={`Set importance to ${level}`}
                    >
                        <Star
                            className={`w-6 h-6 transition-colors duration-100 ${(hoverValue >= level || (!hoverValue && value >= level))
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-300'
                                }`}
                        />
                    </Button>
                ))}
                {value > 0 && <span className="ml-2 text-sm text-gray-600">({value}/7)</span>}
            </div>
        </div>
    );
};

const CounterInput = ({ label, count, onIncrement, onDecrement, disabled }) => (
    <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            {label === "Upvotes" ? <ThumbsUp className="w-4 h-4 text-green-500" /> : <ThumbsDown className="w-4 h-4 text-red-500" />}
            {label}
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
                className="w-16 text-center h-8 bg-gray-50 border-0 rounded-md text-sm outline-none"
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

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

export default function NoteEditor({
    note,
    onSave,
    onCancel,
    isOpen,
    isSaving = false,
    availableClientTags = [],
    availableTopics = []
}) {
    const [content, setContent] = useState("");
    const [symbol, setSymbol] = useState("🙂");
    const [importance, setImportance] = useState(1);
    const [clientTags, setClientTags] = useState([]);
    const [editableUpvotes, setEditableUpvotes] = useState(0);
    const [editableDownvotes, setEditableDownvotes] = useState(0);

    const [currentReferences, setCurrentReferences] = useState([]);
    const [newReferenceUrl, setNewReferenceUrl] = useState("");
    const [currentTopics, setCurrentTopics] = useState([]);
    const [internalComments, setInternalComments] = useState("");
    const [showInternalComments, setShowInternalComments] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const [lightboxImage, setLightboxImage] = useState(null);

    const textareaRef = useRef(null);
    const isInitialEditLoadRef = useRef(false);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            if (note) {
                setContent(note.content || "");
                setSymbol(note.symbol || "🙂");
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
                setSymbol("🙂");
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
        } else {
            isInitialEditLoadRef.current = false;
        }
    }, [note, isOpen]);

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
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        if (oversizedFiles.length > 0) {
            toast.error(`Some files are too large. Maximum size is 10MB per file.`);
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
            toast.success(`${files.length} image(s) uploaded successfully!`);
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload one or more images.");
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
            alert("Please enter a valid URL (e.g., https://example.com)");
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
            setSymbol(note.symbol || "🙂");
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
            setContent(""); setSymbol("🙂"); setImportance(1); setClientTags([]);
            setEditableUpvotes(0); setEditableDownvotes(0); setCurrentReferences([]); setCurrentTopics([]);
            setInternalComments(""); setShowInternalComments(false); setCurrentImages([]);
        }
        onCancel();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleCancel();
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
            handleCancel();
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto"
                onClick={handleBackdropClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="w-full max-w-2xl mb-12"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="shadow-2xl border-0 bg-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
                            <div className="flex items-center gap-4">
                                <EmojiPicker
                                    selectedEmoji={symbol}
                                    onSelect={setSymbol}
                                    size="large"
                                />
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {note ? 'Edit Note' : 'New Note'}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {note ? 'Update your research note' : 'Capture your insights'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600"
                                disabled={isSaving || isUploadingImages}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6 px-6 pb-6">
                            <div className="space-y-2">
                                <MarkdownEditor
                                    ref={textareaRef}
                                    label="Note Content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What did you learn? What insights did you capture?"
                                    height={calculateTextareaHeight(content)}
                                    disabled={isSaving || isUploadingImages}
                                />
                                <div className="text-xs text-gray-400 flex justify-between">
                                    <span>Press Ctrl+Enter to save quickly</span>
                                    <span>{content.length} characters</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {!showInternalComments ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-start text-gray-500 hover:text-gray-700 border-dashed"
                                        onClick={() => setShowInternalComments(true)}
                                        disabled={isSaving || isUploadingImages}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Add internal comments...
                                    </Button>
                                ) : (
                                    <MarkdownEditor
                                        label="Our Comments (Internal)"
                                        value={internalComments}
                                        onChange={(e) => setInternalComments(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Add internal notes, observations, or next steps (only visible to your team)..."
                                        height={calculateTextareaHeight(internalComments)}
                                        disabled={isSaving || isUploadingImages}
                                    />
                                )}
                            </div>

                            <ImportanceStarSelector value={importance} onChange={setImportance} disabled={isSaving || isUploadingImages} />

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <LinkIcon className="w-4 h-4 text-gray-500" /> References (URLs)
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="url"
                                        placeholder="Add a relevant link (e.g., https://example.com)"
                                        value={newReferenceUrl}
                                        onChange={(e) => setNewReferenceUrl(e.target.value)}
                                        onKeyDown={handleReferenceInputKeyDown}
                                        className="flex-grow bg-gray-50 border-0 focus:bg-white"
                                        disabled={isSaving || isUploadingImages}
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddReference} disabled={isSaving || isUploadingImages || !newReferenceUrl.trim()}>
                                        <Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add</span>
                                    </Button>
                                </div>
                                {currentReferences.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {currentReferences.map((refUrl, index) => (
                                            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                                                <a href={refUrl} target="_blank" rel="noopener noreferrer" className="hover:underline max-w-[150px] sm:max-w-[200px] truncate" title={refUrl}>
                                                    {refUrl}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveReference(refUrl)}
                                                    className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                                                    aria-label={`Remove ${refUrl}`}
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
                                label="Client Tags"
                                selectedTags={clientTags}
                                availableTags={availableClientTags}
                                onTagsChange={setClientTags}
                                disabled={isSaving || isUploadingImages}
                                placeholder="Select or create client tags..."
                                infoText="Helps you track which client(s) or projects this insight relates to."
                            />

                            <TagSelector
                                label="Topics"
                                selectedTags={currentTopics}
                                availableTags={availableTopics}
                                onTagsChange={setCurrentTopics}
                                disabled={isSaving || isUploadingImages}
                                placeholder="Select or create topic tags..."
                                infoText="Categorize this note by relevant topics."
                                icon={<TopicIcon className="w-4 h-4 text-gray-500" />}
                            />

                            {/* Images Section - Enhanced */}
                            <div className="space-y-4">
                                <Label htmlFor="image-upload" className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                    <ImagePlus className="w-4 h-4 text-gray-500" /> Attached Images
                                </Label>

                                {/* Upload Area - Fixed visibility */}
                                <div className="min-h-[120px] p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center gap-3">
                                        <ImagePlus className="w-8 h-8 text-gray-400" />
                                        <div>
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                multiple
                                                accept="image/png, image/jpeg, image/gif, image/webp"
                                                onChange={handleImageUpload}
                                                disabled={isSaving || isUploadingImages}
                                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--ruby-dust-100)] file:text-[var(--ruby-dust-700)] hover:file:bg-[var(--ruby-dust-200)] file:cursor-pointer cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Upload PNG, JPEG, GIF, or WebP files (max 10MB each)
                                            </p>
                                        </div>
                                    </div>
                                    {isUploadingImages && (
                                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading images...
                                        </div>
                                    )}
                                </div>

                                {/* Image Previews - Enhanced with lightbox */}
                                {currentImages.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {currentImages.map((image, index) => (
                                            <div key={`${image.url}-${index}`} className="relative group space-y-3 p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="relative">
                                                    <img
                                                        src={image.url}
                                                        alt={image.alt || `Upload preview ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                                                        onDoubleClick={() => handleImageDoubleClick(image)}
                                                        title="Double-click to view full size"
                                                    />
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-6 w-6 bg-black/50 hover:bg-black/70 text-white border-0"
                                                            onClick={() => handleImageDoubleClick(image)}
                                                            title="View full size"
                                                        >
                                                            <Maximize2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Input
                                                    type="text"
                                                    placeholder="Add description for accessibility..."
                                                    value={image.alt}
                                                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                                                    disabled={isSaving || isUploadingImages}
                                                    className="bg-gray-50 border-0 focus:bg-white text-sm"
                                                    aria-label={`Alternative text for image ${index + 1}`}
                                                />
                                                <div className="flex justify-end gap-1">
                                                    <a href={image.url} download={image.originalName || true} target="_blank" rel="noopener noreferrer" title="Download image">
                                                        <Button variant="outline" size="icon" className="h-7 w-7" disabled={isSaving || isUploadingImages}>
                                                            <Download className="w-3 h-3" />
                                                        </Button>
                                                    </a>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleRemoveImage(index)}
                                                        disabled={isSaving || isUploadingImages}
                                                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        title="Remove image"
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
                                    label="Upvotes"
                                    count={editableUpvotes}
                                    onIncrement={() => setEditableUpvotes(prev => prev + 1)}
                                    onDecrement={() => setEditableUpvotes(prev => Math.max(0, prev - 1))}
                                    disabled={isSaving || isUploadingImages}
                                />
                                <CounterInput
                                    label="Downvotes"
                                    count={editableDownvotes}
                                    onIncrement={() => setEditableDownvotes(prev => prev + 1)}
                                    onDecrement={() => setEditableDownvotes(prev => Math.max(0, prev - 1))}
                                    disabled={isSaving || isUploadingImages}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving || isUploadingImages}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isSaving || isUploadingImages}
                                    className="bg-gradient-to-r from-[var(--ruby-dust-500)] to-[var(--ruby-dust-700)] hover:from-[var(--ruby-dust-600)] hover:to-[var(--ruby-dust-800)] text-[var(--ruby-dust-text-on-primary)]"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {note ? 'Update Note' : 'Save Note'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Image Lightbox */}
            <ImageLightbox
                image={lightboxImage}
                isOpen={!!lightboxImage}
                onClose={() => setLightboxImage(null)}
            />
        </AnimatePresence>
    );
}
