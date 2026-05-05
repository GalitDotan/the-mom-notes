import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TermsOfUse() {
    useEffect(() => {
        document.title = "Terms of Use - The Mom Notes";
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
                        <CardTitle className="text-3xl font-bold text-gray-900">Terms of Use</CardTitle>
                        <p className="text-gray-700">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none">
                        <div className="text-gray-800 space-y-6">
                            <p>
                                Welcome to The Mom Notes. By using this application, you agree to these Terms of Use. Please read them carefully.
                            </p>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
                                <p>
                                    By accessing and using The Mom Notes, you accept and agree to be bound by the terms and provision of this agreement.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h3>
                                <p>
                                    The Mom Notes is a free, non-commercial tool designed to help users organize research notes and customer insights using methodologies inspired by "The Mom Test" by Rob Fitzpatrick.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">3. User Account and Responsibilities</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>You must provide accurate and complete information when creating an account.</li>
                                    <li>You are responsible for maintaining the confidentiality of your account.</li>
                                    <li>You agree to use the service only for lawful purposes.</li>
                                    <li>You will not attempt to gain unauthorized access to the service or other user accounts.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">4. User Content</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>You retain ownership of any content you create or upload to the service.</li>
                                    <li>You grant us a limited license to store, display, and share your content as necessary to provide the service.</li>
                                    <li>You are responsible for ensuring your content does not infringe on third-party rights.</li>
                                    <li>We reserve the right to remove content that violates these terms.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h3>
                                <p>
                                    This application is inspired by "The Mom Test" by Rob Fitzpatrick. We acknowledge and respect the intellectual property rights of the original work. This tool is provided as a tribute and is not affiliated with or endorsed by Rob Fitzpatrick.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Disclaimer of Warranties</h3>
                                <p>
                                    The service is provided "as is" without any warranties, expressed or implied. We do not guarantee that the service will be error-free or uninterrupted.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
                                <p>
                                    In no event shall The Mom Notes or its creators be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Service Availability</h3>
                                <p>
                                    We strive to maintain high availability but do not guarantee continuous, uninterrupted access to the service. We may need to perform maintenance or updates that temporarily affect availability.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h3>
                                <p>
                                    We reserve the right to terminate or suspend access to the service at any time, without prior notice, for conduct that we believe violates these Terms of Use.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h3>
                                <p>
                                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of the modified terms.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Information</h3>
                                <p>
                                    If you have any questions about these Terms of Use, please contact us through the feedback mechanisms provided in the application.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}