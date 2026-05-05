import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AccessibilityStatement() {
  useEffect(() => {
    document.title = "Accessibility Statement - The Mom Notes";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to={createPageUrl("DashboardsPage")}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </Link>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900">Accessibility Statement</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div className="space-y-6">
              <p>
                The Mom Notes is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Conformance Status</h3>
                <p>
                  We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level. These guidelines explain how to make web content accessible to people with a wide array of disabilities.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Accessibility Features</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Keyboard Navigation:</strong> The application is designed to be navigable using a keyboard.</li>
                  <li><strong>ARIA Attributes:</strong> We use Accessible Rich Internet Applications (ARIA) attributes to improve the accessibility of dynamic content.</li>
                  <li><strong>Customization:</strong> We provide user-controlled settings for font size and high-contrast mode to improve readability.</li>
                  <li><strong>Focus Management:</strong> Clear focus indicators help users understand where they are on the page.</li>
                  <li><strong>Color Contrast:</strong> We maintain appropriate color contrast ratios, especially in high-contrast mode.</li>
                  <li><strong>Responsive Design:</strong> The application works across different screen sizes and devices.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Supported Technologies</h3>
                <p>
                  The Mom Notes is designed to work with the following assistive technologies:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
                  <li>Keyboard navigation</li>
                  <li>Voice recognition software</li>
                  <li>Screen magnification software</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Known Limitations</h3>
                <p>
                  Despite our efforts, some limitations may exist:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Some complex interactive elements may require additional navigation steps.</li>
                  <li>File uploads and exports may require manual intervention for some assistive technologies.</li>
                  <li>Dynamic content updates may not always be immediately announced by screen readers.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Feedback and Contact Information</h3>
                <p>
                  We welcome your feedback on the accessibility of The Mom Notes. If you encounter accessibility barriers or have suggestions for improvement, please let us know through the feedback mechanisms in the application.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Ongoing Efforts</h3>
                <p>
                  We are committed to continuing our accessibility improvements. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Regular accessibility audits and testing</li>
                  <li>Training our development team on accessibility best practices</li>
                  <li>Incorporating accessibility considerations into our design and development process</li>
                  <li>Staying current with accessibility standards and guidelines</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Assessment Approach</h3>
                <p>
                  Our accessibility assessment was conducted using a combination of automated testing tools and manual testing, including:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Keyboard navigation testing</li>
                  <li>Screen reader testing</li>
                  <li>Color contrast analysis</li>
                  <li>Focus management evaluation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}