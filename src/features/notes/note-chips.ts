/**
 * Colors of a note's metadata chips. The note card, the editor, the tag
 * selector and the version history all use these, so a client, a topic or a
 * reference link looks the same wherever it appears, in every theme.
 */
export const NOTE_CHIP_CLASSES = {
    client: "bg-primary-tint text-primary-fg border-primary/40",
    topic: "bg-info-tint text-info-fg border-info/40",
    reference: "bg-muted text-primary-fg border-border",
} as const;

/** Hover for a chip that is also a button, e.g. one that filters by its client. */
export const NOTE_CHIP_HOVER_CLASSES = {
    client: "hover:bg-primary/20",
    topic: "hover:bg-info/20",
    reference: "hover:bg-accent",
} as const;
