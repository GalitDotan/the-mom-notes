import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import type { ReactNode } from "react";

type LegalDocumentPageProps = {
    /** The browser tab title. */
    documentTitle: string;
    title: string;
    /** An introduction followed by LegalSections. */
    children: ReactNode;
};

/**
 * A legal document page (Privacy Policy, Terms of Use, Accessibility
 * Statement). Each page keeps its own text; this owns the layout.
 */
export function LegalDocumentPage({ documentTitle, title, children }: LegalDocumentPageProps) {
    usePageTitle(documentTitle);

    // TODO: "Last updated" shows today's date on every visit. Each document
    // should carry the date its text last changed instead.
    const lastUpdated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </CardHeader>
                <CardContent className="prose max-w-none">
                    <div className="space-y-6">{children}</div>
                </CardContent>
            </Card>
        </div>
    );
}

/** A numbered section of a LegalDocumentPage. */
export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {children}
        </section>
    );
}
