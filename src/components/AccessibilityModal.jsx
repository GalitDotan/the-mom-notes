import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Zap, ZoomIn, ZoomOut, Keyboard } from "lucide-react";

export default function AccessibilityModal({
  isOpen,
  onClose,
  fontSize,
  setFontSize,
  isHighContrast,
  setIsHighContrast,
}) {
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
            Accessibility Settings
          </DialogTitle>
          <DialogDescription id="accessibility-description">
            Adjust the appearance of the application to suit your needs. Your
            settings will be saved for your next visit.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex-grow overflow-y-auto -mx-6 px-6 py-4 space-y-6"
          role="main"
        >
          <div className="space-y-3">
            <Label
              htmlFor="font-size-slider"
              className="flex items-center gap-2 font-medium"
            >
              <ZoomIn className="w-5 h-5" aria-hidden="true" /> Font Size
            </Label>

            <div className="flex items-center gap-4">
              <ZoomOut className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <Slider
                id="font-size-slider"
                min={80}
                max={200}
                step={10}
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
                aria-label={`Font size: ${fontSize} percent`}
                className="flex-1"
              />
              <ZoomIn className="w-6 h-6 text-gray-500" aria-hidden="true" />
            </div>

            <p
              className="text-center text-sm text-gray-600"
              aria-live="polite"
            >
              Current size: {fontSize}%
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
            <div className="space-y-0.5">
              <Label
                htmlFor="high-contrast-switch"
                className="flex items-center gap-2 font-medium"
              >
                <Zap className="w-5 h-5" aria-hidden="true" /> High Contrast Mode
              </Label>
              <p className="text-xs text-gray-500">
                Increases text visibility for better readability.
              </p>
            </div>
            <Switch
              id="high-contrast-switch"
              checked={isHighContrast}
              onCheckedChange={setIsHighContrast}
              aria-label={`High contrast mode: ${
                isHighContrast ? "enabled" : "disabled"
              }`}
              aria-describedby="high-contrast-description"
            />
          </div>

          <div id="high-contrast-description" className="sr-only">
            {isHighContrast
              ? "High contrast mode is currently enabled. This uses black backgrounds and white text for better visibility."
              : "High contrast mode is currently disabled. Enable this for better text visibility."}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Keyboard className="w-5 h-5" aria-hidden="true" /> Keyboard
              Shortcuts
            </h4>
            <ul
              className="text-sm list-disc list-inside space-y-1 text-gray-600"
              role="list"
            >
              <li>
                <span className="font-semibold">Tab</span>: Move to the next
                interactive element.
              </li>
              <li>
                <span className="font-semibold">Shift + Tab</span>: Move to the
                previous element.
              </li>
              <li>
                <span className="font-semibold">Enter</span> or{" "}
                <span className="font-semibold">Space</span>: Activate buttons
                and controls.
              </li>
              <li>
                <span className="font-semibold">Escape</span>: Close dialogs and
                modals.
              </li>
              <li>
                In Note Editor:{" "}
                <span className="font-semibold">Ctrl/Cmd + Enter</span> to save
                quickly.
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-auto pt-4 border-t flex-shrink-0">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={onClose}
              aria-label="Close accessibility settings"
            >
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}