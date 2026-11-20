import * as React from 'react';
import { useInView, type UseInViewOptions } from 'motion/react';

/**
 * Tracks whether an element is in the viewport, for animate-ui's `animateOnView`.
 * Recreated from the animate-ui hook that the copied icon library expects at
 * `@/hooks/use-is-in-view` (it was not included in the copy).
 */
interface UseIsInViewOptions {
    /** When false, the element is always treated as in view. */
    inView?: boolean;
    inViewOnce?: boolean;
    inViewMargin?: UseInViewOptions['margin'];
}

function useIsInView<T extends HTMLElement = HTMLElement>(
    ref: React.Ref<T>,
    options: UseIsInViewOptions = {},
) {
    const { inView, inViewOnce = false, inViewMargin = '0px' } = options;
    const localRef = React.useRef<T>(null);
    React.useImperativeHandle(ref, () => localRef.current as T);
    const inViewResult = useInView(localRef, {
        once: inViewOnce,
        margin: inViewMargin,
    });
    const isInView = !inView || inViewResult;
    return { ref: localRef, isInView };
}

export { useIsInView, type UseIsInViewOptions };
