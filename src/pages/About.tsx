import { BrandTile } from "@/components/content/BrandTile";
import { ContentPage, ContentSection } from "@/components/content/ContentPage";
import { ExternalLinkButton } from "@/components/content/ExternalLinkButton";
import { HighlightCard } from "@/components/content/HighlightCard";
import { Card, CardContent } from "@/components/ui/card";
import { pageTitle, productName } from "@/lib/constants";
import { Github, Linkedin, User } from "lucide-react";

export default function About() {
    return (
        <ContentPage
            documentTitle={pageTitle.about}
            icon={User}
            title="About The Creator"
            description={`Meet the person behind ${productName}`}
        >
            {/* Creator Profile */}
            <ContentSection>
                <Card>
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <BrandTile className="size-32 rounded-3xl">
                                <span className="text-4xl font-bold">GD</span>
                            </BrandTile>
                            <div className="flex-1 text-center md:text-start">
                                <h2 className="text-3xl font-bold text-foreground mb-4">
                                    Galit Dotan
                                </h2>
                                <p className="leading-relaxed text-muted-foreground">
                                    This project was created by <strong className="font-semibold text-foreground">Galit Dotan</strong>, an entrepreneur
                                    consistent in building thoughtful, user-centered products. Galit has
                                    experience in innovation, product development, and leveraging customer
                                    insights to drive meaningful solutions.
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
                            Connect with Galit
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ExternalLinkButton
                                href="https://www.linkedin.com/in/galit-dotan-337589204/"
                                icon={Linkedin}
                                className="w-full sm:w-auto"
                            >
                                LinkedIn Profile
                            </ExternalLinkButton>
                            <ExternalLinkButton
                                href="https://github.com/GalitDotan"
                                icon={Github}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                GitHub Profile
                            </ExternalLinkButton>
                        </div>
                    </CardContent>
                </Card>
            </ContentSection>

            {/* Mission Statement */}
            <ContentSection>
                <HighlightCard>
                    <h2 className="text-2xl font-semibold mb-4">Project Mission</h2>
                    <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
                        {productName} was created to help entrepreneurs, product managers, and researchers
                        systematically capture and organize customer insights using Rob Fitzpatrick's proven
                        methodology. By making good customer development practices more accessible, we hope
                        to help more people build products that truly matter.
                    </p>
                </HighlightCard>
            </ContentSection>
        </ContentPage>
    );
}
