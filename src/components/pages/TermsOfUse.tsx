// src/pages/TermsOfUse.tsx

import { useEffect } from "react";
import { LegalDocumentPage } from "@/components/documents/LegalDocumentPage";
import { termsOfUse } from "@/content/termsOfUse";
import { productName } from "@/lib/constants";
import { createPageUrl } from "@/utils";

export default function TermsOfUse() {
    useEffect(() => {
        document.title = `${termsOfUse.title} - ${productName}`;
    }, []);

    return (
        <LegalDocumentPage
            document={termsOfUse}
            backTo={createPageUrl("DashboardsPage")}
            backLabel="Back to App"
        />
    );
}
