export const NOTE_TAGS = [
    {
        id: "excited",
        emoji: "🙂",
        label: "Excited",
        description: "Positive emotions or enthusiasm",
    },
    {
        id: "angry",
        emoji: "🙁",
        label: "Angry",
        description: "Frustration, complaints, or negative feelings",
    },
    {
        id: "embarrassed",
        emoji: "😳",
        label: "Embarrassed",
        description: "Awkwardness, discomfort, or uncertainty",
    },
    {
        id: "pain_problem",
        emoji: "💥",
        label: "Pain/Problem",
        description:
            "Critical insight: the core challenge or pain the user urgently needs solved",
    },
    {
        id: "goal",
        emoji: "🥅",
        label: "Goal",
        description: "What the user ultimately wants to achieve or accomplish",
    },
    {
        id: "obstacle",
        emoji: "🟥",
        label: "Obstacle",
        description: "Something blocking progress or creating friction",
    },
    {
        id: "workaround",
        emoji: "↪️",
        label: "Workaround",
        description: "A clever or improvised solution the user employs",
    },
    {
        id: "context",
        emoji: "🏔",
        label: "Context",
        description: "Additional background details that shape the situation",
    },
    {
        id: "feature_request",
        emoji: "☑️",
        label: "Feature Request",
        description: "A suggestion for new functionality or improvements",
    },
    {
        id: "budget",
        emoji: "💲",
        label: "Budget",
        description: "Conversations about pricing, spending, or funding",
    },
    {
        id: "person_company",
        emoji: "♀️",
        label: "Person/Company",
        description:
            "Mention of a specific individual, organization, competitor, collaborator, or key decision-maker",
    },
    {
        id: "follow_up",
        emoji: "⭐",
        label: "Follow-up",
        description: "Topics that require a future action or next step",
    },
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];
export type NoteTagId = NoteTag["id"];
export type NoteTagEmoji = NoteTag["emoji"];

export const NOTE_TAG_BY_ID = Object.fromEntries(
    NOTE_TAGS.map((tag) => [tag.id, tag])
) as Record<NoteTagId, NoteTag>;

export const NOTE_TAG_BY_EMOJI = Object.fromEntries(
    NOTE_TAGS.map((tag) => [tag.emoji, tag])
) as Record<NoteTagEmoji, NoteTag>;
