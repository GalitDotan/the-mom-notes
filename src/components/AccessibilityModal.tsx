import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ThemePicker } from "@/features/theme/ThemePicker";
import { accessibilitySettings } from "@/lib/constants";
import { Keyboard, Zap, ZoomIn, ZoomOut } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

/** The shortcuts listed, in order; each is a key under appearanceSettings.keyboardShortcuts. */
const KEYBOARD_SHORTCUTS = ["nextElement", "previousElement", "activate", "closeDialogs", "quickSave"] as const;

export default function AccessibilityModal({
    isOpen,
    onClose,
    fontSize,
    setFontSize,
    isHighContrast,
    setIsHighContrast,
}) {
    const { t } = useTranslation();

    const handleFontSizeChange = (value) => {
        setFontSize(value[0]);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[480px] flex flex-col max-h-[90vh]"
                onKeyDown={handleKeyDown}
                role="dialog"
                aria-labelledby="accessibility-title"
                aria-describedby="accessibility-description"
            >
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle id="accessibility-title">
                        {t("appearanceSettings.title")}
                    </DialogTitle>
                    <DialogDescription id="accessibility-description">
                        {t("appearanceSettings.description")}
                    </DialogDescription>
                </DialogHeader>

                <div
                    className="flex-grow overflow-y-auto -mx-6 px-6 py-4 space-y-6"
                    role="main"
                >
                    <ThemePicker />

                    <div className="space-y-3">
                        <Label
                            htmlFor="font-size-slider"
                            className="flex items-center gap-2 font-medium"
                        >
                            <ZoomIn className="w-5 h-5" aria-hidden="true" /> {t("appearanceSettings.fontSize.label")}
                        </Label>

                        <div className="flex items-center gap-4">
                            <ZoomOut className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                            <Slider
                                id="font-size-slider"
                                min={accessibilitySettings.fontSizePercent.min}
                                max={accessibilitySettings.fontSizePercent.max}
                                step={accessibilitySettings.fontSizePercent.step}
                                value={[fontSize]}
                                onValueChange={handleFontSizeChange}
                                aria-label={t("appearanceSettings.fontSize.sliderLabel", { percent: fontSize })}
                                className="flex-1"
                            />
                            <ZoomIn className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
                        </div>

                        <p
                            className="text-center text-sm text-muted-foreground"
                            aria-live="polite"
                        >
                            {t("appearanceSettings.fontSize.current", { percent: fontSize })}
                        </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs bg-card">
                        <div className="space-y-0.5">
                            <Label
                                htmlFor="high-contrast-switch"
                                className="flex items-center gap-2 font-medium"
                            >
                                <Zap className="w-5 h-5" aria-hidden="true" /> {t("appearanceSettings.highContrast.label")}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                {t("appearanceSettings.highContrast.hint")}
                            </p>
                        </div>
                        <Switch
                            id="high-contrast-switch"
                            checked={isHighContrast}
                            onCheckedChange={setIsHighContrast}
                            aria-label={isHighContrast
                                ? t("appearanceSettings.highContrast.switchLabelEnabled")
                                : t("appearanceSettings.highContrast.switchLabelDisabled")}
                            aria-describedby="high-contrast-description"
                        />
                    </div>

                    <div id="high-contrast-description" className="sr-only">
                        {isHighContrast
                            ? t("appearanceSettings.highContrast.enabledDescription")
                            : t("appearanceSettings.highContrast.disabledDescription")}
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                            <Keyboard className="w-5 h-5" aria-hidden="true" /> {t("appearanceSettings.keyboardShortcuts.title")}
                        </h4>
                        <ul
                            className="text-sm list-disc list-inside space-y-1 text-muted-foreground"
                            role="list"
                        >
                            {KEYBOARD_SHORTCUTS.map((shortcut) => (
                                <li key={shortcut}>
                                    <Trans
                                        i18nKey={`appearanceSettings.keyboardShortcuts.${shortcut}`}
                                        components={{ key: <span className="font-semibold" /> }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <DialogFooter className="mt-auto pt-4 border-t flex-shrink-0">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            onClick={onClose}
                            aria-label={t("appearanceSettings.closeLabel")}
                        >
                            {t("appearanceSettings.done")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}