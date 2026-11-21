import { BrandTile } from "@/components/content/BrandTile";
import { usePageTitle } from "@/hooks/use-page-title";
import { STAGGERED_ENTRANCE } from "@/lib/motion";
import type { LucideIcon } from "lucide-react";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type ContentPageProps = {
    /** The browser tab title. */
    documentTitle: string;
    icon: LucideIcon;
    title: string;
    description: ReactNode;
    /** The page's ContentSections, shown below the hero. */
    children: ReactNode;
};

/**
 * An informational page such as About or Credits: a hero, then sections that
 * enter one after another.
 */
export function ContentPage({ documentTitle, icon: Icon, title, description, children }: ContentPageProps) {
    usePageTitle(documentTitle);

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8"
            variants={STAGGERED_ENTRANCE.container}
            initial="hidden"
            animate="visible"
        >
            <motion.header variants={STAGGERED_ENTRANCE.item} className="text-center pb-4">
                <BrandTile className="size-24 rounded-3xl rotate-12 mx-auto mb-8">
                    <Icon className="size-12" />
                </BrandTile>
                <h1 className="text-4xl font-bold text-foreground mb-6">{title}</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{description}</p>
            </motion.header>
            {children}
        </motion.div>
    );
}

/** A section of a ContentPage. Use it as a direct child so it joins the staggered entrance. */
export function ContentSection(props: Omit<HTMLMotionProps<"section">, "variants">) {
    return <motion.section variants={STAGGERED_ENTRANCE.item} {...props} />;
}
