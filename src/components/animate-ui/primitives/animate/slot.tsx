'use client';

/**
 * Adapted from Saga's animate-ui `Slot` (src/components copy/animate-ui/primitives/animate/slot.tsx)
 * for React 18, which this app uses:
 * - React 18 strips `ref` from props, so the slot uses `forwardRef` and reads the
 *   child's ref from the element rather than from `props.ref`.
 * - Refs are only attached to children that can hold one (DOM elements, forwardRef
 *   and motion components). Plain function components, such as an animated icon's
 *   inner SVG component, get the merged props without a ref instead of a React
 *   "Function components cannot be given refs" warning.
 *
 * Consequence: an animate-ui icon's `animateOnView` cannot see its element under
 * React 18 and never fires. Drive the icon's `animate` prop from state instead
 * (hover, focus, selection), as the app does.
 */

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  'ref'
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  children?: React.ReactNode;
} & Omit<DOMMotionProps<T>, 'children'>;

const FORWARD_REF_TYPE = Symbol.for('react.forward_ref');

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps(childProps: AnyProps, slotProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(
      childProps.className as string,
      slotProps.className as string,
    );
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

const canHoldRef = (type: unknown) =>
  typeof type === 'string' ||
  (typeof type === 'object' &&
    type !== null &&
    ((type as { $$typeof?: symbol }).$$typeof === FORWARD_REF_TYPE ||
      isMotionComponent(type as React.ElementType)));

const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...props },
  ref,
) {
  const childType = React.isValidElement(children) ? children.type : null;
  const isAlreadyMotion =
    typeof childType === 'object' &&
    childType !== null &&
    isMotionComponent(childType as React.ElementType);

  // DOM children are promoted to motion components so motion props passed to
  // the slot take effect; other components already handle their own motion.
  const Base = React.useMemo(
    () =>
      typeof childType === 'string' && !isAlreadyMotion
        ? motion.create(childType)
        : (childType as React.ElementType | null),
    [childType, isAlreadyMotion],
  );

  if (!React.isValidElement(children) || !Base) return null;

  const childRef = (children as React.ReactElement & { ref?: React.Ref<HTMLElement> }).ref;
  const mergedProps = mergeProps(children.props as AnyProps, props as AnyProps);

  return canHoldRef(childType) ? (
    <Base {...mergedProps} ref={mergeRefs(childRef, ref)} />
  ) : (
    <Base {...mergedProps} />
  );
});

export {
  Slot,
  type SlotProps,
  type WithAsChild,
  type DOMMotionProps,
  type AnyProps,
};
