import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NOTE_TAGS, type NoteTag, type NoteTagEmoji } from "../../features/notes/note-tags";

type EmojiPickerSize = "default" | "large";

type EmojiPickerProps = {
    selectedEmoji: NoteTagEmoji;
    onSelect: (emoji: NoteTagEmoji) => void;
    size?: EmojiPickerSize;
};

export default function EmojiPicker({
    selectedEmoji,
    onSelect,
    size = "default",
}: EmojiPickerProps) {
    const isLarge = size === "large";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        "border-2 transition-all duration-200 hover:border-primary focus-visible:ring-ring",
                        isLarge ? "size-16 text-2xl" : "size-12 text-xl"
                    )}
                >
                    {selectedEmoji}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4">
                <TooltipProvider delayDuration={200}>
                    <div className="space-y-3">
                        <div className="mb-3 text-sm font-medium text-foreground">
                            Choose an emoji for your note:
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {NOTE_TAGS.map((tag: NoteTag) => {
                                const isSelected = selectedEmoji === tag.emoji;

                                return (
                                    <Tooltip key={tag.id}>
                                        <TooltipTrigger asChild>
                                            <Button
                                                type="button"
                                                variant={isSelected ? "secondary" : "ghost"}
                                                className={cn(
                                                    "h-12 text-xl transition-all duration-200",
                                                    isSelected &&
                                                    "border-2 border-primary bg-secondary text-secondary-foreground",
                                                    !isSelected && "hover:bg-muted"
                                                )}
                                                onClick={() => onSelect(tag.emoji)}
                                            >
                                                {tag.emoji}
                                            </Button>
                                        </TooltipTrigger>

                                        <TooltipContent side="bottom" className="max-w-64 text-center">
                                            <p className="font-semibold">
                                                {tag.emoji} {tag.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {tag.description}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>

                        <div className="border-t border-border pt-2 text-xs text-muted-foreground">
                            Hover over emojis to see their meanings.
                        </div>
                    </div>
                </TooltipProvider>
            </PopoverContent>
        </Popover>
    );
}
