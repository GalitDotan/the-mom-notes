import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { pageTitle, productName } from "@/lib/constants";

export default function PrivacyPolicy() {
    useEffect(() => {
        document.title = pageTitle.privacy;
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900">Privacy Policy</CardTitle>
                    <p className="text-gray-700">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                    <div className="text-gray-800 space-y-6">
                        <p>
                            Welcome to {productName}. This Privacy Policy explains how we collect, use, and protect your information. Your privacy is important to us.
                        </p>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Account Information:</strong> When you sign in using Google Authentication, we receive your name and email address from Google to create and manage your account. We do not collect or store your password.</li>
                                <li><strong>User-Generated Content:</strong> We store the notes, dashboards, and related content you create within the application. This includes text, tags, and other data you input.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>To Provide the Service:</strong> Your information is used to operate, maintain, and provide you with the features and functionality of {productName}.</li>
                                <li><strong>Authentication:</strong> Your email is used to securely identify you and grant you access to your content.</li>
                                <li><strong>Communication:</strong> We may use your email to send you important service-related notices, but we will never send you marketing emails.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage and Security</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Data Storage:</strong> All your data, including account information and user-generated content, is securely stored on cloud infrastructure.</li>
                                <li><strong>Data Residency:</strong> Our cloud provider may store data in various locations globally. We rely on their security and compliance programs to protect your data.</li>
                                <li><strong>Security Measures:</strong> We implement reasonable security measures to protect your data from unauthorized access, alteration, or destruction. However, no internet-based service is 100% secure.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Disclosure</h3>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>No Commercial Use:</strong> We will never sell, rent, or share your personal information or user-generated content with third parties for marketing or commercial purposes.</li>
                                <li><strong>Collaboration Features:</strong> If you use features to share dashboards with other users, the email addresses you invite and the associated content will be accessible to those users based on the permissions you set.</li>
                                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to comply with a legal obligation.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h3>
                            <p>
                                We retain your personal data and content as long as your account is active. You can request the deletion of your account and all associated data by contacting us.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h3>
                            <p>
                                You have the right to access, update, or delete your information at any time by logging into your account or contacting us for assistance.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Changes to This Policy</h3>
                            <p>
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}