import type { Transition, Variants } from 'motion/react';

/**
 * Shared springs. A spring with `bounce: 0` is critically damped (no
 * overshoot); `duration` is its perceptual response time, not a fixed length.
 * Bounce is reserved for motion the user threw (a flick or drag release), so
 * none of the presets below overshoot.
 *
 * Reduced motion is handled globally: App wraps everything in
 * `<MotionConfig reducedMotion="user">`, which turns transform and layout
 * animation off for people who ask for it while keeping opacity fades.
 */

/** Default for things moving into place: page entrance, cards, lists. */
export const SPRING_SMOOTH: Transition = { type: 'spring', bounce: 0, duration: 0.4 };

/** Small, quick UI responses: selection indicators, menus, sheets. */
export const SPRING_SNAPPY: Transition = { type: 'spring', bounce: 0, duration: 0.3 };

/** Entrance for a page or large surface: a short fade with a slight rise. */
export const ENTER_FROM_BELOW = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: SPRING_SMOOTH,
} as const;

/**
 * A page's sections entering one after another, each with ENTER_FROM_BELOW's
 * rise. `container` goes on the parent and `item` on each section; both must
 * be motion components (see ContentPage).
 */
export const STAGGERED_ENTRANCE = {
    container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
    item: {
        hidden: ENTER_FROM_BELOW.initial,
        visible: { ...ENTER_FROM_BELOW.animate, transition: SPRING_SMOOTH },
    },
} satisfies Record<'container' | 'item', Variants>;

/** Item in an animated list: grows in place and fades, leaves the same way. */
export const LIST_ITEM_MOTION = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: SPRING_SMOOTH,
} as const;
