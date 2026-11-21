"use client";
import { useTheme } from "@/features/theme/theme-context"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"
import { Toaster as Sonner } from "sonner"

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({
  ...props
}: ToasterProps) => {
  // Sonner only knows light and dark; it follows the app theme's appearance.
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    (<Sonner
      theme={theme.appearance}
      className="toaster group"
      containerAriaLabel={t("ui.toaster.notifications")}
      toastOptions={{
        closeButtonAriaLabel: t("ui.toaster.closeToast"),
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} />)
  );
}

export { Toaster }
