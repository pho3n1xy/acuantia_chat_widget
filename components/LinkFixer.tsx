"use client";
import { useEffect } from "react";

export default function LinkFixer() {
    useEffect(() => {
        // 1. Force the base target natively just in case Next.js stripped it
        let base = document.querySelector('base');
        if (!base) {
            base = document.createElement('base');
            document.head.appendChild(base);
        }
        base.target = '_top';

        // 2. The Ironclad Capture-Phase Interceptor
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href && link.href.startsWith('http')) {
                e.preventDefault();
                e.stopPropagation(); // Stop Radix/React from seeing the click

                // 👇 THIS IS THE MAGIC LINE 👇
                // Opens the product in a new tab so the chat doesn't close!
                window.open(link.href, '_blank');
            }
        };

        // The 'true' argument intercepts the click BEFORE React gets it.
        document.addEventListener('click', handleGlobalClick, true);

        return () => {
            document.removeEventListener('click', handleGlobalClick, true);
        };
    }, []);

    return null; // This component is invisible
}