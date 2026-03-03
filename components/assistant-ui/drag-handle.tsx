"use client";

import { useRef } from "react";

interface DragHandleProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * DragHandle fires a TANKBOT_DRAG_START signal to the Magento parent window.
 * Magento's embed script then handles ALL coordinate tracking and container movement
 * directly, because once iframe.style.pointerEvents is set to "none", the iframe
 * no longer receives mousemove events - so we can't track movement here.
 */
export function DragHandle({ children, className = "" }: DragHandleProps) {
    const hasFiredRef = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return; // left click only
        e.stopPropagation();
        hasFiredRef.current = false;

        // Tell Magento to start tracking mouse movement on its own window.
        // The startX/startY let Magento know where dragging started.
        window.parent.postMessage(
            {
                type: "TANKBOT_DRAG_START",
                startX: e.clientX,
                startY: e.clientY,
            },
            "*"
        );
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.stopPropagation();
        window.parent.postMessage(
            {
                type: "TANKBOT_DRAG_START",
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY,
            },
            "*"
        );
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`cursor-grab select-none active:cursor-grabbing ${className}`}
            style={{ touchAction: "none" }}
        >
            {children}
        </div>
    );
}
