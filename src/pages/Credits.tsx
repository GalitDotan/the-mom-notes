import { CircleCheck } from "@/components/animate-ui/icons/circle-check";
import { Compass } from "@/components/animate-ui/icons/compass";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { BrandTile } from "@/components/content/BrandTile";
import { ContentPage, ContentSection } from "@/components/content/ContentPage";
import { ExternalLinkButton } from "@/components/content/ExternalLinkButton";
import { HighlightCard } from "@/components/content/HighlightCard";
import { Card, CardContent } from "@/components/ui/card";
import { pageTitle } from "@/lib/constants";
import { BookOpen, Heart } from "lucide-react";
import { useState } from "react";

/** The three Mom Test benefits, each with an icon that animates while hovered. */
const METHOD_BENEFITS = [
    { id: "questions", title: "Better Questions", text: "Learn to ask questions that reveal actual behavior, not just opinions", Icon: CircleCheck, chip: "bg-tag-business/10 text-tag-business" },
    { id: "insights", title: "Real Insights", text: "Discover what customers actually do, not what they say they'll do", Icon: Lightbulb, chip: "bg-accent text-primary" },
    { id: "build", title: "Build Better", text: "Create products people actually want by understanding real problems", Icon: Compass, chip: "bg-tag-behavior/10 text-tag-behavior" },
] as const;

export default function Credits() {
    return (
        <ContentPage
            documentTitle={pageTitle.credits}
            icon={Heart}
            title="Credits & Attribution"
            description="This app stands on the shoulders of giants"
        >
            {/* Rob Fitzpatrick Credit */}
            <ContentSection>
                <Card>
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-start">
                            <BrandTile className="size-20">
                                <BookOpen className="size-10" />
                            </BrandTile>
                            <div className="flex-1 space-y-4 leading-relaxed text-muted-foreground">
                                <h2 className="text-2xl font-bold text-foreground">
                                    Inspired by "The Mom Test"
                                </h2>
                                <p>
                                    This app is inspired by and gives full credit to <strong className="font-semibold text-foreground">Rob Fitzpatrick</strong>,
                                    author of <em>The Mom Test</em> — a must-read book for anyone doing customer development,
                                    product interviews, or startup validation.
                                </p>
                                <p>
                                    We highly recommend you buy the book and support Rob's work:
                                </p>
                                <div className="flex justify-center py-2">
                                    <ExternalLinkButton href="https://momtestbook.com" size="lg" className="w-full sm:w-auto">
                                        Get The Mom Test Book
                                    </ExternalLinkButton>
                                </div>
                                <p className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm font-medium text-foreground">
                                    <strong>Important:</strong> This project is not affiliated with, endorsed by,
                                    or officially connected to Rob Fitzpatrick or The Mom Test. It's simply a
                                    tribute tool for those who want to apply the lessons in their own workflows.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ContentSection>

            {/* Quote from The Mom Test */}
            <ContentSection>
                <HighlightCard>
                    <figure>
                        <blockquote className="text-xl italic mb-4 leading-relaxed">
                            "The Mom Test is a set of simple rules for crafting good questions that
                            even your mom can't lie to you about."
                        </blockquote>
                        <figcaption className="font-medium text-primary-foreground/80">— Rob Fitzpatrick</figcaption>
                    </figure>
                </HighlightCard>
            </ContentSection>

            {/* Why This Matters */}
            <ContentSection>
                <Card>
                    <CardContent className="p-8">
                        <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                            Why The Mom Test Methodology Matters
                        </h2>
                        <MethodBenefits />
                    </CardContent>
                </Card>
            </ContentSection>
        </ContentPage>
    );
}

function MethodBenefits() {
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="grid md:grid-cols-3 gap-6 text-center">
            {METHOD_BENEFITS.map(({ id, title, text, Icon, chip }) => (
                <div key={id} onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)}>
                    <div className={`size-12 rounded-full flex items-center justify-center mx-auto mb-3 ${chip}`} aria-hidden>
                        <Icon size={22} animate={hovered === id} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground">{text}</p>
                </div>
            ))}
        </div>
    );
}
