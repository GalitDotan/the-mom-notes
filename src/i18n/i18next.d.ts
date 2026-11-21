import "i18next";

import type { en } from "./locales/en";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "translation";
        /** English is the source: every key, and the {{variables}} each one needs. */
        resources: { translation: typeof en };
        /** A `t()` call must pass every {{variable}} its text uses... */
        strictInterpolationChecks: true;
        /** ...except these, which i18n.ts fills in everywhere. */
        defaultVariables: { productName: string };
    }
}
