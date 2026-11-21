import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { NOTE_TAG_CATEGORY_CLASSES, NoteTagIcon } from "./NoteTagIcon";
import { DEFAULT_NOTE_TAG, NOTE_TAGS, findNoteTagBySymbol, type NoteTagEmoji, type NoteTagId } from "./note-tags";

type NoteTagPickerProps = {
    /** The note's stored symbol. */
    value: string;
    onChange: (symbol: NoteTagEmoji) => void;
    disabled?: boolean;
};

/**
 * Chooses a note's Mom Test tag. Options are a labelled grid with arrow-key
 * navigation; the popover closes as soon as a tag is chosen.
 */
export function NoteTagPicker({ value, onChange, disabled }: NoteTagPickerProps) {
    const [open, setOpen] = useState(false);
    const [highlighted, setHighlighted] = useState<NoteTagId | null>(null);
    const selected = findNoteTagBySymbol(value);
    const shown = selected ?? DEFAULT_NOTE_TAG;

    const handleValueChange = (id: string) => {
        // Radix allows deselecting the active item (""); a note always keeps a tag.
        const tag = NOTE_TAGS.find((candidate) => candidate.id === id);
        if (!tag) return;
        onChange(tag.emoji);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="h-auto gap-2.5 py-1.5 ps-1.5 pe-3"
                    aria-label={`Note tag: ${selected?.label ?? "Untagged"}. Change tag`}
                >
                    <NoteTagIcon tag={selected} symbol={value} size="md" decorative />
                    <span className="text-sm font-medium">{selected?.label ?? "Untagged"}</span>
                    <ChevronDown className="text-muted-foreground" aria-hidden />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-[22rem] p-2">
                <p className="px-2 pb-2 pt-1 text-[13px] font-medium text-muted-foreground" id="note-tag-picker-label">
                    What kind of insight is this?
                </p>
                <ToggleGroup.Root
                    type="single"
                    value={selected?.id ?? ""}
                    onValueChange={handleValueChange}
                    aria-labelledby="note-tag-picker-label"
                    className="grid grid-cols-3 gap-1"
                    onPointerLeave={() => setHighlighted(null)}
                >
                    {NOTE_TAGS.map((tag) => {
                        const isSelected = tag.id === shown.id && Boolean(selected);
                        return (
                            <ToggleGroup.Item
                                key={tag.id}
                                value={tag.id}
                                onPointerEnter={() => setHighlighted(tag.id)}
                                onFocus={() => setHighlighted(tag.id)}
                                onBlur={() => setHighlighted(null)}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 text-center text-xs font-medium text-foreground/80 transition-colors duration-150",
                                    "hover:bg-secondary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
                                    "motion-safe:active:scale-[0.97] motion-safe:transition-[background-color,transform]",
                                    isSelected && cn("bg-secondary text-foreground ring-1", NOTE_TAG_CATEGORY_CLASSES[tag.category].ring)
                                )}
                            >
                                <NoteTagIcon tag={tag} size="md" animate={highlighted === tag.id} decorative />
                                <span className="leading-tight">{tag.label}</span>
                                <span className="sr-only">: {tag.description}</span>
                            </ToggleGroup.Item>
                        );
                    })}
                </ToggleGroup.Root>
                {/* Always rendered (two lines reserved) so the popover never changes height on hover. */}
                <p className="min-h-[2.5rem] px-2 pb-1 pt-2 text-xs leading-snug text-muted-foreground" aria-hidden>
                    {(highlighted ? NOTE_TAGS.find((tag) => tag.id === highlighted) : selected)?.description}
                </p>
            </PopoverContent>
        </Popover>
    );
}
