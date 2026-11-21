/**
 * The Mom Test note tags: the single catalog every screen reads from.
 *
 * A note stores its tag as the `emoji` string in its `symbol` field. That stored
 * value is the tag's persisted identity and must not change without a data
 * migration; the UI shows each tag's animated icon instead of the emoji.
 *
 * Names and descriptions are translations under `noteTags`, keyed by id (see
 * the *Key helpers below).
 */
import type { ComponentType } from "react";

import { BellRing } from "@/components/animate-ui/icons/bell-ring";
import { ChartColumnIncreasing } from "@/components/animate-ui/icons/chart-column-increasing";
import { ChartLine } from "@/components/animate-ui/icons/chart-line";
import { CircleX } from "@/components/animate-ui/icons/circle-x";
import { ClipboardCheck } from "@/components/animate-ui/icons/clipboard-check";
import { CloudLightning } from "@/components/animate-ui/icons/cloud-lightning";
import { Compass } from "@/components/animate-ui/icons/compass";
import { Heart } from "@/components/animate-ui/icons/heart";
import { Layers } from "@/components/animate-ui/icons/layers";
import { Orbit } from "@/components/animate-ui/icons/orbit";
import { RefreshCw } from "@/components/animate-ui/icons/refresh-cw";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { MessageCircleQuestion } from "@/components/animate-ui/icons/message-circle-question";
import { MessageSquarePlus } from "@/components/animate-ui/icons/message-square-plus";
import { MessageSquareWarning } from "@/components/animate-ui/icons/message-square-warning";
import { PartyPopper } from "@/components/animate-ui/icons/party-popper";
import { Route } from "@/components/animate-ui/icons/route";
import { SquareX } from "@/components/animate-ui/icons/square-x";
import { Users } from "@/components/animate-ui/icons/users";

/** The props the app passes to a tag icon; every animate-ui icon accepts them. */
export type NoteTagIconProps = {
    size?: number;
    className?: string;
    /** Plays the icon's default animation while true. */
    animate?: boolean;
    "aria-hidden"?: boolean;
};

export type NoteTagIconComponent = ComponentType<NoteTagIconProps>;

export const NOTE_TAG_CATEGORIES = [
    { id: "emotional", Icon: Heart },
    { id: "problem", Icon: CircleX },
    { id: "outcome", Icon: Compass },
    { id: "behavior", Icon: RefreshCw },
    { id: "context", Icon: Orbit },
    { id: "business", Icon: ChartLine },
    { id: "action", Icon: ClipboardCheck },
] as const satisfies ReadonlyArray<{ id: string; Icon: NoteTagIconComponent }>;

export type NoteTagCategory = (typeof NOTE_TAG_CATEGORIES)[number];
export type NoteTagCategoryId = NoteTagCategory["id"];

export const NOTE_TAGS = [
    {
        id: "excited",
        emoji: "🙂",
        category: "emotional",
        Icon: PartyPopper,
    },
    {
        id: "angry",
        emoji: "🙁",
        category: "emotional",
        Icon: CloudLightning,
    },
    {
        id: "embarrassed",
        emoji: "😳",
        category: "emotional",
        Icon: MessageCircleQuestion,
    },
    {
        id: "pain_problem",
        emoji: "💥",
        category: "problem",
        Icon: MessageSquareWarning,
    },
    {
        id: "goal",
        emoji: "🥅",
        category: "outcome",
        Icon: MapPin,
    },
    {
        id: "obstacle",
        emoji: "🟥",
        category: "problem",
        Icon: SquareX,
    },
    {
        id: "workaround",
        emoji: "↪️",
        category: "behavior",
        Icon: Route,
    },
    {
        id: "context",
        emoji: "🏔",
        category: "context",
        Icon: Layers,
    },
    {
        id: "feature_request",
        emoji: "☑️",
        category: "outcome",
        Icon: MessageSquarePlus,
    },
    {
        id: "budget",
        emoji: "💲",
        category: "business",
        Icon: ChartColumnIncreasing,
    },
    {
        id: "person_company",
        emoji: "♀️",
        category: "context",
        Icon: Users,
    },
    {
        id: "follow_up",
        emoji: "⭐",
        category: "action",
        Icon: BellRing,
    },
] as const satisfies ReadonlyArray<{
    id: string;
    emoji: string;
    category: NoteTagCategoryId;
    Icon: NoteTagIconComponent;
}>;

export type NoteTag = (typeof NOTE_TAGS)[number];
export type NoteTagId = NoteTag["id"];
export type NoteTagEmoji = NoteTag["emoji"];

export const NOTE_TAG_BY_ID = Object.fromEntries(
    NOTE_TAGS.map((tag) => [tag.id, tag])
) as Record<NoteTagId, NoteTag>;

/** Tag new notes start with. Kept as before: Excited. */
export const DEFAULT_NOTE_TAG: NoteTag = NOTE_TAG_BY_ID.excited;

/**
 * Emoji can be stored with or without the U+FE0F variation selector
 * (e.g. "🏔" vs "🏔️", "↪" vs "↪️"), depending on the keyboard or app that
 * produced them. Matching ignores it so such notes still resolve to their tag.
 */
const normalizeSymbol = (symbol: string) => symbol.replace(/️/g, "").trim();

const TAG_BY_NORMALIZED_EMOJI = new Map<string, NoteTag>(
    NOTE_TAGS.map((tag) => [normalizeSymbol(tag.emoji), tag])
);

/** The tag a stored note symbol refers to, or undefined for an unknown symbol. */
export const findNoteTagBySymbol = (symbol: unknown): NoteTag | undefined =>
    typeof symbol === "string" ? TAG_BY_NORMALIZED_EMOJI.get(normalizeSymbol(symbol)) : undefined;

/** Whether a stored note symbol refers to the given tag. */
export const noteHasTag = (symbol: unknown, tagId: NoteTagId) => findNoteTagBySymbol(symbol)?.id === tagId;

export const tagsInCategory = (categoryId: NoteTagCategoryId) =>
    NOTE_TAGS.filter((tag) => tag.category === categoryId);

/** Translation keys of a tag's name and of what it marks. */
export const noteTagLabelKey = (tagId: NoteTagId) => `noteTags.tags.${tagId}.label` as const;
export const noteTagDescriptionKey = (tagId: NoteTagId) => `noteTags.tags.${tagId}.description` as const;

/** Translation keys of a category's name and of what its tags cover. */
export const noteTagCategoryLabelKey = (categoryId: NoteTagCategoryId) => `noteTags.categories.${categoryId}.label` as const;
export const noteTagCategoryDescriptionKey = (categoryId: NoteTagCategoryId) => `noteTags.categories.${categoryId}.description` as const;
