import { LegalDocumentPage } from "@/components/documents/LegalDocumentPage";
import { useTranslation } from "react-i18next";

export default function AccessibilityStatement() {
    const { t } = useTranslation();

    return <LegalDocumentPage documentTitle={t("documentTitles.accessibility")} documentId="accessibilityStatement" />;
}