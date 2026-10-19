"use client";

import { useEffect, useRef } from "react";

export function useDialogFocus(open: boolean, onClose?: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex="-1"])",
    ];
    const getFocusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelectors.join(","))
      ).filter((el) => !el.hasAttribute("aria-hidden"));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const focusable = getFocusable();
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 0);
    } else {
      dialog.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current) {
        try {
          triggerRef.current.focus();
        } catch {}
      }
    };
  }, [open, onClose]);

  return dialogRef;
}
