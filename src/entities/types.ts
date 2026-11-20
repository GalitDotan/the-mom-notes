/**
 * Shapes of the records the app stores in browser localStorage.
 *
 * They describe what the app writes. Reads are validated only structurally
 * (a list of records with string ids, see lib/localStorageStore), so data
 * written by older versions may lack fields: everything not needed to relate
 * records to each other is optional, and callers must not assume it exists.
 */
import type { EntityRecord } from '@/lib/localStorageStore';

/** An image attached to a note; `url` is a data: URL for locally stored images. */
export type NoteImage = {
    url: string;
    alt?: string;
    originalName?: string;
};

/** Research content shared by a note and each of its saved versions. */
export type NoteContentFields = {
    /** What was heard or observed, in Markdown. */
    content?: string;
    /** The note's Mom Test tag, stored as its emoji (see features/notes/note-tags). */
    symbol?: string;
    /** 1 (default) to 7. */
    importance?: number;
    /** Client/project tags. Older records may hold a single string. */
    client_reference?: string[] | string;
    upvote_count?: number;
    downvote_count?: number;
    references?: string[];
    topics?: string[];
    /** The researcher's own comments, kept separate from what the participant said. */
    internal_comments?: string;
    images?: NoteImage[];
};

export type DashboardRecord = EntityRecord & {
    name: string;
    owner_email: string;
};

export type NoteRecord = EntityRecord & NoteContentFields & {
    dashboard_id: string;
    /** The NoteVersion holding this note's latest saved state. */
    current_version_id?: string;
};

/** A saved snapshot of a note, for version history. */
export type NoteVersionRecord = EntityRecord & NoteContentFields & {
    note_id: string;
};

export type DashboardPermissionLevel = 'viewer' | 'editor';

export type DashboardShareRecord = EntityRecord & {
    dashboard_id: string;
    shared_with_email: string;
    permission_level: DashboardPermissionLevel;
};

/** A single note shared with someone by email. */
export type NoteShareRecord = EntityRecord & {
    note_id: string;
    shared_with_email: string;
};
