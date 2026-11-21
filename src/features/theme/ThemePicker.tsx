import { Palette } from 'lucide-react';
import { useTheme } from './theme-context';
import { THEMES, type ThemeId } from './themes';

/** Lets the user choose one of the app themes. The choice applies at once and is saved. */
export function ThemePicker() {
    const { theme, setTheme } = useTheme();

    return (
        <fieldset>
            <legend className="flex items-center gap-2 font-medium mb-3">
                <Palette className="w-5 h-5" aria-hidden="true" /> Theme
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map((option) => (
                    <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:bg-muted has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
                    >
                        <input
                            type="radio"
                            name="theme"
                            value={option.id}
                            checked={theme.id === option.id}
                            onChange={() => setTheme(option.id)}
                            className="sr-only"
                        />
                        <ThemeSwatch themeId={option.id} />
                        <span className="min-w-0 text-sm">
                            <span className="block font-medium text-foreground">{option.name}</span>
                            <span className="block text-xs text-muted-foreground">{option.description}</span>
                        </span>
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

/**
 * A preview of a theme in its own colors: its background with its primary and
 * secondary colors. data-theme makes that theme's --theme-* palette (from
 * themes.css) available on this element without changing the page's theme.
 */
function ThemeSwatch({ themeId }: { themeId: ThemeId }) {
    return (
        <span
            data-theme={themeId}
            className="flex size-9 shrink-0 items-center justify-center gap-1 rounded-md border border-border bg-(--theme-background)"
            aria-hidden="true"
        >
            <span className="size-2.5 rounded-full bg-(--theme-primary)" />
            <span className="size-2.5 rounded-full bg-(--theme-secondary)" />
        </span>
    );
}
