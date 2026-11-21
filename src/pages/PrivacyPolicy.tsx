import { LegalDocumentPage } from "@/components/documents/LegalDocumentPage";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return <LegalDocumentPage documentTitle={t("documentTitles.privacy")} documentId="privacyPolicy" />;
}