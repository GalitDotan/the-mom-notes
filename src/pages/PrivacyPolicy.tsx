import { LegalDocumentPage, LegalSection } from "@/components/documents/LegalDocumentPage";
import { pageTitle, productName } from "@/lib/constants";

export default function PrivacyPolicy() {
    return (
        <LegalDocumentPage documentTitle={pageTitle.privacy} title="Privacy Policy">
            <p>
                Welcome to {productName}. This Privacy Policy explains how we collect, use, and protect your information. Your privacy is important to us.
            </p>

            <LegalSection title="1. Information We Collect">
                <ul>
                    <li><strong>Account Information:</strong> When you sign in using Google Authentication, we receive your name and email address from Google to create and manage your account. We do not collect or store your password.</li>
                    <li><strong>User-Generated Content:</strong> We store the notes, dashboards, and related content you create within the application. This includes text, tags, and other data you input.</li>
                </ul>
            </LegalSection>

            <LegalSection title="2. How We Use Your Information">
                <ul>
                    <li><strong>To Provide the Service:</strong> Your information is used to operate, maintain, and provide you with the features and functionality of {productName}.</li>
                    <li><strong>Authentication:</strong> Your email is used to securely identify you and grant you access to your content.</li>
                    <li><strong>Communication:</strong> We may use your email to send you important service-related notices, but we will never send you marketing emails.</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Data Storage and Security">
                <ul>
                    <li><strong>Data Storage:</strong> All your data, including account information and user-generated content, is securely stored on cloud infrastructure.</li>
                    <li><strong>Data Residency:</strong> Our cloud provider may store data in various locations globally. We rely on their security and compliance programs to protect your data.</li>
                    <li><strong>Security Measures:</strong> We implement reasonable security measures to protect your data from unauthorized access, alteration, or destruction. However, no internet-based service is 100% secure.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Data Sharing and Disclosure">
                <ul>
                    <li><strong>No Commercial Use:</strong> We will never sell, rent, or share your personal information or user-generated content with third parties for marketing or commercial purposes.</li>
                    <li><strong>Collaboration Features:</strong> If you use features to share dashboards with other users, the email addresses you invite and the associated content will be accessible to those users based on the permissions you set.</li>
                    <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Data Retention">
                <p>
                    We retain your personal data and content as long as your account is active. You can request the deletion of your account and all associated data by contacting us.
                </p>
            </LegalSection>

            <LegalSection title="6. Your Rights">
                <p>
                    You have the right to access, update, or delete your information at any time by logging into your account or contacting us for assistance.
                </p>
            </LegalSection>

            <LegalSection title="7. Changes to This Policy">
                <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
            </LegalSection>
        </LegalDocumentPage>
    );
}