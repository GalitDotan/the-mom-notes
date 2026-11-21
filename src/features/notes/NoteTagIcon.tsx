import { cn } from "@/lib/utils";

import { findNoteTagBySymbol, type NoteTag, type NoteTagCategoryId } from "./note-tags";

/** Per-category classes, spelled out in full so Tailwind can find them. */
export const NOTE_TAG_CATEGORY_CLASSES: Record<NoteTagCategoryId, { text: string; tint: string; ring: string }> = {
    emotional: { text: "text-tag-emotional", tint: "bg-tag-emotional/10", ring: "ring-tag-emotional/50" },
    problem: { text: "text-tag-problem", tint: "bg-tag-problem/10", ring: "ring-tag-problem/50" },
    outcome: { text: "text-tag-outcome", tint: "bg-tag-outcome/10", ring: "ring-tag-outcome/50" },
    behavior: { text: "text-tag-behavior", tint: "bg-tag-behavior/10", ring: "ring-tag-behavior/50" },
    context: { text: "text-tag-context", tint: "bg-tag-context/10", ring: "ring-tag-context/50" },
    business: { text: "text-tag-business", tint: "bg-tag-business/10", ring: "ring-tag-business/50" },
    action: { text: "text-tag-action", tint: "bg-tag-action/10", ring: "ring-tag-action/50" },
};

const SIZES = {
    sm: { chip: "size-7 rounded-lg", icon: 15, fallback: "text-sm" },
    md: { chip: "size-9 rounded-[10px]", icon: 19, fallback: "text-lg" },
    lg: { chip: "size-12 rounded-xl", icon: 24, fallback: "text-2xl" },
} as const;

type NoteTagIconProps = {
    /** The tag to show; alternatively pass a note's stored `symbol`. */
    tag?: NoteTag;
    symbol?: unknown;
    size?: keyof typeof SIZES;
    /** Plays the icon's animation while true (e.g. while its card is hovered). */
    animate?: boolean;
    /** Hide from assistive technology when the tag's label is shown next to it. */
    decorative?: boolean;
    className?: string;
};

/** A note tag's animated icon on a chip tinted with its category color. */
export function NoteTagIcon({ tag, symbol, size = "md", animate = false, decorative = false, className }: NoteTagIconProps) {
    const resolved = tag ?? findNoteTagBySymbol(symbol);
    const dimensions = SIZES[size];
    const a11y = decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": resolved?.label ?? "Untagged note" };

    if (!resolved) {
        // A symbol outside the catalog: show what is stored rather than guessing a tag.
        const stored = typeof symbol === "string" && symbol.trim() ? symbol : "•";
        return (
            <span
                {...a11y}
                title={typeof symbol === "string" ? symbol : undefined}
                className={cn("inline-flex shrink-0 items-center justify-center bg-muted text-foreground", dimensions.chip, dimensions.fallback, className)}
            >
                {stored}
            </span>
        );
    }

    const { Icon } = resolved;
    const styles = NOTE_TAG_CATEGORY_CLASSES[resolved.category];

    return (
        <span
            {...a11y}
            className={cn("inline-flex shrink-0 items-center justify-center", dimensions.chip, styles.tint, styles.text, className)}
        >
            <Icon size={dimensions.icon} animate={animate} aria-hidden />
        </span>
    );
}
