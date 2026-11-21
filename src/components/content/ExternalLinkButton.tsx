import { Button } from "@/components/ui/button";
import { screenReaderText } from "@/lib/constants";
import { ExternalLink, type LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type ExternalLinkButtonProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "className"> & {
    href: string;
    /** Shown before the label. */
    icon?: LucideIcon;
    children: ReactNode;
};

/**
 * A link to another site, styled as a button and opened in a new tab. It is a
 * real link (not a button inside a link), and tells screen readers about the
 * new tab.
 */
export function ExternalLinkButton({ href, icon: Icon, children, ...buttonProps }: ExternalLinkButtonProps) {
    return (
        <Button asChild {...buttonProps}>
            <a href={href} target="_blank" rel="noopener noreferrer">
                {Icon && <Icon aria-hidden="true" />}
                {children}
                <ExternalLink aria-hidden="true" />
                <span className="sr-only"> {screenReaderText.opensInNewTab}</span>
            </a>
        </Button>
    );
}
