/**
 * The Mom Test note tags: the single catalog every screen reads from.
 *
 * A note stores its tag as the `emoji` string in its `symbol` field. That stored
 * value is the tag's persisted identity and must not change without a data
 * migration; the UI shows each tag's animated icon instead of the emoji.
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
    { id: "emotional", label: "Emotional Responses", description: "How users feel about their current situation", Icon: Heart },
    { id: "problem", label: "Problems & Pain Points", description: "Challenges and obstacles users face", Icon: CircleX },
    { id: "outcome", label: "Goals & Outcomes", description: "What users want to achieve", Icon: Compass },
    { id: "behavior", label: "Current Behavior", description: "How users currently work around problems", Icon: RefreshCw },
    { id: "context", label: "Context & Environment", description: "Background information that influences decisions", Icon: Orbit },
    { id: "business", label: "Business Context", description: "Budget, purchasing, and business considerations", Icon: ChartLine },
    { id: "action", label: "Action Items", description: "Follow-up tasks and next steps", Icon: ClipboardCheck },
] as const satisfies ReadonlyArray<{ id: string; label: string; description: string; Icon: NoteTagIconComponent }>;

export type NoteTagCategory = (typeof NOTE_TAG_CATEGORIES)[number];
export type NoteTagCategoryId = NoteTagCategory["id"];

export const NOTE_TAGS = [
    {
        id: "excited",
        emoji: "🙂",
        label: "Excited",
        description: "Positive emotions or enthusiasm",
        category: "emotional",
        Icon: PartyPopper,
    },
    {
        id: "angry",
        emoji: "🙁",
        label: "Angry",
        description: "Frustration, complaints, or negative feelings",
        category: "emotional",
        Icon: CloudLightning,
    },
    {
        id: "embarrassed",
        emoji: "😳",
        label: "Embarrassed",
        description: "Awkwardness, discomfort, or uncertainty",
        category: "emotional",
        Icon: MessageCircleQuestion,
    },
    {
        id: "pain_problem",
        emoji: "💥",
        label: "Pain/Problem",
        description:
            "Critical insight: the core challenge or pain the user urgently needs solved",
        category: "problem",
        Icon: MessageSquareWarning,
    },
    {
        id: "goal",
        emoji: "🥅",
        label: "Goal",
        description: "What the user ultimately wants to achieve or accomplish",
        category: "outcome",
        Icon: MapPin,
    },
    {
        id: "obstacle",
        emoji: "🟥",
        label: "Obstacle",
        description: "Something blocking progress or creating friction",
        category: "problem",
        Icon: SquareX,
    },
    {
        id: "workaround",
        emoji: "↪️",
        label: "Workaround",
        description: "A clever or improvised solution the user employs",
        category: "behavior",
        Icon: Route,
    },
    {
        id: "context",
        emoji: "🏔",
        label: "Context",
        description: "Additional background details that shape the situation",
        category: "context",
        Icon: Layers,
    },
    {
        id: "feature_request",
        emoji: "☑️",
        label: "Feature Request",
        description: "A suggestion for new functionality or improvements",
        category: "outcome",
        Icon: MessageSquarePlus,
    },
    {
        id: "budget",
        emoji: "💲",
        label: "Budget",
        description: "Conversations about pricing, spending, or funding",
        category: "business",
        Icon: ChartColumnIncreasing,
    },
    {
        id: "person_company",
        emoji: "♀️",
        label: "Person/Company",
        description:
            "Mention of a specific individual, organization, competitor, collaborator, or key decision-maker",
        category: "context",
        Icon: Users,
    },
    {
        id: "follow_up",
        emoji: "⭐",
        label: "Follow-up",
        description: "Topics that require a future action or next step",
        category: "action",
        Icon: BellRing,
    },
] as const satisfies ReadonlyArray<{
    id: string;
    emoji: string;
    label: string;
    description: string;
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
