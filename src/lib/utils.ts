import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges CSS class names.
 *
 * Accepts strings, arrays, objects, and conditional values using `clsx`,
 * then resolves conflicting Tailwind CSS classes using `tailwind-merge`.
 *
 * @example
 * cn("p-4", isActive && "bg-blue-500", className)
 * // → "p-4 bg-blue-500 ..."
 *
 * @example
 * cn("p-2", "p-4")
 * // → "p-4"
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
