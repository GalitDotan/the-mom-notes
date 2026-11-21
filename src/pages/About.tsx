import { BrandTile } from "@/components/content/BrandTile";
import { ContentPage, ContentSection } from "@/components/content/ContentPage";
import { ExternalLinkButton } from "@/components/content/ExternalLinkButton";
import { HighlightCard } from "@/components/content/HighlightCard";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, User } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();

    return (
        <ContentPage
            documentTitle={t("documentTitles.about")}
            icon={User}
            title={t("about.title")}
            description={t("about.description")}
        >
            {/* Creator Profile */}
            <ContentSection>
                <Card>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <BrandTile className="size-32 rounded-3xl">
                                <span className="text-4xl font-bold">{t("about.creator.initials")}</span>
                            </BrandTile>
                            <div className="flex-1 text-center md:text-start">
                                <h2 className="text-3xl font-bold text-foreground mb-4">
                                    {t("about.creator.name")}
                                </h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    <Trans
                                        i18nKey="about.creator.biography"
                                        components={{ strong: <strong className="font-semibold text-foreground" /> }}
                                    />
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </ContentSection>

            {/* Connect Section */}
            <ContentSection>
                <Card>
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                            {t("about.connect.title")}
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ExternalLinkButton
                                href="https://www.linkedin.com/in/galit-dotan-337589204/"
                                icon={Linkedin}
                                className="w-full sm:w-auto"
                            >
                                {t("about.connect.linkedIn")}
                            </ExternalLinkButton>
                            <ExternalLinkButton
                                href="https://github.com/GalitDotan"
                                icon={Github}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                {t("about.connect.gitHub")}
                            </ExternalLinkButton>
                        </div>
                    </CardContent>
                </Card>
            </ContentSection>

            {/* Mission Statement */}
            <ContentSection>
                <HighlightCard>
                    <h2 className="text-2xl font-semibold mb-4">{t("about.mission.title")}</h2>
                    <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
                        {t("about.mission.text")}
                    </p>
                </HighlightCard>
            </ContentSection>
        </ContentPage>
    );
}
