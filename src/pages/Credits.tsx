import { CircleCheck } from "@/components/animate-ui/icons/circle-check";
import { Compass } from "@/components/animate-ui/icons/compass";
import { Lightbulb } from "@/components/animate-ui/icons/lightbulb";
import { BrandTile } from "@/components/content/BrandTile";
import { ContentPage, ContentSection } from "@/components/content/ContentPage";
import { ExternalLinkButton } from "@/components/content/ExternalLinkButton";
import { HighlightCard } from "@/components/content/HighlightCard";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Heart } from "lucide-react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

/**
 * The three Mom Test benefits, each with an icon that animates while hovered.
 * Their text is under credits.benefits.<id>.
 */
const METHOD_BENEFITS = [
    { id: "questions", Icon: CircleCheck, chip: "bg-tag-business/10 text-tag-business" },
    { id: "insights", Icon: Lightbulb, chip: "bg-accent text-primary-fg" },
    { id: "build", Icon: Compass, chip: "bg-tag-behavior/10 text-tag-behavior" },
] as const;

export default function Credits() {
    const { t } = useTranslation();

    return (
        <ContentPage
            documentTitle={t("documentTitles.credits")}
            icon={Heart}
            title={t("credits.title")}
            description={t("credits.description")}
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
                                    {t("credits.inspiration.title")}
                                </h2>
                                <p>
                                    <Trans
                                        i18nKey="credits.inspiration.credit"
                                        components={{ strong: <strong className="font-semibold text-foreground" />, em: <em /> }}
                                    />
                                </p>
                                <p>
                                    {t("credits.inspiration.recommendation")}
                                </p>
                                <div className="flex justify-center py-2">
                                    <ExternalLinkButton href="https://momtestbook.com" size="lg" className="w-full sm:w-auto">
                                        {t("credits.inspiration.bookLink")}
                                    </ExternalLinkButton>
                                </div>
                                <p className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm font-medium text-foreground">
                                    <Trans i18nKey="credits.inspiration.disclaimer" components={{ strong: <strong /> }} />
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
                            {t("credits.quote.text")}
                        </blockquote>
                        <figcaption className="font-medium text-primary-foreground/80">{t("credits.quote.attribution")}</figcaption>
                    </figure>
                </HighlightCard>
            </ContentSection>

            {/* Why This Matters */}
            <ContentSection>
                <Card>
                    <CardContent className="p-8">
                        <h2 className="text-xl font-bold text-foreground mb-4 text-center">
                            {t("credits.benefits.title")}
                        </h2>
                        <MethodBenefits />
                    </CardContent>
                </Card>
            </ContentSection>
        </ContentPage>
    );
}

function MethodBenefits() {
    const { t } = useTranslation();
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <div className="grid md:grid-cols-3 gap-6 text-center">
            {METHOD_BENEFITS.map(({ id, Icon, chip }) => (
                <div key={id} onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)}>
                    <div className={`size-12 rounded-full flex items-center justify-center mx-auto mb-3 ${chip}`} aria-hidden>
                        <Icon size={22} animate={hovered === id} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{t(`credits.benefits.${id}.title`)}</h3>
                    <p className="text-sm text-muted-foreground">{t(`credits.benefits.${id}.text`)}</p>
                </div>
            ))}
        </div>
    );
}
