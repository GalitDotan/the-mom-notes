import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NOTE_CHIP_CLASSES, NOTE_CHIP_HOVER_CLASSES } from "@/features/notes/note-chips";
import { Label } from "@/components/ui/label";
import { X, Plus, Users, Check } from "lucide-react"; // Added DefaultTagIcon
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TagSelectorProps = {
    /** Which note chips these are, for their colors; other tags get neutral chips. */
    kind?: "client" | "topic";
    label?: string;
    selectedTags?: string[];
    availableTags?: string[];
    onTagsChange: (tags: string[]) => void;
    disabled?: boolean;
    placeholder?: string;
    infoText?: string;
    icon?: React.ReactElement<{ className?: string }>;
};

export default function TagSelector({
    kind,
    label, // Added default label
    selectedTags = [],
    availableTags = [],
    onTagsChange,
    disabled = false,
    placeholder,
    infoText = "", // Added infoText prop
    icon // Added icon prop
}: TagSelectorProps) {
    const { t } = useTranslation();
    const shownLabel = label ?? t("tagSelector.defaultLabel");
    const shownPlaceholder = placeholder ?? t("tagSelector.defaultPlaceholder");
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filteredAvailable, setFilteredAvailable] = useState(availableTags);
    const inputRef = useRef(null);

    const TagIconComponent = icon || <Users className="w-4 h-4 text-muted-foreground" />; // Use Users icon if no specific icon provided

    useEffect(() => {
        const lowerInputValue = inputValue.toLowerCase();
        const filtered = availableTags.filter(tag =>
            tag.toLowerCase().includes(lowerInputValue) &&
            !selectedTags.some(selectedTag => selectedTag.toLowerCase() === tag.toLowerCase())
        );
        setFilteredAvailable(filtered);
    }, [inputValue, availableTags, selectedTags]);

    const handleAddTag = (tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !selectedTags.some(selectedTag => selectedTag.toLowerCase() === trimmedTag.toLowerCase())) {
            onTagsChange([...selectedTags, trimmedTag]);
        }
        setInputValue(""); // Clear input after adding or attempting to add
        if (inputRef.current) inputRef.current.focus(); // Keep focus on input
    };

    const handleRemoveTag = (tagToRemove) => {
        onTagsChange(selectedTags.filter(tag => tag.toLowerCase() !== tagToRemove.toLowerCase()));
    };

    const handleCreateNew = () => {
        if (inputValue.trim()) {
            handleAddTag(inputValue.trim());
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                handleCreateNew();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const currentBadgeStyle = kind
        ? { base: NOTE_CHIP_CLASSES[kind], hover: NOTE_CHIP_HOVER_CLASSES[kind] }
        : { base: "bg-muted text-foreground border-border", hover: "hover:bg-accent" }; // Default

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    {React.cloneElement(TagIconComponent, { className: "w-4 h-4 text-muted-foreground" })}
                    {shownLabel}
                </Label>
                {infoText && <span className="text-xs text-muted-foreground">{infoText}</span>}
            </div>

            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className={`${currentBadgeStyle.base} flex items-center gap-1 cursor-default`}
                        >
                            {tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className={`ml-1 ${currentBadgeStyle.hover} rounded-full p-0.5 transition-colors`}
                                    aria-label={t("tagSelector.remove", { tag })}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </Badge>
                    ))}
                </div>
            )}

            {!disabled && (
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-muted border-0 focus:bg-card hover:bg-accent"
                            disabled={disabled}
                            onClick={() => {
                                setIsOpen(true);
                                setTimeout(() => inputRef.current?.focus(), 0);
                            }}
                        >
                            <Plus className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span className={selectedTags.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                                {selectedTags.length > 0 ? t("tagSelector.addMore") : shownPlaceholder}
                            </span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 shadow-lg" align="start">
                        <div className="space-y-2">
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t("tagSelector.searchPlaceholder")}
                                className="w-full h-9 text-sm"
                            />

                            {inputValue.trim() &&
                                !availableTags.some(at => at.toLowerCase() === inputValue.trim().toLowerCase()) &&
                                !selectedTags.some(st => st.toLowerCase() === inputValue.trim().toLowerCase()) && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleCreateNew}
                                        className="w-full h-8 text-sm justify-start text-primary-fg hover:text-primary-fg hover:bg-primary-tint"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-2" />
                                        {t("tagSelector.createNew", { tag: inputValue.trim() })}
                                    </Button>
                                )}

                            {filteredAvailable.length > 0 && (
                                <div className="space-y-0.5">
                                    {/* <div className="text-xs font-medium text-muted-foreground px-2 pt-1">Available tags</div> */}
                                    <div className="max-h-32 overflow-y-auto">
                                        {filteredAvailable.map((tag) => (
                                            <Button
                                                key={tag}
                                                variant="ghost"
                                                onClick={() => handleAddTag(tag)}
                                                className="w-full h-8 text-sm justify-start text-left font-normal text-foreground hover:bg-accent"
                                            >
                                                <Check className="w-3.5 h-3.5 mr-2 opacity-0" /> {/* Keep for alignment */}
                                                {tag}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredAvailable.length === 0 &&
                                (!inputValue.trim() ||
                                    (inputValue.trim() && availableTags.some(at => at.toLowerCase() === inputValue.trim().toLowerCase())) ||
                                    (inputValue.trim() && selectedTags.some(st => st.toLowerCase() === inputValue.trim().toLowerCase()))
                                ) && (
                                    <div className="text-center text-muted-foreground text-xs py-2">
                                        {availableTags.length === 0 && !inputValue.trim() ? t("tagSelector.noExistingTags") : t("tagSelector.noMatches")}
                                    </div>
                                )}
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}