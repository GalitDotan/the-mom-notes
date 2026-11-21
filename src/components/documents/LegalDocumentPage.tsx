import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import { useDateFormatter } from "@/i18n/useDateFormatter";
import { useTranslation } from "react-i18next";

/** The legal documents; each one's text is under `legal.<id>` in the translations. */
export type LegalDocumentId = "privacyPolicy" | "termsOfUse" | "accessibilityStatement";

type LegalDocumentPageProps = {
    /** The browser tab title. */
    documentTitle: string;
    documentId: LegalDocumentId;
};

/**
 * A legal document page (Privacy Policy, Terms of Use, Accessibility
 * Statement). The text, including how it splits into sections, comes from the
 * translations; this owns the layout.
 */
export function LegalDocumentPage({ documentTitle, documentId }: LegalDocumentPageProps) {
    const { t } = useTranslation();
    const { formatDate } = useDateFormatter();
    usePageTitle(documentTitle);

    const legalDocument = t(`legal.${documentId}`, { returnObjects: true });

    // TODO: "Last updated" shows today's date on every visit. Each document
    // should carry the date its text last changed instead.
    const lastUpdated = formatDate(new Date(), "longDate");

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold text-foreground">{legalDocument.title}</h1>
                    <p className="text-muted-foreground">{t("legal.lastUpdated", { date: lastUpdated })}</p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <div className="space-y-6">
                        <p>{legalDocument.introduction}</p>
                        {legalDocument.sections.map((section) => (
                            <LegalSection key={section.title} section={section} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/** A list item: plain text, or a term in bold followed by its text. */
type LegalItem = string | { readonly term: string; readonly text: string };

type LegalSectionContent = {
    readonly title: string;
    readonly paragraphs?: readonly string[];
    readonly items?: readonly LegalItem[];
};

/** A numbered section: its paragraphs, then its items as a list. */
function LegalSection({ section }: { section: LegalSectionContent }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && (
                <ul>
                    {section.items.map((item) =>
                        typeof item === "string" ? (
                            <li key={item}>{item}</li>
                        ) : (
                            <li key={item.term}><strong>{item.term}</strong> {item.text}</li>
                        )
                    )}
                </ul>
            )}
        </section>
    );
}
