import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { NOTE_TAG_CATEGORY_CLASSES, NoteTagIcon } from "@/features/notes/NoteTagIcon";
import { NOTE_TAG_CATEGORIES, tagsInCategory, type NoteTagCategoryId, type NoteTagId } from "@/features/notes/note-tags";
import { productName, routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const QUICK_TIPS = [
    "Use tags to quickly categorize insights during interviews",
    "One note can contain multiple insights - group related quotes together",
    "Focus on exact user quotes rather than your interpretations",
    "Review and tag notes immediately after interviews while memory is fresh",
];

/** Explains the Mom Test tag system. Everything shown comes from the tag catalog. */
export default function Guide() {
    const location = useLocation();
    const categoryRefs = useRef<Partial<Record<NoteTagCategoryId, HTMLElement | null>>>({});
    const [hoveredTag, setHoveredTag] = useState<NoteTagId | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<NoteTagCategoryId | null>(null);

    useEffect(() => {
        document.title = `Guide - ${productName}`;

        // Check if there's a category hash in the URL and scroll to it
        const hash = location.hash.replace('#', '') as NoteTagCategoryId;
        const target = categoryRefs.current[hash];
        if (hash && target) {
            const timer = setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location.hash]);

    const scrollToCategory = (categoryId: NoteTagCategoryId) => {
        const target = categoryRefs.current[categoryId];
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without triggering navigation
        window.history.replaceState(null, '', `${location.pathname}#${categoryId}`);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="text-center mb-10">
                <h1 className="text-4xl sm:text-[44px] leading-[1.05] font-semibold text-foreground mb-4">
                    How tagging works
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Twelve tags, grouped in seven categories, help you capture and organize what you
                    learn from user interviews, customer feedback, and research sessions.
                </p>
            </header>

            <Card className="p-5 sm:p-6 mb-10">
                <div className="flex items-start gap-4">
                    <div className="size-11 shrink-0 rounded-xl bg-accent text-primary flex items-center justify-center" aria-hidden>
                        <Lightbulb size={22} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-foreground mb-2">Quick tips</h2>
                        <ul className="text-muted-foreground space-y-1.5 text-[15px] list-disc ps-5 marker:text-border">
                            {QUICK_TIPS.map((tip) => <li key={tip}>{tip}</li>)}
                        </ul>
                    </div>
                </div>
            </Card>

            <section aria-labelledby="categories-overview" className="mb-14">
                <h2 id="categories-overview" className="text-2xl font-semibold text-foreground mb-5">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {NOTE_TAG_CATEGORIES.map((category) => {
                        const tags = tagsInCategory(category.id);
                        const styles = NOTE_TAG_CATEGORY_CLASSES[category.id];
                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => scrollToCategory(category.id)}
                                onPointerEnter={() => setHoveredCategory(category.id)}
                                onPointerLeave={() => setHoveredCategory(null)}
                                onFocus={() => setHoveredCategory(category.id)}
                                onBlur={() => setHoveredCategory(null)}
                                className="group text-start rounded-2xl border border-border/70 bg-card p-4 shadow-card transition-[box-shadow,transform] duration-200 hover:shadow-card-hover motion-safe:active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                aria-label={`${category.label}: ${tags.length} ${tags.length === 1 ? "tag" : "tags"}. Jump to section`}
                            >
                                <div className="flex items-center gap-2.5 mb-2">
                                    <span className={cn("size-8 rounded-lg inline-flex items-center justify-center", styles.tint, styles.text)} aria-hidden>
                                        <category.Icon size={17} animate={hoveredCategory === category.id} />
                                    </span>
                                    <h3 className="font-semibold text-foreground">{category.label}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                                <div className="flex items-center gap-1.5" aria-hidden>
                                    {tags.map((tag) => <NoteTagIcon key={tag.id} tag={tag} size="sm" decorative />)}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <div className="space-y-12">
                {NOTE_TAG_CATEGORIES.map((category) => {
                    const styles = NOTE_TAG_CATEGORY_CLASSES[category.id];
                    return (
                        <section
                            key={category.id}
                            ref={(element) => { categoryRefs.current[category.id] = element; }}
                            id={category.id}
                            className="scroll-mt-24"
                            aria-labelledby={`category-${category.id}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className={cn("size-9 rounded-xl inline-flex items-center justify-center", styles.tint, styles.text)} aria-hidden>
                                    <category.Icon size={19} />
                                </span>
                                <h2 id={`category-${category.id}`} className="text-xl font-semibold text-foreground">{category.label}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tagsInCategory(category.id).map((tag) => (
                                    <Card
                                        key={tag.id}
                                        className="p-5 transition-shadow duration-200 hover:shadow-card-hover"
                                        onPointerEnter={() => setHoveredTag(tag.id)}
                                        onPointerLeave={() => setHoveredTag(null)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <NoteTagIcon tag={tag} size="lg" animate={hoveredTag === tag.id} decorative />
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-foreground leading-tight">{tag.label}</h3>
                                                <p className="text-muted-foreground mt-1.5 leading-relaxed">{tag.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            <div className="mt-16 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground">
                <h2 className="text-2xl font-semibold mb-3">Ready to start taking notes?</h2>
                <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                    Now that you know the tags, start capturing insights from your user research and interviews.
                </p>
                <Button asChild variant="secondary" size="lg" className="bg-card text-primary hover:bg-card/90">
                    <Link to={routes.dashboards}>
                        Start taking notes
                        <ArrowRight className="rtl:rotate-180" aria-hidden />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
