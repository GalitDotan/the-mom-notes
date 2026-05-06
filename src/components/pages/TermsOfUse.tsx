// src/pages/TermsOfUse.tsx

import { useEffect } from "react";
import { LegalDocumentPage } from "@/components/documents/LegalDocumentPage";
import { termsOfUse } from "@/content/termsOfUse";
import { createPageUrl } from "@/utils";

export default function TermsOfUse() {
    useEffect(() => {
        document.title = `${termsOfUse.title} - The Mom Notes`;
    }, []);

    return (
        <LegalDocumentPage
            document={termsOfUse}
            backTo={createPageUrl("DashboardsPage")}
            backLabel="Back to App"
        />
    );
}
