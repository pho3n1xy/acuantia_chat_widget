"use client";

import { forwardRef, useEffect, useRef, useState } from "react";

export const DragHandle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className = "", onMouseDown, onTouchStart, onClick, ...props }, ref) => {
        const [isDragging, setIsDragging] = useState(false);
        const dragStartRef = useRef<{ x: number; y: number } | null>(null);
        const hasDraggedRef = useRef<boolean>(false);

        useEffect(() => {
            // If we're not dragging, no need to listen globally
            if (!isDragging) return;

            const handleMouseMove = (e: MouseEvent | TouchEvent) => {
                if (!isDragging || !dragStartRef.current) return;

                const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
                const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

                const deltaX = clientX - dragStartRef.current.x;
                const deltaY = clientY - dragStartRef.current.y;

                // If we move more than 5 pixels, consider it a drag so we can cancel the click
                if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                    hasDraggedRef.current = true;
                }

                // Send the movement calculation to the parent Magento window
                window.parent.postMessage(
                    {
                        type: "TANKBOT_DRAG",
                        deltaX,
                        deltaY,
                    },
                    "*"
                );

                // Update the start position for the next move event, making it ultra-smooth
                dragStartRef.current = { x: clientX, y: clientY };
            };

            const handleMouseUp = () => {
                setIsDragging(false);
                dragStartRef.current = null;
                // Tell Magento to restore pointer-events to the iframe
                window.parent.postMessage({ type: "TANKBOT_DRAG_END" }, "*");

                // Reset hasDragged after a tiny delay so the click event has time to be intercepted
                setTimeout(() => {
                    hasDraggedRef.current = false;
                }, 100);
            };

            // Attach global listeners while dragging so we don't lose the cursor if it moves fast
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleMouseMove, { passive: false });
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchend", handleMouseUp);

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("touchmove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
                window.removeEventListener("touchend", handleMouseUp);
            };
        }, [isDragging]);

        const startDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            // If native event was passed, call it too (e.g., AssistantModalPrimitive.Trigger)
            if (onMouseDown && e.type === "mousedown") {
                onMouseDown(e as React.MouseEvent<HTMLDivElement>);
            }
            if (onTouchStart && e.type === "touchstart") {
                onTouchStart(e as React.TouchEvent<HTMLDivElement>);
            }

            // If it's not a left click (0), ignore
            if ("button" in e && e.button !== 0) return;

            hasDraggedRef.current = false;
            setIsDragging(true);

            const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
            const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

            dragStartRef.current = { x: clientX, y: clientY };

            window.parent.postMessage({ type: "TANKBOT_DRAG_START" }, "*");
        };

        // Intercept clicks to prevent opening/closing the chat if the user was just dragging
        const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
            if (hasDraggedRef.current) {
                e.stopPropagation();
                e.preventDefault();
            } else if (onClick) {
                onClick(e);
            }
        };

        return (
            <div
                ref={ref}
                onMouseDown={startDrag}
                onTouchStart={startDrag}
                onClickCapture={handleClickCapture}
                style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
                className={`select-none ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

DragHandle.displayName = "DragHandle";
