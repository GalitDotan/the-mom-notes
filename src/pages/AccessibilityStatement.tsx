import { LegalDocumentPage, LegalSection } from "@/components/documents/LegalDocumentPage";
import { pageTitle, productName } from "@/lib/constants";

export default function AccessibilityStatement() {
    return (
        <LegalDocumentPage documentTitle={pageTitle.accessibility} title="Accessibility Statement">
            <p>
                {productName} is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>

            <LegalSection title="1. Conformance Status">
                <p>
                    We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These guidelines explain how to make web content accessible to people with a wide array of disabilities.
                </p>
            </LegalSection>

            <LegalSection title="2. Accessibility Features">
                <ul>
                    <li><strong>Keyboard Navigation:</strong> The application is designed to be navigable using a keyboard.</li>
                    <li><strong>ARIA Attributes:</strong> We use Accessible Rich Internet Applications (ARIA) attributes to improve the accessibility of dynamic content.</li>
                    <li><strong>Customization:</strong> We provide user-controlled settings for font size and high-contrast mode to improve readability.</li>
                    <li><strong>Focus Management:</strong> Clear focus indicators help users understand where they are on the page.</li>
                    <li><strong>Color Contrast:</strong> We maintain appropriate color contrast ratios, especially in high-contrast mode.</li>
                    <li><strong>Responsive Design:</strong> The application works across different screen sizes and devices.</li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Supported Technologies">
                <p>
                    {productName} is designed to work with the following assistive technologies:
                </p>
                <ul>
                    <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
                    <li>Keyboard navigation</li>
                    <li>Voice recognition software</li>
                    <li>Screen magnification software</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Known Limitations">
                <p>
                    Despite our efforts, some limitations may exist:
                </p>
                <ul>
                    <li>Some complex interactive elements may require additional navigation steps.</li>
                    <li>File uploads and exports may require manual intervention for some assistive technologies.</li>
                    <li>Dynamic content updates may not always be immediately announced by screen readers.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Feedback and Contact Information">
                <p>
                    We welcome your feedback on the accessibility of {productName}. If you encounter accessibility barriers or have suggestions for improvement, please let us know through the feedback mechanisms in the application.
                </p>
            </LegalSection>

            <LegalSection title="6. Ongoing Efforts">
                <p>
                    We are committed to continuing our accessibility improvements. This includes:
                </p>
                <ul>
                    <li>Regular accessibility audits and testing</li>
                    <li>Training our development team on accessibility best practices</li>
                    <li>Incorporating accessibility considerations into our design and development process</li>
                    <li>Staying current with accessibility standards and guidelines</li>
                </ul>
            </LegalSection>

            <LegalSection title="7. Assessment Approach">
                <p>
                    Our accessibility assessment was conducted using a combination of automated testing tools and manual testing, including:
                </p>
                <ul>
                    <li>Keyboard navigation testing</li>
                    <li>Screen reader testing</li>
                    <li>Color contrast analysis</li>
                    <li>Focus management evaluation</li>
                </ul>
            </LegalSection>
        </LegalDocumentPage>
    );
}