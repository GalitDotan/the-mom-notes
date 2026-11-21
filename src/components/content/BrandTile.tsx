import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BrandTileProps = {
    /** Size, rotation and spacing; the colors come from the theme. */
    className?: string;
    children: ReactNode;
};

/** A decorative tile in the theme's primary color, holding an icon or initials. */
export function BrandTile({ className, children }: BrandTileProps) {
    return (
        <div
            className={cn("flex shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground", className)}
            aria-hidden="true"
        >
            {children}
        </div>
    );
}
