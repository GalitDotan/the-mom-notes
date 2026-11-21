import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

/** A card filled with the theme's primary color, for a page's one standout message. */
export function HighlightCard({ children }: { children: ReactNode }) {
    return (
        <Card className="border-0 bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">{children}</CardContent>
        </Card>
    );
}
