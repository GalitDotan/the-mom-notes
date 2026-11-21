import { LegalDocumentPage, LegalSection } from "@/components/documents/LegalDocumentPage";
import { pageTitle, productName } from "@/lib/constants";

export default function TermsOfUse() {
    return (
        <LegalDocumentPage documentTitle={pageTitle.terms} title="Terms of Use">
            <p>
                Welcome to {productName}. By using this application, you agree to these Terms of Use. Please read them carefully.
            </p>

            <LegalSection title="1. Acceptance of Terms">
                <p>
                    By accessing and using {productName}, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
            </LegalSection>

            <LegalSection title="2. Description of Service">
                <p>
                    {productName} is a free, non-commercial tool designed to help users organize research notes and customer insights using methodologies inspired by "The Mom Test" by Rob Fitzpatrick.
                </p>
            </LegalSection>

            <LegalSection title="3. User Account and Responsibilities">
                <ul>
                    <li>You must provide accurate and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your account.</li>
                    <li>You agree to use the service only for lawful purposes.</li>
                    <li>You will not attempt to gain unauthorized access to the service or other user accounts.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. User Content">
                <ul>
                    <li>You retain ownership of any content you create or upload to the service.</li>
                    <li>You grant us a limited license to store, display, and share your content as necessary to provide the service.</li>
                    <li>You are responsible for ensuring your content does not infringe on third-party rights.</li>
                    <li>We reserve the right to remove content that violates these terms.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Intellectual Property">
                <p>
                    This application is inspired by "The Mom Test" by Rob Fitzpatrick. We acknowledge and respect the intellectual property rights of the original work. This tool is provided as a tribute and is not affiliated with or endorsed by Rob Fitzpatrick.
                </p>
            </LegalSection>

            <LegalSection title="6. Disclaimer of Warranties">
                <p>
                    The service is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.
                </p>
            </LegalSection>

            <LegalSection title="7. Limitation of Liability">
                <p>
                    In no event shall {productName} or its creators be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
                </p>
            </LegalSection>

            <LegalSection title="8. Service Availability">
                <p>
                    We strive to maintain high availability but do not guarantee continuous, uninterrupted access to the service. We may need to perform maintenance or updates that temporarily affect availability.
                </p>
            </LegalSection>

            <LegalSection title="9. Termination">
                <p>
                    We reserve the right to terminate or suspend access to the service at any time, without prior notice, for conduct that we believe violates these Terms of Use.
                </p>
            </LegalSection>

            <LegalSection title="10. Changes to Terms">
                <p>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the modified terms.
                </p>
            </LegalSection>

            <LegalSection title="11. Contact Information">
                <p>
                    If you have any questions about these Terms of Use, please contact us through the feedback mechanisms provided in the application.
                </p>
            </LegalSection>
        </LegalDocumentPage>
    );
}