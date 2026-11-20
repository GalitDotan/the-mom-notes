import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type OnlineStatusBadgeProps = {
    isOnline: boolean;
};

export function OnlineStatusBadge({ isOnline }: OnlineStatusBadgeProps) {
    return (
        <Badge variant={isOnline ? "secondary" : "outline"} className="gap-2">
            {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
            <span className="hidden sm:inline">
                {isOnline ? "Online" : "Offline"}
            </span>
        </Badge>
    );
}
