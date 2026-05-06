import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { LegalDocument } from "./documentTypes";

type LegalDocumentPageProps = {
    document: LegalDocument;
    backTo: string;
    backLabel?: string;
};

export function LegalDocumentPage({
    document,
    backTo,
    backLabel = "Back",
}: LegalDocumentPageProps) {
    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <Button asChild variant="ghost" className="mb-8">
                    <Link to={backTo}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {backLabel}
                    </Link>
                </Button>

                <Card className="bg-white">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            {document.title}
                        </CardTitle>

                        <p className="text-sm text-gray-600">
                            Last updated: {document.lastUpdated}
                        </p>
                    </CardHeader>

                    <CardContent>
                        <article className="prose prose-lg max-w-none text-gray-800">
                            {document.intro && <p>{document.intro}</p>}

                            {document.sections.map((section, sectionIndex) => (
                                <section key={section.title} className="mt-8">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {sectionIndex + 1}. {section.title}
                                    </h2>

                                    <div className="mt-3 space-y-4">
                                        {section.blocks.map((block, blockIndex) => {
                                            if (block.type === "paragraph") {
                                                return <p key={blockIndex}>{block.text}</p>;
                                            }

                                            if (block.type === "list") {
                                                return (
                                                    <ul
                                                        key={blockIndex}
                                                        className="list-disc space-y-2 pl-6"
                                                    >
                                                        {block.items.map((item) => (
                                                            <li key={item}>{item}</li>
                                                        ))}
                                                    </ul>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>
                                </section>
                            ))}
                        </article>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
