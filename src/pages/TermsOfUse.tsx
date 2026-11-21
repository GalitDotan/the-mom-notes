import { LegalDocumentPage } from "@/components/documents/LegalDocumentPage";
import { useTranslation } from "react-i18next";

export default function TermsOfUse() {
    const { t } = useTranslation();

    return <LegalDocumentPage documentTitle={t("documentTitles.terms")} documentId="termsOfUse" />;
}