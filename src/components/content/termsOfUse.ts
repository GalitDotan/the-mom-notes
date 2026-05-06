// src/content/termsOfUse.ts

import type { LegalDocument } from "@/components/documents/documentTypes";

export const termsOfUse: LegalDocument = {
    title: "Terms of Use",
    lastUpdated: "May 5, 2026",
    intro:
        "Welcome to The Mom Notes. By using this application, you agree to these Terms of Use. Please read them carefully.",
    sections: [
        {
            title: "Acceptance of Terms",
            blocks: [
                {
                    type: "paragraph",
                    text: "By accessing and using The Mom Notes, you accept and agree to be bound by the terms and provisions of this agreement.",
                },
            ],
        },
        {
            title: "Description of Service",
            blocks: [
                {
                    type: "paragraph",
                    text: 'The Mom Notes is a free, non-commercial tool designed to help users organize research notes and customer insights using methodologies inspired by "The Mom Test" by Rob Fitzpatrick.',
                },
            ],
        },
        {
            title: "User Account and Responsibilities",
            blocks: [
                {
                    type: "list",
                    items: [
                        "You must provide accurate and complete information when creating an account.",
                        "You are responsible for maintaining the confidentiality of your account.",
                        "You agree to use the service only for lawful purposes.",
                        "You will not attempt to gain unauthorized access to the service or other user accounts.",
                    ],
                },
            ],
        },
    ],
};
